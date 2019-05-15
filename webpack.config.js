const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const merge = require('webpack-merge');

function getEnvironmentConfig(envConfig, params) {
  return envConfig[params.buildEnv] || envConfig.development || {};
}

function baseConfig(params) {
  return merge(
    {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: [
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-syntax-dynamic-import',
                  '@loadable/babel-plugin',
                ],
              },
            },
          },
        ],
      },
    },
    getEnvironmentConfig(
      {
        production: {
          mode: 'production',
        },
        development: {
          devtool: 'source-map',
        },
      },
      params,
    ),
  );
}

function serverConfig(params) {
  return merge(
    baseConfig(params),
    {
      target: 'node',
      entry: path.resolve(__dirname, 'src/server/index.js'),
      output: {
        path: path.resolve(__dirname, 'dist/server'),
        filename: 'index.js',
      },
      context: path.resolve(__dirname),
      node: {
        __dirname: true,
      },
      externals: [webpackNodeExternals()],
    },
    getEnvironmentConfig({}, params),
  );
}

function clientConfig(params) {
  return merge(
    baseConfig(params),
    {
      target: 'web',
      entry: path.resolve(__dirname, 'src/client/index.js'),
      output: {
        path: path.resolve(__dirname, 'dist/client/scripts'),
        filename: 'index.js',
        publicPath: '/',
      },
      optimization: {
        splitChunks: {
          chunks: 'all',
        },
      },
      plugins: [
        new LoadablePlugin({ filename: '../loadable-stats.json' }),
        new CopyWebpackPlugin([
          { from: './src/client/html/index.html', to: '../templates/index.html' },
        ]),
      ],
    },
    getEnvironmentConfig({}, params),
  );
}

function processEnv(env) {
  const { BUILD_ENV = 'development' } = env || {};
  return {
    buildEnv: BUILD_ENV,
  };
}

module.exports = (env) => {
  const params = processEnv(env);
  return [serverConfig(params), clientConfig(params)];
};
