# OVERVIEW

AdventureWorks Bikes is an ecommerce SaaS platform focused on helping bikes stores run better in the "cloud" without the headaches and inefficiencies of disconnected and costly in-house IT systems for finance, order and inventory management, ecommerce and more. 
- Eliminate manual processes and IT systems maintenance by running your business in the cloud. 

- Manage the customers, orders and all the topics related to the business. 

- Manage store and online business, integrated with the store accounting, inventory, CRM and more. 

- Help grow revenues. 


![](img/image13.jpg) 

AdventureWorks Bikes is the single-tenant database model application: Each store gets a separate instance of the database which runs on a logically isolated hardware environment. With this option, there´s essentially no sharing going on. Every store has their own database, separate from everyone else. 

![](img/image14.jpg) 

There is a thousand of articles talking about the technical aspects between a single tenant model and multi-tenant model. But the fact is that the decision between single tenant and multi-tenant is a strategic one and more often decided by the business factors rather than the technical factors. 
- Single tenant gives you enhanced security. 

- Single tenant systems are usually more reliable. 

- Single tenant systems are easier to backup and restore. 

- Single tenant is easier to migrate from SaaS to Self-Hosted. 
 
### AZURE SQL DATABASE 

SQL Database is a relational database service in the cloud based on the market-leading Microsoft SQL Server engine, with mission-critical capabilities. SQL Database delivers predictable performance, scalability with no downtime, business continuity and data protection´all with near-zero administration. You can focus on rapid app development and accelerating your time to market, rather than managing virtual machines and infrastructure. Because it´s based on the SQL Server engine, SQL Database supports existing SQL Server tools, libraries and APIs, which makes it easier for you to move and extend to the cloud. 

Azure SQL Database allows you to focus on what you do best: building great apps. You can develop your app and connect to SQL Database with the tools and platforms you prefer. 

- Popular Languages. Develop with a choice of popular languages such as C#, Java, Node.js, Ruby, PHP, or Python or with popular frameworks such as Entity Framework, Hibernate, Ruby on Rails, and Django.  

- Popular Platforms. Develop on a choice of popular platform such as Windows, Linux and Mac. 

- Improve your productivity. Work with the Azure Management Portal with HTML5 support, PowerShell, or REST APIs. 

- Familiar with SQL Server Management Studio and Visual Studio. You can leverage your skills and tools across on-premises and Azure environments.  
 
 
Also, SQL Database helps you build secure apps in the cloud by providing built in protection and security features - without implementing custom code. With Azure´s physical and operational security, Azure SQL Database can help you meet the most stringent regulatory compliances. 

- Data Protection. Built-in geo-redundant database backups provide complete data protection.  

- Point-in-time Restore. One click restore service offers full protection from user mistakes. SQL Database´s automatically generates backups, putting the power to restore to any point in time in your hands.  

- Geo-restore. One click restore service allows you to restore your database to a different region if it became unavailable due to a catastrophic failure.  

- High Availability. Built-in automatic failover system guarantees 99.99% availability of your database, so common failures within the datacenter do not interrupt your apps.  

- Business Continuity. Configurable database geo-replication protects your critical databases from catastrophic failures or extended outages in the region.  

- One click configuration. You can easily protect your application and enable an aggressive SLA. 

- Compliance ready. Meet or exceed national, regional, and industry-specific compliance requirements.  

- Data Protection /Always Encrypted. Protect data at rest, in motion, or in use with built-in encryption features that leverage the NIST´s Advance Encryption Standard 256 cipher. 

### UPDATE THE WEB APP CONFIGURATION FILE

1. Open the `<your_repo_directory>\source\AdventureWorks.Bikes\src\AdventureWorks.Bikes.Web` directory.

1. Open the `appsettings.json` file.

1. Replace the tokens with the right configuration.
    
    - `YOUR_DEFAULT_CONNECTION` 
    - `YOUR_IDENTITY_CONNECTION` 
    - `YOUR_INSTRUMENTATION_KEY` 
    - `YOUR_SEARCH_SERVICE_NAME` 
    - `YOUR_SEARCH_SERVICE_KEY` 
    - `YOUR_COSMOSDB_ENDPOINT` 
    - `YOUR_COSMOSDB_KEY` 

<a href="0.Tour.md">Next</a>



