const controller = require('./seats.controller');

const routes = {
    base: '/api/seats/'
};

module.exports = server => {
    server.get(routes.base, controller.get);
};
