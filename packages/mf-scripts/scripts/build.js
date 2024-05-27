const webpack = require('webpack');
const webpackConfig = require('../src/webpack-config');
const paths = require('../src/paths');
const { isHost } = require('../src/app-config');
const { formatMfManifest, createFile, deleteFile } = require('../src/utils');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const build = async () => {
  if (isHost) {
    deleteFile(paths.localMfManifestGen);
    const formattedMfManifest = formatMfManifest(paths.appMfManifest, { isDev: false });
    createFile(paths.localMfManifestGen, formattedMfManifest);
  }

  const config = webpackConfig({ mode: process.env.NODE_ENV });
  const compiler = webpack(config);
  compiler.run((error, stats) => {
    if (error || stats.hasErrors()) {
      console.error(stats.toString('errors-only'));
      process.exit(1);
    } else {
      console.log('Build succeeded!');
      if (isHost) {
        deleteFile(paths.localMfManifestGen);
      }
    }
  });
};

build();
