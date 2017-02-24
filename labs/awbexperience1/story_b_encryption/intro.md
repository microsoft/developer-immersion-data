<page title="Intro"/>

ALWAYS ENCRYPTED
====

MyExpenses is an application that aims to provide a comprehensive expense tracking system for companies all over the world. Every employee can log expenses using the MyExpenses web portal and get them reimbursed in either cash or company points, which can be spent in the company store without leaving MyExpenses. Managers can do everything an employee can, but also review, approve or reject the expense reports submitted by team members. 

![](img/image1.png)

MyExpenses is built on top of a SQL Server 2016 database, with a frontend in AngularJS and a backend using Node.js. SQL Server allows us to easily scale the services offered to our clients and provide a good performance. At MyExpenses, one of the most important features is security: our database contains employee account numbers, and right now they're stored as plain text. The account numbers are required by the payroll management application, since at the moment MyExpenses only manages internally the company points. 

However, it's a massive risk to have such sensitive information easily accessible. At the moment, any employee with access to the database can look at any other employee account number or even worse, if a malicious attacker manages to access the database, we would be in a lot of trouble. We've considered different approaches to solve the issue, and decided to try one of the new features of SQL Server 2016: Always Encrypted. As far as we've read, using Always Encrypted we can encrypt the account number and be completely safe since only the payroll management application, using the proper key, will be able to decrypt it.

ALWAYS ENCRYPTED IN SQL SERVER
------------------
Always Encrypted is a client-side encryption technology that ensures that neither the encrypted data, nor the encryption keys, are revealed to the database (SQL Server 2016 in this scenario). It is the sole responsibility of the client driver to encrypt the data before sending it to the database engine, and decrypt the data retrieved from the database. This provides a clear separation between the data owners, who can view it freely, and the data managers, who shouldn't be able to access it. Since the encryption and decryption of the data is managed by the driver, Always Enabled makes encryption transparent to the client applications. 

Check this [link](https://msdn.microsoft.com/en-us/library/mt163865.aspx) for further information about the Always Encrypted feature.

By using Always Encrypted to encrypt the employees account numbers in MyExpenses we aim to improve the security of the app by ensuring they cannot be read by anyone besides the client. Let’s see which steps we need to follow in order to get it done.