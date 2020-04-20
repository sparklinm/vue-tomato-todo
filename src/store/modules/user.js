export default {
  namespaced: true,
  state: {
    getUpClocks: [
      new Date(2019, 11, 2, 5, 10),
      new Date(2019, 11, 3, 10, 10),
      new Date(2019, 11, 5, 7, 33),
      new Date(2019, 11, 16, 8, 42)
    ],
    sleepClocks: [
      new Date(2019, 11, 2, 20, 10),
      new Date(2019, 11, 3, 21, 10),
      new Date(2019, 11, 4, 22, 33),
      new Date(2019, 11, 16, 2, 42)
    ],
    user: {
      headIcon: require('../../assets/user/head.jpg'),
      nickname: '默认名字',
      accound: '0000000000',
      signature: '千里之行，始于足下',
      background: '',
      creat: new Date()
    },
    isLogin: false
  },
  getters: {},
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    modifyUser (state, obj) {
      Object.assign(state.user, obj)
    },
    setLoginStatus (state, isLogin) {
      state.isLogin = isLogin
    }
  },
  actions: {}
}