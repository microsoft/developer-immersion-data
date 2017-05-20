#Requires -Version 3.0
#Requires -Module AzureRM.Resources
#Requires -Module Azure.Storage

Param(
    [string] [Parameter(Mandatory=$true)] $ResourceGroupLocation,
    [string] $ResourceGroupName = 'AzureARM',
    [switch] $UploadArtifacts,
    [string] $StorageAccountName,
    [string] $StorageContainerName = $ResourceGroupName.ToLowerInvariant() + '-stageartifacts',
    [string] $TemplateFile = '..\Templates\WebSiteSQLDatabase.json',
    [string] $TemplateParametersFile = '..\Templates\WebSiteSQLDatabase.parameters.json',
    [string] $ArtifactStagingDirectory = '..\bin\Debug\staging',
    [string] $DSCSourceFolder = '..\DSC'
)

Import-Module Azure -ErrorAction SilentlyContinue

try {
    [Microsoft.Azure.Common.Authentication.AzureSession]::ClientFactory.AddUserAgent("VSAzureTools-$UI$($host.name)".replace(" ","_"), "2.9")
} catch { }

Set-StrictMode -Version 3

$OptionalParameters = New-Object -TypeName Hashtable
$TemplateFile = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, $TemplateFile))
$TemplateParametersFile = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, $TemplateParametersFile))

if ($UploadArtifacts) {
    # Convert relative paths to absolute paths if needed
    $ArtifactStagingDirectory = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, $ArtifactStagingDirectory))
    $DSCSourceFolder = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, $DSCSourceFolder))

    Set-Variable ArtifactsLocationName '_artifactsLocation' -Option ReadOnly -Force
    Set-Variable ArtifactsLocationSasTokenName '_artifactsLocationSasToken' -Option ReadOnly -Force

    $OptionalParameters.Add($ArtifactsLocationName, $null)
    $OptionalParameters.Add($ArtifactsLocationSasTokenName, $null)

    # Parse the parameter file and update the values of artifacts location and artifacts location SAS token if they are present
    $JsonContent = Get-Content $TemplateParametersFile -Raw | ConvertFrom-Json
    $JsonParameters = $JsonContent | Get-Member -Type NoteProperty | Where-Object {$_.Name -eq "parameters"}

    if ($JsonParameters -eq $null) {
        $JsonParameters = $JsonContent
    }
    else {
        $JsonParameters = $JsonContent.parameters
    }

    $JsonParameters | Get-Member -Type NoteProperty | ForEach-Object {
        $ParameterValue = $JsonParameters | Select-Object -ExpandProperty $_.Name

        if ($_.Name -eq $ArtifactsLocationName -or $_.Name -eq $ArtifactsLocationSasTokenName) {
            $OptionalParameters[$_.Name] = $ParameterValue.value
        }
    }

    # Create DSC configuration archive
    if (Test-Path $DSCSourceFolder) {
        Add-Type -Assembly System.IO.Compression.FileSystem
        $ArchiveFile = Join-Path $ArtifactStagingDirectory "dsc.zip"
        Remove-Item -Path $ArchiveFile -ErrorAction SilentlyContinue
        [System.IO.Compression.ZipFile]::CreateFromDirectory($DSCSourceFolder, $ArchiveFile)
    }

    $StorageAccountContext = (Get-AzureRmStorageAccount | Where-Object{$_.StorageAccountName -eq $StorageAccountName}).Context

    # Generate the value for artifacts location if it is not provided in the parameter file
    $ArtifactsLocation = $OptionalParameters[$ArtifactsLocationName]
    if ($ArtifactsLocation -eq $null) {
        $ArtifactsLocation = $StorageAccountContext.BlobEndPoint + $StorageContainerName
        $OptionalParameters[$ArtifactsLocationName] = $ArtifactsLocation
    }

    # Copy files from the local storage staging location to the storage account container
    New-AzureStorageContainer -Name $StorageContainerName -Context $StorageAccountContext -Permission Container -ErrorAction SilentlyContinue *>&1

    $ArtifactFilePaths = Get-ChildItem $ArtifactStagingDirectory -Recurse -File | ForEach-Object -Process {$_.FullName}
    foreach ($SourcePath in $ArtifactFilePaths) {
        $BlobName = $SourcePath.Substring($ArtifactStagingDirectory.length + 1)
        Set-AzureStorageBlobContent -File $SourcePath -Blob $BlobName -Container $StorageContainerName -Context $StorageAccountContext -Force
    }

    # Generate the value for artifacts location SAS token if it is not provided in the parameter file
    $ArtifactsLocationSasToken = $OptionalParameters[$ArtifactsLocationSasTokenName]
    if ($ArtifactsLocationSasToken -eq $null) {
        # Create a SAS token for the storage container - this gives temporary read-only access to the container
        $ArtifactsLocationSasToken = New-AzureStorageContainerSASToken -Container $StorageContainerName -Context $StorageAccountContext -Permission r -ExpiryTime (Get-Date).AddHours(4)
        $ArtifactsLocationSasToken = ConvertTo-SecureString $ArtifactsLocationSasToken -AsPlainText -Force
        $OptionalParameters[$ArtifactsLocationSasTokenName] = $ArtifactsLocationSasToken
    }
}

# Create or update the resource group using the specified template file and template parameters file
New-AzureRmResourceGroup -Name $ResourceGroupName -Location $ResourceGroupLocation -Verbose -Force -ErrorAction Stop 

$results = New-AzureRmResourceGroupDeployment -Name ((Get-ChildItem $TemplateFile).BaseName + '-' + ((Get-Date).ToUniversalTime()).ToString('MMdd-HHmm')) `
                                   -ResourceGroupName $ResourceGroupName `
                                   -TemplateFile $TemplateFile `
                                   -TemplateParameterFile $TemplateParametersFile `
                                   @OptionalParameters `
                                   -Force -Verbose

if ($results) 
{
	Write-Host 'Deploy WebApp (End)'
	$webAppName = $results.Outputs.webAppNameEnd.value
	$publisScript = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, 'PublishASPNET.ps1'))
	& $publisScript $ResourceGroupName $webAppName "..\WebApp\Bikes.Web.zip"

    Write-Host 'Test WebApp'
	$testwebapps = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, 'TestWebApps.ps1'))
	& $testwebapps $results.Outputs.webAppNameEnd.value

    Write-Host 'Configure Begin WebApp'

	$configRelativePath = "..\..\..\..\..\..\..\..\src\AdventureWorks.Bikes.Web\appsettings.json"
	$configPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, $configRelativePath))
	$replacescript = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, 'Replace-FileString.ps1'))

	& $replacescript -Pattern 'YOUR_DEFAULT_CONNECTION' -Replacement $results.Outputs.defaultConnectionString.value -Overwrite -Path $configPath
	& $replacescript -Pattern 'YOUR_IDENTITY_CONNECTION' -Replacement $results.Outputs.identityConnection.value -Overwrite -Path $configPath
	& $replacescript -Pattern 'YOUR_SEARCH_SERVICE_NAME' -Replacement $results.Outputs.searchServiceName.value -Overwrite -Path $configPath
	& $replacescript -Pattern 'YOUR_SEARCH_SERVICE_KEY' -Replacement $results.Outputs.searchServiceApiKey.value -Overwrite -Path $configPath
	& $replacescript -Pattern 'YOUR_COSMOSDB_ENDPOINT' -Replacement $results.Outputs.cosmosDBEndpointUri.value -Overwrite -Path $configPath
	& $replacescript -Pattern 'YOUR_COSMOSDB_KEY' -Replacement $results.Outputs.cosmosDBKey.value -Overwrite -Path $configPath
	& $replacescript -Pattern 'YOUR_INSTRUMENTATION_KEY' -Replacement $results.Outputs.applicationInsightsKey.value -Overwrite -Path $configPath

	$configRelativePath = "..\..\..\..\..\..\..\CreateSampleData\appsettings.json"
	$configPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, $configRelativePath))
	$replacescript = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, 'Replace-FileString.ps1'))

	& $replacescript -Pattern 'YOUR_DEFAULT_CONNECTION' -Replacement $results.Outputs.defaultConnectionString.value -Overwrite -Path $configPath
	& $replacescript -Pattern 'YOUR_IDENTITY_CONNECTION' -Replacement $results.Outputs.identityConnection.value -Overwrite -Path $configPath
	& $replacescript -Pattern 'YOUR_SEARCH_SERVICE_NAME' -Replacement $results.Outputs.searchServiceName.value -Overwrite -Path $configPath
	& $replacescript -Pattern 'YOUR_SEARCH_SERVICE_KEY' -Replacement $results.Outputs.searchServiceApiKey.value -Overwrite -Path $configPath
	& $replacescript -Pattern 'YOUR_COSMOSDB_ENDPOINT' -Replacement $results.Outputs.cosmosDBEndpointUri.value -Overwrite -Path $configPath
	& $replacescript -Pattern 'YOUR_COSMOSDB_KEY' -Replacement $results.Outputs.cosmosDBKey.value -Overwrite -Path $configPath
	& $replacescript -Pattern 'YOUR_INSTRUMENTATION_KEY' -Replacement $results.Outputs.applicationInsightsKey.value -Overwrite -Path $configPath


	$configRelativePath = "..\..\..\..\..\..\..\ElasticPoolLoadGenerator\ElasticPoolLoadGenerator.exe.config"
	$configPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, $configRelativePath))
	$replacescript = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, 'Replace-FileString.ps1'))

	& $replacescript -Pattern 'YOUR_DEFAULT_CONNECTION' -Replacement $results.Outputs.defaultConnectionString.value -Overwrite -Path $configPath

}