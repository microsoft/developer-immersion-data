# OVERVIEW

AdventureWorks Bikes is an ecommerce SaaS platform focused on helping bikes stores run better in the "cloud"—without the headaches and inefficiencies of disconnected and costly in-house IT systems for finance, order and inventory management, ecommerce and more.

From the customer point of view the Bike Store aggregates the information of all the stores to provide a unified shopping experience. The public web portal allows the customers to search the existing products across stores and show the best offers for the customer.

DocumentDB is the primary data store for our product catalogue. AdventureWorks identifies early the need to support an ever changing product definition, maintain multiple product prices for customers in different countries and provide a fast query response. Through the use of functionality provided by DocumentDB we can easily meet these needs.

![](img/image1.jpg)
 
# DOCUMENTDB OVERVIEW

Modern applications produce, consume and therefore must respond quickly to very large volumes of data. These applications evolve very rapidly and so does the underlying data schema. In response to this, developers have increasingly chosen schema-free NoSQL databases as simple, fast, scalable solutions to store and process data while preserving the ability to quickly iterate over application data models and unstructured data feeds. However, many schema-free databases do not allow for complex queries and transactional processing, making advanced data management difficult. This is where 
DocumentDB comes in. Microsoft developed DocumentDB to fulfill these requirements when managing data for today's applications.

DocumentDB is a true schema-free NoSQL database service designed for modern mobile, web, gaming, and IoT applications. DocumentDB delivers consistently fast reads and writes, schema flexibility, and the ability to easily scale a database in and out on demand. It does not assume or require any schema for the JSON documents that it indexes. By default, it automatically indexes all the documents in the database and does not expect or require any schema or creation of secondary indexes. DocumentDB enables complex ad hoc queries using a SQL language, supports well defined consistency levels, and offers JavaScript language integrated, multi-document transaction processing using the familiar programming model of stored procedures, triggers, and UDFs.

As a JSON database, DocumentDB natively supports JSON documents enabling easy iteration of application schema, and support applications that need key-value, document or tabular data models. DocumentDB embraces the ubiquity of JSON and JavaScript, eliminating mismatches between application defined objects and database schema. Deep integration of JavaScript also allows developers to execute application logic efficiently and directly - within the database engine in a database transaction.

## Hierarchical resource model

As the following diagram illustrates, the DocumentDB hierarchical resource model consists of sets of resources under a database account, each reachable via a logical and stable URI. A set of resources will be referred to as a feed in this article.
 
![](img/image2.jpg)

In order to start working with resources, you must create a DocumentDB database account using your Azure subscription. A database account can consist of a set of databases, each one containing multiple collections and each collection may contain stored procedures, triggers, UDFs, documents and related attachments (preview feature). A database also has associated users, each one with a set of permissions to access collections, stored procedures, triggers, UDFs, documents or attachments. While databases, users, permissions and collections are system-defined resources with well-known schemas, documents and attachments contain arbitrary, user defined JSON content.

# UPDATE THE WEB APP CONFIGURATION FILE

1. Open the `<your_repo_directory>\source\AdventureWorks.Bikes\src\AdventureWorks.Bikes.Web` directory.

1. Open the `appsettings.json` file.

1. Replace the tokens with the right configuration.
    
    - `YOUR_DEFAULT_CONNECTION` 
    - `YOUR_IDENTITY_CONNECTION` 
    - `YOUR_INSTRUMENTATION_KEY` 
    - `YOUR_SEARCH_SERVICE_NAME` 
    - `YOUR_SEARCH_SERVICE_KEY` 
    - `YOUR_DOCUMENTDB_ENDPOINT` 
    - `YOUR_DOCUMENTDB_KEY` 

<a href="0.Tour.md">Next</a>