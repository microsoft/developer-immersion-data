const controller = require('./flights.controller');

const routes = {
    base: '/api/flights/',
    single: '/api/flights/:id',
    checkin: '/api/flights/checkin/:id',
    feedback: '/api/flights/feedback/:flightId'
};

module.exports = server => {
    server.get(routes.base, controller.get);
    server.get(routes.single, controller.getSingle);
    server.get(routes.checkin, controller.checkin);
    server.get(routes.feedback, controller.getFlightFeedback);
};
