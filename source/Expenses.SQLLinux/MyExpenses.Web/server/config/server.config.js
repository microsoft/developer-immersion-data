'use strict';

let config = {
    port: process.env.port || 8000,
    path: 'api',
    serverName: 'DemoExpenses',
    db: {
        userName: process.env.databaseUsername || 'sa',
        password: process.env.databasePassword || 'P2ssw0rd',
        database: process.env.database || 'Expenses',
        options: {
            host: process.env.databaseServer || 'localhost',
            dialect: 'mssql',
            port: process.env.databasePort || 11433,
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        }
    }
};

module.exports = config;