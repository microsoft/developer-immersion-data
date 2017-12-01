const controller = require('./alternatives.controller');

const routes = {
    base: '/api/alternatives/'
};

module.exports = server => {
    server.get(routes.base, controller.get);
};
