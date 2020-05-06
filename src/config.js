const colors = [
  {
    class: 'theme-1',
    base: '#6acfac',
    darken10: '#5caf92',
    darken20: '#4c947b',
    lighter10: '#76ecc3'
  },
  {
    class: 'theme-2',
    base: '#37A5E5',
    darken10: '#338bbe',
    darken20: '#2776a3',
    lighter10: '#43abe7'
  },
  {
    class: 'theme-3',
    base: '#FAA3C1',
    darken10: '#cf89a1',
    darken20: '#ac667e',
    lighter10: '#ff88b1'
  },
  {
    class: 'theme-4',
    base: '#78C9C2',
    darken10: '#54b4ac',
    darken20: '#34928a',
    lighter10: '#5fdacf'
  }
]

export default {
  colors,
  getTheme () {
    const storedTheme = localStorage.getItem('theme')

    if (storedTheme) {
      return JSON.parse(storedTheme)
    }
    localStorage.setItem('theme', JSON.stringify(this.colors[0]))
    return this.colors[0]
  }
}