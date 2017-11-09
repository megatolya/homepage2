'use strict';

const deepMerge = require('deepmerge');
const defaultConfig = require('./configs/default');
const developmentConfig = require('./configs/development');
const productionConfig = require('./configs/production');

if (process.env.NODE_ENV === 'development') {
    module.exports = deepMerge(defaultConfig, developmentConfig);
} else if (process.env.NODE_ENV === 'production') {
    module.exports = deepMerge(defaultConfig, productionConfig);
} else {
    module.exports = defaultConfig;
}
