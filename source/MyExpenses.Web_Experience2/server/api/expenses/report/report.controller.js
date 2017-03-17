'use strict';

var reportService = require('./services');

const restify = require('restify');

let catchError = require('../../../error/ErrorHandler');

let getReportSummary = function(req, res, next) {

    let reportCode = req.params.reportcode;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    reportService.getReportSummary(req.user.email, reportCode)
        .then(reportSummary => {

            if (Object.keys(reportSummary).length === 0) {
                res.send(new restify.NotFoundError());
                return;
            }

            res.json(reportSummary);
            next();
        })
        .catch(err => {
            catchError(err, res);
            next();
        });
};

let getReportDetails = function (req, res, next) {

    let reportCode = req.params.reportcode;

    let base_url = req.root_url;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    reportService.getDetailedExpenseReport(req.user.email, reportCode, base_url)
        .then(reportDetails => {

            if (Object.keys(reportDetails).length === 0) {
                res.send(new restify.NotFoundError());
                return;
            }

            res.json(reportDetails);
            next();
        })
        .catch(err => {
            catchError(err, res);
            next();
        });
};

let createReport = function (req, res, next) {
    
    let report = req.body;

    req.assert('purpose', '').notEmpty();
    req.assert('costCenterId', '').notEmpty();
    req.assert('description', '').notEmpty();
    
    var errors = req.validationErrors();

    if (errors) {
        res.send(new restify.BadRequestError());
        next();
        return;
    }

    reportService.createReport(req.user.email, report)
        .then(() => {
            res.send(201);
            next();
        }).catch(err => {
            next();
            catchError(err, res);
        });
};

let updateReport = function (req, res, next) {

    let reportCode = req.params.reportcode;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    let report = req.body;

    req.assert('purpose', '').notEmpty();
    req.assert('costCenterId', '').notEmpty();
    req.assert('description', '').notEmpty();

    report.reportCode = reportCode;

    var errors = req.validationErrors();

    if (errors) {
        res.send(new restify.BadRequestError());
        next();
        return;
    }

    reportService.updateReport(req.user.email, report)
        .then(() => {
            res.send(200);
            next();
        }).catch(err => {
            catchError(err, res);
            next();
        });
};

let deleteReport = function (req, res, next) {
    let reportCode = req.params.reportcode;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    reportService.deleteReport(req.user.email, reportCode)
        .then(() => {
            res.send(200);
            next();
        }).catch(err => {
            catchError(err, res);
            next();
        });
};

let submitForApproval = function (req, res, next) {
    let reportCode = req.params.reportcode;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    reportService.submitForApproval(req.user.email, reportCode)
        .then(() => {
            res.send(200);
            next();
        }).catch(err => {
            catchError(err, res);
            next();
        });
};

let reimburseInPoints = function (req, res, next) {
    let reportCode = req.params.reportcode;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    reportService.reimburseInPoints(req.user.email, reportCode)
        .then(() => {
            res.send(200);
            next();
        }).catch(err => {
            catchError(err, res);
            next();
        });
};

let reimburseInCash = function (req, res, next) {
    let reportCode = req.params.reportcode;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    reportService.reimburseInCash(req.user.email, reportCode)
        .then(() => {
            res.send(200);
            next();
        }).catch(err => {
            catchError(err, res);
            next();
        });
};

let approveReport = function (req, res, next) {
    let reportCode = req.params.reportcode;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    reportService.approveReport(req.user.email, reportCode)
        .then(() => {
            res.send(200);
            next();
        }).catch(err => {
            catchError(err, res);
            next();
        });
};

let rejectReport = function (req, res, next) {
    let reportCode = req.params.reportcode;
    let reason = req.body.reason;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    if (!reason) {
        res.send(new restify.BadRequestError('No reason'));
        next();
        return;
    }

    reportService.rejectReport(req.user.email, reportCode, reason)
        .then(() => {
            res.send(200);
            next();
        }).catch(err => {
            catchError(err, res);
            next();
        });
};

let reimburseReport = function (req, res, next) {

    let reportCode = req.params.reportcode;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    reportService.reimburseReportByReportCode(req.user.email, reportCode)
        .then(() => {
            res.send(200);
            next();
        }).catch(err => {
            catchError(err, res);
            next();
        });
};

let cloneReport = function (req, res, next) {
    let reportCode = req.params.reportcode;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    reportService.cloneReport(req.user.email, reportCode)
        .then(() => {
            res.send(200);
            next();
        }).catch(err => {
            catchError(err, res);     
            next();                   
        });
};

let sendLink = function (req, res, next) {

    try {
        let link = process.env.link || ''; // <-- YOUR REPORT SERVER DNS NAME HERE
        res.header('Content-Type', 'text/plain');
        res.send(200, link);
        next();
    } catch (e) {
        res.send(500, e.message);
        next();
    }
};

module.exports = {
    getReportSummary: getReportSummary,
    getReportDetails: getReportDetails,
    createReport: createReport,
    updateReport: updateReport,
    deleteReport: deleteReport,
    submitForApproval: submitForApproval,
    reimburseInPoints: reimburseInPoints,
    reimburseInCash: reimburseInCash,
    approveReport: approveReport,
    rejectReport: rejectReport,
    reimburseReport: reimburseReport,
    cloneReport: cloneReport,
    sendLink: sendLink
};