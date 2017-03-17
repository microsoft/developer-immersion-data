'use strict';

const config = require('../../../config').server;
const authFilter = require('../../../auth').filter;

let controller = require('./report.controller');

var base = config.path + '/reports';

const routes = {
    base: base,
    summary: base + '/:reportcode/summary',
    details: base + '/:reportcode/details',
    create: base + '/create',
    update: base + '/:reportcode/update',
    delete: base + '/:reportcode/delete',
    submit: base + '/:reportcode/submit',
    inpoints: base + '/:reportcode/inpoints',
    incash: base + '/:reportcode/incash',
    approve: base + '/:reportcode/approve',
    reject: base + '/:reportcode/reject',
    reimburse: base + '/:reportcode/reimburse',
    clone: base + '/:reportcode/clone',
    reportLink: base + '/chartlink'
};

module.exports = app => {
    app.get(routes.summary, authFilter, controller.getReportSummary);
    app.get(routes.details, authFilter, controller.getReportDetails);
    app.post(routes.create, authFilter, controller.createReport);
    app.put(routes.update, authFilter, controller.updateReport);
    app.del(routes.delete, authFilter, controller.deleteReport);
    app.put(routes.submit, authFilter, controller.submitForApproval);
    app.put(routes.inpoints, authFilter, controller.reimburseInPoints);
    app.put(routes.incash, authFilter, controller.reimburseInCash);
    app.put(routes.approve, authFilter, controller.approveReport);
    app.put(routes.reject, authFilter, controller.rejectReport);
    app.put(routes.reimburse, authFilter, controller.reimburseReport);
    app.put(routes.clone, authFilter, controller.cloneReport);
    app.get(routes.reportLink, controller.sendLink);
};