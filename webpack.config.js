const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "src", "index.tsx"),

  output: {
    path: path.join(__dirname, "/dist"),
    filename: "[name].[contenthash].js",
    clean: true, // Clean the dist folder before each build
  },

  mode: "production", // Switch to production mode for optimizations
  devtool: "source-map", // Use source maps for debugging production builds

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-typescript",
              "@babel/preset-react",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./public/index.html"),
      favicon: "./public/favicon.ico",
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: "all", // Enable code splitting for all chunks
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
