'use strict';

const config = require('../../../config').server;

let controller = require('./employee.controller');

const routes = {
    base: config.path + '/employees/current',
    picture: config.path + '/employees/:employeeId/picture'
};

module.exports = app => {
    app.get(routes.base, controller.getMyProfile);
    app.get(routes.picture, controller.getPicture);
};
