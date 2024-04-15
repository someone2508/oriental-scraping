//ADnhmm

const config = require('config');

async function init() {
    const express = require('express');
    const bodyParser = require('body-parser');

    const Routes = require('./Routes');
    const constants = require('./constants');
    const errorHandler = require('./lib/errorHandler');

    const app = express();

    // middlewares
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    const appRoutes = await Routes.requireRoutes();

    app.use(constants.BASE_ENDPOINT, appRoutes);
    app.use(errorHandler);

    // run code on server start
    require('./lib/runOnServerStart');


    // start listening
    app.listen(config.server.PORT, () => {
        console.log(`app online @${config.server.PORT}`)
    });


}

init().catch((err) => {
    console.log(`App failed to start ${err}`);
    throw err;
});