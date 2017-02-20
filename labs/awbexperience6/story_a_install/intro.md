# INTRODUCTION
In this lab we are going to connect the **MyExpenses** application
we have seen on previous labs, with an **SQL Server 2016 on Linux**.

SQL Server 2016 can be executed on different platforms:
- Linux
- MacOS
- Windows
- Docker
- Azure

In this lab, we will choose one of the **Linux** flavors to execute the SQL Server 2016 on.

## The Power of ``SQL Server`` now on Linux and containers

The next version of SQL Server, dubbed ``SQL Server v.Next,`` brings Microsoft’s industry-leading relational
database engine to the enterprise Linux ecosystem. 

This includes SQL Server Agent, Active Directory authentication, best-in-class high availability/disaster recovery, and unparalleled data security features. 
It is important to note that SQL Server on Linux is not a port or a rewrite. This is Microsoft’s world-class
RDBMS now available on more operating systems like Red Hat Enterprise Linux (RHEL), SUSE Linux
Enterprise Server (SLES), Ubuntu, and more cloud and container platforms like OpenStack, Docker Swarm,
Kubernetes, and Mesosphere D/C OS.

SQL Server 2016 offers the best performance and security features, which are now available with SQL
Server on Linux. High performance features such as columnstore, which provides column-based data
storage ad processing to achieve up to 10x the query performance and data compression over row-based
storage, and In-Memory OLTP which brings transaction processing to memory optimized tables at more
than 2.5x the speed of disk-based tables, bring record-breaking speed to data-driven applications.

Security features such as Row-Level Security and Dynamic Data Masking provide server-side security
measures which vastly simplify keeping your data safe from unauthorized access, without the need for 
modifying existing client applications. More details on these world-class features and more will be
covered later in this lab.

The quickest and easiest way to execute SQL Server 2016 on Linux is do it choosing the *Docker flavor* and run SQL Server 2016 on linux
inside a **Docker** container.

With *Docker* we can execute ``SQL Server 2016 on Linux`` inside a Mac.

**Docker +** ``SQL Server 2016 Linux`` image is going to manage all of this complexity for us in the background.

## MyExpenses

MyExpenses is an demo app that aims to provide a comprehensive expense tracking system for companies all over the world. 
Every employee can log expenses using the MyExpenses web portal and get them reimbursed in either cash or company points, which can be spent in the company store without leaving MyExpenses. 
Managers can do everything an employee can, but also review, approve or reject the expense reports submitted by team members. 

You can find the demo app in the `source\Expenses.SQLLinux` directory. 

You need to copy the content of this directory to your own computer to complete this lab.

**IMPORTANT:** You must use your own workstation to complete the lab, not the Azure virtual machine.

## Requisites

Before starting you need to be sure that your workstation has all the prerequisites needed to complete the lab.

- At least 4 Gb RAM in our computer
	- Mac must be a 2010 or newer model, with Intel’s hardware support for memory management unit (MMU) virtualization.
	- OS X El Capitan 10.11 or upper. 
- [Visual Studio Code](https://code.visualstudio.com/) 
- [Nodejs](https://nodejs.org)
- gulp and bower installed as global
    - npm install bower -g
    - npm install gulp -g

<a href="1.InstallConfigureDocker.md">Next</a>
