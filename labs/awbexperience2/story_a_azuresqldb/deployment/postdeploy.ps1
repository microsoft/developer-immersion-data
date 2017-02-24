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

    # Elevate permissions from default 'Reader' role
    AssignUserRole -RoleDefinitionName 'DocumentDB Account Contributor'
    AssignUserRole -RoleDefinitionName 'Search Service Contributor'
    AssignUserRole -RoleDefinitionName 'Storage Account Contributor'
    AssignUserRole -RoleDefinitionName 'SQL DB Contributor'
    AssignUserRole -RoleDefinitionName 'SQL Security Manager'
    AssignUserRole -RoleDefinitionName 'SQL Server Contributor'
    AssignUserRole -RoleDefinitionName 'Website Contributor'
    AssignUserRole -RoleDefinitionName 'Web Plan Contributor'
    AssignUserRole -RoleDefinitionName '[Hands-on Labs] Sql Server Data Masking Contributor'
    AssignUserRole -RoleDefinitionName '[Hands-on Labs] Data Lake Contributor'
    
    #Grant access to Power BI Workspace
    $scope = (Find-AzureRmResource -ResourceGroupNameContains $ResourceGroupName -ResourceType Microsoft.PowerBI/workspaceCollections).ResourceId
    $ExistingRole = Get-AzureRmRoleAssignment -SignInName $UserEmail -RoleDefinitionName 'Contributor' | Where-Object Scope -eq $scope
    if (!$ExistingRole) {
        New-AzureRmRoleAssignment -SignInName $UserEmail -RoleDefinitionName 'Contributor' -Scope $scope
    }
}