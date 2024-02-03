/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const ContextReplacementPlugin = require('webpack').ContextReplacementPlugin
const NodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/server.ts',
  mode: process.env.NODE_ENV || 'production',
  target: 'node',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new NodePolyfillPlugin({ excludeAliases: ['console'] }),
    new ContextReplacementPlugin(/sequelize(\\|\/)/, path.resolve(__dirname, './src')),
    new ContextReplacementPlugin(/express(\\|\/)/, path.resolve(__dirname, './src'))
  ],

  externals: [NodeExternals()],

  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 4000
  }
}
