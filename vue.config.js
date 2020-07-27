const path = require('path')
const webpack = require('webpack')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, 'src/styles/mixin.less'),
        path.resolve(__dirname, 'src/styles/variable.less')
      ]
    }
  },
  chainWebpack: (config) => {
    // // 解决ie11兼容ES6
    // config.entry('main').add('babel-polyfill')
    // // 开启图片压缩
    // config.module.rule('images')
    //   .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    //   .use('image-webpack-loader')
    //   .loader('image-webpack-loader')
    //   .options({
    //     bypassOnDebug: true
    //   })
    // 开启js、css压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin').use(
        new CompressionPlugin({
          test: /\.js$|\.html$|.\css/, // 匹配文件名
          threshold: 1000, // 对超过10k的数据压缩
          deleteOriginalAssets: false // 不删除源文件
        })
      )

      config.optimization.minimize(true)
      config.plugin('terser').use(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_debugger: true,
              drop_console: true // 生产环境自动删除console
            },
            warnings: false
          },
          sourceMap: false,
          parallel: true // 使用多进程并行运行来提高构建速度。默认并发运行数：os.cpus().length - 1。
        })
      )
    }
  },
  pwa: {
    iconPaths: {
      favicon32: 'product.png',
      favicon16: 'product.png',
      appleTouchIcon: 'product.png',
      maskIcon: 'product.png',
      msTileImage: 'product.png'
    },
    manifestOptions: {
      icons: [
        {
          src: './product.png',
          type: 'image/png',
          sizes: '144x144 192x192 512x512'
        }
      ]
    },
    themeColor: '#37a5e5',
    msTileColor: '#ffffff',
    appleMobileWebAppCapable: 'yes',
    name: '番茄todo'
  },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        _cloneDeep: 'lodash/cloneDeep',
        _isEmpty: 'lodash/isEmpty',
        _merge: 'lodash/merge',
        Velocity: 'velocity-animate',
        html2canvas: 'html2canvas',
        StackBlur: 'stackblur-canvas',
        TWEEN: 'tween'
      }),

      // 忽略 moment.js的所有本地文件
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
