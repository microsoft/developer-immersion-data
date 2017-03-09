'use strict';

const config = require('../../../config').server;
const authFilter = require('../../../auth').filter;

let controller = require('./products.controller');

const routes = {
    base: config.path + '/products',
    picture: config.path + '/products/:productId/picture'
};

module.exports = app => {
    app.get(routes.base, authFilter, controller.getProducts);
    app.get(routes.picture, controller.getPicture);
};
