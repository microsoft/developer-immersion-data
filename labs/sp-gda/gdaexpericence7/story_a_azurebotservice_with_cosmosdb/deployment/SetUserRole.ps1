function Start-ImmersionPostDeployScript {
    param(
        $Credentials,
        $TenantId,
        $Region,
        $UserEmail,
        $UserPassword,
        $ResourceGroupName,
        $StorageAccountName
    )

    function AssignUserRole ($RoleDefinitionName) {
        Write-Verbose "Assigning role '$RoleDefinitionName' to $UserEmail"
        if(!(Get-AzureRmRoleAssignment -SignInName $UserEmail -ResourceGroupName $ResourceGroupName -RoleDefinitionName $RoleDefinitionName)) {
            New-AzureRmRoleAssignment -SignInName $UserEmail -ResourceGroupName $ResourceGroupName -RoleDefinitionName $RoleDefinitionName | Out-Null
        }
        else {
            Write-Warning "Role '$RoleDefinitionName' already assigned!"
        }
    }

    #Assign roles required for the current story
	AssignUserRole -RoleDefinitionName 'Storage Account Contributor'
    AssignUserRole -RoleDefinitionName 'DocumentDB Account Contributor'
    AssignUserRole -RoleDefinitionName 'Website Contributor'
    AssignUserRole -RoleDefinitionName 'Web Plan Contributor'
    AssignUserRole -RoleDefinitionName 'Storage Account Contributor'
}