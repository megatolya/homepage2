'use strict';

module.exports = function (req, res, next) {
    if (!(/\.\w{2,5}$/.test(req.originalUrl))) {
        next();
    } else {
        console.log('404', req.originalUrl);
        res.status(404).end();
    }
};
