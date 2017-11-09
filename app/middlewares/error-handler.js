'use strict';

module.exports = function (error, req, res, next) {
    // TODO handle this better
    if (!req.state) {
        try {
            req.logger.log(error.stack || error);
        } catch (ex) {
            console.log(ex);
        }
        res.sendStatus(error.status || 500);
        return;
    }

    if (error.stack || error.message) {
        req.logger.log(error.stack || error.message);
    }

    if (!req.state.common.errors.includes(error)) {
        req.state.common.errors.push(error);
    }

    if (error.statusCode) {
        req.state.common.status = error.statusCode;
    } else if (typeof error === 'number') {
        req.state.common.status = error;
    } else {
        req.state.common.status = 500;
    }

    next();
};
