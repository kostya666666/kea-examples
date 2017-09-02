const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HTMLWebpackTemplate = require("html-webpack-template");

// Resolve paths
const BUILD_DIR = path.resolve(__dirname, ".build");
const APP_DIR = path.resolve(__dirname, "src");

const commonConfig = {
  entry: ["babel-polyfill", APP_DIR],
  output: {
    path: BUILD_DIR,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        // Babel loader for React's JSX
        test: /\.jsx?$/,
        loaders: ["babel-loader", "eslint-loader"],
        include: APP_DIR,
        exclude: [/node_modules/]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      // Required
      inject: false,
      template: HTMLWebpackTemplate,
      // template: 'node_modules/html-webpack-template/index.ejs',

      // Optional
      appMountId: "app"
    })
  ]
};

function developmentConfig() {
  const config = {
    devServer: {
      historyApiFallback: true,
      contentBase: BUILD_DIR,
      stats: "errors-only",
      host: process.env.HOST, // Defaults to `localhost`
      port: process.env.PORT // Defaults to 8080
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ]
  };

  return Object.assign({}, commonConfig, config, {
    plugins: commonConfig.plugins.concat(config.plugins)
  });
}

const productionConfig = commonConfig;

// function productionConfig() {
//   return commonConfig;
// }

module.exports = function(env) {
  return env === "production" ? productionConfig : developmentConfig();
  // if (env === "production") {
  //   return productionConfig();
  // }

  // return developmentConfig();
};
