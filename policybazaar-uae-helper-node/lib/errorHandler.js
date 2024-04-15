const ApiError = require('./ApiError');
const errors = require('./errors');
// const log = require('./logger').log;
// const googleChatNotification = require('./googleChatNotification');

/**
 * Express error handler middleware.
 * Should be the last middleware used.
 * 
 * @param {Error|*} err Error value 
 * @param {Request} req Express request
 * @param {Response} res Express response
 * @param {Function} next Next function
 */
module.exports = function (err, req, res, next) {

    if (res.headersSent) {
        // end if headers have already been sent
        res.end();
    } else {
        // send error
        if (err instanceof ApiError) {
            // send API error
            err.send(res);
        } else {
            // log intrnal error
            console.log(err);

            let msg = `${req.method} ${req.url} ${JSON.stringify(req.query)} ${JSON.stringify(req.body)}`;
            if (err && err.stack) {
                msg += `\nStack: ${err.stack}`;
            }
            if (err && err.response && err.response.data) {
                msg += `\nAPIError: ${typeof err.response.data == 'object' ? JSON.stringify(err.response.data) : err.response.data}`;
            }
            // googleChatNotification.send(msg);

            // send default API error
            errors.INTERNAL().send(res);
        }
    }
}