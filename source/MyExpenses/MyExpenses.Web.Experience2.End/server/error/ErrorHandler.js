'use strict';

let ApplicationError = require('../error/ApplicationError');

let messages = require('../locales/messages');

let catchError = (err, res) => {
    console.log(err);

    let error = {
        Content: messages.CommonApiError,
        ReasonPhrase: (err instanceof ApplicationError) ? err.message : ''
    };

    res.send(err.code ? err.code : 500, error);
};

module.exports = catchError;