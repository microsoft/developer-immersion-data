'use strict';

let Expenses = require('../../../model/Expenses');

let Expense = Expenses.Expense;
let ExpenseReport = Expenses.ExpenseReport;
let Employee = Expenses.Employee;
let ExpenseBonus = Expenses.ExpenseBonus;
let sequelize = Expenses.sequelize;
let Team = Expenses.Team;

const messages = require('../../../locales/messages');

const reportsStatus = require('../../../model/Expenses/ReportStatus');

let ApplicationError = require('../../../error/ApplicationError');

let employeeQueryService = require('../../../querys/query.employee.js');

let buildReportList = (expenseReports, pageIndex, pageSize, count) => {
    let vm = {};

    vm.PageIndex = pageIndex;
    vm.PageSize = pageSize;
    vm.TotaCount = count;
    vm.TotalPages = Math.ceil(count / pageSize);
    vm.HasPreviousPage = pageIndex > 0;
    vm.HasNextPage = ((pageIndex + 1) < vm.TotalPages);
    vm.Items = [];

    expenseReports.forEach((expr) => {

        vm.Items.push({
            SequenceNumber: expr.sequenceNumber,
            Purpose: expr.purpose,
            SubmissionDate: expr.submissionDate,
            Status: expr.status,
            Total: expr.total(),
            Points: expr.points(),
            ChargeInPoints: expr.reimburseInPoints,
            Description: expr.description
        });
    });

    return vm;
};

let buildReportTeamsList = (expenseReports, pageIndex, pageSize, count, base_url) => {
    let vm = {};

    vm.PageIndex = pageIndex;
    vm.PageSize = pageSize;
    vm.TotaCount = count;
    vm.TotalPages = Math.ceil(count / pageSize);
    vm.HasPreviousPage = pageIndex > 0;
    vm.HasNextPage = ((pageIndex + 1) < vm.TotalPages);
    vm.Items = [];

    expenseReports.forEach((expr) => {

        vm.Items.push({
            SequenceNumber: expr.sequenceNumber,
            Purpose: expr.purpose,
            EmployeeName: expr.Employee.fullName(),
            SubmissionDate: expr.submissionDate,
            Status: expr.status,
            Total: expr.total(),
            Points: expr.points(),
            ChargeInPoints: expr.reimburseInPoints,
            Description: expr.description,
            EmployeePictureUrl: base_url + 'api/employees/' + expr.Employee.id + '/picture'
        });
    });

    return vm;
};

let getReports = function (ownerEmail, status, filter, pageIndex, pageSize) {
 
    let offset = pageIndex * pageSize;

    var conditions = {
        include: [
            {
                model: Employee,
                include: [Team],
                where: sequelize.where(sequelize.fn('lower', sequelize.col('Email')), ownerEmail.toLowerCase())
            },
            {
                model: Expense,
                attributes: { exclude: ['receiptPicture'] },
                include: [ExpenseBonus]
            }
        ],
        attributes: ['sequenceNumber', 'purpose', 'submissionDate', 'status', 'reimburseInPoints', 'description', 'createdOn'],
        order: [ [sequelize.col('createdOn'), 'DESC']],
        offset: offset, // skip pages
        limit: pageSize // fetch pageSize
    };

    conditions.where = conditions.where || {};
   
    if (status) {
        conditions.where.status = status;       
    }

    if (filter) {
        conditions.where.$or = [
            { purpose: { $like: '%' + filter + '%' } },
            { sequencenumber: { $like: '%' + filter + '%' } }];       
    }

    return countReports(ownerEmail, status, filter).then(function (c) {
        return ExpenseReport.findAll(conditions).then((reports) => {
            return buildReportList(reports, pageIndex, pageSize, c);
        });
    });              
};

let countReports = function (ownerEmail, status, filter) {

    var countConditions = {
        include: [{
            model: Employee,
            where: sequelize.where(sequelize.fn('lower', sequelize.col('Email')), ownerEmail.toLowerCase())
        }]
    };
   
    countConditions.where = countConditions.where || {};
    
    if (status) {
        countConditions.where.status = status;
    }

    if (filter) {
        countConditions.where.$or = [
            { purpose: { $like: '%' + filter + '%' } },
            { sequencenumber: { $like: '%' + filter + '%' } }];
    }

    return ExpenseReport.count(countConditions);
};

let getReportsSummary = function (ownerEmail) {
    var conditions = {
        include: {
            model: Employee,
            where: { email: ownerEmail },
            attributes: [] // no select needed
        },
        attributes: ['Status', [sequelize.fn('COUNT', sequelize.col('status')), 'Count']],
        group: ['status'],
        raw: true
    };

    return ExpenseReport.findAll(conditions).then((summary) => {
        return summary;
    });
};

let countReportsTeam = function (userName, status, filter) {
    return employeeQueryService.getEmployeeByUserName(userName, { include: [Team], noRaw: true }).then(function (employee) {
        var conditions = {
            include: [
                {
                    model: Employee,
                    required: true,
                    include: [{
                        model: Team,
                        where: { id: employee.Team.id },
                    }],
                }
            ]
        };

        conditions.where = conditions.where || {};

        if (status && (parseInt(status, 10) === reportsStatus.SubmittedForApproval || parseInt(status, 10) === reportsStatus.Approved)) {
            conditions.where.status = status;
        } else {
            conditions.where.status = {
                $in: [reportsStatus.SubmittedForApproval, reportsStatus.Approved]
            };
        }

        if (filter) {
            conditions.where.$or = conditions.where.$or || [];

            conditions.where.$or.push({
                purpose: { $like: '%' + filter + '%' }
            });

            conditions.where.$or.push({
                sequencenumber: { $like: '%' + filter + '%' }
            });

            conditions.where.$or.push(sequelize.literal('[Employee].firstName LIKE N\'%' + filter + '%\''));
            conditions.where.$or.push(sequelize.literal('[Employee].lastName LIKE N\'%' + filter + '%\''));

        }
        return ExpenseReport.count(conditions);
    });
};

let getReportsTeam = function (userName, status, filter, pageIndex, pageSize, base_url) {
    return employeeQueryService.getEmployeeByUserName(userName, { include: [Team] ,noRaw: true }).then(function (employee) {

        if (!employee.isTeamManager) {
            return new ApplicationError(messages.NotAuhtorized, 401);
        }

        let offset = pageIndex * pageSize;

        var conditions = {
            include: [
                {
                    model: Employee,
                    required: true,
                    include: [{
                        model: Team,
                        where: { id: employee.Team.id },                        
                    }],                                                          
                },
                {
                    model: Expense,
                    attributes: { exclude: ['receiptPicture'] },
                    include: [ExpenseBonus]
                }
            ],
            attributes: ['sequenceNumber', 'purpose', 'submissionDate', 'status', 'reimburseInPoints', 'description', 'createdOn'],
            order: [[sequelize.col('createdOn'), 'DESC']],
            offset: offset, // skip pages
            limit: pageSize, // fetch pageSize,            
        };

        conditions.where = conditions.where || {};
        
        if (status && (parseInt(status, 10) === reportsStatus.SubmittedForApproval || parseInt(status, 10) === reportsStatus.Approved)) {
            conditions.where.status = status;
        } else {
            conditions.where.status = {
                $in: [reportsStatus.SubmittedForApproval, reportsStatus.Approved]
            };         
        }

        if (filter) {
            conditions.where.$or = conditions.where.$or || [];

            conditions.where.$or.push({
                purpose: { $like: '%' + filter + '%' }
            });

            conditions.where.$or.push({
                sequencenumber: { $like: '%' + filter + '%' }
            });

            conditions.where.$or.push(sequelize.literal('[Employee].firstName LIKE N\'%' + filter+'%\''));
            conditions.where.$or.push(sequelize.literal('[Employee].lastName LIKE N\'%' + filter + '%\''));           
        }

        return countReportsTeam(userName, status, filter).then(function (count) {
            return ExpenseReport.findAll(conditions).then(function (reports) {
                return buildReportTeamsList(reports, pageIndex, pageSize, count, base_url);
            });
        });
      
    });
};

let getReportsTeamSummary = function (userName) {

    return employeeQueryService.getEmployeeByUserName(userName, { include: [Team], noRaw: true }).then(function (employee) {
        var conditions = {
            include: {
                model: Employee,
                include: [{
                    model: Team,
                    where: { id: employee.Team.id },
                    attributes: []
                }],
                attributes: [] // no select needed
            },
            where: {
                status: {
                    $in: [reportsStatus.SubmittedForApproval, reportsStatus.Approved]
                }
            },
            attributes: ['Status', [sequelize.fn('COUNT', sequelize.col('status')), 'Count']],
            group: ['status'],
            raw: true
        };

        return ExpenseReport.findAll(conditions).then((summary) => {
            return summary;
        });
    });    
};

module.exports = {
    getReports: getReports,
    getReportsSummary: getReportsSummary,
    getReportsTeam: getReportsTeam,
    getReportsTeamSummary: getReportsTeamSummary
};