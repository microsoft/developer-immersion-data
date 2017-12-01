// private variable's Declaration
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var config = require('./config')
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var connectionString = config.MONGO_DB_CONNECTION_STRING;
var collection = config.MONGO_DB_COLLECTION;
var data_to_import = JSON.parse(fs.readFileSync('./api/feedback/feedback.data.json', 'utf8'));

// Functions Declaration

// Insert Feedback data into MongoDB Database
var insertDocument = function (db, callback) {
    for (let i = 0; i < data_to_import.length; i++) {
        db.collection(collection).insertOne(data_to_import[i], function (err, result) {
            assert.equal(err, null);           
            if (i === data_to_import.length - 1)
            {
                console.log('Data imported successfully into the ' + collection + ' collection.');

                setTimeout(function () {
                    callback();
                }, 1500);
            }
        });
    }    
};

// Execution starts
MongoClient.connect(connectionString, function (err, db) {
    assert.equal(null, err);
    insertDocument(db, function () {
        db.close();
        process.exit();
    });
});