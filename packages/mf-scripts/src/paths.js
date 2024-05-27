const path = require('path');
const fs = require('fs');

const appDir = fs.realpathSync(process.cwd());

const resolveApp = (relativePath) => path.resolve(appDir, relativePath);
const resolveLocal = (relativePath) => path.resolve(__dirname, '..', relativePath);

module.exports = {
  localPkgJson: resolveLocal('package.json'),
  localMfManifestGen: resolveLocal('scripts/mf-manifest.gen.json'),
  appEnvConfig: resolveApp('.env'),
  appEntry: resolveApp('src/index.ts'),
  appDist: resolveApp('dist'),
  appConfig: resolveApp('mf.config.js'),
  appPkgJson: resolveApp('package.json'),
  appHtmlTemplate: resolveApp('public/index.html'),
  appMfManifest: resolveApp('mf-manifest.json'),
  appAssets: resolveApp('public/assets'),
};
