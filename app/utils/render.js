'use strict';

const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(
    path.resolve(__dirname, '../../dist/server.vue.js'),
    'utf-8'
);
const config = require('../config');
const renderer = require('vue-server-renderer').createBundleRenderer(code);
const glob = require('glob');
const mustache = require('mustache');

const layouts = {};
const cwd = path.resolve(path.join(__dirname, '..', '..'));

const isProduction = ['production'].includes(process.env.NODE_ENV);
const styles = fs.readFileSync(path.resolve(
    cwd,
    'dist',
    isProduction
        ? 'all.vue.min.css'
        : 'all.vue.css'
), {encoding: 'utf8'})
    .replace(
        /(url\()(assets\/)/g,
        `$1${config.staticPath}/dist/$2`
    );

glob('app/layouts/*.html', (ex, files) => {
    files.forEach((file) => {
        const content = fs.readFileSync(path.join(cwd, file)).toString();
        layouts[path.basename(file, '.html')] = content;
    });
});

function renderLayout(layoutName, data) {
    const html = layouts[layoutName];
    return mustache.render(html, data);
}

module.exports = {
    renderLayout({layout, state}) {
        return new Promise((resolve, reject) => {
            renderer.renderToString(state, (error, html) => {
                if (error) {
                    reject(error);
                    console.log(error);
                    return;
                }

                resolve(renderLayout(layout, {
                    content: html,
                    meta: state.page.meta,
                    title: state.page.title,
                    staticPath: config.staticPath,
                    js: isProduction ? 'min.js' : 'js',
                    css: isProduction ? 'min.css' : 'css',
                    styles,
                    state: JSON.stringify(state).replace(/</g, '&lt;').replace(/>/g, '&gt;')
                }));
            });
        });
    }
};
