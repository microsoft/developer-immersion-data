<page title="Row Level Security"/>

ROW LEVEL SECURITY 
====

MyExpenses is an application that aims to provide a comprehensive expense tracking system for companies all over the world. Every employee can log expenses using the MyExpenses web portal and get them reimbursed in either cash or company points, which can be spent in the company store without leaving MyExpenses. Managers can do everything an employee can, but also review, approve or reject the expense reports submitted by team members. 

![](img/0.png)

MyExpenses is built on top of a SQL Server 2016 database, with a frontend in AngularJS and a backend using Node.js. SQL Server allows us to easily scale the services offered to our clients and provide good performance. Right now, the MyExpenses website controls the user access to the data via JavaScript filters. Think for a moment what would happen if developers accidentally forget or delete the lines of code in charge of filtering reports. Every employee of the company would see data they are not supposed to, and this could be a big problem! In order to be safer, we are going to apply Row-Level Security to our Expenses database so that when users access their expenses, they just see their ones and not those from other users. Applying this change we free the app developers of security concerns like this. 

ROW LEVEL SECURITY SUPPORT IN SQL SERVER
------------------

Row-Level Security is a feature in SQL Server 2016 that enables customers to control access to rows in a database table based on the characteristics of the user executing a query.

Check the following [link](https://msdn.microsoft.com/en-us/library/dn765131.aspx) for further information about the Row Level Security feature.