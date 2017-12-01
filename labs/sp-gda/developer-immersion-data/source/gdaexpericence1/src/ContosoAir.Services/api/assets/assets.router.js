const restify = require('restify');

module.exports = server => {
    server.get(/\/documents\/?.*/, restify.serveStatic({
        directory: './api/assets',
        default: 'map'
    }));
};
