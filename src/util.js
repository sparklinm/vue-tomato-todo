module.exports = {
  timeFormat: function (date, config) {
    const y = date.getFullYear()
    let m = date.getMonth() + 1
    const d = date.getDate()
    let time = ''
    m = m < 10 ? '0' + m : m
    if (config.cut) {
      time = y + config.cut + m + config.cut + d
    }
    if (config.unit) {
      time = y + '年' + m + '月' + d + '日'
    }
    return time
  }
}