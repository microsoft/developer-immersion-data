const controller = require('./booking.controller');

const routes = {
    base: '/api/booking/'
};

module.exports = server => {
    server.post(routes.base, controller.push);
};
