import config from '@/config'
import echart from '@/lib/echart'

export default {
  namespaced: true,
  state: {
    themes: config.colors,
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
        src: '/music/beep/ding_ding.mp3'
      },
      // same_volume_media,same_volume_system
      toneVolume: 'same_volume_system',
      backgroundMusic: {
        name: 'soft_piano',
        src: '/music/soft_piano.mp3',
        backgroundImg: '/music/images/back1.jpg'
      },
      restDuration: 5,
      // system,custom,mixin
      randomMottoWay: 'system',
      stopUpperLimit: 3,
      fixedSort: false,
      hideAfterComplete: false,
      autoToMainPage: true
    },
    appearance: {
      // online,local,mixin
      posterRandomMode: 'online',
      morePoster: false,
      mainPageBackground: '/page_back/simple/back5.jpg',
      todoCardBackground: 'colorful',
      todoOpacity: 'opaque',
      todoSetCardBackground: 'solid',
      todoSetOpacity: 'opaque',
      timeTextSize: 'normal',
      timeTextStyle: 'normal'
    },
    // completed
    chart: {
      showClockChart: true,
      showStopChart: true,
      chartDurationUnit: 'minute',
      // seven_days,whole_month
      monthlyStatisticsDisplayRange: 'seven_days'
    },
    language: 'zh',
    noShowCompletedPlan: true,
    beeps: [
      {
        name: 'ding_ding',
        src: '/music/beep/ding_ding.mp3'
      },
      {
        name: 'short_ring',
        src: '/music/beep/short_ring.mp3'
      },
      {
        name: 'piano',
        src: '/music/beep/piano.mp3'
      },
      {
        name: 'music_box',
        src: '/music/beep/music_box.mp3'
      }
    ],
    todoMusic: [
      {
        name: 'none_sound',
        src: '',
        backgroundImg: '/music/images/back1.jpg'
      },
      {
        name: 'clock_tick',
        src: '/music/clock_tick.mp3',
        backgroundImg: '/music/images/back2.jpg'
      },
      {
        name: 'soft_piano',
        src: '/music/soft_piano.mp3',
        backgroundImg: '/music/images/back3.jpg'
      },
      {
        name: 'rain_sound',
        src: '/music/rain_sound.mp3',
        backgroundImg: '/music/images/back4.jpg'
      },
      {
        name: 'peaceful_mind',
        src: '/music/peaceful_mind.mp3',
        backgroundImg: '/music/images/back5.jpg'
      }

    ],
    // urls array
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
    },
    setCurrentTheme (state, value) {
      state.currentTheme = value
      config.setTheme(value)
      document.body.className = value.class
      echart.registerTheme()
    }
  },
  actions: {}
}