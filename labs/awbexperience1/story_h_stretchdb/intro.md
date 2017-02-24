<page title="Intro"/>

STRETCH DB
====

MyExpenses is an application that aims to provide a comprehensive expense tracking system for companies all over the world. Every employee can log expenses using the MyExpenses web portal and get them reimbursed in either cash or company points, which can be spent in the company store without leaving MyExpenses. Managers can do everything an employee can, but also review, approve or reject the expense reports submitted by team members. 

![](img/0.png)

MyExpenses is built on top of a SQL Server 2016 database, with a frontend in AngularJS and a backend using Node.js. SQL Server allows us to easily scale the services offered to our clients and provide a good performance. One of the key points is what happens with the historic data. This data could grow fast and it may causes performance and space issues with the existing database. Moving some of the historic data to Azure using StretchDB is an option to keep the data secured and available everytime.

AZURE SQL DATABASE
------------------
SQL Database is a relational database service in the cloud based on the market-leading Microsoft SQL Server engine, with mission-critical capabilities. SQL Database delivers predictable performance, scalability with no downtime, business continuity and data protection all with near-zero administration. You can focus on rapid app development and accelerating your time to market, rather than managing virtual machines and infrastructure. Because it's based on the SQL Server engine, SQL Database supports existing SQL Server tools, libraries and APIs, which makes it easier for you to move and extend to the cloud. 
Azure SQL Database allows you to focus on what you do best: building great apps. You can develop your app and connect to SQL Database with the tools and platforms you prefer. 

-	Popular Languages. Develop with a choice of popular languages such as C#, Java, Node.js, Ruby, PHP, or Python or with popular frameworks such as Entity Framework, Hibernate, Ruby on Rails, and Django.  
-	Popular Platforms. Develop on a choice of popular platform such as Windows, Linux and Mac.  
-	Improve your productivity. Work with the Azure Management Portal with HTML5 support, PowerShell, or REST APIs.  
-	Familiar with SQL Server Management Studio and Visual Studio. You can leverage your skills and tools across on-premises and Azure environments.  
 
Check the following [link](https://azure.microsoft.com/en-us/services/sql-database/) for further information about Azure SQL Database.  

STRETCHDB IN SQL SERVER
------------------
Stretch Database migrates your cold data transparently and securely to the Microsoft Azure cloud. For this purpose, it connects your SQL SERVER 2016 instance with an AZURE SQL DATABASE. After you enable Stretch Database for a SQL Server instance, a database, and at least one table, Stretch Database silently begins to migrate your cold data to Azure. What is cold data? It is the data that you do not need now. You can think the typical historic table, such as Purchase History and just imagine a huge number of rows inside for every years. If the user wants to query that table through the application, it problably is interested in retrieving the most recent history. Of course it can retrieve more and older data from other years, but it is not common. But the most recent data is the important data and we can move the old data (cold) to save space in the physical table.

This is transparent for the application. In this tutorial we are going to check how SQL Server 2016 is smart as it determines how it needs to retrieve data from the local table, from Azure or from both. Event there is a way to force the data retrieval. 
You don't have to change existing queries and client apps. You continue to have seamless access to both local and remote data, even during data migration. There is a small amount of latency for remote queries, but you only encounter this latency when you query the cold data.

Check the following [link](https://msdn.microsoft.com/en-us/library/dn935011.aspx) for further information about StretchDB feature.  