'use strict';

var expenseService = require('./expense.service');

const restify = require('restify');

let catchError = require('../../../error/ErrorHandler');

let getExpensesOfReport = function(req, res, next) {

    let reportCode = req.params.reportcode;

    let filter = req.query.filter;

    let base_url = req.root_url;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    expenseService.getExpensesOfReport(req.user.email, reportCode, filter, base_url)
        .then(expenses => {
          
            res.json(expenses);
            next();
        })
        .catch(function (err) {
            catchError(err, res);
            next();
        });
};

let getExpenseDetail = function (req, res, next) {

    let reportCode = req.params.reportcode;
    let expenseId = req.params.expenseId;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    expenseService.getExpenseDetail(req.user.email, reportCode, expenseId)
        .then(expDetail => {
            if (Object.keys(expDetail).length === 0) {
                res.send(new restify.NotFoundError());
                next();
                return;
            }

            res.json(expDetail);
        })
        .catch(function (err) {
            catchError(err, res);
            next();
        });
};

let getReceipt = function (req, res, next) {

    let reportCode = req.params.reportcode;
    let expenseId = req.params.expenseId;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    expenseService.getReceipt(req.user.email, reportCode, expenseId)
        .then(receipt => {

            if (!receipt || receipt === '' || receipt === null) {
                res.send(new restify.NotFoundError());
            } else {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.end(receipt);
            }
            next();
        })
        .catch(function (err) {
            catchError(err, res);
            next();
        });
};

let createExpense = function (req, res, next) {

    let reportCode = req.params.reportcode;

    let expense = req.body;

    req.assert('categoryId', '').notEmpty();
    req.assert('title', '').notEmpty();
    req.assert('amount', '').notEmpty();
    req.assert('date', '').notEmpty();
    
    expense.recurrentFrom = expense.ecurrentFrom;
       
    var errors = req.validationErrors();

    if (errors) {
        res.send(new restify.BadRequestError());
        next();
        return;
    }

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    expenseService.createExpense(req.user.email, reportCode, expense)
        .then(() => {
            res.send(201);
            next();
        }).catch(function (err) {
            catchError(err, res);
            next();
        });
};

let updateExpense = function (req, res, next) {

    let reportCode = req.params.reportcode;
    let expenseId = req.params.expenseId;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    if (!expenseId || parseInt(expenseId, 10) < 0) {
        res.send(new restify.BadRequestError('Invalid expense'));
        next();
        return;
    }

    let expense = req.body;

    req.assert('categoryId', '').notEmpty();
    req.assert('title', '').notEmpty();
    req.assert('amount', '').notEmpty();
    req.assert('date', '').notEmpty();
    
    var errors = req.validationErrors();

    if (errors) {
        res.send(new restify.BadRequestError());
        next();
        return;
    }

    expenseService.updateExpense(req.user.email, reportCode, expenseId, expense)
        .then(() => {
            res.send(200);
            next();
        }).catch(function (err) {
            catchError(err, res);
            next();
        });
};

let getExpenseCategories = function (req, res, next) {

    expenseService.getExpenseCategories().then((categories) => {
                
        res.json(categories);
        next();

    }).catch(function (err) {
        catchError(err, res);
        next();
    });
};

let getExpense = function (req, res, next) {

    let reportCode = req.params.reportcode;
    let expenseId = req.params.expenseId;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    if (!expenseId || parseInt(expenseId, 10) < 0) {
        res.send(new restify.BadRequestError('Invalid expense'));
        next();
        return;
    }

    expenseService.getExpense(req.user.email, reportCode, expenseId).then((expense) => {

        if (!expense || Object.keys(expense).length === 0) {
            res.send(new restify.NotFoundError());
            return;
        }

        res.json(expense);
        next();

    }).catch(function (err) {
        catchError(err, res);
        next();
    });
};

let deleteExpense = function (req, res, next) {

    let reportCode = req.params.reportcode;
    let expenseId = req.params.expenseId;

    if (!reportCode) {
        res.send(new restify.BadRequestError('Invalid expense report code'));
        next();
        return;
    }

    if (!expenseId || parseInt(expenseId, 10) < 0) {
        res.send(new restify.BadRequestError('Invalid expense'));
        next();
        return;
    }

    expenseService.deleteExpense(req.user.email, reportCode, expenseId).then(() => {
        res.send(200);
        next();
    }).catch(function (err) {
        catchError(err, res);
        next();
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
    deleteExpense: deleteExpense
};