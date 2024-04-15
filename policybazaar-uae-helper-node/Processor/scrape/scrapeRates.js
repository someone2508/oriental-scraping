const constants = require('../../constants');
const orientalProcessor = require('./oriental');

const scapeRates = async (req, res) => {
    try {
        if(req.body.insurerId == constants.INSURERS.ORIENTAL) {
            const response = await orientalProcessor.scrapeRateUsingPupetter(req, res);
            return res.json({
                message: "Scraped rates successfully!",
                data: response
            });
        }

        return res.json({
            message: "Insurer not supported yet!"
        });
    } catch(error) {
        console.log(error);
        return res.json({
            message: "Something went wrong!",
            error
        })
    }
}

module.exports = {
    scapeRates
}