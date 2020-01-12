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
            id: 0,
            time: '17:33',
            days: [1, 2, 3, 4, 5]
          },
          {
            id: 1,
            time: '17:55',
            days: [1, 2, 3, 4, 5, 6, 7]
          }
        ],
        background: '/background/back5.jpg'
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
            id: 3,
            time: '17:33',
            days: [1, 2, 3, 4, 5]
          }
        ],
        stickDays: {
          total: 2,
          continuation: 2
        },
        background: '/background/back1.jpg'
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
            id: 4,
            time: '17:33',
            days: [1, 2, 3, 4, 5, 6, 7]
          }
        ],
        background: '/background/back6.jpg'
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
        hideAfterComplete: false,
        background: '/background/back8.jpg'
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
        id: 0,
        name: '1',
        background: '#0000FF',
        resetTimeSingle: '',
        resetTimeAll: '',
        continuousExcute: true,
        sid: 0,
        todos: [0]
      },
      {
        id: 1,
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
          days: [1, 2, 3]
        }
      ],
      stickDays: {
        total: 2,
        continuation: 2
      },
      abandons: []
    }
  },
  getters: {
    allFocus (state) {
      const data = []
      state.todos.forEach(todo => {
        if (todo.focus) {
          todo.focus.forEach(item => {
            data.push(item)
          })
        }
      })
    },
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id)
    },
    getTodosNormal (state) {
      const data = []
      state.todos.forEach(todo => {
        if (!todo.sid) {
          data.push(todo)
        }
      })
    }
  },
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
    addTodoToSet (state, obj) {
      state.todoSets.some(set => {
        if (set.id === obj.sid) {
          set.todos.push(obj.tid)
          return true
        }
      })
      console.log(state.todoSets)

    },
    modifyTodoSet (state, { set, index }) {
      state.todoSets[index] = set
    },
    modifyTarget (state, obj) {
      for (const [key, value] of Object.entries(obj)) {
        state.target[key] = value
      }
    },
    editTodo (state, obj) {
      const todo = state.todos.find(todo => todo.id === obj.id)
      if (todo) {
        _.merge(todo, obj)
      }
    },
    deleteTodo (state, id) {
      state.todos.some((todo, index) => {
        if (todo.id === id) {
          state.todos.splice(index, 1)
          return true
        }
      })
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
    },
    addReminder (state, data) {
      const todo = state.todos.find(todo => todo.id === data.tid)
      delete data.tid
      data.id = Math.floor(Math.random() * 10000)
      todo.reminders.push(data)
    },
    editReminder (state, data) {
      state.todos.some(todo => {
        return todo.reminders.some(item => {
          if (item.id === data.id) {
            Object.assign(item, data)
            return true
          }
        })
      })
    },
    deleteReminder (state, id) {
      state.todos.some(todo => {
        return todo.reminders.some((item, index) => {
          if (item.id === id) {
            todo.reminders.splice(index, 1)
            return true
          }
        })
      })
    }
  },
  actions: {}
}