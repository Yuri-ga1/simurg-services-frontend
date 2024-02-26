const dotenv = require('dotenv');
const path = require('path');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { dependencies: deps } = require('./package.json');

const NODE_ENV = process.env.NODE_ENV;

const isDev = NODE_ENV === 'development';
const isAnalyze = NODE_ENV === 'analyze';

const envConfig = dotenv.config().parsed;

/** @type {import('webpack').Configuration} */
module.exports = {
  target: 'web',
  entry: './src/index',
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'inline-source-map' : false,
  devServer: {
    hot: true,
    static: path.join(__dirname, 'dist'),
    port: envConfig.PORT,
  },
  output: {
    publicPath: 'auto',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.json$/,
        type: 'json',
      },
      {
        test: /\.css$/,
        oneOf: [
          {
            test: /\.module\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true,
                },
              },
              'postcss-loader',
            ],
          },
          {
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
          },
        ],
      },
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [isDev && 'react-refresh/babel'].filter(Boolean),
              presets: [
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new ModuleFederationPlugin({
      name: envConfig.APP_NAME,
      filename: 'remoteEntry.js',
      exposes: {
        './Module': './src/remote-entry.ts',
      },
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
        '@mantine/notifications': {
          singleton: true,
          requiredVersion: deps['@mantine/notifications'],
        },
        '@mantine/form': {
          singleton: true,
          requiredVersion: deps['@mantine/form'],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      templateParameters: {
        title: envConfig.APP_NAME,
      },
      chunks: ['main'],
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(envConfig),
      __DEV__: isDev,
    }),
    isDev &&
      new ReactRefreshWebpackPlugin({
        exclude: [/node_modules/, /bootstrap\.tsx$/],
      }),
    isAnalyze && new BundleAnalyzerPlugin({ analyzerPort: 'auto' }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    plugins: [new TsconfigPathsPlugin()],
  },
};
