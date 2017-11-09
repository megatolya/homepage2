'use strict';

const {mapState} = require('vuex');

const year = new Date().getFullYear();

module.exports = {
    computed: mapState({
        page: state => state.page.type,
        year: () => year
    })
};
