'use strict';

let sequelize = require('../../db/db.sequelize');

let ExpenseReport = sequelize.import('./ExpenseReport');
let Expense = sequelize.import('./Expense');
let Employee = sequelize.import('./Employee');
let ExpenseBonus = sequelize.import('./ExpenseBonus');
let ExpenseCategory = sequelize.import('./ExpenseCategory');
let Picture = sequelize.import('./Picture');
let Team = sequelize.import('./Team');
let CostCenter = sequelize.import('./CostCenter');
let Bonification = sequelize.import('./Bonification');
let SuspiciousExpense = sequelize.import('./SuspiciousExpense');

// Expense
Expense.belongsTo(ExpenseReport, { foreignKey: 'expenseReportId' });
Expense.belongsTo(ExpenseCategory, { foreignKey: 'expenseCategoryId' });
Expense.hasMany(ExpenseBonus, { foreignKey: 'expenseId' });

// ExpenseReport
ExpenseReport.hasMany(Expense, { foreignKey: 'expenseReportId' });
ExpenseReport.belongsTo(Employee, { foreignKey: 'employeeId' });
ExpenseReport.belongsTo(CostCenter, { foreignKey: 'costCenterId' });

// Employee
Employee.hasMany(Picture, { foreignKey: 'employeeId' });
Employee.belongsTo(Team, { foreignKey: 'teamId' });

//Bonification
Bonification.belongsTo(Employee, { foreignKey: 'employeeId' });
Employee.hasMany(Bonification, { foreignKey: 'employeeId' });

//SuspiciousExpense
SuspiciousExpense.belongsTo(Expense, { foreignKey: 'suspiciousExpenseId' });
Expense.hasMany(SuspiciousExpense, { foreignKey: 'suspiciousExpenseId' });

module.exports = {
    Expense: Expense,
    ExpenseReport: ExpenseReport,
    Employee: Employee,
    ExpenseBonus: ExpenseBonus,
    ExpenseCategory: ExpenseCategory,
    Picture: Picture,
    Team: Team,
    CostCenter: CostCenter,
    Bonification: Bonification,
    SuspiciousExpense: SuspiciousExpense,
    sequelize: sequelize
};