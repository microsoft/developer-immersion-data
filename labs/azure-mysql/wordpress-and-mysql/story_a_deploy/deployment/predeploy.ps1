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
    # TODO: update this to use an image with the right tools
	$ProvisioningStorageVHDBlobName = 'sp-dfd/20171102/jumphost-2.vhd'
	$VHDStorageVHDBlobName = 'jumphost.vhd'
	$ProvisioningStorageContainerName = 'assets'
    
    $StorageAccountKey = Get-AzureRmStorageAccountKey -ResourceGroupName $ResourceGroupName -Name $StorageAccountName
    if (-not $StorageAccountKey -or $StorageAccountKey.Length -eq 0) {
        throw "Could not retrieve storage account key $($StorageAccountName)"
	}
    
    Start-AzureStorageBlobCopy  -Context (New-AzureStorageContext -Protocol Https `
                                                            -StorageAccountName $StorageAccountName `
                                                            -StorageAccountKey $StorageAccountKey[0].Value) `
                                -SrcContainer $ProvisioningStorageContainerName `
                                -SrcBlob $ProvisioningStorageVHDBlobName `
                                -DestContext (New-AzureStorageContext -Protocol Https `
                                                            -StorageAccountName $StorageAccountName `
                                                            -StorageAccountKey $StorageAccountKey[0].Value) `
                                -DestContainer $ProvisioningStorageContainerName `
                                -DestBlob $VHDStorageVHDBlobName
}
