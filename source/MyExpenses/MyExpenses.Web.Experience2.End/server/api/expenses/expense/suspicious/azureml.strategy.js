'use strict';

let https = require('https');

let config = require('../../../../config/suspicious.config');

let evaluateExpense = function (expense) {

    let data = { Inputs: { input1: [{ Amount: expense.amount, ExpenseCategoryId: expense.categoryId, IsSuspicious: 0 }] }, GlobalParameters: {} };
     
    var dataString = JSON.stringify(data);

    var headers ={
        'Content-Type': 'application/json',
        'Content-Length': dataString.length,
        'Authorization': 'Bearer ' + config.token
    };

    var options = {
        hostname: config.hostname, 
        path: config.path, 
        method: 'POST',
        headers: headers,
        port: config.port
    };

    let deferred = new Promise((resolve, reject) => {
        var req = https.request(options, function (res) {
            res.setEncoding('utf-8');

            var responseString = '';

            res.on('data', function (data) {
                responseString += data;
            });

            res.on('end', function () {
                console.log(responseString);                   
                var responseObject = JSON.parse(responseString);
                var IsSuspicious = { IsSuspicious: responseObject.Results.output1[0]['Scored Labels'] };
                resolve(IsSuspicious);
            });
        });

        req.on('error', function (e) {
            reject(e);
            console.error(e);
        });

        req.write(dataString);
        req.end();
    });
                            
    return deferred;
    
};

module.exports = evaluateExpense;