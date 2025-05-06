const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,         // For React
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.vue$/,          // For Vue
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,          // Optional: CSS support
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new VueLoaderPlugin()
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3000,
    open: true
  },
  mode: 'development'
};
