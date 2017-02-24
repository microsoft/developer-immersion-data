'use strict';

let Expenses = require('../model/Expenses');

let Employee = Expenses.Employee;

let sequelize = Expenses.sequelize;

let getEmployeeByUserName = function (userName, options) {
    var conditions = {
        where: sequelize.where(sequelize.fn('lower', sequelize.col('Email')), userName.toLowerCase()),
        raw: options ? !options.noRaw: true ,
    };

    if (options && options.include) {
        conditions.include = options.include;
    }

    return Employee.findOne(conditions);
};

module.exports = {
    getEmployeeByUserName: getEmployeeByUserName
};
