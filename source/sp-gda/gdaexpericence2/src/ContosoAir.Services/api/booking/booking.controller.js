var config = require('../../config');
var DocumentClient = require("documentdb").DocumentClient;
var host = config.DOCUMENT_DB_ENDPOINT;     // Add your endpoint
var masterKey = config.DOCUMENT_DB_PRIMARYKEY;
var bookingCollectionUrl = "dbs/" + config.DOCUMENT_DB_DATABASE + "/colls/" + config.DOCUMENT_DB_BOOKING;
var seatCollectionUrl = "dbs/" + config.DOCUMENT_DB_DATABASE + "/colls/" + config.DOCUMENT_DB_SEAT;

var client = new DocumentClient(host, { masterKey: masterKey });
var data = '';

let push = (req, res) => {
    let this_booking = (req.body);
    var random_text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
        random_text += possible.charAt(Math.floor(Math.random() * possible.length));
    var boking_id = random_text;
    var documentDefinition =
        {
            "booking_id": boking_id,
            "userName": this_booking.username,
            "seatNumber": this_booking.seat,
            "fromCode": this_booking.there.fromCode,
            "toCode": this_booking.there.toCode,
            "startDate": this_booking.startDate,
            "endDate": this_booking.endDate,
            "thereId": this_booking.there.id,
            "backId": this_booking.back.id
        }
    var createdList = [];
    UpdateSeatDocument(this_booking.seat, function(retval){
        if(retval.length>0){
            var parts1 = (this_booking.seat).replace(/[0-9]/g, '');
            let seat_record = (retval[0]);
            let seats_col = seat_record["seat_seg"];
            var seat_loc = 'col_' + parts1;
            seats_col[seat_loc] = 1;
            let final_document = retval[0];
            let docLink = seatCollectionUrl+"/docs/" + seat_record["id"];
            client.replaceDocument(docLink, final_document, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                    client.createDocument(bookingCollectionUrl, documentDefinition, function (err, document) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('created ' + document.id);
                            createdList.push(document);
                            res.send(document);
                        }
                    });
                }
            });
        }
    });
}

let UpdateSeatDocument = (seat_no, callback) => {
    var seat_row = seat_no.replace(/[A-Z]/g, '');
    let resultString = new Array();
    let querySpec = {
        query: 'select * from Demo_Seat_Collection c where c.seat_Row ='+seat_row ,
    }
    client.queryDocuments(
        seatCollectionUrl, querySpec
    ).toArray((err, results) => {
        if (err) reject(err)
        else {
            for (var queryResult of results)
            {
                resultString.push(queryResult);
            }
    callback(resultString)
    }});
}

let getSingle = (req, res) => {
    let airports = data.filter(airport => airport.code === req.params.id);
    if (airports.length > 0) {
        return res.send(airports[0]);
    }
    res.send(404);
};

module.exports = {
    push: push,
    getSingle: getSingle
};