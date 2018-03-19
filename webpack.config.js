const path = require('path');
const merge = require('webpack-merge');
const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;
const webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};


const common = {
  entry: PATHS.app,
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2)/,
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ],
        include: PATHS.app
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader'
        },
        include: PATHS.app
      }
    ]
  }
}

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devServer: {
      contentBase: PATHS.build,
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT,
    },
    devtool: 'eval-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {});
}