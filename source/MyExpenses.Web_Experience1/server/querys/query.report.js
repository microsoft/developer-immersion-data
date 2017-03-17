'use strict';

let Expenses = require('../model/Expenses');

let employeeQueryService = require('./query.employee');

let Employee = Expenses.Employee;
let ExpenseReport = Expenses.ExpenseReport;
let ExpenseBonus = Expenses.ExpenseBonus;
let ExpenseCategory = Expenses.ExpenseCategory;
let Expense = Expenses.Expense;
let CostCenter = Expenses.CostCenter;
let Team = Expenses.Team;
let SuspiciousExpense = Expenses.SuspiciousExpense;

let sequelize = Expenses.sequelize;

let getDetailedExpenseReport = function (userName, reportCode, includeExpensesReceipt) {
    return employeeQueryService.getEmployeeByUserName(userName).then(function (employee) {
        var conditions = {
            include: [
                {
                    model: Expense,
                    include: [ExpenseBonus, ExpenseCategory, SuspiciousExpense]                  
                }, {
                    model: Employee,
                    include: [Team],
                    where: {
                        $or: [{ Id: employee.id },
                            [{ TeamId: employee.teamId, $and: sequelize.literal('1 = ' + (employee.isTeamManager ? '1' : '0')) }]]
                    }
                }, {
                    model: CostCenter
                }
            ]            
        };

        if (!includeExpensesReceipt && conditions.include)
            conditions.include[0].attributes = { exclude: ['receiptPicture'] };

        conditions.where = conditions.where || {};

        if (reportCode) {
            conditions.where.sequenceNumber = reportCode;
        }

        let deferred = new Promise((resolve, reject) => {
            ExpenseReport.findAll(conditions).then(function (reports) {
                if (!reports || reports.length === 0)
                    resolve({});
                else
                    resolve(reports[0]);
            }).catch(function (err) {
                reject(err);
            });
        });

        return deferred;
    });
};

module.exports = {
    getDetailedExpenseReport: getDetailedExpenseReport
};