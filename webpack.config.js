const config = require('./config');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");// Build html
const CopyWebpackPlugin = require('copy-webpack-plugin');// Build image

const SRC = path.resolve(__dirname, 'src');
const BUILD_DIR = process.env.NODE_ENV=='production'? path.resolve(__dirname, 'public') : path.resolve(__dirname, 'build');
const APP_DIR = path.resolve(__dirname, 'src/app');

module.exports = {
  // context: path.join(__dirname, "src"),
  // devtool: debug ? "inline-sourcemap" : false,
  entry: path.resolve(APP_DIR, 'App.js'),
  output: {
    path: BUILD_DIR,
    filename: "bundle.js"
  },
  watch: process.env.NODE_ENV=='production' ? false : true,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules|bower_components/,
        use: { loader: "babel-loader" }
      },
      {
        test: /\.html$/,
        use: { loader: "html-loader" }
      },
      { 
        test: /\.css$/, 
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  devServer: {
    host: 'localhost', // Defaults to `localhost`
    port: 3000, // Defaults to 8080,
    proxy: {
      '^/api/*': {
        target: 'http://localhost:3000/',
        secure: false
      }
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(SRC, 'index.html'),
      filename: "./index.html"
    }),
    new CopyWebpackPlugin([
      { from: SRC + '/images', to: BUILD_DIR + '/images' },
      { from: SRC + '/css', to: BUILD_DIR + '/css' },
      { from: SRC + '/js', to: BUILD_DIR + '/js' }
    ])
  ]
};
