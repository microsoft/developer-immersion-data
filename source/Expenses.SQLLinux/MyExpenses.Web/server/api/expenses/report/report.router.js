'use strict';

const config = require('../../../config').server;

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
    app.get(routes.summary, controller.getReportSummary);
    app.get(routes.details, controller.getReportDetails);
    app.post(routes.create, controller.createReport);
    app.put(routes.update, controller.updateReport);
    app.del(routes.delete, controller.deleteReport);
    app.put(routes.submit, controller.submitForApproval);
    app.put(routes.inpoints, controller.reimburseInPoints);
    app.put(routes.incash, controller.reimburseInCash);
    app.put(routes.approve, controller.approveReport);
    app.put(routes.reject, controller.rejectReport);
    app.put(routes.reimburse, controller.reimburseReport);
    app.put(routes.clone, controller.cloneReport);
    app.get(routes.reportLink, controller.sendLink);
};