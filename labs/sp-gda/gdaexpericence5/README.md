# Integrating Cosmos DB (SQL API) and Cognitive Services with Universal Windows Platform Application

In this experience you will use the ContosoAir app to learn the Azure Congnitive Services like Emotion API, Text Analytics API, Bing Speech API, Azure Function, Logic App and Cosmos DB.

### Pre-requisites for the lab ###

- SQL Migration Tool(dtui)
- Visual Studio Community 2017

### Introduction 

Consider the user scenario, Alina completes her journey from Seattle to Barcelona, after reaching her destination, she wants to share her flight experience by providing feedback through the ContosoAir application.
To solve this problem, we will use the ContosoAir app to learn the services like **Emotion API, Text Analytics API, Bing Speech API, Azure Function, Logic App** and **Cosmos DB** through the provision of providing feedback by analysing the facial expression and feedback description in the form of speech.

### Provision the Azure Resources ###

1. Create the Azure resources.
    
  Simply click the Deploy to Azure button below and follow the wizard to create the resources. You will need to log in to the Azure Portal.
                                                                     
  <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FMicrosoft%2Fdeveloper-immersion-data%2Fmaster%2Flabs%2Fsp-gda%2Fgdaexpericence5%2Fstory_a_azurefunction_with_cosmosdb%2Fdeployment%2Ftemplate.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
  </a>

  The resources will be deployed to a Resource Group. You can delete the resource group in order to remove all the created resources at any time.

### Scenarios ###

<a href="./story_a_azurefunction_with_cosmosdb/content/intro.md">Intro</a>

<a href="./story_a_azurefunction_with_cosmosdb/content/0.md">Scenario 1: Analysing emotions of the captured image through Emotion API and manually enter the feedback, then analysing the displayed message accordingly</a>

<a href="./story_a_azurefunction_with_cosmosdb/content/1.md">Scenario 2 – Analysing emotions of captured image through Emotion API and entering the feedback using Bing Speech API, then display the message accordingly</a>

<a href="./story_a_azurefunction_with_cosmosdb/content/conclusion.md">Conclusion</a>   


