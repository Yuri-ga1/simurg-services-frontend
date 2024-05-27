const webpack = require('webpack');
const devServer = require('webpack-dev-server');
const webpackConfig = require('../src/webpack-config');
const paths = require('../src/paths');
const { isHost } = require('../src/app-config');
const { formatMfManifest, createFile, deleteFile } = require('../src/utils');

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const start = async () => {
  if (isHost) {
    deleteFile(paths.localMfManifestGen);
    const formattedMfManifest = formatMfManifest(paths.appMfManifest, { isDev: true });
    createFile(paths.localMfManifestGen, formattedMfManifest);
  }

  const config = webpackConfig({ mode: process.env.NODE_ENV });
  const compiler = webpack(config);
  const server = new devServer(config.devServer, compiler);
  await server.start();
};

start();
