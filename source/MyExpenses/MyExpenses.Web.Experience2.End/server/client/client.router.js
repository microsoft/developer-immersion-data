'use strict';

let restify = require('restify');

const routes = {
    base: /^(?:(?!api).)*$/
};

module.exports = app => {
    app.get(routes.base, restify.serveStatic({
        directory: './client/dist',
        default: 'index.html'
    }));
};