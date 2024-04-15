'use strict';

const express = require('express');
const router = express.Router();
const glob = require('glob');
const path = require('path');

/*
 load all routes from files except for
 index.js
 */
module.exports.requireRoutes = async () => {
    return new Promise((resolve, reject) => {
        try {
            const files = glob.sync(__dirname + '/**/!(index).js');
            files.forEach((file, index) => {
                router.use(require(path.resolve(file)));
                if (index === files.length - 1)
                    return resolve(router);
            });
            return resolve(router);
        } catch (err) {
            return reject(err);
        }
    });
};