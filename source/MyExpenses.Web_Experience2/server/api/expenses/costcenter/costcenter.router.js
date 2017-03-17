'use strict';

const config = require('../../../config').server;
const authFilter = require('../../../auth').filter;

let controller = require('./costcenter.controller');

var base = config.path + '/costcenters';

const routes = {
    base: base,
};

module.exports = app => {
    app.get(routes.base, authFilter, controller.getCostCenters);
};