<page title="Intro"/>

DYNAMIC DATA MASKING
====

MyExpenses is an application that aims to provide a comprehensive expense tracking system for companies all over the world. Every employee can log expenses using the MyExpenses web portal and get them reimbursed in either cash or company points, which can be spent in the company store without leaving MyExpenses. Managers can do everything an employee can, but also review, approve or reject the expense reports submitted by team members. 

![](img/image1.png)

MyExpenses is built on top of a SQL Server 2016 database, with a frontend in AngularJS and a backend using Node.js. SQL Server allows us to easily scale the services offered to our clients and provide a good performance. At MyExpenses, one of the most important features is security: since we’re working with sensitive information (emails, account numbers…), we need to ensure only authorized users can access it. At the moment, any employee with access to the database can look at any other employee email address or worse, account number. Even worse, if a malicious attacker manages to access the database, we would be in a lot of trouble. We've considered different approaches to solve the issue, and decided to try one of the new features of SQL Server 2016: Dynamic Data Masking. Based on what we've investigated, it should allow masking of the sensitive fields so they're not out in the open.

DYNAMIC DATA MASKING IN SQL SERVER
------------------
DDM can be defined on a per-column basis, indicating the level of obfuscation that will be applied to each one of them:

- Default masking, which fully masks the original value 
- Partial masking, which allows a custom masking to be applied 
- Random masking, which replaces a numeric value with a random one within a specified range
- Email masking, which exposes only the first character of the email and keeps its format

Check this [link](https://msdn.microsoft.com/en-us/library/mt130841.aspx) for further information about the Dynamic Data Masking feature.

In MyExpenses, we have a few fields that contain sensitive information: the employee email address and their account number. Right now, any IT employee that connects to the MyExpenses database can access this information, and we want to ensure this is not the case anymore. Applying DDM will allow us to hide emails and account numbers from non-privileged users, while keepping them available for users with the proper permissions. Let’s see which steps we need to follow in order to get it done.