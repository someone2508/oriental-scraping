const _ = require('lodash');
const ApiError = require('./ApiError');

/**
 * Defined API errors.
 */
const errors = {
    'INTERNAL': {
        status: 500,
        message: 'Internal server error.'
    },
    'UNAUTHORIZED': {
        status: 401,
        message: 'Unauthorized access.'
    },
    'NOT_IMPLEMENTED': {
        status: 501,
        message: 'Resource method not implemented.'
    },
    'INVALID_INPUT': {
        status: 400,
        message: 'Invalid input in request.'
    },
    'NOT_FOUND': {
        status: 404,
        message: 'No such resource exists.'
    },
    'NOT_ALLOWED': {
        status: 403,
        message: 'Operation not allowed.'
    },
    'NO_ACCESS': {
        status: 403,
        message: 'Access not allowed.'
    },
    'ALREADY_EXISTS': {
        status: 409,
        message: 'Resource already exists.'
    },
    'SIZE_LIMIT': {
        status: 413,
        message: 'Input size exceeds allowed limits.'
    },
    'RATE_LIMIT': {
        status: 429,
        message: 'Request rate exceeds allowed limits.'
    },
    'ORIGIN_NOT_ALLOWED': {
        status: 403,
        message: 'Request from this origin is not allowed, Please contact to admin.'
    },
    'DEVICE_ID_NOT_FOUND': {
        status: 404,
        message: 'device uuid not found'
    },
    'ERROR_WHILE_SENDING_EMAIL': {
        status: 404,
        message: 'Error while sending email.'
    },
    'INVALID_AUTH': {
        status: 403,
        message: 'Invalid Auth.'
    },
    'DATABASE_TIMEOUT': {
        status: 503,
        message: 'Unable to connect database.'
    },
    'URL_NOT_EXISTS': {
        status: 301,
        message: 'Url not exists, please contact saurabhsingh@policybazaar.com.'
    },
    'SESSION_EXPIRED': {
        status: 401,
        message: 'Session has been expired.'
    },
}

// Transform error value into error functions
module.exports = _.mapValues(errors, (val, key) => {
    return (message) => new ApiError(message || val.message, val.status, key);
});