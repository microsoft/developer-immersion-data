const restify = require('restify');
const glob = require('glob');

// Create server
let server = restify.createServer();

// Configure CORS
server.use(restify.CORS());

// Configure body
server.use(restify.bodyParser());

// Require routers
let modules = glob.sync('./api/**/*.router.*');
modules.forEach(_module => {
    require(_module)(server);
});

// Start server 
server.listen(8081, () => {
    console.log('%s listening at %s', server.name, server.url);
});
