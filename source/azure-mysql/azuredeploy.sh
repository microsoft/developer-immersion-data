rg=[ResourceGroupName]
mysql=[Servername]
usr=[Username]
pass=[Password]
location=westus
az group create --resource-group $rg --location $location
az mysql server create --resource-group $rg --name $mysql --location $location --admin-user $usr --admin-password $pass --performance-tier Basic --compute-units 50
az mysql server firewall-rule create --name splat --resource-group $rg --server $mysql --name AllowAllIps --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
az mysql server show --resource-group $rg --name $mysql
