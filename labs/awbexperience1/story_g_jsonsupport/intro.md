<page title="Intro"/>

JSON CAPABILITIES
====

MyExpenses is an application that aims to provide a comprehensive expense tracking system for companies all over the world. Every employee can log expenses using the MyExpenses web portal and get them reimbursed in either cash or company points, which can be spent in the company store without leaving MyExpenses. Managers can do everything an employee can, but also review, approve or reject the expense reports submitted by team members. 

![](img/0.png)

MyExpenses is built on top of a SQL Server 2016 database, with a frontend in AngularJS and a backend using Node.js. SQL Server allows us to easily scale the services offered to our clients and provide a good performance. One of the features offered by MyExpenses is getting an expense reinbursed in company points, which can be spent directly in the website. We want to provide additional information about the existent products in our catalog, in particular the games currently available in the catalog. When doing something like this, it is common to use a service that provides an APIs to get all the available information about a videogame, and you usually obtain this information in a JSON format. But it would be a heavy task having to parse all the possible information to new columns to the table. Besides, it wouldn't be a good idea because our catalog comprises not only videogames, but hardware and other software products, so these new columns wouldn't make any sense and we should create a new table just for the videogame catalog. Instead of that, we are going to take advantage of the JSON capabilities to see how easy is to store the information provided in JSON by a web service in our table. 

JSON SUPPORT IN SQL SERVER
------------------
JSON is currently one of the most commonly used data exchange formats. JSON is also used for storing unstructured data in log files or NoSQL databases like Microsoft Azure DocumentDB. Many REST web services return results formatted as JSON text or accept data formatted as JSON and most Azure services such as Azure Search, Azure Storage, and Azure DocumentDB have REST endpoints that return or consume JSON. JSON is also the main format for exchanging data between web pages and web servers using AJAX calls. Because a lot of data is formatted as JSON, it is important to enable SQL Server to process JSON text retrieved from other systems or to format information retrieved from SQL Server tables as JSON text.
 
Check the following [link](https://msdn.microsoft.com/en-us/library/dn921897.aspx) for further information about JSON capabilities on SQL SERVER 2016.