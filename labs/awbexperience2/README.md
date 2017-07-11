# Modernizing LOB apps with intelligence

In this scenario we will re-architect an existing LOB workload for the cloud

### Pre-requisites for the lab ###

-   [Visual Studio 2015 Update 3](https://msdn.microsoft.com/en-in/library/mt613162.aspx)

-   [2.9 version of Microsoft Azure SDK](https://azure.microsoft.com/en-us/downloads/)

-   [4.6 version of Node.js](https://nodejs.org/en/download/)

-   [1.2 version of Node.js Tools for Visual Studio 2015](https://marketplace.visualstudio.com/items?itemName=NodejsToolsforVisualStudio.NodejsTools12forVisualStudio2015)

-   An active Microsoft Azure Subscription for deployments

-   [Python Tools 2.2.4 for Visual Studio](https://github.com/Microsoft/PTVS/releases/tag/v2.2.4)

-   [SQL Server Management Studio or SQL Data Tools for Visual Studio](http://go.microsoft.com/fwlink/?LinkID=824938)

-   [NPM Task Runner extension for Visual Studio](https://visualstudiogallery.msdn.microsoft.com/8f2f2cbc-4da5-43ba-9de2-c9d08ade4941)

-   [R Client](https://msdn.microsoft.com/en-us/microsoft-r/r-client-get-started#installrclient)

-   [PowerBI Desktop](https://powerbi.microsoft.com/en-us/desktop/)

-   gulp and bower installed as global 
        - npm install bower -g
        - npm install gulp -g

### Provision the Azure Resources ###

1. Create the Azure resources.
    
  Simply click the Deploy to Azure button below and follow the wizard to create the resources. You will need to log in to the Azure Portal.
                                                                     
  <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Faperezplain%2Ftemplates%2Fmaster%2Ftemplate2data.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
  </a>

  The resources will be deployed to a Resource Group. You can delete the resource group in order to remove all the created resources at any time.

### Modules ###

<a href="./story_0_setup/intro.md">Preliminary Setup</a>
    
  Get ready to begin re-architecting for the cloud

<a href="./story_a_azuresqldb/intro.md">Module 1: Migrating to Azure SQL Database</a>
    
  Migrate from your current database installed in a SQL Server on a Virtual Machine to an Azure SQL Database keeping all the features you have been using until this very moment
  
<a href="./story_b_azureml/intro.md">Module 2: Azure Machine Learning</a>
    
  Build, deploy, and share predictive analytics solutions using Azure Machine Learning

<a href="./story_c_azuresearch/intro.md">Module 3: Azure Search, a cloud search-as-a-service solution</a>
    
  Easily add a robust search experience to your application using a simple REST API or .NET SDK using Azure Search
 
<a href="./story_d_pbiembedded/intro.md">Module 4: PowerBI and PowerBI Embedded</a>
    
  Create a report with PowerBI desktop and take advantange of the PowerBI Emmbedded capabilities to see how easily is to integrate it in a website
