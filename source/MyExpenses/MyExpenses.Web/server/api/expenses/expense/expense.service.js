'use strict';

let Expenses = require('../../../model/Expenses');

let ExpenseReport = Expenses.ExpenseReport;
let Expense = Expenses.Expense;
let ExpenseCategory = Expenses.ExpenseCategory;
let ExpenseBonus = Expenses.ExpenseBonus;
let SuspiciousExpense = Expenses.SuspiciousExpense;

let sequelize = Expenses.sequelize;

let Employee = Expenses.Employee;

let Bonification = Expenses.Bonification;

let employeeQueryService = require('../../../querys/query.employee.js');

let reportQueryService = require('../../../querys/query.report.js');

let ApplicationError = require('../../../error/ApplicationError');

const messages = require('../../../locales/messages');

const status = require('../../../model/Expenses/ReportStatus');

let suspiciousService = require('./suspicious/suspicious.service');
let suspiciousStrategy = require('./suspicious/procedure.strategy');

let buildExpensesOfReport = (report, base_url) => {
    let vm = [];

    report.Expenses.forEach(function (x) {
        let r = {};
        r.ExpenseId = x.id;
        r.Title = x.title;
        r.Date = x.date;
        r.Recurrent = x.isRecurrent() ? 'Recurrent' : '';
        r.CategoryId = x.ExpenseCategory.id;
        r.Category = x.ExpenseCategory.title;
        r.Total = x.total();
        r.IsSuspicious = x.isSuspicious();
        r.ReceiptUrl = base_url +'/api/reports/' + report.sequenceNumber + '/expenses/'+ x.id + '/receipt';

        vm.push(r);
    });
    return vm;
    
};

let buildExpenseDetail = (report, expenseId) => {
    let vm = {};

    for (var i = 0; i < report.Expenses.length; i++) {
        var exp = report.Expenses[i];
        if (exp.id === parseInt(expenseId, 10)) {
            vm.Notes = exp.notes;
            vm.Amount = exp.amount;
            vm.TotalBonus = exp.totalBonus();
            vm.RecurrentDays = exp.isRecurrent() ? exp.daysEnabled() : 0;
            vm.Points = exp.points();
            vm.IsSuspicious = exp.isSuspicious();
            break;
        }
    }
   
    return vm;
};

let getExpensesOfReport = function (userName, reportCode, filter, request_url) {
   
    return employeeQueryService.getEmployeeByUserName(userName).then(function (employee) {
        var conditions = {
            include: [
                {
                    model: Expense,
                    include: [ExpenseBonus, SuspiciousExpense, ExpenseCategory]
                }, {
                    model: Employee,
                    where: {
                        $or: [{ Id: employee.id },
                            [{ TeamId: employee.teamId, $and: sequelize.literal('1 = ' + (employee.isTeamManager ? '1' : '0')) }]]
                    }
                }
            ],
            where: { sequenceNumber: reportCode }

        };

        if (filter && filter != '') {
            conditions.include[0].where = { title: { $like: '%' + filter + '%' } };
        }

        return ExpenseReport.findAll(conditions).then(function (reports) {
            if (reports.length === 0)
                return [];

            return buildExpensesOfReport(reports[0], request_url);          
        });
    });

};

let getExpenseDetail = function (userName, reportCode, expenseId) {
    return reportQueryService.getDetailedExpenseReport(userName, reportCode).then(function (report) {
        return buildExpenseDetail(report, expenseId);
    });
};

let getReceipt = function (userName, reportCode, expenseId) {
   
    return reportQueryService.getDetailedExpenseReport(userName, reportCode, true).then(function (report) {

        if (report && Object.keys(report).length === 0)
            return null;

        if (Array.isArray(report.Expense) && report.Expense.length === 0)
            return null;

        for (var i = 0; i < report.Expenses.length; i++) {
            var exp = report.Expenses[i];
            if (exp.id === parseInt(expenseId, 10)) {
                return exp.receiptPicture;                               
            }
        }

        return null;

    });
    
};

let daydiff = function (first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
};

let createExpense = function (userName, reportCode, expense) {
        
    return ExpenseReport.find({
        where: { sequenceNumber: reportCode },
        include: [{ model: Employee, include: [Bonification] }]        
    }).then(function (report) {
       
        if (!report) {
            throw new ApplicationError(messages.ReportNotExist);
        }

        if (report.Employee.email.toLowerCase() != userName.toLowerCase()) {
            throw new ApplicationError(messages.NotAuhtorized, 401);
        }

        return ExpenseCategory.findById(expense.categoryId).then(function (cat) {
            if (!cat)
                throw new ApplicationError(messages.CategoryNotExist);
            
            if (expense.recurrentFrom && expense.recurrentTo) {
                let rFrom = new Date(expense.recurrentFrom);
                let rTo = new Date(expense.recurrentTo);
                if (rFrom > rTo)
                    throw new ApplicationError(messages.InvalidInputRecurrentPatternDateTo);

                if (daydiff(rFrom, rTo) <= 1) {
                    expense.recurrentFrom = null;
                    expense.recurrentTo = null;
                }
            }

            if (expense.receipt)
                var buf = new Buffer(expense.receipt, 'base64');

            return Expense.create({
                enabledFrom: expense.recurrentFrom ? expense.recurrentFrom : null,
                enabledTo: expense.recurrentTo ? expense.recurrentTo : null,
                title: expense.title,
                notes: expense.notes,
                amount: expense.amount,
                expenseReportId: report.id,
                expenseCategoryId: cat.id,
                receiptPicture: buf ? buf : null,
                date: expense.date
            }).then(function (newExp) {
                return suspiciousService.evaluateExpense(suspiciousStrategy, { id: newExp.id }).catch(function (err) {
                    console.log(err);
                });
            });

        });

    });  
};

let updateExpense = function (userName, reportCode, expenseId, expenseDto) {

    return ExpenseReport.find({
        where: { sequenceNumber: reportCode },
        include: [{ model: Employee }, { model: Expense }]
    }).then(function (report) {

        if (!report) {
            throw new ApplicationError(messages.ReportNotExist);
        }

        if (report.Employee.email.toLowerCase() != userName.toLowerCase()) {
            throw new ApplicationError(messages.NotAuhtorized);
        }

        if (report.status !== status.UnSubmittedForApproval && report.status !== status.SubmittedForApproval)
            throw new ApplicationError(messages.CantModifyReport);

        return ExpenseCategory.findById(expenseDto.categoryId).then(function (cat) {
            if (!cat)
                throw new ApplicationError(messages.CategoryNotExist);

            if (expenseDto.recurrentFrom && expenseDto.recurrentTo) {
                let rFrom = new Date(expenseDto.recurrentFrom);
                let rTo = new Date(expenseDto.recurrentTo);
                if (rFrom > rTo)
                    throw new ApplicationError(messages.InvalidInputRecurrentPatternDateTo);
            }
                       
            let expenseToUpdate = report.Expenses.find(function (exp) {
                return exp.id === parseInt(expenseId, 10);
            });

            if (!expenseToUpdate)
                throw new ApplicationError(messages.ExpenseNotExist);

            let upExpense = {
                title: expenseDto.title,
                date: expenseDto.date,
                notes: expenseDto.notes,
                amount: expenseDto.amount,
                expenseCategoryId: expenseDto.categoryId,
                enabledFrom: expenseDto.recurrentFrom ? expenseDto.recurrentFrom : null,
                enabledTo: expenseDto.recurrentTo ? expenseDto.recurrentTo : null
            };

            let fieldsToUpdate = { fields: ['title', 'date', 'notes', 'amount', 'expenseCategoryId', 'enabledFrom', 'enabledTo'] };

            if (expenseDto.receipt)
                var newReceipt = new Buffer(expenseDto.receipt, 'base64');

            if (newReceipt) {               
                upExpense.receiptPicture = newReceipt;
                fieldsToUpdate.fields.push('receiptPicture');               
            }
                       
            return expenseToUpdate.update(upExpense, fieldsToUpdate).then(function (newExp) {
                return suspiciousService.evaluateExpense(suspiciousStrategy, { id: newExp.id });
            });

        });

    });  
};

let deleteBonusOfExpense = function (expense, t) {
    let bonusIdsArr = [];

    bonusIdsArr = expense.ExpenseBonus.map(function (eb) {
        return eb.id;
    });

    let deferred = new Promise((resove, reject) => {

        if (bonusIdsArr.length > 0) {

            ExpenseBonus.destroy({
                where: {
                    id: { $in: bonusIdsArr }
                },
                transaction: t
            }).then(function (rows) {
                resove(rows);
            }).catch(function (err) {
                reject(err);
            });

        } else {
            resove(0);
        }

    });

    return deferred;
};

let deleteSuspiciousOfExpense = function (expense, t) {

    let suspiciousExpenseIds = [];

    if (expense.SuspiciousExpenses.length > 0)
        suspiciousExpenseIds = [expense.SuspiciousExpenses[0].id];

    let deferred = new Promise((resove, reject) => {

        if (suspiciousExpenseIds.length > 0) {
            SuspiciousExpense.destroy({
                where: {
                    id: { $in: suspiciousExpenseIds }
                },
                transaction: t
            }).then(function (rows) {
                resove(rows);
            }).catch(function (err) {
                reject(err);
            });
        } else {
            resove(0);
        }

    });

    return deferred;
};

let deleteExpenseOfReport = function (expense, t) {
    let deferred = new Promise((resove, reject) => {

        deleteSuspiciousOfExpense(expense, t).then(function () {

            deleteBonusOfExpense(expense, t).then(function () {

                expense.destroy({ transaction: t }).then(function () {
                    resove();
                }).catch(function (err) {
                    reject(err);
                });

            }).catch(function (err) {
                reject(err);
            });

        }).catch(function (err) {
            reject(err);
        });

    });

    return deferred;
};

let deleteExpense = function (userName, reportCode, expenseId) {
    return ExpenseReport.find({
        where: { sequenceNumber: reportCode },
        include: [Employee, { model: Expense, exclude: ['receiptPicture'], include: [SuspiciousExpense, ExpenseBonus] }]
    }).then(function (report) {

        if (!report) {
            throw new ApplicationError(messages.ReportNotExist);
        }

        if (report.Employee.email.toLowerCase() != userName.toLowerCase()) {
            throw new ApplicationError(messages.NotAuhtorized, 401);
        }

        if (status.UnSubmittedForApproval != report.status &&
            status.SubmittedForApproval != report.status) {
            throw new ApplicationError(messages.CantDeleteExpenseInNotValidState);
        }

        let ExpenseToDelete = report.Expenses.find(function (exp) {
            return exp.id == expenseId;
        });

        return sequelize.transaction(function (t) {
            return deleteExpenseOfReport(ExpenseToDelete, t);
        });
        
    });
};

let getExpenseCategories = function () {

    return ExpenseCategory.findAll({ order: 'title' }).then(function (categories) {
        let dtoCategories = [];
        categories.forEach(function (c) {
            dtoCategories.push({
                Id: c.id,
                Title: c.title,
                DefaultAmount: c.defaultAmount,
                Version: 'Version 2'
            });            
        });

        return dtoCategories;

    });
};

let getExpense = function (userName, reportCode, expenseId) {
    return reportQueryService.getDetailedExpenseReport(userName, reportCode, true).then(function (report) {

        if (report && Object.keys(report).length === 0)
            return null;

        if (Array.isArray(report.Expense) && report.Expense.length === 0)
            return null;

        let expense = report.Expenses.find(function (exp) {
            return exp.id === parseInt(expenseId, 10);
        });
              
        if (expense) {
            let image64 = null;
            if (expense.receiptPicture)
                image64 = new Buffer(expense.receiptPicture).toString('base64');

            return {
                CategoryId: expense.expenseCategoryId,
                Title: expense.title,
                Amount: expense.amount,
                Date: expense.date,
                RecurrentFrom: expense.enabledFrom,
                RecurrentTo: expense.enabledTo,
                Notes: expense.notes,
                Receipt: image64
            };
        } else return expense; 

    });
};

module.exports = {
    getExpensesOfReport: getExpensesOfReport,
    getExpenseDetail: getExpenseDetail,
    getReceipt: getReceipt,
    createExpense: createExpense,
    updateExpense: updateExpense,
    getExpenseCategories: getExpenseCategories,
    getExpense: getExpense,
    deleteExpense: deleteExpense,
    deleteBonusOfExpense: deleteBonusOfExpense,
    deleteSuspiciousOfExpense: deleteSuspiciousOfExpense

};
