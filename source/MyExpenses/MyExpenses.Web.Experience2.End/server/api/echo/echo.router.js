'use strict';

const config = require('../../config').server;
const authFilter = require('../../auth').filter;

let controller = require('./echo.controller');

const routes = {
    base: config.path + '/echo/:msg',
};

module.exports = app => {
    app.get(routes.base, authFilter, controller.get);
};