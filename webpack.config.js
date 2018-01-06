var fs = require('fs');
var path = require('path');
var webpack = require('webpack')

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './src/server.js',
  externals: nodeModules,
  devtool: 'sourcemap',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'server.js'
  },
  plugins: [
    new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false })
  ],
  target: 'node',
}