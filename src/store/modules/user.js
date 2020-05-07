const myDate = new Date()
const year = myDate.getFullYear()
const month = myDate.getMonth()
const date = myDate.getDate()

export default {
  namespaced: true,
  state: {
    getUpClocks: [
      new Date(year, month, date, 5, 10),
      new Date(year, month, date - 1, 9, 10),
      new Date(year, month, date - 2, 8, 34),
      new Date(year, month - 1, date, 7, 33),
      new Date(year, month - 1, date + 1, 8, 42),
      new Date(year, month - 1, date + 2, 7, 15)
    ],
    sleepClocks: [
      new Date(year, month, date, 23, 10),
      new Date(year, month, date - 1, 22, 55),
      new Date(year, month, date - 2, 21, 23),
      new Date(year, month - 1, date, 24, 33),
      new Date(year, month - 1, date + 1, 1, 42),
      new Date(year, month - 1, date + 2, 3, 42)
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