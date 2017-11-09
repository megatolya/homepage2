'use strict';

const querystring = require('querystring');

module.exports = ({
    url,
    query,
    headers,
    body,
    method
}) => {
    let res = `curl ${url}`;

    if (query) {
        res += `?${querystring.stringify(query)}`;
    }

    if (headers) {
        const headersStrings = Object.keys(headers).map((headerName) => {
            const headerValue = headers[headerName].replace(/"/g, '"');
            return `-H "${headerName}: ${headerValue}"`;
        });
        res += ` ${headersStrings.join(' ')}`;
    }

    if (body) {
        res += ` --data '${body.replace(/"/g, '"')}'`;
    }

    if (method) {
        res += ` -X ${method.toUpperCase()}`;
    }

    return res;
};
