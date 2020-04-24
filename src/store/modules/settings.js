export default {
  namespaced: true,
  state: {
    themes: [
      {
        class: 'theme-1',
        color: '#798CBF'
      },
      {
        class: 'theme-2',
        color: '#37A5E5'
      },
      {
        class: 'theme-3',
        color: '#FAA3C1'
      },
      {
        class: 'theme-4',
        color: '#78C9C2'
      },
      {
        class: 'theme-5',
        color: '#9E87CE'
      },
      {
        class: 'theme-6',
        color: '#F55449'
      },
      {
        class: 'theme-7',
        color: '#C68D65'
      },
      {
        class: 'theme-8',
        color: '#707F8F'
      },
      {
        class: 'theme-9',
        color: '#D57F93'
      },
      {
        class: 'theme-10',
        color: '#4F88C6'
      }
    ],
    currentTheme: {
      base: '#6acfac',
      darken10: '#5caf92',
      darken20: '#4c947b',
      lighter10: '#76ecc3'
    },
    productIcon: require('@/assets/setting/product.png'),
    keepAlive: [],
    todo: {
      beep: true,
      tone: {
        name: 'ding_ding',
        src: '/music/ding_ding.mp3'
      },
      toneVolume: 'same_volume_system',
      backgroundMusic: {
        name: 'ding_ding',
        src: '/music/ding_ding.mp3',
        backgroundImg: '/music/background/back1.jpg'
      },
      restDuration: 5,
      randomMottoWay: 'system',
      stopUpperLimit: 3,
      fixedSort: false,
      hideAfterComplete: false,
      autoToMainPage: true
    },
    appearance: {
      posterRandomMode: 'online',
      morePoster: false,
      mainPageBackground: '/background/back4.jpg',
      todoCardBackground: 'colorful',
      todoOpacity: 'opaque',
      todoSetCardBackground: 'solid',
      todoSetOpacity: 'opaque',
      timeTextSize: 'normal',
      timeTextStyle: 'normal'
    },
    chart: {
      showClockChart: true,
      showStopChart: true,
      chartDurationUnit: 'hour',
      monthlyStatisticsDisplayRange: 'seven_days'
    },
    language: 'zh',
    noShowCompletedPlan: true,
    beeps: [
      {
        name: 'ding_ding',
        src: '/music/ding_ding.mp3'
      },
      {
        name: 'pinao',
        src: ''
      },
      {
        name: 'music_box',
        src: '/music/music_box.mp3'
      }
    ],
    todoMusic: [
      {
        name: 'ding_ding',
        src: '/music/ding_ding.mp3',
        backgroundImg: '/music/background/back1.jpg'
      },
      {
        name: 'music_box',
        src: '/music/music_box.mp3',
        backgroundImg: '/music/background/back2.jpg'
      }
    ],
    todoPosters: [],
    modules: [
      {
        name: 'todo',
        show: true
      },
      {
        name: 'set',
        show: true
      },
      {
        name: 'statistics',
        show: true
      },
      {
        name: 'time_axis',
        show: true
      },
      {
        name: 'future_plan',
        show: true
      },
      {
        name: 'me',
        show: true
      }
    ],
    motto: [
      '喜欢安定，也不怕漂泊。喜欢结伴，也不怕多行。',
      'another motto'
    ]
  },
  getters: {},
  mutations: {
    setKeepAlive (state, array) {
      state.keepAlive = array
    },
    setTodo (state, obj) {
      Object.assign(state.todo, obj)
    },
    addBeep (state, obj) {
      state.beeps.push(obj)
    },
    addTodoMusic (state, obj) {
      state.todoMusic.push(obj)
    },
    addMotto (state, text) {
      state.motto.push(text)
    },
    deleteMotto (state, index) {
      state.motto.splice(index, 1)
    },
    modifyAppearance (state, obj) {
      Object.assign(state.appearance, obj)
    },
    addTodoPoster (state, data) {
      if (Array.isArray(data)) {
        state.todoPosters = state.todoPosters.concat(data)
      } else {
        state.todoPosters.push(data)
      }
    },
    deleteTodoPoster (state, index) {
      state.todoPosters.splice(index, 1)
    },
    setModules (state, ary) {
      state.modules = ary.concat()
    },
    modifyChart (state, obj) {
      Object.assign(state.chart, obj)
    },
    setLanguage (state, value) {
      state.language = value
    },
    setNoShowCompletedPlan (state, value) {
      state.noShowCompletedPlan = value
    }
  },
  actions: {}
}