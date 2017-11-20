'use strict';

require('babel-polyfill');

import createApp from './create-app'; // eslint-disable-line
const metrika = require(./metrika');

const logState = require('./log-state');

function printError(msg, url, lineNum, columnNum, error) {
    const errorElement = document.createElement('div');

    errorElement.style = 'padding: 16px; font-size: 13px; line-height: 1.5; color: red;';
    errorElement.innerHTML = [
        msg,
        `Source: ${url}:${lineNum}`,
        `Error object: ${JSON.stringify(error)}`
    ].join('<br>');

    document.body.insertBefore(errorElement, document.body.firstChild);
}

if (process.env.NODE_ENV !== 'production') {
    window.onerror = printError;
}

document.addEventListener('DOMContentLoaded', () => {
    const state = JSON.parse(document.querySelector('#initial-state').innerHTML);

    createApp(state, {el: '#app'});
    logState(state);
    setTimeout(() => metrika.init(), 0);
});
