'use strict';

let rootUrl = function (req, res, next) {
    let host = req.headers.host;

    let protocol = 'http';

    if (req.connection.encrypted) {
        protocol = 'https';
    }

    req.root_url = protocol + '://' + host;

    next();
};

let rootUrlParser = function () {
    return rootUrl;
};

module.exports = { rootUrlParser: rootUrlParser };