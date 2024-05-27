const fs = require('fs');
const paths = require('./paths');

const appConfig = fs.existsSync(paths.appConfig) ? require(paths.appConfig) : {};
const isHost = Boolean(appConfig.host);

module.exports = {
  appConfig,
  isHost,
};
