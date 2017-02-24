<page title="Intro"/>

AZURE SEARCH
====

MyExpenses is an application that aims to provide a comprehensive expense tracking system for companies all over the world. Every employee can log expenses using the MyExpenses web portal and get them reimbursed in either cash or company points, which can be spent in the company store without leaving MyExpenses. Managers can do everything an employee can, but also review, approve or reject the expense reports submitted by team members. 

![](img/0.png)

MyExpenses is built on top of a SQL Server 2016 database, with a frontend in AngularJS and a backend using Node.js. SQL Server allows us to easily scale the services offered to our clients and provide a good performance. One of the features offered by MyExpenses is getting an expense report reinbursed in company points, which can be spent directly in the website. We want to provide additional information about the products in our catalog, in particular the videogames. When doing something like this, it is common to use a service that provides an APIs to get all the available information about a videogame, and you usually obtain this information in a JSON format. But it would be a heavy task if you need to parse all the possible information, add new columns to the table, and so on. Besides, it wouldn't be a good idea because our catalog comprises not only videogames, but hardware and other software products, so these new columns wouldn't make any sense for many of them!. We would have to create a new table just for the videogame catalog. Instead of that, we are going to take advantage of the JSON capabilities offered by SQL Server 2016 to see how easy is to store the information provided by a web service in our table, directly in the original JSON format. 

Azure Search
------------------
Azure Search is a cloud search-as-a-service solution that delegates server and infrastructure management to Microsoft, leaving you with a ready-to-use service that you can populate with your data and then use to add search functionality to your web or mobile application. Azure Search allows you to easily add a robust search experience to your applications using a simple REST API or .NET SDK without managing search infrastructure or becoming an expert in search.

In this lab we are going to see how we can make take advantage of this service features to implement a complete and advanced search system in the MyExpenses website, to allow users to search for expenses, and products of the gift catalog.

Check the following [link](https://azure.microsoft.com/en-us/services/search/) for further information about Azure Search.