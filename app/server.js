'use strict';

const path = require('path');

require('source-map-support').install();

require('http').globalAgent.maxSockets = 1024;
require('https').globalAgent.maxSockets = 1024;
require('events').defaultMaxListeners = 1024;

const express = require('express');

const config = require('./config');
const serveStatic = require('serve-static');
const fileNotFound = require('./middlewares/file-not-found');
const redirectToHttps = require('./middlewares/redirect-to-https');

const app = express();

app.disable('x-powered-by');
app.disable('etag');
app.enable('trust proxy');
require('./utils/app-extensions')(app);

app.use(serveStatic(path.resolve(__dirname, '..', 'dist')));
app.use(fileNotFound);
app.use(redirectToHttps);

// To test that app works only
app.get('/ping', (req, res) => {
    res.end('OK');
});

app.use(require('./middlewares/prepare-request'));
app.use(require('cookie-parser')(config.secret));
app.use(require('./middlewares/x-frame-options'));
app.use(require('csurf')({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));
app.use(require('./middlewares/prepare-state'));

require('./controllers')(app);

app.use(require('./middlewares/error-handler'));
app.use(require('./middlewares/response'));

console.log('port', config.port);
app.listen(config.port, () => {
    console.log('App started', config.port);
});
