# Build globally distributed applications using Azure Cosmos DB

## User Story

It used to take extensive time and monotonous efforts to build a Globally Distributed Database conventionally. Also, there were some issues of **Latency** and **Consistency** in case of the data stored in a centralized location. So, to unravel this we will use the **Azure Cosmos Database**.

You will come across the power of **Azure Cosmos DB's** features such as **Turnkey global distribution**, **Consistency**, **Multi-model API**, **Partitioning**, **Failover mechanism** and **SLA's** using **ContosoAir** website along with **SQL DB API**, **Mongo DB API** and **Azure** **Functions**.
    ![](img/Intro.jpg)

## Components Used in Scenario

   ![](img/architechture.jpg)

- **Azure Cosmos DB** is Microsoft's globally distributed, multi-model database. With the click of a button, **Azure Cosmos DB** enables you to elastically and independently scale throughput and storage across any number of Azure's geographic regions. It offers throughput, latency, availability, and consistency guarantees with comprehensive  [service level agreements](https://aka.ms/acdbsla) (SLAs), something no other database service can offer. ([Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/))
- **Azure Functions** is a serverless compute service that enables you to run code on-demand without having to explicitly provision or manage infrastructure. Use **Azure Functions** to run a script or piece of code in response to a variety of events. ([Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/))
- **SQL DB API** is schema-less JSON database engine with SQL querying capabilities. ([SQL DB](https://docs.microsoft.com/en-us/azure/cosmos-db/documentdb-introduction))
- **MongoDB API** is a database service built on top of **Cosmos DB**. Compatible with existing MongoDB libraries, drivers, tools and applications. ([Mongo DB](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction))

## What you will learn from this experience

- Deployment of **Azure resources** through **Ansible playbook**.
- Easily build **globally-distributed** applications without the hassle of complex, multiple-datacenter configurations.
- Walk through different **Consistency Levels** available in **Azure Cosmos DB.**
- Real time example of **Multi-Model API** of **Azure Cosmos DB.**
- Handling **Automatic regional failover** for business continuity in **Azure Cosmos DB**.
- In depth analysis of **Partitioning**.
- **SLA** (Service Level Agreement) for **Azure Cosmos DB**

  > _**Ready? Let's get started!**_

