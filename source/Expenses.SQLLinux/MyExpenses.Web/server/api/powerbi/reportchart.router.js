'use strict';

const config = require('../../config').server;

let controller = require('./reportchart.controller');

var base = config.path + '/powerbireport';

const routes = {
    base: base   
};

module.exports = app => {
    app.get(routes.base, controller.getReportChart);
  
};