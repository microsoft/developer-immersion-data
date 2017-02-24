'use strict';

var powerbi = require('powerbi-api');
var msrest = require('ms-rest');

let ApplicationError = require('../../error/ApplicationError');

let getReportChart = function () {

    var collectionName = 'PowerBIExperience2';
    var accessKey = 'YEHMksavFxbueBLN2qkndWnLGShtUdk7UNgLBkcKnGb7EM31HV7paRzexVxe6srO7ZTGavFzxmwGXC9kw4jiaw==';
      
    var credentials = new msrest.TokenCredentials(accessKey, 'AppKey');
    var client = new powerbi.PowerBIClient(credentials);
    
    let deferred = new Promise((resolve, reject) => {
        client.workspaces.getWorkspacesByCollectionName(collectionName, function (werr, workspace) {

            if (werr)
                reject(werr);

            if (workspace.value && Array.isArray(workspace.value) && workspace.value.length > 0) {

                var workspaceId = workspace.value[0].workspaceId;
               
                client.reports.getReports(collectionName, workspaceId , function (rerr, reports) {

                    if (rerr)
                        reject(rerr);

                    console.log(reports);

                    if (reports.value && Array.isArray(reports.value) && reports.value.length > 0) {

                        var token = powerbi.PowerBIToken.createReportEmbedToken(collectionName, workspaceId, reports.value[0].id);

                        var jwt = token.generate(accessKey);

                        resolve({
                            embedUrl: reports.value[0].embedUrl,
                            token: jwt
                        });

                    } else {
                        reject(new ApplicationError('There aren`t reports'));
                    }
                   
                });
            } else {
                reject(new ApplicationError('There aren`t workspaces'));
            }
           
        });

    });

    return deferred;       
};

module.exports = {
    getReportChart: getReportChart
};