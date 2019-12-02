export default {
  formatTime: function (date, config) {
    if (!(date instanceof Date)) {
      return ''
    }
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    let time = ''
    if (config.hide) {
      const { year, month, day } = config.hide
      if (year) {
        y = ''
      }
      if (month) {
        m = ''
      }
      if (day) {
        d = ''
      }
    }
    if (config.cut) {
      time = (y
        ? y + config.cut
        : '') + (m
        ? this.addZero(m, 10)
        : '') + (d
        ? config.cut
        : '') + (d
        ? this.addZero(d, 10)
        : '')
    }
    if (config.unit) {
      time = (y
        ? y + '年'
        : '') + (m
        ? this.addZero(m, 10) + '月'
        : '') + (d
        ? this.addZero(d, 10) + '日'
        : '')
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
  },
  checkLess ({ value, max }) {
    return value - max <= 0
  },
  boolLeapYear (year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0
  },
  boolBigMonth (month) {
    const bigMonths = [0, 2, 4, 6, 7, 9, 11]
    return bigMonths.includes(month)
  },
  getMonthDays (date) {
    const month = date.getMonth()
    const year = date.getFullYear()
    if (this.boolBigMonth(month)) {
      return 31
    } if (month === 1) {
      if (this.boolLeapYear(year)) {
        return 29
      }
      return 28
    }
    return 30
  },
  assginLeafNode (target, source) {
    if (typeof source !== 'object' || typeof target !== 'object') {
      return
    }
    for (const [key, value] of Object.entries(source)) {
      if (typeof target[key] === 'undefined') {
        target[key] = Array.isArray(value) ? [] : {}
      }
      if (typeof value !== 'object' || _.isEmpty(value)) {
        target[key] = value
      } else {
        this.assginLeafNode(target[key], value)
      }
    }
  }
}
