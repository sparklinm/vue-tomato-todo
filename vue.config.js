const path = require('path')
const webpack = require('webpack')



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
      // 忽略 moment.js的所有本地文件
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  }

}
