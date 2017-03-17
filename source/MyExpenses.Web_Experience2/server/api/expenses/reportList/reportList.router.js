'use strict';

const config = require('../../../config').server;
const authFilter = require('../../../auth').filter;

let controller = require('./reportList.controller');

const routes = {
    reports: config.path + '/reports',
    summary: config.path + '/summary',
    reportsTeam: config.path + '/reports/team/pending',
    summaryTeam: config.path + '/summary/team'
};

module.exports = app => {
    app.get(routes.reports, authFilter, controller.getReports);
    app.get(routes.summary, authFilter, controller.getReportsSummary);
    app.get(routes.reportsTeam, authFilter, controller.getReportsTeam);
    app.get(routes.summaryTeam, authFilter, controller.getReportsTeamSummary);
};