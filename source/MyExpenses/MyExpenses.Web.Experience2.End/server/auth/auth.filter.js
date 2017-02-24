'use strict';

const passport = require('passport');

module.exports = passport.authenticate('oauth-bearer', {
    session: false
});