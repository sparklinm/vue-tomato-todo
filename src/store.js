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
        hideAfterComplete: false,
        create: new Date(2019, 8, 24),
        focus: {
          number: 0,
          duration: 0
        },
        reminders: [
          {
            time: '17:33',
            day: '每天'
          }
        ]
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
        hideAfterComplete: false,
        create: new Date(2019, 8, 24),
        focus: {
          number: 100,
          duration: 1000
        },
        reminders: [
          {
            time: '17:33',
            day: '每天'
          }
        ],
        stickDays: {
          total: 2,
          continuation: 2
        }
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
        hideAfterComplete: false,
        create: new Date(2019, 8, 24),
        focus: {
          number: 5,
          duration: 100
        },
        reminders: [
          {
            time: '17:33',
            day: '每天'
          }
        ],
        stickDays: {
          total: 5,
          continuation: 3
        }
      }
    ],
    todoSet: []

  },
  mutations: {
    addToDo (state, todo) {
      state.todos.push(todo)
    }
  },
  actions: {

  }
})
