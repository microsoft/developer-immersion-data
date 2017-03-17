'use strict';

var reportService = require('./reportList.service');

const messages = require('../../../locales/messages');

let ApplicationError = require('../../../error/ApplicationError');

let catchError = (err, res) => {
    console.log(err);

    let error = {
        Content: messages.CommonApiError,
        ReasonPhrase: (err instanceof ApplicationError) ? err.message : ''
    };

    res.send(500, error);
};

let getReports = function(req, res, next) {
    
    let pageIndex = parseInt(req.query.pageIndex || '0', 10);
    let pageSize = parseInt(req.query.pageSize || '10', 10);

    reportService.getReports(req.user.email, req.query.status, req.query.filter, pageIndex, pageSize)
        .then(reports => {
            res.json(reports);
            next();
        })
        .catch(err => {
            catchError(err, res);
            next();
        });
};

let getReportsSummary = function (req, res, next) {

    reportService.getReportsSummary(req.user.email)
        .then(summary => {
            res.json(summary);
            next();
        })
        .catch(err => {
            catchError(err, res);
            next();
        });
};

let getReportsTeam = function (req, res, next) {

    let pageIndex = parseInt(req.query.pageIndex || '0', 10);
    let pageSize = parseInt(req.query.pageSize || '10', 10);

    let base_url = req.root_url;

    reportService.getReportsTeam(req.user.email, req.query.status, req.query.filter, pageIndex, pageSize, base_url)
        .then(reports => {
            res.json(reports);
            next();
        })
        .catch(err => {
            catchError(err, res);
            next();
        });
};

let getReportsTeamSummary = function (req, res, next) {

    reportService.getReportsTeamSummary(req.user.email)
        .then(summary => {
            res.json(summary);
            next();
        })
        .catch(err => {
            catchError(err, res);
            next();
        });
};
module.exports = {
    getReports: getReports,
    getReportsSummary: getReportsSummary,
    getReportsTeam: getReportsTeam,
    getReportsTeamSummary: getReportsTeamSummary
};