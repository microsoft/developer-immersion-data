'use strict';

let Expenses = require('../../../model/Expenses');
let https = require('https');

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
    return getEmployeeId(ownerEmail).then(id => {
        return searchReports(filter, pageIndex, pageSize, id).then((reports) => {
            var conditions = {
                include: [
                    {
                        model: Employee,
                        include: [Team]
                    },
                    {
                        model: Expense,
                        attributes: { exclude: ['receiptPicture'] },
                        include: [ExpenseBonus]
                    }
                ],
                attributes: ['sequenceNumber', 'purpose', 'submissionDate', 'status', 'reimburseInPoints', 'description', 'createdOn'],
                order: [[sequelize.col('createdOn'), 'DESC']],
                where: {
                    id: {
                        in: reports.ids
                    }
                }
            };
            conditions.where = conditions.where || {};

            if (status) {
                conditions.where.status = status;
            }

            return ExpenseReport.findAll(conditions).then((reports) => {
                return buildReportList(reports, pageIndex, pageSize, reports.total);
            });
        });
    });
};

let getEmployeeId = function (ownerEmail) {
    return Employee.find({
        where: sequelize.where(sequelize.fn('lower', sequelize.col('Email')), ownerEmail.toLowerCase())
    }).then((employee) => employee.id);
};

let searchReports = function (filter, pageIndex, pageSize, employeeId) {
    let offset = pageIndex * pageSize;
    // Search filter. '*' means to search everything in the index.
    let search = filter ? filter : '*';
    // Path that will be built depending on the arguments passed.
    let searchPath = encodeURI('/indexes/expensereports/docs?api-version=2015-02-28&$top=' + pageSize + '&search=' + search + '&$filter=EmployeeId eq ' + employeeId);
    // Request needed to get the total number of documents available, so pagination works as expected.
    let totalCountPath = encodeURI('/indexes/expensereports/docs?api-version=2015-02-28&$count=true&$filter=EmployeeId eq ' + employeeId);
    let totalCount;

    if (offset > 0) {
        searchPath += '&$skip=' + offset;
    }

    return azureSearchRequest(totalCountPath).then(count => {
        var parseCount = JSON.parse(count);
        totalCount = parseCount['@odata.count'];
        return azureSearchRequest(searchPath).then(responseString => {
            var responseObject = JSON.parse(responseString);
            // We return the total number of reports and the array of ids.
            var reportIds = responseObject.value.map((val) => parseInt(val.Id,10));
            var reports = {
                total: totalCount,
                ids: reportIds
            };
            return reports;
        });
    });
};

let azureSearchRequest = function (requestPath) {
    var options = {
        hostname: '{YOUR_AZURE_SEARCH_NAME}.search.windows.net',
        method: 'GET',
        path: requestPath,
        headers: {
            'api-key': '{YOUR_AZURE_SEARCH_KEY}',
            'Content-Type': 'application/json'
        },
    };

    // Request to get the number of elements.

    let deferred = new Promise((resolve, reject) => {
        var req = https.request(options, function (res) {
            res.setEncoding('utf-8');

            var responseString = '';

            res.on('data', function (data) {
                responseString += data;
            });

            res.on('end', function () {
                console.log(responseString);
                resolve(responseString);
            });
        });

        req.on('error', function (e) {
            reject(e);
            console.error(e);
        });

        req.end();
    });

    return deferred;
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

    return sequelize.transaction(function (t) {
        return sequelize.query('EXEC [Expense].[SetContextInfo] @Email=N\'' + ownerEmail + '\'', { transaction: t }).then(function () {
            conditions.transaction = t;
            return ExpenseReport.findAll(conditions).then((summary) => {
                return summary;
            });
        });
    });
};

let countReportsTeam = function (userName, status, filter, t) {
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

        if (t) {
            conditions.transaction = t;
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

        return sequelize.transaction(function (t) {
            return sequelize.query('EXEC [Expense].[SetContextInfo] @Email=N\'' + employee.email + '\'', { transaction: t }).then(function () {
                return countReportsTeam(userName, status, filter, t).then(function (count) {
                    conditions.transaction = t;
                    return ExpenseReport.findAll(conditions).then(function (reports) {
                        return buildReportTeamsList(reports, pageIndex, pageSize, count, base_url);
                    });
                });
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

        return sequelize.transaction(function (t) {
            return sequelize.query('EXEC [Expense].[SetContextInfo] @Email=N\'' + employee.email + '\'', { transaction: t }).then(function () {
                conditions.transaction = t;
                return ExpenseReport.findAll(conditions).then((summary) => {
                    return summary;
                });
            });
        });
    });    
};

module.exports = {
    getReports: getReports,
    getReportsSummary: getReportsSummary,
    getReportsTeam: getReportsTeam,
    getReportsTeamSummary: getReportsTeamSummary
};