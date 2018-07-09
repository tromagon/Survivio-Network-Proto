var path = require("path");
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: path.join(__dirname, './index.ts'),
    output: {
        path: path.join(__dirname, '../../dist/'),
        filename: 'server.js'
    },
    node: {
        __dirname: false,
        __filename: false
    },
    target: 'node',
    externals: [nodeExternals()],
    mode: "development",
    resolve: {
        extensions: [".ts", ".js"],
        modules: [path.join(__dirname, '../'), path.join(__dirname, './')]
    },
    module: {
        rules: [
          // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
          { test: /\.ts?$/, loader: "ts-loader", exclude: '/node_modules/' }
        ]
      },
    devtool: 'source-map'
}