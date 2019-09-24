import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos: [
      {
        name: '普通',
        type: '普通番茄时钟',
        timeWay: '正向计时',
        taskNotes: '普通普通普通',
        loopTimes: 1,
        restTime: 5,
        hideAfterComplete: false
      },
      {
        name: '目标',
        type: '目标',
        timeWay: '倒计时',
        timeDuration: 25,
        goal: {
          deadline: new Date(2019, 8, 28),
          total: 360,
          complete: 100,
          customUnit: '页'
        },
        taskNotes: '目标目标目标',
        loopTimes: 1,
        restTime: 10,
        hideAfterComplete: false
      },
      {
        name: '习惯',
        type: '习惯',
        timeWay: '倒计时',
        timeDuration: 25,
        habit: {
          frequency: '日',
          piece: 120,
          complete: 30
        },
        taskNotes: '习惯习惯习惯',
        loopTimes: 5,
        restTime: 20,
        hideAfterComplete: false
      }
    ],
    todoSet: [],
    showBoxAddToDo: false

  },
  mutations: {
    addToDo (state, todo) {
      state.todos.push(todo)
    },
    toggleBoxAddToDo (state, show) {
      state.showBoxAddToDo = show
    }
  },
  actions: {

  }
})
