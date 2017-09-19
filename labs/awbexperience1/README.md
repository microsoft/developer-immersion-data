# Develop with SQL Server 2016

In this scenario we will learn about the new features of SQL Server 2016

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
                                                                     
  <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Faperezplain%2Ftemplates%2Fmaster%2Ftemplate1data.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
  </a>

  The resources will be deployed to a Resource Group. You can delete the resource group in order to remove all the created resources at any time.

### Modules ###

<a href="./story_0_setup/intro.md">Preliminary Setup</a>
    
  Get ready to begin working with SQL Server 2016

<a href="./story_a_ddm/intro.md">Module 1: Dynamic Data Masking</a>
    
  Keep data away from unauthorized eyes
  
<a href="./story_b_encryption/intro.md">Module 2: Always Encrypted</a>
    
  Encrypt your data at rest and in transit

<a href="./story_c_temporal_tables/intro.md">Module 3: Temporal tables</a>
    
  Recover from user errors more easily using Temporal
  
<a href="./story_d_inmemorycci/intro.md">Module 4: In Memory ColumnStore Indexes</a>
    
  Optimize transactional performance using memory-optimized tables and natively compiled SPs

<a href="./story_e_inmemoryoltp/intro.md">Module 5: In Memory OLTP in SQL Server</a>
    
  Provide real-time insights into app transactions
 
<a href="./story_f_rowlevelsecurity/intro.md">Module 6: Row level security</a>
    
  Develop secure and compliant database apps
  
<a href="./story_g_jsonsupport/intro.md">Module 7: JSON in SQL Server</a>
    
  Explore the power of JSON in SQL Server
  
<a href="./story_h_stretchdb/intro.md">Module 8: StretchDB</a>
    
  Stretch cold data to the cloud without losing query functionality
  
<a href="./story_i_r_services/intro.md">Module 9: R Services</a>
    
  Build predictive and prescriptive analytics into your app using R
