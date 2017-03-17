'use strict';

const restify = require('restify');
const passport = require('passport');
const restifyValidator = require('restify-validator');
const glob = require('glob');

const config = require('./server/config').server;
const authStrategy = require('./server/auth').strategy;
const port = config.port || 8080;

global.Buffer = require('buffer').Buffer;

const middleware = require('./server/middlewares/rootUrl.middleware');

// Initialize app
let app = restify.createServer({ name: config.serverName });

let sequelize = require('./server/db/db.sequelize');

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

        sequelize.query('EXEC [Audit].[usp_Audit] @Email=?, @Path=?, @RequestContent=?, @Verb=?, @ResponseCode=?, @ResponseContent=?',
            { replacements: [user, request.url, JSON.stringify(request.body), request.method, response.statusCode, responseContent], type: sequelize.QueryTypes.RAW });
    }
);

// Middlewares 
app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());
app.use(restify.authorizationParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(restifyValidator);

app.use(middleware.rootUrlParser());

app.pre(restify.pre.sanitizePath());
app.pre(restify.pre.pause());

// Apply passport strategy
authStrategy.apply();

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