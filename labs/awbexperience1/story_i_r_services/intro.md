<page title="Intro"/>

R SERVICES
====

MyExpenses is an application that aims to provide a comprehensive expense tracking system for companies all over the world. Every employee can log expenses using the MyExpenses web portal and get them reimbursed in either cash or company points, which can be spent in the company store without leaving MyExpenses. Managers can do everything an employee can, but also review, approve or reject the expense reports submitted by team members. 

![](img/0.png)

MyExpenses is built on top of a SQL Server 2016 database, with a frontend in AngularJS and a backend using Node.js. SQL Server allows us to easily scale the services offered to our clients and provide a good performance. MyExpenses aims to be an intelligent application, and what we mean here by intelligence is the ability to learn and make decisions. In MyExpenses this means that we are going to build a system for assessing expenses. Even though we assume the employees to be honest, sometimes they could make mistakes when adding a new expense (purposelessly or not). This tutorial will show how a suspicious detection system can be implemented using SQL Server 2016 R Services.

R SERVICES IN SQL SERVER
------------------
SQL Server 2016 R Services provides a platform for developing and deploying intelligent applications that uncover new insights. You can use the rich and powerful R language and the many packages from the community to create models and generate predictions using your SQL Server data. Because R Services integrates the R language with SQL Server, you can keep analytics close to the data and eliminate the costs and security risks associated with data movement.

- **R Services (In-Database)**: Install this feature during SQL Server setup to enable secure execution of R scripts on the SQL Server computer. When you select this feature, extensions are installed in the database engine to support execution of R scripts, and a new service is created, the SQL Server Trusted Launchpad, to manage communications between the R runtime and the SQL Server instance.

- **Microsoft R Client**: A free tool that lets data scientists develop R solutions from their workstations while working with production data that resides on the SQL Server. When you install the in-database server or the client, you get the basic R libraries, plus the ScaleR libraries for enhanced connectivity and performance. Microsoft R Client is available as a separate, free installer.

You will find more information about R Services in SQL Services in this [link](https://msdn.microsoft.com/en-us/library/mt604845.aspx).