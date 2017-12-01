const controller = require('./notifications.controller');

const routes = {
    base: '/api/notifications/'
};

module.exports = server => {
    server.post(routes.base, controller.notification_post);
};
