# SQL LINUX ON WINDOWS

In this lab we are going to connect the **MyExpenses** application
we have seen on previous labs, with an **SQL Server 2016 on Linux**.

SQL Server 2016 can be executed on different platforms:
- Linux
- macOS
- Windows
- Docker
- Azure

In this lab we will choose one of the **Linux** flavors to execute the SQL Server 2016 on.

## The Power of ``SQL Server`` now on Linux and containers

The next version of SQL Server, dubbed ``SQL Server v.Next,`` brings Microsoft’s industry-leading relational
database engine to the enterprise Linux ecosystem. 

This includes SQL Server Agent, Active Directory authentication, best-in-class high availability/disaster recovery, and unparalleled data security features. 
It is important to note that the SQL Server on Linux is not a port or a rewrite. This is Microsoft’s world-class
RDBMS now available on more operating systems like Red Hat Enterprise Linux (RHEL), SUSE Linux
Enterprise Server (SLES), Ubuntu, and more cloud and container platforms like OpenStack, Docker Swarm,
Kubernetes, and Mesosphere D/C OS.

SQL Server 2016 offers the best performance and security features, which are now available with SQL
Server on Linux. High performance features such as columnstore, which provides column-based data
storage ad processing to achieve up to 10x the query performance and data compression over row-based
storage, and In-Memory OLTP which brings transaction processing to memory optimized tables at more
than 2.5x the speed of disk-based tables, bringing record-breaking speed to data-driven applications.

Security features such as Row-Level Security and Dynamic Data Masking provide server-side security
measures which vastly simplify keeping your data safe from unauthorized access, without the need for 
modifying existing client applications. More details on these world-class features and more will be
covered later in this lab.

The quickest and easiest way to execute SQL Server 2016 on Linux is do it choosing the *Docker flavor* and run SQL Server 2016 on linux
inside a **Docker** container.

With *Docker* we can execute ``SQL Server 2016 on Linux`` inside a Windows computer.

**Docker +** ``SQL Server 2016 Linux`` image is going to manage all of this complexity for us in the background.

## Requisites

Before starting, you need to be sure that your workstation has all the prerequisites needed to complete the lab.

- At least 4 Gb RAM in our computer.
- Windows 64 bit.
    - Windows 10 Professional, Enterprise - Anniversary Edition. 
    - Windows Server 2016.
- [Visual Studio Code](https://code.visualstudio.com/) 
- [Nodejs](https://nodejs.org)
- gulp and bower installed as global
    - npm install bower -g
    - npm install gulp -g

### Provision the Azure Resources###

1. Create the Azure resources.
    
  Simply click the Deploy to Azure button below and follow the wizard to create the resources. You will need to log in to the Azure Portal.
                                                                     
  <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fibonilm%2Ftemplates%2Fmaster%2Ftemplatesql.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
  </a>

  The resources will be deployed to a Resource Group. You can delete the resource group in order to remove all the created resources at any time.

###Modules###

<a href="./story_a_install/intro.md">Module 1: Easy to Install and acquire experience</a>
    
  This topic explains how to pull and run the mssql-server Docker image.

<a href="./story_b_advanced_features/intro.md">Module 2: Access to Advanced features</a>
    
  This topic explains how some advanced SQL Server features work on Linux.

<a href="./story_c_cloud/intro.md">Module 3: Use SQL Server 2016 where you want</a>
    
  This topic explains how an existing application can work on SQL Database or SQL Linux.



