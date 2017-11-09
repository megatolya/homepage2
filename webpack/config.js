'use strict';

const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

const APP_ROOT = path.resolve(path.join(__dirname, '..'));

const sourceMapFilename = '[file].map';
const devtoolModuleFilenameTemplate = '[absolute-resource-path]';
const devtoolFallbackModuleFilenameTemplate = '[absolute-resource-path]?[hash]';

const logErrorsPlugin = isProduction => function () {
    this.plugin('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length) {
            /*eslint-disable */
            stats.compilation.errors.forEach(theError => {
                console.log(theError.error || theError);
            });

            if (isProduction || process.env.TEAMCITY_VERSION) {
                throw new Error(`Found ${stats.compilation.errors.length} error(s)`);
            }
            /* eslint-enable */
        }
    });
};

const base = isProduction => ({
    context: APP_ROOT,
    resolve: {
        modules: [
            APP_ROOT,
            'node_modules'
        ],
        extensions: ['.js', '.vue']
    },
    devtool: !isProduction ? 'source-map' : undefined,
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            use: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader',
                            fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
                        })
                    }
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    use: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap!postcss!sass-loader',
                    fallback: 'style'
                })
            },
            {
                test: /\.(png|jpe?g|svg|gif)$/,
                loader: 'file-loader?name=assets/[hash:6].[ext]'
            },
            {
                test: /\.(eot|woff2?|ttf)$/,
                loader: 'file-loader?name=assets/[hash:2].[ext]'
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: /(node_modules)/
            },
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        logErrorsPlugin(isProduction)
    ]
});

const getServerConfig = isProduction => (
    merge(base(isProduction), {
        entry: './app/modules/create-app.js',
        target: 'node',
        externals: /^[a-z\-0-9]+$/,
        output: {
            filename: isProduction ? 'server.vue.min.js' : 'server.vue.js',
            path: `${APP_ROOT}/dist`,
            pathinfo: true,
            libraryTarget: 'commonjs2',
            sourceMapFilename,
            devtoolModuleFilenameTemplate,
            devtoolFallbackModuleFilenameTemplate
        },
        plugins: [
            new ExtractTextPlugin({filename: isProduction ? 'all.vue.min.css' : 'all.vue.css', allChunks: true})
        ],
        resolve: {
            alias: {
                'vue-touch': 'empty-module'
            }
        }
    })
);

const getClientConfig = isProduction => (
    merge(base(isProduction), {
        entry: './app/modules/client.js',
        output: {
            path: `${APP_ROOT}/dist`,
            pathinfo: !isProduction,
            filename: isProduction ? 'client.min.js' : 'client.js',
            libraryTarget: 'var',
            sourcePrefix: '    ',
            sourceMapFilename,
            devtoolModuleFilenameTemplate,
            devtoolFallbackModuleFilenameTemplate
        },
        plugins: [
            new ExtractTextPlugin({filename: isProduction ? 'client.vue.min.css' : 'client.vue.css', allChunks: true}),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: isProduction ? '"production"' : 'null'
                },
                'typeof window': JSON.stringify('object')
            }),
            logErrorsPlugin(isProduction)
        ].concat(isProduction
            ? [
                new webpack.optimize.UglifyJsPlugin({sourceMap: false, mangle: false})
            ]
            : []
        )
    })
);

module.exports = [
    getServerConfig(false),
    getClientConfig(false),
    process.env.NODE_ENV === 'production' && getServerConfig(true),
    process.env.NODE_ENV === 'production' && getClientConfig(true)
].filter(Boolean);
