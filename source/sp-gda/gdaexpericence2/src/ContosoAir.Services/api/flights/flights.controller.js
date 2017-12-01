const dataCheckin = require('./checkin.data');
var request = require("request");
var config = require('../../config');
var DocumentClient = require("documentdb").DocumentClient;
var host = config.DOCUMENT_DB_ENDPOINT;
var masterKey = config.DOCUMENT_DB_PRIMARYKEY;
var flightCollectionUrl = "dbs/" + config.DOCUMENT_DB_DATABASE + "/colls/" + config.DOCUMENT_DB_Flight;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var MongoDBConnectionString = 'mongodb://feedbackdb:Iob2e1F870cg0S96dqhLGMMucJDaBM3CkcpUqiFNT5ga4e09SFIePfT5CRDj2QYCR83WWt03APlImY9KK7vaOA==@feedbackdb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb';

var client = new DocumentClient(host, { masterKey: masterKey });
var data = '';
const arr = [];

var Good_Feedbacks = 0;
var Average_Feedbacks = 0;
var Poor_Feedbacks = 0;

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

// Get flight Feedback from MongoDB database Collection
let getFlightFeedback = function (req, res) {
    MongoClient.connect(MongoDBConnectionString, function (err, db) {
        if (err) {
            res.send(err);
            console.log("Connection Failed")
        }
        else {
            // Set MongoDB collection name here
            db.collection("flightfeedback").find(req.params).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                    console.log("Error in data fetching")
                }
                else {
                    Good_Feedbacks = 0;
                    Average_Feedbacks = 0;
                    Poor_Feedbacks = 0;
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].textAnalyticScore <= 0.33) {
                            Poor_Feedbacks++;
                        }
                        else if (result[i].textAnalyticScore <= 0.66) {
                            Average_Feedbacks++;
                        }
                        else {
                            Good_Feedbacks++;
                        }
                    }
                    db.close();
                    var response = '{' +
                        '"Poor_Feedbacks" : "' + Poor_Feedbacks + '",' +
                        '"Average_Feedbacks": "' + Average_Feedbacks + '",' +
                        '"Good_Feedbacks" : "' + Good_Feedbacks + '"' +
                        '}'
                    console.log(JSON.parse(response));
                    res.send(JSON.parse(response));

                }
            });
        }
    });
}

module.exports = {
    get: get,
    getFlightFeedback: getFlightFeedback,
    getSingle: getSingle,
    checkin: checkin
};

