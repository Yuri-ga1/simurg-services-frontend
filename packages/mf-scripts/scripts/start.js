const webpack = require('webpack');
const devServer = require('webpack-dev-server');
const webpackConfig = require('../config/webpack.config');

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const config = webpackConfig(process.env.NODE_ENV);
const compiler = webpack(config);
const server = new devServer(config.devServer, compiler);

const runServer = async () => {
  await server.start();
};

runServer();
