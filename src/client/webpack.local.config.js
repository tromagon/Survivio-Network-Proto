var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var WebpackSynchronizableShellPlugin = require('webpack-synchronizable-shell-plugin');

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
                scripts: ['npm run assets:dev'],
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
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8000,
        inline: true
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
    mode: "development",
    devtool: 'source-map',
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: true,
        ignored: /node_modules/
    }
}