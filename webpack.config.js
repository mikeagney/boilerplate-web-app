const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
      },
      optimization: {
        splitChunks: {
          chunks: 'all',
        },
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: './src/client/html/index.html',
          filename: '../templates/index.html',
        }),
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
