'use strict';

var employeeService = require('./employee.service');

let employeeQueryService = require('../../../querys/query.employee.js');

const restify = require('restify');

let getMyProfile = function(req, res, next) {

    if (!req.user.email) {
        res.send(500, 'Not allowed to get this employee');
        next();
        return;
    }

    employeeService.getEmployeeByEmail(req.user.email)
        .then(employee => {
            if (!employee || !employee.email) {
                res.send(500, 'This employee doesn\'t exist');
                next();
                return;
            }

            res.json(employee);
            next();
        })
        .catch(err => {
            console.log(err);
            res.send(500, err);
            next();
        });
};

let getPicture = function (req, res, next) {

    let employeeId = req.params.employeeId;

    let pictureType = req.query.pictureType || '1';

    if (!employeeId) {
        res.send(new restify.BadRequestError('Invalid employee id'));
        next();
        return;
    }

    return employeeQueryService.getEmployeeByUserName(req.user.email).then(function (employee) {

        if (employeeId === employee.id) {
            res.send(new restify.UnauthorizedError());
            next();
            return;
        }

        employeeService.getPicture(req.user.email, employeeId, pictureType)
            .then(picture => {

                if (!picture || picture === '' || picture === null) {
                    res.send(new restify.NotFoundError());
                    next();
                } else {
                    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    res.end(picture);
                    next();
                }
            })
            .catch(err => {
                console.log(err);
                res.send(500, err);
                next();
            });
    });
};

module.exports = {
    getMyProfile: getMyProfile,
    getPicture: getPicture
};