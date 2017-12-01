const types = require('./types.model');

let messages = {};
messages[types.none] = '';
messages[types.checkInAvailable] = 'Check-in available!';
messages[types.delayedFlight] = 'The flight has been delayed';
messages[types.giveFeedback] = 'Give feedback';

module.exports = messages;
