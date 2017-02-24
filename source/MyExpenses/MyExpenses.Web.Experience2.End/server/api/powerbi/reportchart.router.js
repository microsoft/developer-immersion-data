'use strict';

const config = require('../../config').server;
const authFilter = require('../../auth').filter;

let controller = require('./reportchart.controller');

var base = config.path + '/powerbireport';

const routes = {
    base: base   
};

module.exports = app => {
    app.get(routes.base, authFilter, controller.getReportChart);
  
};