'use strict';

module.exports = ({
    base,
    x1 = '',
    x2 = ''
}) => {
    if (!base) {
        return null;
    }

    return {
        x1: `${base}${x1}`,
        x2: x2
            ? `${base}${x2}`
            : undefined
    };
};
