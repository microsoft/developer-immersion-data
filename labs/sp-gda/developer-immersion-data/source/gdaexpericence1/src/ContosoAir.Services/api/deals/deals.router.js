const controller = require('./deals.controller');

const routes = {
    base: '/api/deals/',
    single: '/api/deals/:id'
};

module.exports = server => {
    server.get(routes.base, controller.get);
    server.get(routes.single, controller.getSingle);
};
