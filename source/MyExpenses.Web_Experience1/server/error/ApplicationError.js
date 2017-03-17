'use strict';

function ApplicationError(message, httpCodeError) {
    this.message = message;
    var last_part = new Error().stack.match(/[^\s]+$/);
    this.stack = `${this.name} at ${last_part}`;
    this.code = httpCodeError;
}
Object.setPrototypeOf(ApplicationError, Error);
ApplicationError.prototype = Object.create(Error.prototype);
ApplicationError.prototype.name = 'ApplicationError';
ApplicationError.prototype.message = '';
ApplicationError.prototype.code = 500;
ApplicationError.prototype.constructor = ApplicationError;

module.exports = ApplicationError;