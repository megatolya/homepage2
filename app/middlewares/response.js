'use strict';

const _pick = require('lodash/pick');
const timer = require('contimer');

const renderUtils = require('../utils/render');

const isProduction = ['production'].includes(process.env.NODE_ENV);

module.exports = function (req, res) {
    const {state} = req;
    const {page, common} = state;

    state.common.errors = isProduction
        ? []
        : state.common.errors.map(err => (
            _pick(err, ['statusCode', 'message', 'stack', 'curl'])
        ));

    if (!common.status) {
        if (page.type !== 'error') {
            common.status = 200;
        } else {
            common.status = 404;
        }
    }
    res.status(common.status);
    const requestTime = timer.stop(req, 'total').time;

    req.logger.setFields({
        requestTime,
        method: req.method,
        url: req.originalUrl,
        status: common.status,
        requestId: req.state.common.requestId,
        xhr: req.xhr
    });
    req.logger.log('request headers:', JSON.stringify(req.headers));

    if (req.xhr) {
        res.json(req.state);
        return;
    }

    timer.start(req, 'vue');
    /*
    const html = renderUtils.renderLayout({
        layout: page.layout,
        state
    });
    */
    renderUtils.renderLayout({
        layout: 'default',
        state
    }).then((html) => {
        const {time: renderTime} = timer.stop(req, 'vue');

        req.logger.setFields({
            renderTime
        });

        res.send(html);
    }).catch(res.send.bind(res));
};
