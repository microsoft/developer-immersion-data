'use strict';

var fs = require('fs');


let scriptExecuter = function (script, callback, ctx) {
    var contents = fs.readFileSync(script, 'utf8');
    var batches = contents.split("GO");
    var queries = [];
    
    for (var i = 0; i < batches.length; i++) {
        queries.push((function(n) {
            return function() {
                //console.log(batches[n]);      
                return ctx.query(batches[n]);
            }
        })(i));
    }

    queries.push(callback);

    var q = queries[0]();
    for (var x = 1; x < queries.length; x++) {  
        q = q.then(queries[x]);
    }
};

var multipleScriptExecuter = function (array, callback, ctx) {
    var contents = [];
    var insertQueries = [];

    for(var i = 0; i < array.length; i ++) {
        contents.push(fs.readFileSync(array[i], 'utf8'));
    }
   
    for (var i = 0; i < contents.length; i++) {
        insertQueries.push((function(n) {
            return function() { 
                return ctx.query(contents[n]);
            }
        })(i));
    }

    insertQueries.push(callback);

    var q = insertQueries[0]();
    for (var x = 1; x < insertQueries.length; x++) {
        q = q.then(insertQueries[x]);
    }
};

module.exports = {
    scriptExecuter: scriptExecuter,
    multipleScriptExecuter: multipleScriptExecuter
};
