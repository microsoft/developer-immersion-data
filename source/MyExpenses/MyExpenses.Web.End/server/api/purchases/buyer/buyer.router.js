'use strict';

const config = require('../../../config').server;
const authFilter = require('../../../auth').filter;

let controller = require('./buyer.controller');

const routes = {
    base: config.path + '/buyers/current/companyPoints',
    purchase: config.path + '/purchases',
};

module.exports = app => {
    app.get(routes.base, authFilter, controller.getCompanyPointsEmployee);
    app.post(routes.purchase, authFilter, controller.purcharseGift);
};
