'use strict';

const {mapState} = require('vuex');

module.exports = {
    computed: mapState({
        links: state => state.page.links
    })
};
