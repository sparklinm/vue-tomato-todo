export default {
  namespaced: true,
  state: {
    todos: [
      {
        id: 0,
        name: '普通',
        type: 'common',
        timeWay: '倒计时',
        taskNotes: '普通普通普通',
        timeDuration: 25,
        loopTimes: {
          default: 1,
          custom: ''
        },
        restTime: {
          default: 5,
          custom: ''
        },
        hideAfterComplete: false,
        create: new Date(2019, 8, 24),
        focus: [
          {
            id: 0,
            start: new Date(new Date().getTime() - 20 * 60 * 1000),
            end: new Date(),
            status: 'completed',
            experience: '非常好',
            duration: 20
          },
          {
            id: 1,
            start: new Date(2020, 0, 2, 10, 20),
            end: new Date(2020, 0, 2, 10, 45),
            status: 'stopped',
            experience: '等待下一次',
            reason: '临时有事',
            duration: 25
          }
        ],
        reminders: [
          {
            time: '17:33',
            day: '每天'
          }
        ]
      },
      {
        id: 1,
        name: '目标3',
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
        loopTimes: {
          default: 1,
          custom: ''
        },
        restTime: {
          default: 5,
          custom: ''
        },
        hideAfterComplete: false,
        create: new Date(2019, 8, 24),
        focus: [
          {
            id: 3,
            start: new Date(2020, 0, 2, 4, 30),
            end: new Date(2020, 0, 2, 5, 30),
            status: 'completed',
            experience: '心得3',
            duration: 30
          },
          {
            id: 4,
            start: new Date(2020, 0, 2, 4, 30),
            end: new Date(2020, 0, 2, 5, 30),
            status: 'stopped',
            experience: '心得4',
            reason: '临时有事',
            duration: 10
          }
        ],
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
        id: 2,
        name: '普通5',
        type: 'common',
        timeWay: '正向计时',
        taskNotes: '普通普通普通',
        loopTimes: {
          default: 1,
          custom: ''
        },
        restTime: {
          default: 5,
          custom: ''
        },
        hideAfterComplete: false,
        create: new Date(2019, 8, 24),
        focus: [
          {
            id: 5,
            start: new Date(2019, 11, 20, 4, 30),
            end: new Date(2019, 11, 20, 6, 21),
            status: 'completed',
            experience: '心得5',
            duration: 12
          },
          {
            id: 6,
            start: new Date(2019, 11, 26, 10, 30),
            end: new Date(2019, 11, 26, 11, 21),
            status: 'stopped',
            experience: '心得6',
            reason: '临时有事',
            duration: 23
          }
        ],
        reminders: [
          {
            time: '17:33',
            day: '每天'
          }
        ]
      },
      {
        id: 3,
        name: '习惯',
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
        create: new Date(2019, 10, 24),
        focus: [
          {
            id: 7,
            start: new Date(2019, 11, 28, 16, 30),
            end: new Date(2019, 11, 20, 17, 21),
            status: 'completed',
            experience: '心得7',
            duration: 68
          },
          {
            id: 8,
            start: new Date(new Date().getTime() + 20 * 60 * 1000),
            end: new Date(new Date().getTime() + 50 * 60 * 1000),
            status: 'stopped',
            experience: '心得8',
            reason: '临时有事',
            duration: 26
          }
        ],
        hideAfterComplete: false
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
        resetTimeSingle: '',
        resetTimeAll: '',
        continuousExcute: true,
        todos: []
      },
      {
        name: '2',
        background: '#CCFFFF',
        resetTimeSingle: '',
        resetTimeAll: '',
        continuousExcute: true,
        todos: []
      }
    ],
    target: {
      name: '目标2',
      type: 'goal',
      timeWay: 'down',
      timeDuration: 10,
      goal: {
        deadline: new Date(2019, 8, 28),
        total: 360,
        complete: 100,
        customUnit: '页'
      },
      taskNotes: '目标目标目标',
      loopTimes: {
        default: 1,
        custom: 10
      },
      restTime: {
        default: 5,
        custom: 5,
        long: 60
      },
      hideAfterComplete: false,
      create: new Date(2019, 8, 24),
      focus: [
        {
          time: new Date(),
          duration: 30
        }
      ],
      reminders: [
        {
          time: '17:33',
          day: '每天'
        }
      ],
      stickDays: {
        total: 2,
        continuation: 2
      },
      abandons: []
    }
  },
  getters: {},
  mutations: {
    addTodo (state, todo) {
      state.todos.push(todo)
    },
    setTodos (state, todos) {
      state.todos = todos
    },
    addTodoSet (state, set) {
      state.todoSets.push(set)
    },
    modifyTodoSet (state, { set, index }) {
      state.todoSets[index] = set
    },
    modifyTarget (state, obj) {
      for (const [key, value] of Object.entries(obj)) {
        state.target[key] = value
      }
    },
    editFocus (state, obj) {
      state.todos.some(todo => {
        return todo.focus.some(item => {
          if (item.id === obj.id) {
            Object.assign(item, obj)
            return true
          }
        })
      })
    },
    deleteFocus (state, id) {
      state.todos.some(todo => {
        return todo.focus.some((item, index) => {
          if (item.id === id) {
            todo.focus.splice(index, 1)
            return true
          }
        })
      })
      console.log(state.todos)
    }
  },
  actions: {}
}