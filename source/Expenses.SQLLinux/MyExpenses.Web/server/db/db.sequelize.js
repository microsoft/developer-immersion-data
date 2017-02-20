'use strict';

let config = require('../config/server.config').db;

let Sequelize = require('sequelize');

let sequelize = new Sequelize(config.database, config.userName, config.password, config.options);

module.exports = sequelize;
