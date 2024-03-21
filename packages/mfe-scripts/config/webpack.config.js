const fs = require('fs');
const paths = require('./paths');
const utils = require('./utils');
const appPkgJson = require(paths.appPkgJson);
const localPkgJson = require(paths.localPkgJson);
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const dotenv = require('dotenv');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const appConfig = fs.existsSync(paths.appConfig) ? require(paths.appConfig) : {};
const appName = utils.prepareFederationName(appConfig.name ?? appPkgJson.name);

const getModuleRules = (isDev) => {
  return [
    {
      test: /\.(ts|tsx)?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
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
  return {
    name: appName,
    filename: 'js/remoteEntry.js',
    exposes: appConfig.exposes ?? {},
    shared: {
      react: {
        singleton: true,
        requiredVersion: localPkgJson.peerDependencies['react'],
      },
      'react-dom': {
        singleton: true,
        requiredVersion: localPkgJson.peerDependencies['react-dom'],
      },
      '@mantine/core': {
        singleton: true,
        requiredVersion: localPkgJson.peerDependencies['@mantine/core'],
      },
      '@mantine/hooks': {
        singleton: true,
        requiredVersion: localPkgJson.peerDependencies['@mantine/hooks'],
      },
      '@repo/lib/': {
        singleton: true,
        requiredVersion: localPkgJson.peerDependencies['@repo/lib/'],
      },
      '@repo/ui': {
        singleton: true,
        requiredVersion: localPkgJson.peerDependencies['@repo/ui'],
      },
    },
  };
};

const getPlugins = (isDev, isAnalyze) => {
  const federationConfig = getFederationConfig();

  return [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
    }),
    new ModuleFederationPlugin(federationConfig),
    new HtmlWebpackPlugin({
      template: paths.appHtmlTemplate,
      chunks: isDev ? ['main'] : undefined,
      templateParameters: {
        title: appConfig.name,
      },
      minify: !isDev,
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(dotenv.config({ path: paths.appEnvConfig }).parsed),
      __DEV__: JSON.stringify(isDev),
      APP_NAME: JSON.stringify(appName),
    }),
    isDev &&
      new ReactRefreshWebpackPlugin({
        exclude: [/node_modules/, /bootstrap\.tsx$/],
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
      hot: true,
      static: paths.appDist,
      port: appConfig.devPort ?? 3000,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    output: {
      path: paths.appDist,
      filename: 'js/bundle.[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].chunk.js',
      publicPath: 'auto',
      clean: true,
    },
    module: {
      rules: getModuleRules(isDev),
    },
    plugins: getPlugins(isDev, isAnalyze),
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
};
