'use strict';

const _ = require('lodash');
const logger = require('./logger');

function logStateProp(state, pathPrefix = '', logProp = 'models') {
    Object.keys(state).forEach((prop) => {
        if (prop === logProp) {
            logStateProp(state[prop], `${prop}.`);
        } else {
            logger.log(`${pathPrefix}${prop}`, state[prop]);
        }
    });
}

module.exports = function (initialState) {
    logger.groupCollapsed('App initial state');
    const cleanState = _.pickBy(initialState, _.isPlainObject);
    logStateProp(cleanState);
    logger.groupEnd();

    if (process.env.NODE_ENV !== 'production') {
        window.initialState = initialState;
    }

    const {originalState} = initialState.page;

    if (originalState) {
        logger.groupCollapsed('App initial state (original)');
        const cleanOriginalState = _.pickBy(originalState, _.isPlainObject);
        logStateProp(cleanOriginalState);
        logger.groupEnd();
    }
};
