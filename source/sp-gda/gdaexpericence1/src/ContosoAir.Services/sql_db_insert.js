// private variable's Declaration
const seatsdata = require('./api/seats/seats.data.json');
const dealsdata = require('./api/deals/deals.data.json');
const bookingdata = require('./api/booking/booking.data.json');

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
    if (data_type === "Seats") {
        return seatsdata;
    }
    if (data_type === "Deals") {
        return dealsdata;
    }
    if (data_type === "Booking") {
        return bookingdata;
    }
};

// Establish a new instance of the DocumentDBClient
var client = new DocumentDBClient(host, { masterKey: masterKey });

init(function (err) {
    if (!err) {
        createSeatsColection(databaseLink, function (retval) {
            createDealsCollection(databaseLink, function (retval) {
                createBookingColection(databaseLink, function (retval) {
                    console.log('******************************');
                    console.log('  Data Imported Successfully  ');
                    console.log('******************************');
                });
            });
        });
    } else {
        handleError(err);
    }
});

// Create booking collection and also insert data
function createBookingColection(databaseLink, callback) {
    //create two collections to partition data across
    var collectionIds = [config.DOCUMENT_DB_BOOKING];

    getOrCreateCollections(collectionIds, function (colls) {
        var coll1Link = databaseLink + '/colls/' + colls[0];

        var resolver = new HashPartitionResolver(function (doc) { return doc.booking_id; }, [coll1Link]);

        //register this resolver on the instance of DocumentClient we're using
        //the key is something you can identify the resolver with. in most cases we just use the database link
        client.partitionResolvers[databaseLink] = resolver;

        //now let's create some documents
        insertDocuments(documentDefinitions('Booking'), function (docs) {
            callback(true);
        });
    });
}

// Create seat collection and also insert data
function createSeatsColection(databaseLink, callback) {
    //create two collections to partition data across
    var collectionIds = [config.DOCUMENT_DB_SEAT];

    getOrCreateCollections(collectionIds, function (colls) {
        var coll1Link = databaseLink + '/colls/' + colls[0];
        var resolver = new HashPartitionResolver(function (doc) { return doc.id; }, [coll1Link]);

        //register this resolver on the instance of DocumentClient we're using
        //the key is something you can identify the resolver with. in most cases we just use the database link
        client.partitionResolvers[databaseLink] = resolver;

        //now let's create some documents
        insertDocuments(documentDefinitions('Seats'), function (docs) {
            callback(true);
        });
    });
}

// Create Deals collection and also insert data
function createDealsCollection(databaseLink, callback) {
    //create two collections to partition data across
    var collectionIds = [config.DOCUMENT_DB_DEAL];

    getOrCreateCollections(collectionIds, function (colls) {
        var coll1Link = databaseLink + '/colls/' + colls[0];

        var resolver = new HashPartitionResolver(function (doc) { return doc.id; }, [coll1Link]);

        //register this resolver on the instance of DocumentClient we're using
        //the key is something you can identify the resolver with. in most cases we just use the database link
        client.partitionResolvers[databaseLink] = resolver;

        //now let's create some documents
        insertDocuments(documentDefinitions('Deals'), function (docs) {
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

// Insert data into the SQL API database
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