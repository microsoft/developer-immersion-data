'use strict';

let get = function (req, res, next) {
    var msg = req.params.msg;

    res.send(`Echo kk: ${msg}`);

    next();
};

module.exports = {
    get: get
};

