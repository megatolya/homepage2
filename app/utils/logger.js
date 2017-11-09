'use strict';

const _get = require('lodash/get');

const groupLogs = Boolean(process.env.GROUP_LOGS);

class Logger {
    constructor(ctx) {
        this._ctx = ctx;
        this._messages = [];
        this._fields = {};
        ctx.res.on('finish', this.outputLog.bind(this));
    }

    log(...args) {
        if (groupLogs) {
            this._messages.push(
                args.join(' ')
            );
        } else {
            console.log(args.join(' '));
        }
    }

    setFields(fields) {
        Object.assign(this._fields, fields);
    }

    getHeaderMessage() {
        const {
            method,
            url,
            requestTime,
            renderTime
        } = this._fields;
        const status = _get(this, '_ctx.state.common.status');

        return [
            new Date().toISOString(),
            url,
            method ? `method=${method}` : null,
            status ? `status=${status}` : null,
            requestTime ? `total=${requestTime}ms` : null,
            renderTime ? `render=${renderTime}ms` : null
        ].filter(Boolean).join(' ');
    }

    outputLog() {
        if (!groupLogs) {
            console.log(this.getHeaderMessage());
            return;
        }

        console.log(
            [
                this.getHeaderMessage(),
                ...this._messages.map(message => `  ${message}`),
                ''
            ].join('\n')
        );
    }
}

class QloudLogger extends Logger {
    log(...args) {
        if (groupLogs) {
            super.log(...args);
        } else {
            console.log(JSON.stringify({
                message: args.join(' '),
                '@fields': this._fields
            }));
        }
    }

    outputLog() {
        if (groupLogs) {
            console.log(JSON.stringify({
                message: [
                    this.getHeaderMessage(),
                    ...this._messages
                ].join('\n'),
                '@fields': this._fields
            }));
        } else {
            console.log(JSON.stringify({
                message: [
                    this.getHeaderMessage()
                ].join('\n'),
                '@fields': this._fields
            }));
        }
    }
}

module.exports = Logger;
