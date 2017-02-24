<page title="Intro"/>

AZURE ML
====

MyExpenses is an application that aims to provide a comprehensive expense tracking system for companies all over the world. Every employee can log expenses using the MyExpenses web portal and get them reimbursed in either cash or company points, which can be spent in the company store without leaving MyExpenses. Managers can do everything an employee can, but also review, approve or reject the expense reports submitted by team members. 

![](img/image0.png)

MyExpenses is built on top of a SQL Server 2016 database, with a frontend in AngularJS and a backend using Node.js. SQL Server allows us to easily scale the services offered to our clients and provide a good performance. MyExpenses aims to be an intelligent application, and it has an in-built system for assessing expenses. Even though that we assume the employees to be honest, sometimes they could make mistakes when adding a new expense (purposelessly or not). This system was implemented using SQL Server 2016 R Services, and as part of our modernization efforts, we want to migrate it to the cloud using Azure ML.
 
MACHINE LEARNING AS A SERVICE ON AZURE
------------------
Azure Machine Learning is a fully managed cloud service that enables you to easily build, deploy, and share predictive analytics solutions. The machine learning process isn't especillay simple. To make life easier for people doing machine learning, Azure ML provider several different compoents:

- ML Studio: A graphical tool that can be used to control the process from beginning to end.
- A set of data preprocessing modules. 
- A set of machine learning algorithms.
- An Azure ML REST API that lets applications acccess the chosen model once it's deployed on Azure.

Check the following [link](https://azure.microsoft.com/en-us/services/machine-learning/) for further information about Azure Machine Learning.