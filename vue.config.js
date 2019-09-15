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
      })
    ]
  }

}
