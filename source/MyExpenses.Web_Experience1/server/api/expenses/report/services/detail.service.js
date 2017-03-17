'use strict';

let reportQueryService = require('../../../../querys/query.report');

let buildGetReportDetail = (report, base_url) => {
    let vm = {};

    vm.SequenceNumber = report.sequenceNumber;
    vm.Purpose = report.purpose;
    vm.SubmissionDate = report.submissionDate;
    vm.Status = report.status;
    vm.Total = report.total();
    vm.Points = report.points();
    vm.Description = report.description;
    vm.Summary = report.summary;
    vm.CreationDate = report.creationDate;
    vm.ChargedInPoints = report.reimburseInPoints;
    vm.CostCenterId = report.CostCenter.id;
    vm.CostCenter = report.CostCenter.code;
    vm.EmployeeName = report.Employee.fullName();
    vm.Employee = base_url + 'api/employees/' + report.Employee.id  +'/picture';
    
    return vm;
};

let getDetailedExpenseReport = function (userName, reportCode, base_url) {

    return reportQueryService.getDetailedExpenseReport(userName, reportCode).then(function (report) {
        return buildGetReportDetail(report, base_url);
    });

};

module.exports = {
    getDetailedExpenseReport: getDetailedExpenseReport
};

