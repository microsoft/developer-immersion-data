var verticesData = [];
var edgesData;
var Gremlin = require('gremlin');
var verticesDataObject = {};
const config = require('../../config');
const soloservice = 'AirlineSoloService';
const codeshare = 'AirlineCodeshareCarrier';
var client;

//Create gremlin client connection
function createGremlinClient()
{
    client = Gremlin.createClient(
        443,
        config.GRAPH_DB_ENDPOINT,
        {
            "session": false,
            "ssl": true,
            "user": `/dbs/${config.GRAPH_DB_DATABASE}/colls/${config.GRAPH_DB_COLLECTION}`,
            "password": config.GRAPH_DB_PRIMARYKEY
        });
}



// To get combined data of Vertices and Edges
let get = (req, res) => {
    var serviceName;
    if (req.params.servicename === 'codeshare'){
        serviceName = codeshare;
    }
    else {
        serviceName = soloservice;   
    }
    executeVerticesQuery(req, serviceName, function (retval) {
        if (retval) {
                var edgesVerticesData = [];
                edgesVerticesData = edgesVerticesData.concat(verticesData);
                edgesVerticesData = edgesVerticesData.concat(edgesData);
                res.send(edgesVerticesData);
        }
    });
    
};

//To get Vertices
let getVertices = (req, res) => {
    if (verticesData.length > 0) {
        return res.send(verticesData);
    }
    res.send(404);
};

//To get Edges
let getEdges = (req, res) => {
    if (edgesData.length > 0) {
        return res.send(edgesData);
    }
    res.send(404);
};

//To execute gremlin queries
function executeVerticesQuery(request, servicename, callback)
{
    verticesData = [];
    edgesData = [];
    createGremlinClient();
    // query to get vertices of soloservice or codeshare related to flight
    client.execute("g.V().has('FlightId','" + request.params.flightid + "').repeat(out('FlightSegments')).until(has('id')).hasLabel('Segments').repeat(out('SegmentsAirline')).until(has('id')).hasLabel('Airline').repeat(out('" + servicename + "')).until(has('id'))", {}, (err, results) => {
        if (err) return console.error(err);
        verticesData = verticesData.concat(results);
        // query to get vertices of airlines related to flight
        client.execute("g.V().has('FlightId','" + request.params.flightid + "').repeat(out('FlightSegments')).until(has('id')).hasLabel('Segments').repeat(out('SegmentsAirline')).until(has('id'))", {}, (err, results) => {
            if (err) return console.error(err);
            verticesData = verticesData.concat(results);
            // query to get vertices of segments related to flight
            client.execute("g.V().has('FlightId','" + request.params.flightid + "').repeat(out('FlightSegments')).until(has('id'))", {}, (err, results) => {
                if (err) return console.error(err);
                verticesData = verticesData.concat(results);
                client.execute("g.V().has('FlightId','" + request.params.flightid + "')", {}, (err, results) => { // query to get vertices of flight
                    if (err) return console.error(err);
                    verticesData = verticesData.concat(results);
                    client.execute("g.E()", {}, (err, results) => { // query to get edges
                        if (err) return console.error(err);
                        edgesData = results;
                        callback(true);
                    });
                });
            });
        });
    });  
}

module.exports = {
    get: get,
    getVertices: getVertices,
    getEdges: getEdges
};