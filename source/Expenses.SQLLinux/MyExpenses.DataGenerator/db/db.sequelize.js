'use strict';

let config = require('../config/db.config');

let Sequelize = require('sequelize');

let sequelize = new Sequelize(config.database, config.userName, config.password, config.options);
let sequelizeMaster = new Sequelize('master', config.userName, config.password, config.options);
let sequelizeDWH = new Sequelize('ExpensesDWH', config.userName, config.password, config.options);



module.exports = {
    sequelize: sequelize,
    sequelizeMaster: sequelizeMaster,
    sequelizeDWH: sequelizeDWH
}

