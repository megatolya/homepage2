'use strict';

const ADD_TECH = 'ADD_TECH';

const Vuex = require('vuex');

module.exports = {
    createStore(state) {
        return new Vuex.Store({
            state,

            mutations: {
                [ADD_TECH](state, tech) {
                    state.page.techs.push(tech);
                }
            }
        });
    },

    ADD_TECH
};
