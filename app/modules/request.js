'use strict';

require('whatwg-fetch');

const methods = require('methods');
const querystring = require('querystring');
const _ = require('lodash');

function getPageQueryParam(name) {
    const url = location.href;
    const regex = new RegExp(`[?&]${name.replace(/[[\]]/g, '\\$&')}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);

    if (!results) {
        return null;
    }

    if (!results[2]) {
        return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const ask = (method, path, options) => {
    const headers = Object.assign(options.headers || {}, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });

    const requestOptions = _.merge({
        method,
        headers,
        credentials: 'same-origin',
        cache: 'default'
    }, options);
    const {body, query = {}} = requestOptions;
    const from = getPageQueryParam('from');
    const rid = getPageQueryParam('rid');

    if (from) {
        query.from = from;
    }

    if (rid) {
        query.rid = rid;
    }

    if (body) {
        requestOptions.body = JSON.stringify(body);
    }

    delete requestOptions.query;

    return fetch(`${path}?${querystring.stringify(query)}`, requestOptions).then((response) => {
        const isJson = response.headers.getAll('content-type').some(header =>
            header.indexOf('application/json') !== -1,
        );
        const dataPromise = isJson
            ? response.json()
            : response.text();

        return dataPromise.then((res) => {
            if (response.ok) {
                return res;
            }

            const ex = new Error(response.statusText);
            ex.status = response.status;
            ex.response = res;
            throw ex;
        });
    });
};


module.exports = (path, options) => ask('GET', path, options);

methods.forEach(method =>
    module.exports[method] = (path, options) =>
        ask(method.toUpperCase(), path, options));
