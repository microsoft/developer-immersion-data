<page title="Intro"/>

INTRODUCTION
====

MyExpenses is an application that aims to provide a comprehensive expense tracking system for companies all over the world. Every employee can log expenses using the MyExpenses web portal and get them reimbursed in either cash or company points, which can be spent in the company store without leaving MyExpenses. Managers can do everything an employee can, but also review, approve or reject the expense reports submitted by team members. 

![](img/0.png)

MyExpenses is built on top of a SQL Server 2016 database, with a frontend in AngularJS and a backend using Node.js. SQL Server allows us to easily scale the services offered to our clients and provide a good performance. There are thousands of users of MyExpenses all over the world, and for most of them performance is a really important feature: sometimes a deal-breaker. This is why we want to improve the performance of two important MyExpenses areas, expenses and purchase orders, in order to make sure that both the reports that are shown to the team managers and the standard expense reporting in the website feel as responsive as possible. To do so, we'll work with in memory Clustered ColumnStore index in our data warehouse.

IN-MEMORY CLUSTERED COLUMNSTORE INDEX
====

SQL Server 2016 introduces the Clustered ColumnStore index feature for In Memory tables, to allow users that want to analyze a huge data information contained in a data warehouse system to do so with huge performance improvements. While new expenses are introduced on the website every minute, performance of the reports begins to suffer. In this hands on lab we will use ColumnStore indexes to improve the performance and reduce the response time of the reports backed by the MyExpenses data warehouse.

A ColumnStore index is a technology for storing, retrieving, and managing data by using a columnar data format, called a ColumnStore over traditional row-oriented storage. So a columnstore stores data that is logically organized as a table with rows and columns, and physically stored in a columnar format. This gives us two significant benefits:
 - 10x Query improvements in data warehouses over row-oriented
 - 10x Data compression over the uncompressed data size (data from the same domain compresses better)

 Check the following [link](https://msdn.microsoft.com/en-us/library/gg492088.aspx) for further information about In-Memory Column Store Index.
