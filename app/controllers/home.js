'use strict';

module.exports = (req, res, next) => {
    const state = req.state;

    Object.assign(state.page, {
        title: 'Анатолий Островский',
        links: [
            'https://www.instagram.com/qwerty121/',
            'https://t.me/megatolya',
            'https://moikrug.ru/ostrovskiy-anatoliy1',
            'https://www.linkedin.com/in/anatoly-ostrovsky-43549973/',
            'mailto:forgetthisbox@gmail.com'
        ],
        type: 'home'
    });
    state.common.status = 200;
    next();
};
