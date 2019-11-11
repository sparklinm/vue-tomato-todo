import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos: [
      {
        name: '普通',
        type: 'common',
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
        name: '普通2',
        type: 'common',
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
        name: '普通3',
        type: 'common',
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
        name: '普通4',
        type: 'common',
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
        type: 'goal',
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
        type: 'habit',
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
    template: {
      todoCommon: {
        name: '',
        type: 'common',
        timeWay: '倒计时',
        timeDuration: 25,
        taskNotes: '',
        loopTimes: {
          value: 1,
          custom: ''
        },
        restTime: {
          value: 5,
          custom: ''
        },
        hideAfterComplete: false
      },
      todoGoal: {
        name: '',
        type: 'goal',
        timeWay: '倒计时',
        timeDuration: 25,
        goal: {
          deadline: new Date(2019, 9, 2),
          total: 10,
          complete: 0
        },
        taskNotes: '',
        loopTimes: {
          value: 1,
          custom: ''
        },
        restTime: {
          value: 5,
          custom: ''
        },
        hideAfterComplete: false
      },
      todoHabit: {
        name: '',
        type: 'habit',
        timeWay: '倒计时',
        timeDuration: 25,
        habit: {
          frequency: 1,
          piece: 10,
          complete: 0
        },
        taskNotes: '',
        loopTimes: {
          value: 1,
          custom: ''
        },
        restTime: {
          value: 5,
          custom: ''
        },
        hideAfterComplete: false
      },
      type2text: {}
    },
    todoSets: [
      {
        name: '1',
        background: '#0000FF',
        todos: [
          {
            name: '目标',
            type: 'goal',
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
            name: '普通',
            type: 'common',
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
            name: '普通2',
            type: 'common',
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
            name: '普通3',
            type: 'common',
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
          }
        ]
      },
      {
        name: '2',
        background: '#CCFFFF',
        todos: [
          {
            name: '普通',
            type: 'common',
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
            name: '普通2',
            type: 'common',
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
            name: '普通3',
            type: 'common',
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
          }
        ]
      }
    ]
  },
  getters: {},
  mutations: {
    addToDo (state, todo) {
      state.todos.push(todo)
    },
    setToDos (state, todos) {
      state.todos = todos
    },
    addToDoSet (state, set) {
      state.todoSets.push(set)
    }
  },
  actions: {}
})
