'use strict';

const assert = require('assert');

assert(process.env.APP_SECRET);

module.exports = {
    xhrBasePath: '',
    secret: Math.random(),
    port: 80
};
