# Developing Xamarin Apps with Azure Cosmos DB and Notification Services

In this experience you will come across Azure Notification APIs, Text Analytics API, Azure Function, Logic App and Cosmos DB. Using ContosoAir application you will get the reviews of staff serving flying solo service through push notifications.

### Pre-requisites for the lab ###

- NodeJs 6.11.12
- Angular CLI 2-1.0.0-alpha6
- SQL Migration Tool(dtui)
- Visual Studio Community 2017

### Introduction 

Consider the user scenario. Alice, the daughter of Kevin, is a minor and willing to travel from **Seattle** to **Barcelona** and wants to avail  "**Flying Solo Service**" provided by Airline. But as a parent, Kevin needs to know and be assured that the child will be taken care of.

Using **ContosoAir app** you will come across **Azure Notification APIs**, **Text Analytics API**, **Azure Function**, **Logic App** and **Cosmos DB**. After completion of the flight booking process through **ContosoAir application** you will get the reviews of staff serving flying solo service through push notifications.


### Provision the Azure Resources ###

1. Create the Azure resources.
    
  Simply click the Deploy to Azure button below and follow the wizard to create the resources. You will need to log in to the Azure Portal.
                                                                     
  <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FMicrosoft%2Fdeveloper-immersion-data%2Fmaster%2Flabs%2Fsp-gda%2Fgdaexpericence3%2Fstory_a_notificationservice_with_cosmosdb%2Fdeployment%2Ftemplate.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
  </a>

  The resources will be deployed to a Resource Group. You can delete the resource group in order to remove all the created resources at any time.

### Scenarios ###

<a href="./story_a_notificationservice_with_cosmosdb/content/intro.md">Intro</a>

<a href="./story_a_notificationservice_with_cosmosdb/content/0.md">Scenario 1: Fetching information of staff serving the Flying Solo Service</a>

<a href="./story_a_notificationservice_with_cosmosdb/content/1.md">Scenario 2 – Fetching the reviews of staff serving Flying Solo Service along with star ratings</a>

<a href="./story_a_notificationservice_with_cosmosdb/content/2.md">Scenario 3 – Integrating Notification API with ContosoAir app to get the reviews of staff serving the Flying solo service through notifications</a>

<a href="./story_a_notificationservice_with_cosmosdb/content/conclusion.md">Conclusion</a>   
