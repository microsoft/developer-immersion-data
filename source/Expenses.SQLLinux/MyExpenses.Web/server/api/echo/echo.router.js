'use strict';

const config = require('../../config').server;

let controller = require('./echo.controller');

const routes = {
    base: config.path + '/echo/:msg',
};

module.exports = app => {
    app.get(routes.base, controller.get);
};