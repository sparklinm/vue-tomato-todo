module.exports = {
  plugins: {
    'autoprefixer': {
      browsers: ['Android >= 4.0', 'iOS >= 7']
    },
    'postcss-pxtorem': {
      rootValue: 50, // 结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
      propList: ['padding*', 'margin*', 'width', 'height', 'transform*']
    }
  }
}
