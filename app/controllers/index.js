'use strict';

const home = require('./home');

module.exports = function (app) {
    app.get('/', home);
};
