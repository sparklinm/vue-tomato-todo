function getNonRepeatRandom (lower, upper, initCache) {
  let cache = initCache || []
  const nonRepeatNum = cache.reduce((total, val) => {
    if (val < lower || val > upper) {
      return total + 1
    }
  }, 0)

  function randomNumber () {
    if (upper - lower === 0) {
      return lower
    }
    const random = Math.floor(Math.random() * (upper - lower + 1) + lower)

    if (cache.length === upper - lower + 1 + nonRepeatNum) {
      const lastValue = cache[cache.length - 1]

      if (random === lastValue) {
        return randomNumber()
      }
      cache = initCache || []
    }

    if (cache.some(number => number === random)) {
      return randomNumber()
    }
    cache.push(random)
    return random
  }
  return randomNumber
}

export class randomSeed {
  constructor (lower, upper, initCache) {
    this.lower = lower
    this.upper = upper
    this.length = this.upper - this.lower + 1
    this.setCache(initCache || [])
  }
  setCache (cache) {
    this.initCache = cache
    this.cache = cache.concat()
    // 缓存中不重复的数
    this.nonRepeatNum = this.initCache.reduce((total, val) => {
      if (val < this.lower || val > this.upper) {
        return total + 1
      }
      return total
    }, 0)
  }
  do () {
    // 开始时，缓存已满，直接返回
    if (this.cache.length - this.nonRepeatNum >= this.length) {
      return
    }

    if (this.upper - this.lower === 0) {
      return this.lower
    }

    const random = Math.floor(
      Math.random() * (this.length) + this.lower
    )

    if (this.cache.length - this.nonRepeatNum === this.length) {
      const lastValue = this.cache[this.cache.length - 1]

      if (random === lastValue) {
        return this.do()
      }
      this.cache = this.initCache.concat() || []
    }

    if (this.cache.some(number => number === random)) {
      return this.do()
    }
    this.cache.push(random)
    return random
  }
}

const randomClockBackground = getNonRepeatRandom(0, 3)
const randomTodoCardBackground = getNonRepeatRandom(0, 7)

export default {
  randomSeed: randomSeed,
  creatNonRepeatRandom: getNonRepeatRandom,
  getSentence () {
    const length = 2
    const random = Math.floor(Math.random() * length)

    return `sentence.${random}`
  },
  getClockBackground () {
    const random = randomClockBackground()

    return `/clock/back${random}.jpg`
  },
  getTodoCardBackground () {
    const random = randomTodoCardBackground()

    return `/card/back${random}.jpg`
  },
  showLengthTip (str, length, noMore = true, i18) {
    if (str.length === 'undefined') {
      return false
    }
    if (noMore) {
      if (str.length > length) {
        this.$tips(this.$t(i18 || 'tips.no_more_than', [length]))
        return true
      }
    } else {
      if (str.length < length) {
        if (str.length === 0) {
          this.$tips(this.$t(i18 || 'tips.input_no_empty', [length]))
          return true
        }
        this.$tips(this.$t(i18 || 'tips.no_less_than', [length]))
        return true
      }
    }
    return false
  }
}
