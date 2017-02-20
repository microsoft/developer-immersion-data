'use strict';

const config = require('../../../config').server;

let controller = require('./buyer.controller');

const routes = {
    base: config.path + '/buyers/current/companyPoints',
    purchase: config.path + '/purchases',
};

module.exports = app => {
    app.get(routes.base, controller.getCompanyPointsEmployee);
    app.post(routes.purchase, controller.purcharseGift);
};
