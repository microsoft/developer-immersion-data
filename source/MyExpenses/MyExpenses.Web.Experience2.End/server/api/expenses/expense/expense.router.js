'use strict';

const config = require('../../../config').server;
const authFilter = require('../../../auth').filter;

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
    app.get(routes.base, authFilter, controller.getExpensesOfReport);
    app.get(routes.details, authFilter, controller.getExpenseDetail);
    app.get(routes.receipt, authFilter, controller.getReceipt);
    app.post(routes.create, authFilter, controller.createExpense);
    app.put(routes.update, authFilter, controller.updateExpense);
    app.get(routes.expenseCategories, authFilter, controller.getExpenseCategories);
    app.get(routes.expense, authFilter, controller.getExpense);
    app.del(routes.delete, authFilter, controller.deleteExpense);
};