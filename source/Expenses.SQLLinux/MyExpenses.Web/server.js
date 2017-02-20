'use strict';

const restify = require('restify');
const restifyValidator = require('restify-validator');
const glob = require('glob');

const config = require('./server/config').server;
const port = config.port || 8080;

global.Buffer = require('buffer').Buffer;

const rootUrlmiddleware = require('./server/middlewares/rootUrl.middleware');
const fakeAuthmiddleware = require('./server/middlewares/fakeAuth.middleware');


// Initialize app
let app = restify.createServer({ name: config.serverName });

// Logging interceptor
app.on('after',
    (request, response, route, error) => {
        if (error || route === null) {
            // skip
        }
        var user = 'not authenticated';
        var responseContent = response.toString();

        if (request.user != undefined) {
            user = request.user.email;
        }

        if (response._body != undefined) {
            responseContent = JSON.stringify(response._body);
        }
    }
);

// Middlewares 
app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());

app.use(restifyValidator);

app.use(rootUrlmiddleware.rootUrlParser());
app.use(fakeAuthmiddleware.fakeAuthParser());

app.pre(restify.pre.sanitizePath());
app.pre(restify.pre.pause());


// Controllers
let modules = glob.sync('./server/**/*.router.*');
modules.forEach(_module => {
    require(_module)(app);
});

// Configure port
app.listen(port, (err) => {
    if (err) {
        console.log('Error on port: ', port);
        return;
    }

    console.log('Listening on port: ', port);
});