# Modernizing cloud-based web apps

In this scenario we will evolve and grow the e-Commerce web application by adding datalake, data warehouse, DocumentDB (NoSQL), 
Azure Search capabilities.

###Pre-requisites for the lab###

-   [Visual Studio 2015 Update 3] (https://msdn.microsoft.com/en-in/library/mt613162.aspx)

-   [Latest Microsoft Azure SDK] (https://azure.microsoft.com/en-us/downloads/)

-   [.NET Core SDK Visual Studio Tools] (https://www.microsoft.com/net/core#windows)

-   [Latest version of Node.js] (https://nodejs.org/en/download/)

-   An active Microsoft Azure Subscription for deployments

-  [SQL Server Management Studio or SQL Data Tools for Visual Studio] (http://go.microsoft.com/fwlink/?LinkID=824938)

-   [NPM Task Runner extension for Visual Studio] (https://visualstudiogallery.msdn.microsoft.com/8f2f2cbc-4da5-43ba-9de2-c9d08ade4941)

-   [Azure Data Lake Tools for Visual Studio 2015] (https://www.microsoft.com/en-us/download/details.aspx?id=49504)

-   gulp and bower installed as global 
        - npm install bower -g
        - npm install gulp -g

### Provision the Azure Resources###

1. Create the Azure resources.
    
  Simply click the Deploy to Azure button below and follow the wizard to create the resources. You will need to log in to the Azure Portal.
                                                                       
  <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fibonilm%2Ftemplates%2Fmaster%2Ftemplatedata.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
  </a>

  The resources will be deployed to a Resource Group. You can delete the resource group in order to remove all the created resources at any time.
  
  **NOTE:**: If you have completed the experience 3, you could use the same Resource Group.

  ![](img/rg.png)

###Modules###

<a href="./story_a_documentdb/Intro.md">Module 1: Accelerate your development using schema free data store- DocumentDB</a>
    
  DocumentDB, Partition Scale, Geo databases, JSON store, Geo-Spatial..

<a href="./story_b_azureseach/Intro.md">Module 2: Build scalable search experiences for your web apps</a>
    
  Azure Search - Facets, Suggestors, Scoring profile, Linguistics, Scaling, Language Support, Highlighting, High Density.

<a href="./story_c_usql/Intro.md">Module 3: Process Unstructured Data using U-SQL</a>
    
  Unlimited Scale with ADL (Azure Data Lake).

<a href="./story_d_azuredw/Intro.md">Module 4: Build SQL-based cloud DW solutions to support business intelligent needs.</a>
    
  SQL Data warehouse.


