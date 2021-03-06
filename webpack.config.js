const ExtensionReloader = require('webpack-extension-reloader');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const contentScripts = {
  content: './content/index.js'
}
const extensionPages = {
  options: './options/index.js',
  popup: './popup/index.js',
}

let config = {
  mode: process.env.NODE_ENV,
  context: __dirname + '/src/pages'
};

let ExtensionConfig = Object.assign({}, config, {
  entry: {
    background: './background/index.js',
    ...contentScripts,
    ...extensionPages
  },
  output: {
    path: __dirname + '/extension/dist/',
    filename: '[name].dist.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
    ]
  },
  plugins: [
    new ExtensionReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        contentScript: Object.keys(contentScripts),
        extensionPage: Object.keys(extensionPages),
        background: 'background'
      }
    }),
    new CopyPlugin([
      {
        from: './assets/extensionIcons/*',
        to: __dirname + '/assets/extensionIcons/',
      },
      {
        from: './popup/index.html',
        to: __dirname + '/extension/dist/popup.html',
      },
      {
        from: './popup/index.css',
        to: __dirname + '/extension/dist/popup.css',
      },
      {
        from: './options/index.html',
        to: __dirname + '/extension/dist/options.html',
      },
      {
        from: './options/index.css',
        to: __dirname + '/extension/dist/options.css',
      },
      {
        from: './content/index.css',
        to: __dirname + '/extension/dist/content.css',
      },
    ]),
  ]
});

module.exports = [
  ExtensionConfig,
];
