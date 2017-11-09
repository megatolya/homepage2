'use strict';

const got = require('got');
const timer = require('contimer');

const createCurl = require('../utils/create-curl');

const {
    REQUEST_TIMEOUT,
    MAX_RETRIES
} = require('../constants/request');

class BaseDataProvider {
    constructor(ctx) {
        this.ctx = ctx;
    }

    request(backend, path, params) {
        const url = `${backend.baseUrl}${path || '/'}`;
        const method = params.method.toLowerCase() || 'get';
        const requestParams = {
            headers: {},
            timeout: REQUEST_TIMEOUT,
            retries: (count) => {
                if (count >= MAX_RETRIES) {
                    return 0;
                }

                return 1;
            }
        };

        if (params.body) {
            requestParams.body = JSON.stringify(params.body);
            Object.assign(requestParams.headers, {
                'content-type': 'application/json'
            });
        }

        const query = params.query || {};

        const requestTimerId = Math.random().toString();

        requestParams.query = query;
        requestParams.method = method;
        requestParams.url = url;
        requestParams.requestTimerId = requestTimerId;

        timer.start(this.ctx, requestTimerId);

        return got[method](url, requestParams).then((response) => {
            try {
                response.body = JSON.parse(response.body);
            } catch (ex) {
                console.log('parsing response failed', url); // eslint-disable-line
            }

            const requestTime = this._stopTimer(requestTimerId);
            if (requestTime) {
                this.logger.log(method.toUpperCase(), url, response.statusCode, `${requestTime}ms`);
            }

            return response;
        }).catch((error) => {
            this._logError(error, requestParams);
            throw error;
        });
    }

    _logError(error, params) {
        error.curl = createCurl(params);
        this.ctx.state.common.errors.push(error);

        const requestTime = this._stopTimer(params.requestTimerId);
        if (requestTime) {
            this.logger.log(
                params.method.toUpperCase(),
                params.url,
                error.statusCode || 504,
                `${requestTime}ms`
            );
        }
    }

    _stopTimer(requestTimerId) {
        const data = timer.stop(this.ctx, requestTimerId);
        return data ? data.time : null;
    }

    get logger() {
        return this.ctx.logger;
    }
}

module.exports = BaseDataProvider;
