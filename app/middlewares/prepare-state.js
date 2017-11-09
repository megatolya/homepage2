'use strict';

const {createDefaultState} = require('../utils/state');
const {xhrBasePath} = require('../config');

module.exports = function (req, res, next) {
    req.state = createDefaultState();

    Object.assign(req.state.common, {
        requestId: req.query.rid
            ? `${req.query.rid}/${Date.now()}`
            : `${Math.random().toString().slice(12)}/${Date.now()}`,
        csrfToken: req.csrfToken(),
        xhrBasePath,
        target: (req.query.appsearch_header || '').toString() === '1' ? 'app' : 'web'
    });

    next();
};
