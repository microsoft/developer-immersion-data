# ADVANCED FEATURES IN ``SQL Server 2016 on Linux``

MyExpenses is an application that aims to provide a comprehensive expense tracking system for companies all over the world. Every employee can log expenses using the MyExpenses web portal and get them reimbursed in either cash or company points, which can be spent in the company store without leaving MyExpenses. Managers can do everything an employee can, but also review, approve or reject the expense reports submitted by team members. 

![](img/image1.png)

MyExpenses is built on top of a SQL Server 2016 database, with a frontend in AngularJS and a backend using Node.js. SQL Server allows us to easily scale the services offered to our clients and provide a good performance. 

## Dynamic data masking in SQL Server

At MyExpenses, one of the most important features is security: since we’re working with sensitive information
(emails, account numbers…), we need to ensure only authorized users can access it. At the moment, any employee
with access to the database can look at any other employee email address or worse, account number. Even worse,
if a malicious attacker manages to access the database, we would be in a lot of trouble. We've considered
different approaches to solve the issue, and decided to try one of the new features of SQL Server 2016:
``Dynamic Data Masking``.

## In-memory clustered columnstore index

There are thousands of users of MyExpenses all over the world, and for most of them, performance is a really
important feature: sometimes a deal-breaker.  This is why we want to improve the performance of the
important MyExpenses area, expenses, in order to make sure that the reports that are shown to the team managers
and the standard expense reporting in the website feel as responsive as possible. 

To do so, we'll work with in memory ``Clustered ColumnStore index`` in our data warehouse.

<a href="1.PopulateSqlServerWithHugeData.md">Next</a>

