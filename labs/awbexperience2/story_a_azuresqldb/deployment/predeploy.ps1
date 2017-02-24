# NOTE : This pre deploy script will create a copy of the jumphost vhd and place it in the root of the container.
# This is to resolve a issue with attaching to a vhd with '/' characters in the name. 
function Start-ImmersionPreDeployScript {
    param(
        $Credentials,
        $TenantId,
        $Region,
        $UserEmail,
        $UserPassword,
        $ResourceGroupName,
        $StorageAccountName
    )
    # constants
	$ProvisioningStorageVHDBlobName = 'awb/20161108/ex1jumphost.vhd'
	$VHDStorageVHDBlobName = 'ex2jumphost.vhd'
	$ProvisioningStorageContainerName = 'assets'
    
    $StorageAccountKey = Get-AzureRmStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName
    if (-not $StorageAccountKey -or $StorageAccountKey.Length -eq 0) {
        throw "Could not retrieve storage account key $($StorageAccountName)"
	}
   
    $key = (Get-AzureRmStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName)[0].Value
    $ctx = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $key
    
    $copy = Start-AzureStorageBlobCopy  -Context $ctx `
                                        -SrcContainer $ProvisioningStorageContainerName `
                                        -SrcBlob $ProvisioningStorageVHDBlobName `
                                        -DestContext $ctx `
                                        -DestContainer $ProvisioningStorageContainerName `
                                        -DestBlob $VHDStorageVHDBlobName `
                                        -ErrorAction Stop

    $copy | Get-AzureStorageBlobCopyState -WaitforComplete

}
