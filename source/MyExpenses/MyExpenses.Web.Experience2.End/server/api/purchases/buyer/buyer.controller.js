'use strict';

const restify = require('restify');

let buyersService = require('./buyer.service');

let catchError = require('../../../error/ErrorHandler');

let getCompanyPointsEmployee = function(req, res, next) {

    buyersService.getCompanyPointsEmployee(req.user.email)
        .then(employeePoints => {

            if (Object.keys(employeePoints).length === 0) {
                res.send(new restify.NotFoundError());
                next();
                return;
            }

            res.json(employeePoints);
            next();
        })
        .catch(err => {
            catchError(err, res);
            next();
        });
};

let purcharseGift = function (req, res, next) {
    let productDto = req.body;

    req.assert('productId', '').notEmpty();
    req.assert('units', '').notEmpty();
    
    var errors = req.validationErrors();

    if (errors) {
        res.send(new restify.BadRequestError());
        next();
        return;
    }

    buyersService.purcharseGift(req.user.email, productDto)
        .then(() => {
            res.send(201);
            next();
        }).catch(err => {
            catchError(err, res);
            next();
        });
};

module.exports = {
    getCompanyPointsEmployee: getCompanyPointsEmployee,
    purcharseGift: purcharseGift
};
