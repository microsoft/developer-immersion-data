'use strict';

const config = require('../../../config').server;

let controller = require('./reportList.controller');

const routes = {
    reports: config.path + '/reports',
    summary: config.path + '/summary',
    reportsTeam: config.path + '/reports/team/pending',
    summaryTeam: config.path + '/summary/team'
};

module.exports = app => {
    app.get(routes.reports, controller.getReports);
    app.get(routes.summary, controller.getReportsSummary);
    app.get(routes.reportsTeam, controller.getReportsTeam);
    app.get(routes.summaryTeam, controller.getReportsTeamSummary);
};