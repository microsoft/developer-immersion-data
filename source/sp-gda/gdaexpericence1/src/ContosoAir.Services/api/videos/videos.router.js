const controller = require('./videos.controller');

const routes = {
    base: '/api/videos/'
};

module.exports = server => {
    server.get(routes.base, controller.get);
};
