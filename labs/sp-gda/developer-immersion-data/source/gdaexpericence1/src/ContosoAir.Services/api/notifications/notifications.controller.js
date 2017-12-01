const azure = require('azure');
const config = require('../../config');
const types = require('./types.model');
const messages = require('./messages.model');
const payloads = require('./payloads.model');

var notificationHubService = '';

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

let post = (req, res) => {
    // Put on a service

    let counter = 0;
    let body = JSON.parse(req.body);
    let type = body.type || types.none;
    let tag = body.tag || null;
    let options = { message: messages[type], type: type };

    // Send to Android
    notificationHubService.gcm.send(tag, payloads.android(options), error => {
        counter++;
        checkError(error, 'Android');
        checkCounter(counter, res);
    });

    // Send to iOS
    notificationHubService.apns.send(tag, payloads.ios(options), error => {
        counter++;
        checkError(error, 'iOS');
        checkCounter(counter, res);
    });

    // Send to windows
    notificationHubService.wns.send(tag, payloads.windows(options), 'wns/toast', error => {
        counter++;
        checkError(error, 'Windows');
        checkCounter(counter, res);
    });
};

module.exports = {
    post: post
};

