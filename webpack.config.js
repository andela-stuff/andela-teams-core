const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => {
    nodeModules[mod] = `commonjs ${mod}`;
  });

module.exports = {
  entry: './src/server.js',
  externals: nodeModules,
  devtool: 'sourcemap',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false })
  ],
  stats: {
    colors: true
  },
  target: 'node',
  watch: true
};
