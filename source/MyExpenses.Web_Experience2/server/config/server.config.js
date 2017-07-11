 'use strict';

 let config = {
     port: process.env.port || 8000,
     path: 'api',
     serverName: 'DemoExpenses',
     db: {
         userName: process.env.databaseUsername || 'experience2',
         password: process.env.databasePassword || 'P2ssw0rd@Dev',
         database: process.env.database || 'Expenses',
         options: {
             host: process.env.databaseServer || '{YOUR DATABASE SERVER DNS NAME HERE}',
             dialect: 'mssql',
             pool: {
                 max: 5,
                 min: 0,
                 idle: 10000
             }
         }
     }
 };

 module.exports = config;