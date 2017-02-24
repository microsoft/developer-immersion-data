'use strict';

var reportChartService = require('./reportchart.service');

const restify = require('restify');

let catchError = require('../../error/ErrorHandler');

let getReportChart = function (req, res, next) {

    //let reportCode = req.params.reportcode;

    //if (!reportCode) {
    //    res.send(new restify.BadRequestError('Invalid expense report code'));
    //    return;
    //}

    reportChartService.getReportChart()
        .then(report => {

            if (Object.keys(report).length === 0) {
                res.send(new restify.NotFoundError());
                next();
                return;
            }

            res.json(report);
        })
        .catch(err => {
            catchError(err, res);
            next();
        });
};

module.exports = {
    getReportChart: getReportChart,
   
};