'use strict';

[
    'log',
    'error',
    'warn',
    'table',
    'group',
    'groupCollapsed',
    'groupEnd'
].forEach((method) => {
    module.exports[method] = (...args) => {
        if (process.env.NODE_ENV !== 'production') {
            console[method](...args);
        }
    };
});
