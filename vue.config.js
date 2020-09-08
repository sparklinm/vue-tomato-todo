const path = require('path')
const webpack = require('webpack')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// const PurifyCSSPlugin = require('purifycss-webpack')
const glob = require('glob')

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

    // 分包对于单页面作用不大
    config.optimization.splitChunks({
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 200000, // 依赖包超过300000bit将被单独打包
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name (module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]

            return `chunk.${packageName.replace('@', '')}`
          },
          priority: 10
        }
      }
    })

    // config.plugin('preload').tap(options => {
    //   options[0].fileBlacklist = options[0].fileBlacklist || []
    //   options[0].fileBlacklist.push(/chunk.echarts(.)+?\.js$/)
    //   return options
    // })
    // // 或者
    // // 修改它的选项：
    // config.plugin('prefetch').tap(options => {
    //   options[0].rel = 'prefetch'
    //   options[0].include = 'all'
    //   return options
    // })

    // 图片压缩，会损坏图像精度
    // https://www.npmjs.com/package/image-webpack-loader
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({})
      .end()
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
        StackBlur: 'stackblur-canvas',
        TWEEN: 'tween'
      }),
      // new PurifyCSSPlugin({
      //   // Give paths to parse for rules. These should be absolute!
      //   paths: glob.sync(path.join(__dirname, 'public/*.html'))
      // }),

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
