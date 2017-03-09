'use strict';

var costCenterService = require('./costcenter.service');

let getCostCenters = function(req, res, next) {    
    costCenterService.getCostCenters()
        .then(costCenter => {
            
            res.json(costCenter);
            next();
        })
        .catch(err => {
            console.log(err);
            res.send(500, err);
            next();
        });
};

module.exports = {
    getCostCenters: getCostCenters
};