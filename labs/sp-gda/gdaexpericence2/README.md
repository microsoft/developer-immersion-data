# Analyzing Data relationship using the Power of Azure Cosmos DB Graph API (Gremlin Query)

In this scenario you will use the ContosoAir demo app to learn Cosmos DB Graph API(Gremlin query) by searching the flights to check Codeshare and Solo Service Details in graphical format.

### Pre-requisites for the lab ###

- NodeJs 6.11.12
- Angular CLI 2-1.0.0-alpha6
- SQL Migration Tool(dtui)
- Visual Studio Community 2017

### Introduction 

Consider the user scenario, Kevin and his daughter Alina went for holidays and suddenly Kevin wants to travel by air, he booked his ticket with a specific airline. But, in a situation, he may experience that he is not going to travel with the same airline, which he has booked for, but with a different airline. This happens because of codeshare, which is a business agreement where two or more airlines share the same flight. Also, he wants to avail the Flying solo service facility for his daughter Alina. As a user, it will be more descriptive and user friendly to check the Codeshare and Solo Service details in graphical format.
So, to accomplish this scenario, we will use the **ContosoAir** demo app to learn **Cosmos DB Graph API(Gremlin query)** by searching the flights to check Codeshare and Solo Service Details in graphical format.


### Provision the Azure Resources ###

1. Create the Azure resources.
    
  Simply click the Deploy to Azure button below and follow the wizard to create the resources. You will need to log in to the Azure Portal.
                                                                     
  <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FMicrosoft%2Fdeveloper-immersion-data%2Fmaster%2Flabs%2Fsp-gda%2Fgdaexpericence2%2Fstory_a_graphapi_of_cosmosdb%2Fdeployment%2Ftemplate.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
  </a>

  The resources will be deployed to a Resource Group. You can delete the resource group in order to remove all the created resources at any time.

### Scenarios ###

<a href="./story_a_graphapi_of_cosmosdb/content/intro.md">Intro</a>

<a href="./story_a_graphapi_of_cosmosdb/content/0.md">Scenario 1: Creating Azure Cosmos DB Graph API and uploading data</a>

<a href="./story_a_graphapi_of_cosmosdb/content/1.md">Scenario 2: Azure Cosmos Graph DB API to display Flight and Flight Segments details in graphical format using Gremlin</a>

<a href="./story_a_graphapi_of_cosmosdb/content/2.md">Scenario 3: Graph plotting using Graph API (Gremlin Query) for Code Share and Solo Service Details by launching ContosoAir App</a>

<a href="./story_a_graphapi_of_cosmosdb/content/conclusion.md">Conclusion</a>   
