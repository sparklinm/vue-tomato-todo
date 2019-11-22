module.exports = {
  timeFormat: function (date, config) {
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    let time = ''
    if (config.cut) {
      time = y + config.cut + this.addZero(m, 10) + config.cut + d
    }
    if (config.unit) {
      time = y + '年' + m + '月' + d + '日'
    }
    return time
  },
  getTimeView (totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds - minutes * 60
    return `${this.addZero(minutes, 10)}:${this.addZero(seconds, 10)}`
  },
  addZero (num, limit) {
    return num < limit ? '0' + num : num
  }
}