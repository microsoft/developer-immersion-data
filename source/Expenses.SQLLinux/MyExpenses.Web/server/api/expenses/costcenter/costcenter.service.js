'use strict';

let Expenses = require('../../../model/Expenses');

let getCostCenters = function () {

    return Expenses.CostCenter.findAll().then(function (consCenters) {

        let cc = [];

        consCenters.forEach(function (c) {
            cc.push({ Id: c.id, Code: c.code, Version: 'Version 2' });
        });
        return cc;
    });
};

module.exports = {
    getCostCenters: getCostCenters
};