'use strict';

const url = require('url');

module.exports = function (req, res, next) {
    res.setHeader('X-Frame-Options', 'DENY');

    next();
};
