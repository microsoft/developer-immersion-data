'use strict';

var historyService = require('./history.service');

let getPurchasesHistory = function(req, res, next) {
   
    historyService.getPurchasesHistory(req.user.email)
        .then(results => {
            res.json(results);
            next();
        })
        .catch(error => {
            res.send(500, error);
            next();
        });
};

module.exports = {
    getPurchasesHistory: getPurchasesHistory
};

