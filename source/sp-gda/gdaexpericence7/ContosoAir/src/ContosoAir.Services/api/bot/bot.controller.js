let DocumentClient = require('documentdb').DocumentClient;
let config = require('../../config');
let host = config.DOCUMENT_DB_ENDPOINT       // Endpoint Url
let masterKey = config.DOCUMENT_DB_PRIMARYKEY  // DocumentDB Primary Key
let bookingCollectionUrl = "dbs/" + config.DOCUMENT_DB_DATABASE + "/colls/" + config.DOCUMENT_DB_BOOKING_COLLECTION; //Booking Collection Url
let flightCollectionUrl = "dbs/" + config.DOCUMENT_DB_DATABASE + "/colls/" + config.DOCUMENT_DB_FLIGHT_COLLECTION;  //Flight Collection Url
let alternaticeFlightCollectionUrl = "dbs/" + config.DOCUMENT_DB_DATABASE + "/colls/" + config.DOCUMENT_DB_ALTERNATIVE_FLIGHT_COLLECTION; //Alternative Flight Url

//Create DocumentDB Object
let client = new DocumentClient(host, { masterKey: masterKey });

//Function to Call Query Flight Status
let queryFlightStatus = (req, res) => {
    getFromCodeAndRouteID(req.params.pnrcode, res, function (retval) {
        var doc = retval[0];
        if (doc["isCancel"] === false) {
            getFlightStatus(res, '' + retval[0].fromRouteId + '', retval[0].fromCode);
        } else {
            var blankarray = new Array();
            res.send(blankarray);
        }
    })
};

//Function for E-Checkin
let getE_CheckingData = (req, res) => {
    let flag = false;
    getFromCodeAndRouteID(req.params.pnrcode, res, function (retval) {
        var doc = retval[0];
        if (doc["isCancel"] === false) {           
            if (doc["isE_Checkin"] === false) {
                doc["isE_Checkin"] = true;
                flag = true;
            }
            modifyECheckinIn(res, doc, flag);
        } else {
            var blankarray = new Array();
            res.send(blankarray);
        }
       
    })
}

//Function to get Terminal Map
let getTerminalMap = (req, res) => {
    getFromCodeAndRouteID(req.params.pnrcode, res, function (retval) {
        var doc = retval[0];
        if (doc["isCancel"] === false) {
            terminalMapData(res, retval[0].fromRouteId, retval[0].fromCode)
        } else {
            var blankarray = new Array();
            res.send(blankarray);
        }
      
    })
}
//Function to get Alternative Flights
let getAlternativeFlight = (req, res) => {
    getFromCodeAndRouteID(req.params.pnrcode, res, function (retval) {
        var doc = retval[0];
        if (doc["isCancel"] === false) {
            getAlternativeFlightData(res, '' + retval[0].fromRouteId + '', retval[0].fromCode)
        } else {
            var blankarray = new Array();
            res.send(blankarray);
        }
        
    })
}

//Function to get Booking Details to Filter by PNRCode
let getFromCodeAndRouteID = (pnrCode, res, callback)=>{
    let resultString = new Array();
    let querySpec = {
        query: 'SELECT b.pnrCode, b.fromCode, b.toCode, b.startDate, b.endDate, b.fromRouteId, b.toRouteId, b.isE_Checkin, b.isCancel , b.id FROM Bookings b where b.pnrCode=@pnrcode',
        parameters: [
            {
                name: '@pnrcode',
                value: pnrCode.toLowerCase()
            }
        ]
    }
    client.queryDocuments(
        bookingCollectionUrl, querySpec
    ).toArray((err, results) => {
        if (err) { return res.send({ success: false, data: "Error while connecting with DocumentDB" }); } 
        else {
            for (var queryResult of results) {
                resultString.push(queryResult);
            }            
            if (resultString.length > 0) {
                callback(resultString)
            } else {
                var blankarray = new Array();
                res.send(blankarray)
            }
        }
    });

}
//Function to get Flight Status Filter by RouteID and From City Code
let getFlightStatus = (res, routeId, fromCode) => {
    let resultString = new Array();
    let querySpec = {
        query: 'SELECT c.flight, c.fromterminalno, c.fromgateno, SUBSTRING(c.departTime,11,5)departTime FROM Flights f JOIN c in f.segments where f.id = @routeId and c.fromCode = @fromCode',
        parameters: [
            {
                name: '@routeId',
                value: routeId
            },
            {
                name: '@fromCode',
                value: fromCode
            }
        ]
    }
    client.queryDocuments(
        flightCollectionUrl, querySpec
    ).toArray((err, results) => {
        if (err) { return res.send({ success: false, data: "Error while connecting with DocumentDB" }); } 
        else {
            for (var queryResult of results) {
                resultString.push(queryResult);
            }
            if (resultString.length > 0) {
                res.send(resultString)
            } else {
                var blankarray = new Array();
                res.send(blankarray)
            }
            
        }
    });

}

//Function to Modify E-Checkin Data
let modifyECheckinIn = (res, doc, flag) => {
    let docLink = 'dbs/' + config.DOCUMENT_DB_DATABASE + '/colls/' + config.DOCUMENT_DB_BOOKING_COLLECTION + '/docs/' + doc.id;

    if (flag) {
        client.replaceDocument(docLink, doc, (err, result) => {
            if (err) { return res.send({ success: false, data: "Error while connecting with DocumentDB" }); } 
            else {
                getBoardingPass(res, doc["fromRouteId"], doc["fromCode"], flag)
            }
        });
    } else {    
        getBoardingPass(res, doc["fromRouteId"], doc["fromCode"], flag)     
    }
}

//Function to Get Boarding Pass Fliter by Flight it
let getBoardingPass = (res, FromRouteId, FromCode, flag) => {
    let resultString = new Array();
    let querySpec = {
        query: "select flts.Boardingpass from AlternativeFlights af JOIN flts IN af.Flights where af['From'] = @fromCode and flts.Id = @id",
        parameters: [
            {
                name: '@id',
                value: FromRouteId
            },
            {
                name: '@fromCode',
                value: FromCode
            }
        ]
    }
    client.queryDocuments(
        alternaticeFlightCollectionUrl, querySpec
    ).toArray((err, results) => {
        if (err) { return res.send({ success: false, data: "Error while connecting with DocumentDB" }); } 
        else {
            for (var queryResult of results) {
                resultString.push(queryResult);
            }
            //res.send(resultString)
            if (resultString.length > 0) {
                resultString[0]["Flag"]= flag;
                res.send(resultString)
            } else {
                var blankarray = new Array();
                res.send(blankarray)
            }
        }
    });
}

//Function to get Terminal Map Image Filter by Flight Id
let terminalMapData = (res, FromRouteId, FromCode) => {
    let resultString = new Array();
    let querySpec = {
        query: "select flts.Map from AlternativeFlights af JOIN flts IN af.Flights where af['From'] = @fromCode and flts.Id = @id",
        parameters: [
            {
                name: '@id',
                value: FromRouteId
            },
            {
                name: '@fromCode',
                value: FromCode
            }
        ]
    }
    client.queryDocuments(
        alternaticeFlightCollectionUrl, querySpec
    ).toArray((err, results) => {
        if (err) { return res.send({ success: false, data: "Error while connecting with DocumentDB" }); } 
        else {
            for (var queryResult of results) {
                resultString.push(queryResult);
            }
            //res.send(resultString)
            if (resultString.length > 0) {
                res.send(resultString)
            } else {
                var blankarray = new Array();
                res.send(blankarray)
            }
        }
    });

}

//Function to get Alternate Flights Fliter by From City Code
let getAlternativeFlightData = (res, FromRouteId, FromCode) => {
    let resultString = new Array();
    let querySpec = {
        query: "SELECT af['From'], af['To'], af.Flights FROM AlternativeFlights af WHERE af['From'] = @fromCode",
        parameters: [
            {
                name: '@fromCode',
                value: FromCode
            }
        ]
    }
    client.queryDocuments(
        alternaticeFlightCollectionUrl, querySpec
    ).toArray((err, results) => {
        if (err) { return res.send({ success: false, data: "Error while connecting with DocumentDB" }); } 
        else {
            for (var queryResult of results) {
                resultString.push(queryResult);
            }
            //res.send(resultString)
            if (resultString.length > 0) {
                res.send(resultString)
            } else {
                  var blankarray = new Array();
                    res.send(blankarray)
            }
        }
    });
}
//Function to Insert Reschedule Flight Data into DocumentDb
let insertDocument = (req, res) => {
    let createdList = new Array()
    let collLink = 'dbs/' + config.DOCUMENT_DB_DATABASE + '/colls/' + config.DOCUMENT_DB_BOOKING_COLLECTION 
    let documentDefinition = {
        "pnrCode": req.params.newpnrcode,
        "fromCode": req.params.fromcode,
        "toCode": req.params.tocode,
        "startDate": req.params.date,
        "endDate": req.params.date,
        "fromRouteId": req.params.fromrouteid,
        "toRouteId": "",
        "isE_Checkin": false,
        "isCancel": false   
    }
    client.createDocument(collLink, documentDefinition, function (err, document) {
        if (err) {
            console.log(err);

        } else {
            console.log('created ' + document.id);
            createdList.push(document);            
            getFromCodeAndRouteID(req.params.oldpnrcode, res, function (retval) {
                var doc = retval[0];                
                doc["isCancel"] = true;                   
                let docLink = 'dbs/' + config.DOCUMENT_DB_DATABASE + '/colls/' + config.DOCUMENT_DB_BOOKING_COLLECTION + '/docs/' + doc.id;                
                    client.replaceDocument(docLink, doc, (err, result) => {
                        if (err) { return res.send({ success: false, data: "Error while connecting with DocumentDB" }); }
                        else {
                            var blankarray = new Array();
                            res.send(blankarray)
                        }
                    });
               
            })
        }
    });
}



module.exports = {
    queryFlightStatus: queryFlightStatus,
    getE_CheckingData: getE_CheckingData,
    getAlternativeFlight: getAlternativeFlight,
    getTerminalMap: getTerminalMap,
    insertDocument: insertDocument
};

