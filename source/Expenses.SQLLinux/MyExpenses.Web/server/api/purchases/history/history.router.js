'use strict';

const config = require('../../../config').server;

let controller = require('./history.controller');

const routes = {
    base: config.path + '/purchases/history',
};

module.exports = app => {
    app.get(routes.base, controller.getPurchasesHistory);
};