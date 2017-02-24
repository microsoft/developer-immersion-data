'use strict';

let Expenses = require('../../../../model/Expenses');

let employeeQueryService = require('../../../../querys/query.employee');

let Expense = Expenses.Expense;
let ExpenseBonus = Expenses.ExpenseBonus;
let ExpenseReport = Expenses.ExpenseReport;
let Employee = Expenses.Employee;
let ExpenseCategory = Expenses.ExpenseCategory;

let sequelize = Expenses.sequelize;

let buildSummary = (report, categories) => {
    let vm = {};

    vm.Description = report.description;

    vm.Points = report.points();

    vm.ExpenseCategoryDetails = [];

    categories.forEach(function (c) {
        vm.ExpenseCategoryDetails.push({
            CategoryId: c.id,
            Category: c.title,
            Total: 0
        });
    });

    report.Expenses.forEach(function (exp) {

        var indexCategory = null;

        vm.ExpenseCategoryDetails.forEach(function (c, index) {
            if (c.CategoryId === exp.ExpenseCategory.id) {
                indexCategory = index;
            }
        });

        if (Number.isInteger(indexCategory) && indexCategory >= 0) {            
            vm.ExpenseCategoryDetails[indexCategory].Total += exp.total();
        } else {
            vm.ExpenseCategoryDetails.push({
                CategoryId: exp.ExpenseCategory.id,
                Category: exp.ExpenseCategory.title,
                Total: exp.total()
            });
        }
    });

    return vm;
};

let getExpenseCategories = function () {
    return ExpenseCategory.findAll();
};

let getReportSummary = function (userName, reportCode) {
   
    return employeeQueryService.getEmployeeByUserName(userName).then(function (employee) {
        var conditions = {
            include: [
                {
                    model: Expense,
                    attributes: { exclude: ['receiptPicture'] },
                    include: [ExpenseBonus, ExpenseCategory]
                }, {
                    model: Employee,
                    where: {
                        $or: [{ Id: employee.id },
                            [{ TeamId: employee.teamId, $and: sequelize.literal('1 = ' + (employee.isTeamManager ? '1' : '0')) }]]
                    }
                }
            ],
            where: { 'sequenceNumber': reportCode },

        };

        return ExpenseReport.findAll(conditions).then(function (reports) {
           
            if (reports.length == 0)
                return {};

            return getExpenseCategories().then(function (categories) {
                return buildSummary(reports[0], categories);
            });

        });
    });

};

module.exports = {
    getReportSummary: getReportSummary
};
