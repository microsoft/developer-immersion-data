'use strict';

let Expenses = require('../../../../model/Expenses');

let sequelize = Expenses.sequelize;

let ExpenseReport = Expenses.ExpenseReport;
let Expense = Expenses.Expense;
let ExpenseBonus = Expenses.ExpenseBonus;
let ExpenseCategory = Expenses.ExpenseCategory;

let SuspiciousExpense = Expenses.SuspiciousExpense;

let Employee = Expenses.Employee;
let CostCenter = Expenses.CostCenter;
let Team = Expenses.Team;

let Purchase = require('../../../../model/Purchase');
let EmployeePurcharse = Purchase.EmployeePurchase;
let AccountMovement = Purchase.AccountMovement;

let employeeQueryService = require('../../../../querys/query.employee');
let reportQueryService = require('../../../../querys/query.report');
let expenseService = require('../../expense/expense.service');

let BBPromise = require('bluebird');

const messages = require('../../../../locales/messages');

const status = require('../../../../model/Expenses/ReportStatus');

let ApplicationError = require('../../../../error/ApplicationError');

let createReport = function (userName, newReport) {

    return employeeQueryService.getEmployeeByUserName(userName).then(function (employee) {

        if (!employee) {
            throw new ApplicationError(messages.EmployeeNotExist);
        }

        return CostCenter.findById(newReport.costCenterId).then(function (cc) {
            if (!cc)
                throw new ApplicationError(messages.CostCenterNotExist);

            return ExpenseReport.create({
                purpose: newReport.purpose,
                description: newReport.description,
                costCenterId: newReport.costCenterId,
                createdOn: Date.now(),
                status: status.UnSubmittedForApproval,
                reimburseInPoints: false,
                submissionDate: null,
                employeeId: employee.id
            });
        });

    });

};

let updateReport = function (userName, upReport) {

    return reportQueryService.getDetailedExpenseReport(userName, upReport.reportCode).then(function (report) {

        if (report && Object.keys(report).length === 0) {
            throw new ApplicationError(messages.ReportNotExist);
        }

        if (report.Employee.email.toLowerCase() != userName.toLowerCase()) {
            throw new ApplicationError(messages.NotAuhtorized, 401);
        }

        if (status.UnSubmittedForApproval != report.status &&
            status.SubmittedForApproval != report.status) {
            throw new ApplicationError(messages.CantModifyReport);
        }

        return CostCenter.findById(upReport.costCenterId).then(function (cc) {
            if (!cc)
                throw new ApplicationError(messages.CostCenterNotExist);

            return sequelize.transaction(function (t) {
                return sequelize.query('EXEC [Expense].[SetContextInfo] @Email=N\'' + report.Employee.email + '\'', { transaction: t }).then(function () {
                    return report.update({
                        purpose: upReport.purpose,
                        costCenterId: upReport.costCenterId,
                        description: upReport.description
                    }, { fields: ['purpose', 'description', 'costCenterId'] });

                });
            });
        });
    });
};

let deleteExpensesOfReport = function (report, t) {

    let deferred = new Promise((resove, reject) => {

        var countToDelete = report.Expenses.length;

        for (let i = 0; i < report.Expenses.length; i++) {

            let expense = report.Expenses[i];

            expenseService.deleteSuspiciousOfExpense(expense, t).then(function () {

                expenseService.deleteBonusOfExpense(expense, t).then(function () {

                    expense.destroy({ transaction: t }).then(function () {
                        countToDelete -= 1;

                        if (countToDelete == 0) {
                            resove(report.Expenses.length);
                        }

                    }).catch(function (err) {
                        reject(err);
                    });

                }).catch(function (err) {
                    reject(err);
                });

            }).catch(function (err) {
                reject(err);
            });

        }

    });

    return deferred;
};

let deleteReport = function (userName, reportCode) {
    return sequelize.transaction(function (t) {
        return sequelize.query('EXEC [Expense].[SetContextInfo] @Email=N\'' + userName + '\'', { transaction: t }).then(function () {
            return ExpenseReport.find({
                where: { sequenceNumber: reportCode },
                include: [Employee, { model: Expense, exclude: ['receiptPicture'], include: [SuspiciousExpense, ExpenseBonus] }],
                transaction: t
            }).then(function (report) {

                if (!report) {
                    throw new ApplicationError(messages.ReportNotExist);
                }

                if (report.Employee.email.toLowerCase() != userName.toLowerCase()) {
                    throw new ApplicationError(messages.NotAuhtorized, 401);
                }

                if (status.UnSubmittedForApproval != report.status &&
                    status.SubmittedForApproval != report.status) {
                    throw new ApplicationError(messages.CantModifyReport);
                }

                return deleteExpensesOfReport(report, t).then(function () {
                    return report.destroy({ transaction: t });
                });

            });
        });
    });
};

let submitForApproval = function (userName, reportCode) {
    return sequelize.transaction(function (t) {
        return sequelize.query('EXEC [Expense].[SetContextInfo] @Email=N\'' + userName + '\'', { transaction: t }).then(function () {
            return ExpenseReport.find({
                where: { sequenceNumber: reportCode },
                include: [Employee],
                transaction: t
            }).then(function (report) {

                if (!report) {
                    throw new ApplicationError(messages.ReportNotExist);
                }

                if (report.Employee.email.toLowerCase() != userName.toLowerCase()) {
                    throw new ApplicationError(messages.NotAuhtorized, 401);
                }

                report.submitForApproval();

                return report.save();

            });
        });
    });
};

let reimburseInPoints = function (userName, reportCode) {
    return sequelize.transaction(function (t) {
        return sequelize.query('EXEC [Expense].[SetContextInfo] @Email=N\'' + userName + '\'', { transaction: t }).then(function () {
            return ExpenseReport.find({
                where: { sequenceNumber: reportCode },
                include: [Employee],
                transaction: t
            }).then(function (report) {

                if (!report) {
                    throw new ApplicationError(messages.ReportNotExist);
                }

                if (report.Employee.email.toLowerCase() != userName.toLowerCase()) {
                    throw new ApplicationError(messages.NotAuhtorized, 401);
                }

                report.inPoints();

                return report.save();

            });
        });
    });
};

let reimburseInCash = function (userName, reportCode) {
    return sequelize.transaction(function (t) {
        return sequelize.query('EXEC [Expense].[SetContextInfo] @Email=N\'' + userName + '\'', { transaction: t }).then(function () {
            return ExpenseReport.find({
                where: { sequenceNumber: reportCode },
                include: [Employee],
                transaction: t
            }).then(function (report) {

                if (!report) {
                    throw new ApplicationError(messages.ReportNotExist);
                }

                if (report.Employee.email.toLowerCase() != userName.toLowerCase()) {
                    throw new ApplicationError(messages.NotAuhtorized, 401);
                }

                report.inCash();

                return report.save();

            });
        });
    });
};

let approveReport = function (userName, reportCode) {
    return employeeQueryService.getEmployeeByUserName(userName, { noRaw: true }).then(function (manager) {
        if (!manager.isTeamManager)
            throw new ApplicationError(messages.OnlyManagerCanApproveReport);
        return sequelize.transaction(function (t) {
            return sequelize.query('EXEC [Expense].[SetContextInfo] @Email=N\'' + userName + '\'', { transaction: t }).then(function () {
                return ExpenseReport.find({
                    where: { sequenceNumber: reportCode },
                    include: {
                        model: Employee,
                        include: [Team]
                    },
                    transaction: t
                }).then(function (report) {

                    if (!report) {
                        throw new ApplicationError(messages.ReportNotExist);
                    }

                    if (report.Employee.teamId === manager.teamId) {
                        if (report.status === status.SubmittedForApproval) {

                            report.status = status.Approved;
                            report.summary = manager.fullName() + ' approved this expense report on ' + new Date().toUTCString() + '.';
                            return report.save();

                        } else {
                            throw new ApplicationError(messages.CantApproveNonSubmittedReport);
                        }
                    } else {
                        throw new ApplicationError(messages.OnlyManagerCanApproveReport);
                    }

                });
            });
        });
    });
};

let rejectReport = function (userName, reportCode, reason) {
    return employeeQueryService.getEmployeeByUserName(userName, { noRaw: true }).then(function (manager) {
        if (!manager.isTeamManager)
            throw new ApplicationError(messages.OnlyManagerCanRejectReport);
        return sequelize.transaction(function (t) {
            return sequelize.query('EXEC [Expense].[SetContextInfo] @Email=N\'' + userName + '\'', { transaction: t }).then(function () {
                return ExpenseReport.find({
                    where: { sequenceNumber: reportCode },
                    include: {
                        model: Employee,
                        include: [Team]
                    },
                    transaction: t
                }).then(function (report) {

                    if (!report) {
                        throw new ApplicationError(messages.ReportNotExist);
                    }

                    if (report.Employee.teamId === manager.teamId) {
                        if (report.status === status.SubmittedForApproval) {

                            report.status = status.Rejected;
                            report.summary = manager.fullName() + ' rejected this expense report on ' + new Date().toUTCString() + '.  Reason:' + reason;
                            return report.save();

                        } else {
                            throw new ApplicationError(messages.CantRejectNonSubmittedReport);
                        }
                    } else {
                        throw new ApplicationError(messages.OnlyManagerCanRejectReport);
                    }

                });
            });
        });
    });

};

let reimburseReport = function (report, manager) {

    if (!report) {
        throw new ApplicationError(messages.ReportNotExist);
    }

    if (report.Employee.teamId === manager.teamId) {
        if (report.status === status.Approved) {

            let points = parseFloat(report.points());
            points = parseFloat(points.toFixed(2));

            report.status = status.Reimbursed;

            let accountMovement = {
                movement: points,
                notes: 'Reimburse of report ' + report.sequenceNumber,
                movementDate: Date.now(),
                employeeId: report.Employee.id
            };

            return EmployeePurcharse.findById(report.Employee.id).then(function (emplPurcharse) {

                return sequelize.transaction(function (t) {

                    if (!emplPurcharse) {
                        return EmployeePurcharse.create({ employeeId: report.Employee.id, buyerCategoryId: 1, points: points }, { transaction: t }).then(function () {
                            return report.save({ transaction: t }).then(function () {
                                return AccountMovement.create(accountMovement, { transaction: t });
                            });
                        });
                    } else {
                        emplPurcharse.points = emplPurcharse.points + points;

                        return emplPurcharse.save({ transaction: t }).then(function () {
                            return report.save({ transaction: t }).then(function () {
                                return AccountMovement.create(accountMovement, { transaction: t });
                            });
                        });
                    }

                });
            });
        } else {
            throw new ApplicationError(messages.CantReimburseNonApprovedReport);
        }
    } else {
        throw new ApplicationError(messages.OnlyManagerCanReimburseReport);
    }

};

let reimburseReportByReportCode = function (userName, reportCode) {
    return employeeQueryService.getEmployeeByUserName(userName, { noRaw: true }).then(function (manager) {
        if (!manager.isTeamManager)
            throw new ApplicationError(messages.OnlyManagerCanReimburseReport);

        return ExpenseReport.findOne({
            where: { sequenceNumber: reportCode },
            include: [{
                model: Employee,
                include: [Team]
            }, {
                model: Expense,
                include: [ExpenseBonus, ExpenseCategory]
            }]
        }).then(function (report) {
            return reimburseReport(report, manager);
        });
    });
};

let cloneReport = function (userName, reportCode) {
    return sequelize.transaction(function (t) {
        return sequelize.query('EXEC [Expense].[SetContextInfo] @Email=N\'' + userName + '\'', { transaction: t }).then(function () {
            return ExpenseReport.find({
                where: { sequenceNumber: reportCode },
                include: [{
                    model: Employee
                }, {
                    model: Expense,
                    include: [ExpenseBonus, SuspiciousExpense]
                }],
                transaction: t
            }).then(function (report) {

                if (!report) {
                    throw new ApplicationError(messages.ReportNotExist);
                }

                if (report.Employee.email.toLowerCase() != userName.toLowerCase()) {
                    throw new ApplicationError(messages.NotAuhtorized, 401);
                }

                let clone = report.clone();

                return ExpenseReport.create(clone, { transaction: t }).then(function (newReport) {
                    return BBPromise.map(clone.Expenses, function (exp) {

                        exp.expenseReportId = newReport.id;

                        return Expense.create(exp, { transaction: t }).then(function (newExpense) {

                            let pSus = BBPromise.map(exp.SuspiciousExpenses, function () {
                                return SuspiciousExpense.create({

                                    suspiciousExpenseId: newExpense.id
                                }, { transaction: t });
                            });

                            let pExp = BBPromise.map(exp.ExpenseBonus, function (expBonus) {
                                return ExpenseBonus.create({
                                    amount: expBonus.amount,
                                    reason: expBonus.reason,
                                    expenseId: newExpense.id

                                }, { transaction: t });
                            });

                            return BBPromise.join(pSus, pExp);

                        });
                    });
                });

            });
        });
    });
};

module.exports = {
    createReport: createReport,
    updateReport: updateReport,
    deleteReport: deleteReport,
    submitForApproval: submitForApproval,
    reimburseInPoints: reimburseInPoints,
    reimburseInCash: reimburseInCash,
    approveReport: approveReport,
    rejectReport: rejectReport,
    reimburseReportByReportCode: reimburseReportByReportCode,
    cloneReport: cloneReport
};