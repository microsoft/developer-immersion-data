<page title="Temporal Tables"/>

TEMPORAL TABLES
====

MyExpenses is an application that aims to provide a comprehensive expense tracking system for companies all over the world. Every employee can log expenses using the MyExpenses web portal and get them reimbursed in either cash or company points, which can be spent in the company store without leaving MyExpenses. Managers can do everything an employee can, but also review, approve or reject the expense reports submitted by team members.

![](img/0.png)

MyExpenses is built on top of a SQL Server 2016 database, with a frontend in AngularJS and a backend using Node.js. SQL Server allows us to easily scale the services offered to our clients and provide a good performance. It is important for us to be able to track the changes made to an expense by an employee, in order to see if some employees are messing up with the expenses amounts, and also to keep a historical record. Sadly, currently there is no way to do this, since each change overwrites the previous value. To get this info, we're looking at the Temporal Tables feature of SQL Server 2016, that allows us to track and monitor changes on the Expenses tables in a clean and easy way.

TEMPORAL TABLES IN SQL SERVER
------------------
One of the new features included in SQL Server 2016 are the temporal tables. That allows to us to have system-versioned tables as a database feature that brings build-in support for providing information about data stored in the table at any point in time rather than only the data that is correct at the current moment in time.
The benefits to developers to implement an analyzing data changes over time are:

- **History tracking:** it is integrated into SQL Server. You don’t have to configure anything (triggers, stored procedures, app…). The process below is automatic and optimal.
- **Data analysis:** The new clause “FOR SYSTEM TIME” give us to travel into the history time of a table. That’s makes querying simply.
- **Schema maintenance:** To do any change to your table schema, to add a column for instance, that will be change automatically into your history table as well. 
- **Data protection:** Nobody can change temporal tables. Immutability of history is guaranteed so your history is protected from external access.
 
Check the following [link](https://msdn.microsoft.com/en-us/library/dn935015.aspx) for further information about Temporal Tables feature.