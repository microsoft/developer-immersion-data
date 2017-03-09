'use strict';

module.exports = {
    getReportSummary: require('./summary.service').getReportSummary,
    getDetailedExpenseReport: require('./detail.service').getDetailedExpenseReport,
    createReport: require('./report.service').createReport,
    updateReport: require('./report.service').updateReport,
    deleteReport: require('./report.service').deleteReport,
    submitForApproval: require('./report.service').submitForApproval,
    reimburseInPoints: require('./report.service').reimburseInPoints,
    reimburseInCash: require('./report.service').reimburseInCash,
    approveReport: require('./report.service').approveReport,
    rejectReport: require('./report.service').rejectReport,
    reimburseReportByReportCode: require('./report.service').reimburseReportByReportCode,
    cloneReport: require('./report.service').cloneReport,
};