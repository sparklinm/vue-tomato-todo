export default {
  getSentence () {
    const length = 2
    const random = Math.floor(Math.random() * length)

    return `sentence.${random}`
  },
  getClockBackground () {
    const length = 4
    const random = Math.floor(Math.random() * length)

    return `/clock/back${random}.jpg`
  },
  getMusicBackground () {
    const length = 4
    const random = Math.floor(Math.random() * length)

    return `/music/background/back${random}.jpg`
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
  },
  getNoLoginUser () {
  }
}