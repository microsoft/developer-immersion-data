'use strict';

let Expenses = require('../../../model/Expenses');

let employeeQueryService = require('../../../querys/query.employee.js');

let Team = Expenses.Team;
let Picture = Expenses.Picture;

let buildSummary = (employee) => {
    let vm = {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        jobTitle: employee.jobTitle,
        isTeamManager: employee.isTeamManager,
        team: {
            teamName: employee.Team.teamName
        }
    };

    return vm;
};

let getEmployeeByEmail = function (email) {

    let options = {
        noRaw: true,
        include: [
            Team,
            Picture
        ]
    };

    return employeeQueryService.getEmployeeByUserName(email, options).then(function (employee) {
        return buildSummary(employee);
    });

};

let getPicture = function (email, employeeId, pType) {

    let options = {
        noRaw: true,
        include: [Picture]        
    };

    return employeeQueryService.getEmployeeByUserName(email, options).then(function (employee) {

        if (!employee)
            return null;
      
        if (Array.isArray(employee.Pictures) && employee.Pictures.length === 0) {
            return null;
        } else {           
            let pic = null;
            for (let i = 0; i < employee.Pictures.length; i++) {
                if (parseInt(pType, 10) === employee.Pictures[i].pictureType) {
                    pic = employee.Pictures[i].content;
                }
            }                        
            return pic;
        }                  
    });
};

module.exports = {
    getEmployeeByEmail: getEmployeeByEmail,
    getPicture: getPicture
};
