const express = require('express');
const router = express.Router();
const validate = require('../../lib/validate');
const validationSchema = require('../../Docs/definations/scraping/rates/rates.json');
const scrapeRatesProcessor = require('../../Processor/scrape/scrapeRates');

module.exports = router.post('/scrape/rates', async (req, res, next) => {
    validate(req.body, validationSchema.general);

    validate(req.body, validationSchema.insurer[req.body.insurerId]);

    return await scrapeRatesProcessor.scapeRates(req, res);
});