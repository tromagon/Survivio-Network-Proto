var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var WebpackSynchronizableShellPlugin = require('webpack-synchronizable-shell-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, './index.ts'),
    output: {
        path: path.join(__dirname, '../../dist/client'),
        filename: 'client.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            assets: path.join(__dirname, './assets/')
        }
    },
    plugins: [
        new WebpackSynchronizableShellPlugin({
            onBuildStart: {
                scripts: ['npm run assets'],
                blocking: true,
                parallel: false
            }
        }),
        new webpack.DefinePlugin({
            'S_RECONC': true,
            'C_PREDICT': true,
            'E_INTERP': true,
            'GOOGLE_WEB_FONTS': JSON.stringify([ // Add or remove entries in this array to change which fonts are loaded
            ]),
        }),
        new CleanWebpackPlugin([
            path.join(__dirname, 'dist/client')
        ]),
        new HtmlWebpackPlugin({
            title: 'Hola',
            template: path.join(__dirname, '../../templates/index.ejs')
        })
    ],
    optimization: {
        minimizer: [
          // we specify a custom UglifyJsPlugin here to get source maps in production
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
                compress: {
                    drop_console: true
                },
                ecma: 6,
                mangle: true,
                output: {
                    comments:false,
                    beautify: false
                }
            },
            sourceMap: false
          })
        ]
      },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/'},
            { test: /\.js$/, loader: 'expose-loader', options: '$'},
            { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
            { test: /SAT\.js$/, loader: 'expose-loader?SAT' },
            { test: /assets(\/|\\)/, loader: 'file-loader?name=assets/[hash].[ext]' }
        ]
    },
    mode: "production"
}