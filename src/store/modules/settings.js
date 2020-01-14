export default {
  namespaced: true,
  state: {
    themes: [
      {
        base: '#6acfac',
        darken10: '#5caf92',
        darken20: '#4c947b',
        lighter10: '#76ecc3'
      }
    ],
    currentTheme: {
      base: '#6acfac',
      darken10: '#5caf92',
      darken20: '#4c947b',
      lighter10: '#76ecc3'
    },
    keepAlive: []
  },
  getters: {},
  mutations: {
    setKeepAlive (state, array) {
      state.keepAlive = array
    }
  },
  actions: {}
}