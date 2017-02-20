'use strict';

const config = require('../../../config').server;

let controller = require('./products.controller');

const routes = {
    base: config.path + '/products',
    picture: config.path + '/products/:productId/picture'
};

module.exports = app => {
    app.get(routes.base, controller.getProducts);
    app.get(routes.picture, controller.getPicture);
};
