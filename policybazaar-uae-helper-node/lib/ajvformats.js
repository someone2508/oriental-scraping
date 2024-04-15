const _ = require('lodash');

/**
 * Extra formats for tv4 JSON schema validator.
 * @type {Object}
 */
module.exports = {

    // anything parcelable to a valid Date Object
    'date': (data) => {
        let valid = (_.isFinite(data) || _.isString(data) || _.isDate(data));
        valid = valid && new Date(data).toString() !== 'Invalid Date';
        return valid ? true : false;
    },

    // date in dd/mm/yyyy format
    'dd/mm/yyyy': (data) => {
        let valid = _.isString(data);
        let dateParts = data.split("/");
        let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
        valid = valid && new Date(dateObject).toString() !== 'Invalid Date';
        return valid ? true : false;
    },

    // string with something to read. i.e not empy or blank
    'nonEmptyOrBlank': (data) => {
        return (data.length > 0 && !/^\s+$/.test(data)) ? true : false;
    },

    // string parcelable to a number
    'numberString': (data) => {
        return !isNaN(data) ? true : false;
    },

    // true or false string
    'booleanString': (data) => {
        return data === 'true' || data === "false" ? true : false;
    }
};