const path = require('path')
const webpack = require('webpack')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')



module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/styles/mixin.less'), path.resolve(__dirname, 'src/styles/variable.less')]
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Velocity: 'velocity-animate'
      }),
      new webpack.ProvidePlugin({
        _: 'lodash'
      }),
      new webpack.ProvidePlugin({
        html2canvas: 'html2canvas'
      }),
      new webpack.ProvidePlugin({
        StackBlur: 'stackblur-canvas'
      }),
      new webpack.ProvidePlugin({
        gsap: 'gsap'
      }),
      new webpack.ProvidePlugin({
        TWEEN: 'tween'
      }),
      // 忽略 moment.js的所有本地文件
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new BrowserSyncPlugin(
        // BrowserSync options
        {
          // browse to http://localhost:3000/ during development
          host: 'localhost',
          port: 8088,
          // proxy the Webpack Dev Server endpoint
          // (which should be serving on http://localhost:3100/)
          // through BrowserSync
          proxy: 'http://localhost:8080/'
        },
        // plugin options
        {
          // prevent BrowserSync from reloading the page
          // and let Webpack Dev Server take care of this
          reload: false
        }
      )
    ]
  }

}
