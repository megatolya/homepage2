'use strict';

const Logger = require('./logger');
const BaseDataProvider = require('../data-providers/base-data-provider');

const dataProvidersClasses = {
    BaseDataProvider
};

module.exports = (app) => {
    Object.defineProperty(app.request, 'dataProviders', {
        get() {
            if (!this._proxyDataProviders) {
                this._proxyDataProviders = new Proxy({}, {
                    get: (target, name) => {
                        if (!(name in target)) {
                            const DataProvider = dataProvidersClasses[name];
                            target[name] = new DataProvider(this);
                        }

                        return target[name];
                    }
                });
            }

            return this._proxyDataProviders;
        }
    });

    Object.defineProperty(app.request, 'logger', {
        get() {
            if (this._logger) {
                return this._logger;
            }

            this._logger = new Logger(this);
            return this._logger;
        }
    });

    app.request.getPage = function () {
        return parseInt(this.query.page, 10) || 1;
    };
};
