'use strict';

const config = require('../../../config').server;

let controller = require('./costcenter.controller');

var base = config.path + '/costcenters';

const routes = {
    base: base,
};

module.exports = app => {
    app.get(routes.base, controller.getCostCenters);
};