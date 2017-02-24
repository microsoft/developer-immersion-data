'use strict';

const passport = require('passport');
const config = require('../config').passport;
var BearerStrategy = require('passport-azure-ad').BearerStrategy;

const options = {
    clientID: config.clientID,
    identityMetadata: config.identityMetadata,
    audience: config.audience,
    passReqToCallback: false
};

let strategy = new BearerStrategy(options,
    (token, done) => {
        let user = {
            given_name: token.given_name,
            family_name: token.family_name,
            email: token.upn
        };

        return done(null, user, token);
    }
);

let apply = () => {
    passport.use(strategy);
};

module.exports = apply;