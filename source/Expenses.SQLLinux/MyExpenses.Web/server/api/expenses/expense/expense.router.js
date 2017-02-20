'use strict';

const config = require('../../../config').server;

let controller = require('./expense.controller');

var base = config.path + '/reports/:reportcode/expenses';

const routes = {
    base: base,
    details: base + '/:expenseId/details',
    receipt: base + '/:expenseId/receipt',
    create: base + '/create',
    update: base + '/:expenseId/update',
    expenseCategories: config.path + '/expensecategories',
    expense: base + '/:expenseId',
    delete: base + '/:expenseId/delete'
};

module.exports = app => {
    app.get(routes.base, controller.getExpensesOfReport);
    app.get(routes.details, controller.getExpenseDetail);
    app.get(routes.receipt, controller.getReceipt);
    app.post(routes.create, controller.createExpense);
    app.put(routes.update, controller.updateExpense);
    app.get(routes.expenseCategories, controller.getExpenseCategories);
    app.get(routes.expense, controller.getExpense);
    app.del(routes.delete, controller.deleteExpense);
};