'use strict';

const counters = Object.create(null);
const resolveFunctions = {};

const metrika = {
    /**
     * Async .reachGoal() implementation
     *
     * @param {String} counter
     * @param {String} targetName
     */
    reachGoal(counter, targetName, params) {
        this._execute(counter, 'reachGoal', targetName, params);
    },

    /**
     * Async .params() implementation
     *
     * @param {String} counter
     * @param {Object} params
     */
    params(counter, params) {
        params = params.reduceRight((memo, item) => {
            const nested = {};
            nested[item] = memo;
            return nested;
        }, params.pop());

        this._execute(counter, 'params', params);
    },

    /**
     * Try to execute metrika method if metrika API exists.
     * Otherwise wait for it to become available
     *
     * @param {String} counter
     * @param {String} method
     */
    _execute(counter, method, params, reachGoalParams) {
        // call method
        this.getCounterByName(counter).then((metrikaCounter) => {
            if (Array.isArray(params)) {
                metrikaCounter[method](...params);
            } else {
                metrikaCounter[method](params, reachGoalParams);
            }
        });
    },

    /**
     * Called when counter object is ready
     *
     * @param {String} counter
     * @param {Ya.Metrika} metrikaAPI
     */
    onApiReady(counter, metrikaAPI) {
        if (!counters[counter]) {
            counters[counter] = metrikaAPI;
            resolveFunctions[counter].forEach((resolve) => {
                resolve(metrikaAPI);
            });
        }
    },

    getCounterByName(counter) {
        return new Promise((_resolve) => {
            if (counters[counter]) {
                _resolve(counters[counter]);
            } else if (resolveFunctions[counter]) {
                resolveFunctions[counter].push(_resolve);
            } else {
                resolveFunctions[counter] = [_resolve];
            }
        });
    }
};

const getNewMetrikaErrorPromise = () =>
    new Promise(resolve => setTimeout(resolve, 1000));

let metrikaErrorPromise = getNewMetrikaErrorPromise();
let errorsCount = 0;

module.exports = {
    onApiReady(...args) {
        return metrika.onApiReady(...args);
    }
};
