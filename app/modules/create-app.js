'use strict';

import Vue from 'vue';
import Vuex from 'vuex';

const App = require('../components/app/index.vue');
const HomePage = require('../components/home-page/index.vue');

const {createStore} = require('./store');

if (typeof window !== 'undefined') {
    const VueTouch = require('vue-touch'); // eslint-disable-line
    Vue.use(VueTouch);
}

Vue.use(Vuex);

Vue.component('app', App);
Vue.component('home-page', HomePage);

export default (state, props = {}) => Promise.resolve(new Vue(Object.assign(props, {
    store: createStore(state)
}, App)));
