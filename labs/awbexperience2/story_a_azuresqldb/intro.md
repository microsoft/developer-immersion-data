<page title="Intro"/>

AZURE SQL DATABASE
====

MyExpenses is an application that aims to provide a comprehensive expense tracking system for companies all over the world. Every employee can log expenses using the MyExpenses web portal and get them reimbursed in either cash or company points, which can be spent in the company store without leaving MyExpenses. Managers can do everything an employee can, but also review, approve or reject the expense reports submitted by team members. 

![](img/0.png)

MyExpenses is built on top of a SQL Server 2016 database, with a frontend in AngularJS and a backend using Node.js. SQL Server allows us to easily scale the services offered to our clients and provide a good performance. Until now, MyExpenses was running on SQL Server 2016 in an on-premises database. This is perfectly fine, but we wan't to modernize it to take advantage of some features (Azure Search, Azure ML...) which are better suited for a database on the cloud. Since Azure SQL Database provides us with everything that SQL Server 2016 on-premises offers us, we're going to migrate the whole MyExpenses system to the cloud!

AZURE SQL DATABASE
------------------
Azure SQL Database is a relational database service in the cloud based on the market-leading Microsoft SQL Server engine, with mission-critical capabilities. SQL Database delivers predictable performance, scalability with no downtime, business continuity and data protection—all with near-zero administration. You can focus on rapid app development and accelerating your time to market, rather than managing virtual machines and infrastructure. Because it’s based on the SQL Server engine, SQL Database supports existing SQL Server tools, libraries and APIs, which makes it easier for you to move and extend to the cloud.

The purpose of this lab is show you how easily you can migrate from your current database installed in a SQL Server on a Virtual Machine to an Azure SQL Database keeping all the features you have been using until this very moment. In fact, we are going to migrate the MyExpenses database, which has some very interesting features like In-Memory OLTP, In-Memory Columnstore Index, Row Level Security, Always Encrypted, Dynamic Data Masking or JSON capabilities.

Check the following [link](https://azure.microsoft.com/en-us/services/sql-database/) for further information about Azure SQL Database.

