const controller = require('./bot.controller');

const routes = { 
    queryFlightStatus: '/api/bot/flightstatus/:pnrcode/',
    getE_CheckingData: '/api/bot/echeckin/:pnrcode/',
    getAlternativeFlight: '/api/bot/alternatives/:pnrcode/',
    getTerminalMap: '/api/bot/terminalmap/:pnrcode/',
    insertDocument: '/api/bot/insert/:oldpnrcode/:newpnrcode/:fromcode/:tocode/:fromrouteid/:date/'
};

module.exports = server => {
    server.get(routes.queryFlightStatus, controller.queryFlightStatus);
    server.get(routes.getE_CheckingData, controller.getE_CheckingData);
    server.get(routes.getAlternativeFlight, controller.getAlternativeFlight);
    server.get(routes.getTerminalMap, controller.getTerminalMap);
    server.get(routes.insertDocument, controller.insertDocument);    

};
