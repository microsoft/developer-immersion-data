// private variable's Declaration
const dataCheckin = require('./checkin.data');
var request = require("request");
var config = require('../../config');

// define variables to fetch flights data from SqlDB api
var DocumentDBClient = require('documentdb').DocumentClient
    , HashPartitionResolver = require('documentdb').HashPartitionResolver
    , fs = require('fs')
var host = config.DOCUMENT_DB_ENDPOINT;
var masterKey = config.DOCUMENT_DB_PRIMARYKEY;
var flightCollectionUrl = "dbs/" + config.DOCUMENT_DB_DATABASE + "/colls/" + config.DOCUMENT_DB_FLIGHT;

// define variables to fetch feedback data from MongoDB
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var MongoDBConnectionString = config.MONGO_DB_CONNECTION_STRING;
var MongoDBCollection = config.MONGO_DB_COLLECTION;

// Get preferred region from config file
var DocumentBase = require('documentdb').DocumentBase;
var connectionPolicy = new DocumentBase.ConnectionPolicy();

// Set preferred region in connection policy
connectionPolicy.PreferredLocations.push(config.DOCUMENT_DB_PREFERRED_REGION);

var client = new DocumentDBClient(host, { masterKey: masterKey }, connectionPolicy);
var data = '';
const arr = [];

var Good_Feedbacks = 0;
var Average_Feedbacks = 0;
var Poor_Feedbacks = 0;


// functions declaration

let getFlight = (req, res) => {
    var filteredData = data.filter(flight => flight.id === req.params.id);
    return res.send(filteredData);
};

// Get flight data from SqlDB api
let get = (req, res) => {
    var databaseLink = 'dbs/' + config.DOCUMENT_DB_DATABASE;
    var coll1Link = databaseLink + '/colls/' + config.DOCUMENT_DB_FLIGHT + '_Stop1';
    var coll2Link = databaseLink + '/colls/' + config.DOCUMENT_DB_FLIGHT + '_Stop2';

    // Register this resolver on the instance of DocumentClient we're using
    // the key is something you can identify the resolver with. in most cases we just use the database link
    var resolver = new HashPartitionResolver(function (doc) { return doc.stop; }, [coll1Link, coll2Link]);
    client.partitionResolvers[databaseLink] = resolver;

    let resultString = new Array();
    var end_time;
    var start_time = (new Date).getTime();

    // write a select query
    let querySpec = {
        query: 'SELECT * From c'
    }

    // fetch the data from the SQL DB Collection according to the query
    client.queryDocuments(
        databaseLink, querySpec
    ).toArray((err, results) => {
        if (!err) {
            end_time = (new Date).getTime();
            for (var queryResult of results) {
                resultString.push(queryResult);
            }
            // Calculate time required to fetch data from Azure CosmosDB
            var time_slice = end_time.valueOf() - start_time.valueOf();
            var flight_json = resultString;
            flight_json.push('time_Duration: ' + time_slice);
            flight_json.push('preferred_Region: ' + config.DOCUMENT_DB_PREFERRED_REGION);

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

// Get flight feedback data from MongoDB
let getFlightFeedback = function (req, res) {

    // Set the connection string property of the mongodb client object.
    MongoClient.connect(MongoDBConnectionString, function (err, db) {
        if (err) {
            res.send(err);
            console.log("Connection Failed")
        }
        else {
            // Fetch the data from the mongodb collection
            db.collection(MongoDBCollection).find(req.params).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                    console.log("Error in data fetching")
                }
                else {
                    Good_Feedbacks = 0;
                    Average_Feedbacks = 0;
                    Poor_Feedbacks = 0;

                    // Calculate the count of overall feedback according to different factors
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