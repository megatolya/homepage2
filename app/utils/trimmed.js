'use strict';

module.exports = (strings, ...values) => {
    let output = '';

    for (let i = 0; i < values.length; i++) {
        output += strings[i] + values[i];
    }

    output += strings[values.length];

    return output.split('\n').map(line => (
        line.replace(/^\s+/gm, '')
    ))
        .join('\n')
        .trim();
};
