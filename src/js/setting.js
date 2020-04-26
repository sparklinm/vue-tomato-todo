function getNonRepeatRandom (lower, upper) {
  const cache = []

  function randomNumber () {
    if (upper - lower === 0) {
      return lower
    }
    const random = Math.floor(Math.random() * (upper - lower + 1) + lower)

    if (cache.length === upper - lower + 1) {
      const lastValue = cache[cache.length - 1]

      if (random === lastValue) {
        return randomNumber()
      }
      cache.length = 0
    }

    if (cache.some(number => number === random)) {
      return randomNumber()
    }
    cache.push(random)
    return random
  }
  return randomNumber
}

const randomClockBackground = getNonRepeatRandom(0, 3)
const randomTodoCardBackground = getNonRepeatRandom(0, 7)

export default {
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