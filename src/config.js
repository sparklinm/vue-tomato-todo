const colors = [
  {
    base: '#6acfac',
    darken10: '#5caf92',
    darken20: '#4c947b',
    lighter10: '#76ecc3'
  }
]

export default {
  colors,
  getTheme () {
    const storedTheme = localStorage.getItem('theme')

    if (storedTheme) {
      return JSON.parse(storedTheme)
    }
    localStorage.setItem('theme', JSON.stringify(this, colors[0]))
    return this.colors[0]
  }
}