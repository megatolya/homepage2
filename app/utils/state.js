'use strict';

module.exports = {
    createDefaultState() {
        return {
            page: {
                layout: 'default',
                type: 'error'
            },
            common: {
                errors: []
            },
            models: {}
        };
    }
};
