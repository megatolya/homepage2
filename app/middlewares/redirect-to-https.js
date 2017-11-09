'use strict';

const config = require('../config');

module.exports = (req, res, next) => {
    if (config.redirectToHttps) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            res.redirect(301, `https://${config.host}${req.url}`);
        } else {
            next();
        }
    } else {
        next();
    }
};
