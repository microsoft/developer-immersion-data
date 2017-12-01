const azure = require('azure');
const config = require('../../config');
const types = require('./types.model');
const messages = require('./messages.model');
const payloads = require('./payloads.model');
var request = require('request');


var notificationHubService = azure.createNotificationHubService(config.NOTIFICATION_HUB, config.NOTIFICATION_SECRET);
var soloServiceDataUrl = config.GET_SOLOSERVICE

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
    // Put on a service
    request(soloServiceDataUrl, function (error, response, body) {
        if(error) {
            console.log('error:', error); // Print the error if one occurred
        }
        else {            
            var response = JSON.parse(body)
            var soloService_1 = response[0].First_Name + " " + response[0].Last_Name;
            var soloService_2 = response[1].First_Name + " " + response[1].Last_Name;

            var payload_start = '<toast><visual><binding template="ToastText01">';
            var payload_end = '</binding></visual></toast>';
            
            // Notification Payload 1
            var solo_service_providers = payload_start +
                                         '<text id="1">Solo Service Providers Details</text>'+
                                         '<text id="1">1.' + soloService_1 +'</text>' +
                                         '<text id="1">2.' + soloService_2 +'</text>' +
                                         payload_end;  

            // Notification Payload 2
            var pick_from_airport = payload_start +
                                    '<text id="1">From Source Airport, Your child is assisted by  '+ soloService_1 +'</text>' +
                                    payload_end;

            // Notification Payload 3                         
            var drop_in_flight =  payload_start +
                                  '<text id="1">Your child has boarded the flight successfully with the assistance of  '+ soloService_1 +'</text>' +
                                  payload_end;
            
            // Notification Payload 4
            var pick_from_flight = payload_start +
                                  '<text id="1">Your child has landed destination successfully and is faciliated by '+ soloService_2 +' from flight</text>' +
                                   payload_end;

            // Notification Payload 5
            var drop_to_parent =  payload_start +
                                 '<text id="1">Your child has been successfully handover to gaurdian at destination airport by '+ soloService_2 +'</text>' +
                                  payload_end;

            // Send Notification 1            
            notificationHubService.wns.send(null, solo_service_providers, 'wns/toast', error => {
                if(error){             
                    console.log("Error in Notification 1 sent")   
                    res.send(error); 
                }
                else{
                    // Send Notification 2
                    setTimeout(function() {                    
                        notificationHubService.wns.send(null, pick_from_airport, 'wns/toast', error => {
                            if(error){             
                                console.log("Error in Notification 2 sent")                           
                                res.send(error);
                            }
                            else{
                                // Send Notification 3
                                setTimeout(function() {   
                                    notificationHubService.wns.send(null, drop_in_flight, 'wns/toast', error => {
                                        if(error){             
                                            console.log("Error in Notification 3 sent")                                                       
                                            res.send(body);
                                        }
                                        else{
                                            // Send Notification 4
                                            setTimeout(function() { 
                                                notificationHubService.wns.send(null, pick_from_flight, 'wns/toast', error => {
                                                    if(error){             
                                                        console.log("Error in Notification 4 sent")
                                                        res.send(body); 
                                                    }
                                                    else{
                                                        // Send Notification 5
                                                        setTimeout(function() { 
                                                            notificationHubService.wns.send(null, drop_to_parent, 'wns/toast', error => {
                                                                if(error){             
                                                                    console.log("Error in Notification 5 sent")      
                                                                }
                                                                else{
                                                                    res.send(body);      
                                                                }
                                                            });
                                                        }, 10000);                                                         
                                                    }
                                                });
                                            }, 10000);                                              
                                        }
                                    });
                                }, 10000);                                
                            }
                        });
                    }, 10000);                    
                }
            });
        }
    });
};

module.exports = {
    notification_post: notification_post
};