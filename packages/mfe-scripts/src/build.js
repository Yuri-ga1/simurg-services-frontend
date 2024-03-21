const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const config = webpackConfig(process.env.NODE_ENV);
const compiler = webpack(config);

compiler.run((error, stats) => {
  if (error || stats.hasErrors()) {
    console.error(stats.toString('errors-only'));
    process.exit(1);
  } else {
    console.log('Build succeeded!');
  }
});
