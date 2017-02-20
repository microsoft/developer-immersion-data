 'use strict';

let config = {
        userName: 'sa',
        password: 'P2ssw0rd',
        database: 'Expenses',
        options: {
            dialectOptions: {           
                requestTimeout: 3500000
            },
            host: process.env.databaseServer || 'localhost',
            logging: false,
            dialect: 'mssql',
            port: process.env.databasePort || 11433,
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        }
};

module.exports = config;