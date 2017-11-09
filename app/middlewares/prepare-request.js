'use strict';

const timer = require('contimer');

module.exports = function (req, res, next) {
    timer.start(req, 'total');
    next();
};
