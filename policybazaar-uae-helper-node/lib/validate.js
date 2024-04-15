const _ = require('lodash');
const Ajv = require('ajv');
const errors = require('./errors');

// create instance
const ajv = new Ajv({ allErrors: true, formats: require('./ajvformats') });

/**
 * Validate data against schema.
 * Throws API error if data is invalid.
 * 
 * @param {*} data data to validate. 
 * @param {object} schema JSON draft schema object.
 * @returns {boolean} isValidJson 
 */
module.exports = function validate(data, schema) {

    const validate = ajv.compile(schema);

    // proceed if valid
    if (validate(data)) {
        return;
    }

    // extract error message
    let message;
    if (_.has(validate.errors[0], 'dataPath') && validate.errors[0].dataPath != "") {
        message = `${validate.errors[0].message} at ${validate.errors[0].dataPath}`;
    } else {
        message = validate.errors[0].message;
    }

    // send validation error with message
    throw errors.INVALID_INPUT(message);
}