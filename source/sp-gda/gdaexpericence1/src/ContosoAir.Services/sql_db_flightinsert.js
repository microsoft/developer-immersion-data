// private variable's Declaration
const flightsdata = require('./api/flights/flights.data.json');
var DocumentDBClient = require('documentdb').DocumentClient
    , HashPartitionResolver = require('documentdb').HashPartitionResolver
    , fs = require('fs')
    , async = require('async')
    , config = require('./config')
    , utils = require('./utils')
    , databaseId = config.DOCUMENT_DB_DATABASE
    , databaseLink;

var host = config.DOCUMENT_DB_ENDPOINT
var masterKey = config.DOCUMENT_DB_PRIMARYKEY;
var documentDefinitions = function (data_type) {

    if (data_type === "Flight") {
        return flightsdata;
    }
};

// Establish a new instance of the DocumentDBClient.
var client = new DocumentDBClient(host, { masterKey: masterKey });

init(function (err) {
    if (!err) {
        createFlightsCollection(databaseLink, function (retval) {
        });

    } else {
        handleError(err);
    }
});

// Create two flight collection and insert the document based on the partition key.
function createFlightsCollection(databaseLink, callback) {

    //create two collections to partition data across
    var collectionIds = [config.DOCUMENT_DB_FLIGHT + '_Stop1', config.DOCUMENT_DB_FLIGHT + '_Stop2'];

    getOrCreateCollections(collectionIds, function (colls) {
        var coll1Link = databaseLink + '/colls/' + colls[0];
        var coll2Link = databaseLink + '/colls/' + colls[1];

		//register these two collections with a HashPartitionResolver
        //the first paramter is the partitionkey resolver
        //  - the partitionkey resolver is a function that you provide that returns a string from your document. 
        //  - if the partitionkey is a root level property such as id, then you can just hardcode the partitionkey resolver to the string literal 'id'
        //the second parameter of a HashPartitionResolver is an array of collection links

        //for this example we are using the stop property and therefore have a custom function to return this
        //if you want to partition by fromCode field, which is a also a string, then function (doc) {return doc.fromCode } would be used.
        var resolver = new HashPartitionResolver(function (doc) { return doc.stop; }, [coll1Link, coll2Link]);

        client.partitionResolvers[databaseLink] = resolver;

        //now let's create some documents
        insertDocuments(documentDefinitions('Flight'), function (docs) {
            callback(true);
        });
    });
}

function executeNext(iterator, callback) {
    iterator.executeNext(function (err, results, responseHeaders) {
        async.each(
            results,

            function i(result, cb) {
                cb();
            }
        );
        if (iterator.hasMoreResults()) {
            executeNext(iterator, callback)
        }
        else {
            callback(null);
        }
    });
}

// Create a new collection if doesn't exist
function getOrCreateCollections(collectionIds, callback) {
    var createdList = [];
    async.each(
        collectionIds,

        function iterator(collectionId, cb) {
            client.createCollection(databaseLink, { id: collectionId }, function (err, document, headers) {
                if (err) {
                    console.log(err);
                    console.log('All collections are already created');
                } else {
                    console.log('created ' + collectionId);
                    createdList.push(collectionId);
                    cb();
                }
            });
        },

        function (err) {
            console.log('Collection Creation done ' + createdList.length);
            callback(createdList);
        }
    );
}

// Insert data into the SQL API Databse
function insertDocuments(documentDefinitions, callback) {
    var createdList = [];
    async.each(
        documentDefinitions,

        function iterator(documentDefinition, cb) {
            client.createDocument(databaseLink, documentDefinition, function (err, document, headers) {
                if (err) {
                    if (err.code === 'ETIMEDOUT') {
                        var wait = headers["x-ms-retry-after-ms"] || 4000;
                        setTimeout(function () { iterator(documentDefinition, cb) }, wait);
                    }
                } else {
                    createdList.push(document);
                    cb();
                }
            });
        },

        function (err) {
            console.log('Creating done ' + createdList.length);
            console.log('******************************');
            console.log('  Data Imported Successfully  ');
            console.log('******************************');
            callback(createdList);
        }
    );
}

// Create the database if database not exist
function init(callback) {
    utils.getOrCreateDatabase(client, databaseId, function (err, db) {
        if (err) {
            return callback(err);

        } else {
            databaseLink = 'dbs/' + databaseId;
            callback();
        }
    });
}

// To handle the error if occur
function handleError(error) {
    console.log('\nAn error with code \'' + error.code + '\' has occurred:');
    console.log('\t' + error.message);
}
