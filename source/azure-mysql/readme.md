[![Deploy to Azure](https://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)


# Notes on HOL flow

Sign into the cli

Make resource group n/a

Make database server  
Note username and password  
Set firewall rules  
Disable SSL  

Open workbench (need to install this onto the vm image)  
Connect to database **do test connection**  
Restore backup from script __optional: change database name__

Clone [repo](https://github.com/seanli1988/bikeshop) from git  
Edit ```wp-config.php```

* Database name
* Server/Host name
* Username
* Password

Save changes

```PowerShell
git add .
git commit -m "updated database connection"
```


Make app service  
Setup Deployment credentials
Setup Deployment options  
> Note the clone url

```PowerShell
git remote add website https://zzzzzzzz/dadasdf.git
git push website
```

