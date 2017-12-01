const dataCheckin = require('./checkin.data');
var request = require("request");
var config = require('../../config');
var DocumentClient = require("documentdb").DocumentClient;
var host = config.DOCUMENT_DB_ENDPOINT;
var masterKey = config.DOCUMENT_DB_PRIMARYKEY;
var flightCollectionUrl = "dbs/" + config.DOCUMENT_DB_DATABASE + "/colls/" + config.DOCUMENT_DB_Flight;
var assert = require('assert');

var client = new DocumentClient(host, { masterKey: masterKey });
var data = '';
const arr = [];

let getFlight = (req, res) => {
    var filetedata = data.filter(flight => flight.id === req.params.id);
    return res.send(filetedata);
};

let get = (req, res) => {
    let resultString = new Array();
    let querySpec = {
        query: 'SELECT * From ' + config.DOCUMENT_DB_Flight,
    }
    client.queryDocuments(
        flightCollectionUrl, querySpec
    ).toArray((err, results) => {
        if (!err) {
            for (var queryResult of results) {
                resultString.push(queryResult);
            }
            res.send(resultString);
        }
        else { res.send(err) }
    });
};

let getSingle = (req, res) => {
    let flights = getFlight(req, res);
    if (flights.length > 0) {
        return res.send(flights[0]);
    }
    res.send(404);
};

let checkin = (req, res) => {
    let flights = getFlight(req, res);
    if (flights.length > 0) {
        let flight = flights[0];
        flight.terminal = dataCheckin.terminal;
        flight.gate = dataCheckin.gate;
        flight.seat = dataCheckin.seat;
        return res.send(flight);
    }
    res.send(404);
};

module.exports = {
    get: get,
    getSingle: getSingle,
    checkin: checkin
};

