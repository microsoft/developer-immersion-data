// private variable's Declaration
var config = require('../../config');
var DocumentClient = require("documentdb").DocumentClient;
var host = config.DOCUMENT_DB_ENDPOINT;
var masterKey = config.DOCUMENT_DB_PRIMARYKEY;
var seatCollectionUrl = "dbs/" + config.DOCUMENT_DB_DATABASE + "/colls/" + config.DOCUMENT_DB_SEAT;

// Get preferred region from config file
var DocumentBase = require('documentdb').DocumentBase;
var connectionPolicy = new DocumentBase.ConnectionPolicy();

// Set preferred region in connection policy
connectionPolicy.PreferredLocations.push(config.DOCUMENT_DB_PREFERRED_REGION);

var client = new DocumentClient(host, { masterKey: masterKey }, connectionPolicy);

const arr = [];
var data = '';

// functions declaration

// Fetch seats data from SqlDB api seats collection
let get = (req, res) => {

    let resultString = new Array();
    let querySpec = {
        query: 'SELECT c.seat_seg.col_A, c.seat_seg.col_B, c.seat_seg.col_C, c.seat_seg.col_D, c.seat_seg.col_E, c.seat_seg.col_F from ' + config.DOCUMENT_DB_SEAT + ' c ORDER BY c.seat_Row',
    }

    client.queryDocuments(
        seatCollectionUrl, querySpec
    ).toArray((err, results) => {
        if (!err) {
            for (var queryResult of results) {
                resultString.push(queryResult);
            }
            let seat_array = new Array();
            for (var i = 0; i < resultString.length; i++) {
                let seat_row = new Array();
                seat_row.push(resultString[i].col_A, resultString[i].col_B, resultString[i].col_C, resultString[i].col_D, resultString[i].col_E, resultString[i].col_F);
                seat_array.push(seat_row);
            }

            var preferredseatset = false;
            for (var i = 0; i <= 8 && preferredseatset != true; i++) {
                for (var j = 0; j <= 5 && preferredseatset != true; j++) {
                    // Set first empty seat as a preferred seat
                    if (seat_array[i][j] == 0) {
                        seat_array[i][j] = 2;
                        preferredseatset = true;
                        break;
                    }
                }
            }
            var seat_data = { "options": { "available": 0, "unavailable": 1, "preferred": 2, "contosoair": 3 }, "rows": seat_array };
            res.send(seat_data);
        }
        else { res.send(err) }
    });
}

module.exports = {
    get: get
};
