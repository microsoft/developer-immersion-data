# Gate change notification to the user for specific flight using Azure Cosmos DB with Notification service

In this experience you will come across Cosmos DB, Azure functions and Notification Service to receive gate change notification through ContosoAir application.

### Pre-requisites for the lab ###

- NodeJs 6.11.12
- Angular CLI 2-1.0.0-alpha6
- SQL Migration Tool(dtui)
- Visual Studio Community 2017

### Introduction 
Consider the user scenario, Kevin wants to travel from Seattle to Barcelona. But due to gate change of one of connecting flight, he struggled to move from one gate to another. So, in this experience we will provide, gate change notification to the end user for his convenience using **Contoso Air App** with **Cosmos DB**, **Azure functions** and **Notification Service**.



### Provision the Azure Resources ###

1. Create the Azure resources.
    
  Simply click the Deploy to Azure button below and follow the wizard to create the resources. You will need to log in to the Azure Portal.
                                                                     
  <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FMicrosoft%2Fdeveloper-immersion-data%2Fmaster%2Flabs%2Fsp-gda%2Fgdaexpericence6%2Fstory_a_azure_notification_for_gate_change%2Fdeployment%2Ftemplate.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
  </a>

  The resources will be deployed to a Resource Group. You can delete the resource group in order to remove all the created resources at any time.

### Scenarios ###

<a href="./story_a_azure_notification_for_gate_change/content/intro.md">Intro</a>

<a href="./story_a_azure_notification_for_gate_change/content/0.md">Scenario 1: Fetching information of delayed flights</a>

<a href="./story_a_azure_notification_for_gate_change/content/1.md">Scenario 2 – Displaying Gate Change detailed information in ContosoAir App</a>

<a href="./story_a_azure_notification_for_gate_change/content/conclusion.md">Conclusion</a>   


