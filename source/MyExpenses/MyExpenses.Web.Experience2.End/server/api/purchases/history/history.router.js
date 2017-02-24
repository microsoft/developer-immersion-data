'use strict';

const config = require('../../../config').server;
const authFilter = require('../../../auth').filter;

let controller = require('./history.controller');

const routes = {
    base: config.path + '/purchases/history',
};

module.exports = app => {
    app.get(routes.base, authFilter, controller.getPurchasesHistory);
};