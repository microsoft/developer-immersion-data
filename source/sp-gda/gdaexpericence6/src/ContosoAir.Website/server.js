const serverFactory = require('spa-server');

var server = serverFactory.create({
    path: './dist',
    port: process.env.port || 5000
});

server.start();
