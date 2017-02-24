'use strict';

const config = require('../../../config').server;
const authFilter = require('../../../auth').filter;

let controller = require('./employee.controller');

const routes = {
    base: config.path + '/employees/current',
    picture: config.path + '/employees/:employeeId/picture'
};

module.exports = app => {
    app.get(routes.base, authFilter, controller.getMyProfile);
    app.get(routes.picture, controller.getPicture);
};
