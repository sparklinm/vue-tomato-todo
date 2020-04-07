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
  }
}