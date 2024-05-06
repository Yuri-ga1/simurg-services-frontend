const fs = require('fs');
const paths = require('./paths');
const utils = require('./utils');
const appPkgJson = require(paths.appPkgJson);
const { peerDependencies: deps } = require(paths.localPkgJson);
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const dotenv = require('dotenv');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyPlugin = require('copy-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const { mergeDeep } = require('./utils');

const appConfig = fs.existsSync(paths.appConfig) ? require(paths.appConfig) : {};
const appName = utils.prepareFederationName(appConfig.name ?? appPkgJson.name);
const isHost = Boolean(appConfig.host);

const getModuleRules = (isDev) => {
  return [
    {
      test: /\.(ts|tsx)?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            plugins: [isDev && !isHost && require.resolve('react-refresh/babel')].filter(Boolean),
            presets: [
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      ],
    },
    {
      test: /\.css$/,
      use: [
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: {
              auto: /\.module\./,
            },
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: {
                'postcss-preset-mantine': {},
                'postcss-simple-vars': {
                  variables: {
                    'mantine-breakpoint-xs': '36em',
                    'mantine-breakpoint-sm': '48em',
                    'mantine-breakpoint-md': '62em',
                    'mantine-breakpoint-lg': '75em',
                    'mantine-breakpoint-xl': '88em',
                  },
                },
              },
            },
          },
        },
      ],
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/,
      type: 'asset/resource',
    },
    {
      test: /\.json$/,
      type: 'json',
    },
  ];
};

const getFederationConfig = () => {
  return mergeDeep(
    {
      name: appName,
      filename: 'js/remoteEntry.js',
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps['react'],
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
        '@mantine/core': {
          singleton: true,
          requiredVersion: deps['@mantine/core'],
        },
        '@mantine/hooks': {
          singleton: true,
          requiredVersion: deps['@mantine/hooks'],
        },
        '@repo/lib/': {
          singleton: true,
        },
        '@repo/ui': {
          singleton: true,
        },
      },
    },
    appConfig.federation,
  );
};

const getPlugins = (isDev, isAnalyze) => {
  const federationConfig = getFederationConfig();

  return [
    isHost &&
      new CopyPlugin({
        patterns: [
          isHost && {
            from: paths.appMfManifest,
            to: '',
          },
          {
            from: paths.appAssets,
            to: '',
          },
        ].filter(Boolean),
      }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
    }),
    new NodePolyfillPlugin(),
    new ModuleFederationPlugin(federationConfig),
    new HtmlWebpackPlugin({
      template: paths.appHtmlTemplate,
      chunks: isDev ? ['main'] : undefined,
      templateParameters: {
        title: appConfig.name,
        isDev,
      },
      minify: !isDev,
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(dotenv.config({ path: paths.appEnvConfig }).parsed),
      __DEV__: JSON.stringify(isDev),
      APP_NAME: JSON.stringify(appName),
    }),
    !isHost &&
      isDev &&
      new ReactRefreshWebpackPlugin({
        exclude: [/node_modules/, /bootstrap\.tsx$/],
      }),
    isHost &&
      isDev &&
      new LiveReloadPlugin({
        port: 35729,
      }),
    isAnalyze && new BundleAnalyzerPlugin({ analyzerPort: 'auto' }),
  ].filter(Boolean);
};

/** @type {import('webpack').Configuration} */
module.exports = (mode) => {
  const isDev = mode === 'development';
  const isAnalyze = mode === 'analyze';

  return {
    mode: isDev ? 'development' : 'production',
    target: 'web',
    entry: paths.appEntry,
    devtool: isDev ? 'inline-source-map' : false,
    devServer: {
      hot: !isHost,
      static: paths.appDist,
      port: appConfig.port ?? 3000,
      historyApiFallback: true,
      headers: isHost
        ? undefined
        : {
            'Access-Control-Allow-Origin': '*',
          },
    },
    output: {
      path: paths.appDist,
      filename: 'js/bundle.[contenthash:8].js',
      assetModuleFilename: 'images/[hash][ext][query]',
      chunkFilename: 'js/[name].[contenthash:8].chunk.js',
      publicPath: 'auto',
      clean: true,
    },
    module: {
      rules: getModuleRules(isDev),
    },
    plugins: getPlugins(isDev, isAnalyze),
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
};
