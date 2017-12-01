const controller = require('./codeshare.controller');

const routes = {
    base: '/api/codeshare/:flightid/:servicename',
    vertices: '/api/codeshare/vertices',
    edges: '/api/codeshare/edges'
};

module.exports = server => {
    server.get(routes.base, controller.get);
    server.get(routes.vertices, controller.getVertices);
    server.get(routes.edges, controller.getEdges);
};
