const controller = require('./airports.controller');

const routes = {
    base: '/api/airports/',
    single: '/api/airports/:id'
};

module.exports = server => {
    server.get(routes.base, controller.get);
    server.get(routes.single, controller.getSingle);
};
