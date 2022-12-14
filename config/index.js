'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.
//庞豪：http://192.168.1.181:8080
//刘梦冰：http://192.168.1.183:8080
//朱辉：http://192.168.1.58:8080
//朱浩然：http://192.168.15.18:28081

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api':{ //代理地址
        // target: 'http://192.168.16.107:28081', //需要代理的地址 'http://192.168.1.224:28083
        // target: 'http://192.168.16.42:28081', //需要代理的地址 'http://192.168.1.224:28083
        // target: 'http://192.168.16.107:28081', //需要代理的地址
        // target: 'http://192.168.10.18:28081', //需要代理的地址 刘梦冰
        // target: 'http://192.168.10.17:28081', //需要代理的地址 余川
        // target: 'http://192.168.1.29:28081', //需要代理的地址 童享
        //  target: 'http://192.168.10.25:28081', //需要代理的地址 王双
        // target: 'http://192.168.10.28:28081', //需要代理的地址 范威乐
        target: 'http://120.76.202.91:28085', //需要代理的地址
        changeOrigin: true, //是否跨域
        secure: false,
        pathRewrite: {
          '^/api': ''
        }
      },
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 28879, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}





