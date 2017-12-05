# Build globally distributed applications using Azure Cosmos DB

In this experience you will come across the power of Azure Cosmos DB's features such as Turnkey global distribution, Consistency, Multi-model API, Partitioning, Failover mechanism and SLA's using ContosoAir website along with SQL DB API, Mongo DB API and Azure Functions.

### Pre-requisites for the lab ###

- NodeJS 6.11.12
- Angular CLI 2-1.0.0-alpha6
- Ubuntu bash on Windows
- Install Ansible Azure 2.4.1.0 on Ubuntu Bash
- Visual Studio Community 2017

### Introduction 
It used to take extensive time and monotonous efforts to build a Globally Distributed Database conventionally. Also, there were some issues of **Latency** and **Consistency** in case of the data stored in a centralized location. So, to unravel this we will use the **Azure Cosmos Database**.

You will come across the power of **Azure Cosmos DB's** features such as **Turnkey global distribution**, **Consistency**, **Multi-model API**, **Partitioning**, **Failover mechanism** and **SLA's** using **ContosoAir** website along with **SQL DB API**, **Mongo DB API** and **Azure** **Functions**.

### Provision the Azure Resources ###

1. Create the Azure resources.
    
  Simply click the Deploy to Azure button below and follow the wizard to create the resources. You will need to log in to the Azure Portal.
                                                                     
  <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FMicrosoft%2Fdeveloper-immersion-data%2Fmaster%2Flabs%2Fsp-gda%2Fgdaexpericence1%2Fstory_a_gda_using_cosmosdb%2Fdeployment%2Ftemplate.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
  </a>

  The resources will be deployed to a Resource Group. You can delete the resource group in order to remove all the created resources at any time.


### Scenarios ###

<a href="./story_a_gda_using_cosmosdb/content/intro.md">Intro</a>

<a href="./story_a_gda_using_cosmosdb/content/0.md">Scenario 1: Globally distributed application for experiencing low latency</a>

<a href="./story_a_gda_using_cosmosdb/content/1.md">Scenario 2: Consistency</a>

<a href="./story_a_gda_using_cosmosdb/content/2.md">Scenario 3: Multi-model API</a>

<a href="./story_a_gda_using_cosmosdb/content/3.md">Scenario 4: Partitioning</a> 

<a href="./story_a_gda_using_cosmosdb/content/conclusion.md">Conclusion</a>   
