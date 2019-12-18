export function dateTimeFormatter (date, format) {
  // 时间格式化辅助函数 date:毫秒数 format:'yyyy-MM-dd hh:mm:ss'
  if (!date || date == '') {
    return ''
  }

  if (typeof date === 'string') {
    const mts = date.match(/(\/Date\((\d+)\)\/)/)
    if (mts && mts.length >= 3) {
      date = parseInt(mts[2])
    }
  }

  date = new Date(date)
  if (!date || date.toUTCString() == 'Invalid Date') {
    return ''
  }

  const map = {
    M: date.getMonth() + 1, // 月份
    d: date.getDate(), // 日
    h: date.getHours(), // 小时
    m: date.getMinutes(), // 分
    s: date.getSeconds(), // 秒
    q: Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }

  format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
    let v = map[t]
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v
        v = v.substr(v.length - 2)
      }
      return v
    }
    if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length)
    }
    return all
  })

  return format
}
export function isisEqualDateStr (dateStr1, dateStr2) {
  const dateArr1 = dateStr1.split('/')
  const dateArr2 = dateStr2.split('/')
  if (parseInt(dateArr1[0], 10) !== parseInt(dateArr2[0], 10)) {
    return false
  }
  if (parseInt(dateArr1[1], 10) !== parseInt(dateArr2[1], 10)) {
    return false
  }
  if (parseInt(dateArr1[2], 10) !== parseInt(dateArr2[2], 10)) {
    return false
  }
  return true
}
export default {
  boolLeapYear (year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
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
    }
    if (month === 1) {
      if (this.boolLeapYear(year)) {
        return 29
      }
      return 28
    }
    return 30
  },
  getPreMonth (date) {
    let month = date.getMonth()
    let year = date.getFullYear()
    if (month < 11) {
      month--
    } else {
      year--
      month = 11
    }
    return new Date(year, month, 1)
  },
  getNextMonth (date) {
    let month = date.getMonth()
    let year = date.getFullYear()
    if (month < 11) {
      month++
    } else {
      year++
      month = 0
    }
    return new Date(year, month, 1)
  },
  isEqualDate (cur, tag) {
    if (!cur.getTime || !tag.getTime) {
      return false
    }
    return cur.getTime() === tag.getTime()
  },
  isEqualDateFuzzy (cur, tag, ignore) {
    if (!cur.getTime || !tag.getTime) {
      return
    }
    const [curYear, curMonth, curDate] = [
      cur.getFullYear(),
      cur.getMonth(),
      cur.getDate()
    ]
    const [tagYear, tagMonth, tagDate] = [
      tag.getFullYear(),
      tag.getMonth(),
      tag.getDate()
    ]
    if (ignore === 'hour') {
      return this.isEqualDate(
        new Date(curYear, curMonth, curDate),
        new Date(tagYear, tagMonth, tagDate)
      )
    }

    if (ignore === 'date') {
      return this.isEqualDate(
        new Date(curYear, curMonth),
        new Date(tagYear, tagMonth)
      )
    }
    return this.isEqualDate(cur, tag)
  },
  dateTimeFormatter (date, format) {
    // 时间格式化辅助函数 date:毫秒数 format:'yyyy-MM-dd hh:mm:ss'
    if (!date || date === '') {
      return ''
    }

    if (typeof date === 'string') {
      const mts = date.match(/(\/Date\((\d+)\)\/)/)
      if (mts && mts.length >= 3) {
        date = parseInt(mts[2])
      }
    }

    date = new Date(date)
    if (!date || date.toUTCString() == 'Invalid Date') {
      return ''
    }

    const map = {
      M: date.getMonth() + 1, // 月份
      d: date.getDate(), // 日
      h: date.getHours(), // 小时
      m: date.getMinutes(), // 分
      s: date.getSeconds(), // 秒
      q: Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    }

    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
      let v = map[t]
      if (v !== undefined) {
        if (all.length > 1) {
          v = '0' + v
          v = v.substr(v.length - 2)
        }
        return v
      }
      if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length)
      }
      return all
    })

    return format
  },
  HexToRgb (str) {
    const hexReg = /^#?[0-9A-Fa-f]{6}$/
    if (!hexReg.test(str)) {
      return str
    }
    let color = str
    color = color.replace('#', '')
    const hxs = color.match(/../g)
    for (let i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i], 16)
    return hxs
  },
  RgbToHex (a, b, c) {
    const r = /^\d{1,3}$/
    if (!r.test(a) || !r.test(b) || !r.test(c)) return ''
    const hexs = [a.toString(16), b.toString(16), c.toString(16)]
    for (let i = 0; i < 3; i++) if (hexs[i].length === 1) hexs[i] = '0' + hexs[i]
    return '#' + hexs.join('')
  },
  getDarkColor (color, level) {
    const rgbColor = this.HexToRgb(color)
    for (let i = 0; i < 3; i++)
      rgbColor[i] = Math.floor(rgbColor[i] * (1 - level))
    return this.RgbToHex(rgbColor[0], rgbColor[1], rgbColor[2])
  },
  getLightColor (color, level) {
    const rgbColor = this.HexToRgb(color)
    for (let i = 0; i < 3; i++) rgbColor[i] = Math.floor((255 - rgbColor[i]) * level + rgbColor[i])
    return this.RgbToHex(rgbColor[0], rgbColor[1], rgbColor[2])
  }
}
