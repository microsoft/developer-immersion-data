const azure = require('azure');
const config = require('../../config');
const types = require('./types.model');
const messages = require('./messages.model');
const payloads = require('./payloads.model');
var request = require('request');
var DocumentClient = require("documentdb").DocumentClient;
var host = config.DOCUMENT_DB_ENDPOINT;
var masterKey = config.DOCUMENT_DB_PRIMARYKEY;
var FlightDelayCollectionUrl = "dbs/" + config.DOCUMENT_DB_DATABASE + "/colls/" + config.DOCUMENT_DB_FlightDelay;
var notificationHubService = azure.createNotificationHubService(config.NOTIFICATION_HUB, config.NOTIFICATION_SECRET);
var GetFlightsUrl = config.GET_FLIGHTS;
var client = new DocumentClient(host, { masterKey: masterKey });

let checkError = (error, platform) => {
    if (error) {
        console.log('Error notification ' + platform);
    }
};

let checkCounter = (counter, res) => {
    if (counter < 3) {
        return;
    }

    res.send(200);
};

let notification_post = (req, res) => {
    let this_booking = (req.body);
    GetFlightsUrl = GetFlightsUrl.replace('{thereId}', this_booking.there.id)
    GetFlightsUrl = GetFlightsUrl.replace('{backId}', this_booking.back.id)

    // Get booked flight details
    request(GetFlightsUrl, function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
        }
        else {
            var response = JSON.parse(body)
            var delay_data = []

            for (var i = 0; i < response.length; i++) {

                // Initialize array for delay hrs
                var delay_hrs = [1, 2, 3, 4, 5, 6];
                var delay_period = delay_hrs[(Math.random() * delay_hrs.length) | 0];

                // Select random segment for flight delay
                var segments = [];
                for (var j = 0; j < response[i].segments.length; j++) {
                    segments.push(j);
                }

                var segment_to_delay = segments[(Math.random() * segments.length) | 0];
                var segements_details = []

                for (var j = 0; j < response[i].segments.length; j++) {

                    // Delay random flight in travel for gate change
                    if (j == segment_to_delay) {

                        var departDateTime = response[i].segments[j].departTime;
                        var date = departDateTime.split('T')[0];
                        var time = departDateTime.split('T')[1];

                        // Create date time object from departTime
                        var before_delay = new Date(
                            date.split('-')[0],
                            date.split('-')[1] - 1,
                            date.split('-')[2],
                            time.split(':')[0],
                            time.split(':')[1],
                            time.split(':')[2].replace('Z', '')
                        );

                        // Logic to delay flight
                        var after_delay = new Date(before_delay);
                        after_delay.setHours(before_delay.getHours() + delay_period);

                        // Details of each segment
                        var segement_data = {
                            "airline": response[i].segments[j].airline,
                            "flight": response[i].segments[j].flight,
                            "fromCode": response[i].segments[j].fromCode,
                            "fromCity": response[i].segments[j].fromCity,
                            "departTime": before_delay,
                            "afterDelay": after_delay,
                            "toCode": response[i].segments[j].toCode,
                            "toCity": response[i].segments[j].toCity,
                            "arrivalTime": response[i].segments[j].arrivalTime,                            
                            "isDelay": true,
                            "delayBy": delay_period + " Hour",
                            "terminal": j + 1
                        }
                        segements_details.push(segement_data);

                        // Notification notification passenger for gate change
                        var gate_change_payload = '<toast><visual><binding template="ToastText01">' +
                            '<text id="1">' + response[i].segments[j].airline + ' flight no. ' + response[i].segments[j].flight + ' will be boarding from changed terminal ' + (j + 1) + ' due to delay. </text>' +
                            '</binding></visual></toast>';

                        notificationHubService.wns.send(null, gate_change_payload, 'wns/toast', error => {
                            if (error) {
                                console.log("Error while Notification sending")
                                res.send(error);
                            }
                        });
                    }
                    else {
                        // Details of each segment
                        var segement_data = {
                            "airline": response[i].segments[j].airline,
                            "flight": response[i].segments[j].flight,
                            "fromCode": response[i].segments[j].fromCode,
                            "fromCity": response[i].segments[j].fromCity,
                            "departTime": response[i].segments[j].departTime,
                            "toCode": response[i].segments[j].toCode,
                            "toCity": response[i].segments[j].toCity,
                            "arrivalTime": response[i].segments[j].arrivalTime,
                            "isDelay": false
                        }
                        segements_details.push(segement_data);
                    }                       
                }

                // List of segments involve one travel
                var flight_data = {
                    "id": response[i].id,
                    "duration": response[i].duration,
                    "price": response[i].price,
                    "fromCode": response[i].fromCode,
                    "toCode": response[i].toCode,
                    "distance": response[i].distance,
                    "stop": response[i].stop,
                    "fldate": response[i].fldate,
                    "segments": segements_details
                }
                delay_data.push(flight_data)
            }

            // flight delay details
            var documentDefinition = {
                "userName": this_booking.username,
                "seatNumber": this_booking.seat,
                "fromCode": this_booking.there.fromCode,
                "toCode": this_booking.there.toCode,
                "startDate": this_booking.startDate,
                "endDate": this_booking.endDate,
                "thereId": this_booking.there.id,
                "backId": this_booking.back.id,
                "flights": delay_data
            }
           
            client.createDocument(FlightDelayCollectionUrl, documentDefinition, function (err, document) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(document);
                }
            });
        }
    });

};

module.exports = {
    notification_post: notification_post
};