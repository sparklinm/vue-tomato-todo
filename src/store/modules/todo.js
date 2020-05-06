import { randomSeed } from '@/js/setting.js'
import config from '@/config.js'

export default {
  namespaced: true,
  state: {
    isGetTodos: false,
    showBoxSortTodo: false,
    showBoxSortSet: false,
    todos: [
      {
        id: 0,
        sid: 0,
        name: '普通',
        type: 'common',
        timeWay: 'down',
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
        background: '/card/back5.jpg',
        color: '#0099CC'
      },
      {
        id: 1,
        name: '目标3',
        type: 'goal',
        timeWay: 'down',
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
          custom: 2
        },
        restTime: {
          default: 5,
          custom: ''
        },
        hideAfterComplete: false,
        create: new Date(2019, 8, 24),
        background: '/card/back1.jpg',
        color: '#996699'
      },
      {
        id: 2,
        name: '普通5',
        type: 'common',
        timeWay: 'up',
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
        background: '/card/back6.jpg',
        color: '#333366'
      },
      {
        id: 3,
        name: '习惯',
        type: 'habit',
        timeWay: 'down',
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
        hideAfterComplete: false,
        background: '/card/back8.jpg',
        color: '#CC9966'
      }
    ],
    reminders: [
      {
        id: 0,
        tid: 0,
        time: '17:33',
        days: [1, 2, 3, 4, 5]
      },
      {
        id: 1,
        tid: 0,
        time: '17:55',
        days: [1, 2, 3, 4, 5, 6, 7]
      },
      {
        id: 3,
        tid: 1,
        time: '17:33',
        days: [1, 2, 3, 4, 5]
      },
      {
        id: 4,
        tid: 2,
        time: '17:33',
        days: [1, 2, 3, 4, 5, 6, 7]
      },
      {
        id: 5,
        tid: 3,
        time: '8:33',
        days: [1, 2, 6, 7]
      }
    ],
    focus: [
      {
        id: 0,
        tid: 0,
        start: new Date(new Date().getTime() - 20 * 60 * 1000),
        end: new Date(),
        status: 'completed',
        experience: '非常好',
        duration: 20
      },
      {
        id: 1,
        tid: 0,
        start: new Date(2020, 0, 2, 10, 20),
        end: new Date(2020, 0, 2, 10, 45),
        status: 'stopped',
        experience: '等待下一次',
        reason: '临时有事',
        duration: 25
      },
      {
        id: 3,
        tid: 1,
        start: new Date(2020, 0, 2, 4, 30),
        end: new Date(2020, 0, 2, 5, 30),
        status: 'completed',
        experience: '心得3',
        duration: 30
      },
      {
        id: 4,
        tid: 1,
        start: new Date(2020, 0, 2, 4, 30),
        end: new Date(2020, 0, 2, 5, 30),
        status: 'stopped',
        experience: '心得4',
        reason: '临时有事',
        duration: 10
      },
      {
        id: 5,
        tid: 2,
        start: new Date(2019, 11, 20, 4, 30),
        end: new Date(2019, 11, 20, 6, 21),
        status: 'completed',
        experience: '心得5',
        duration: 12
      },
      {
        id: 6,
        tid: 2,
        start: new Date(2019, 11, 26, 10, 30),
        end: new Date(2019, 11, 26, 11, 21),
        status: 'stopped',
        experience: '心得6',
        reason: '临时有事',
        duration: 23
      },
      {
        id: 7,
        tid: 3,
        start: new Date(2019, 11, 28, 16, 30),
        end: new Date(2019, 11, 20, 17, 21),
        status: 'completed',
        experience: '心得7',
        duration: 68
      },
      {
        id: 8,
        tid: 3,
        start: new Date(new Date().getTime() + 20 * 60 * 1000),
        end: new Date(new Date().getTime() + 50 * 60 * 1000),
        status: 'stopped',
        experience: '心得8',
        reason: '临时有事',
        duration: 26
      }
    ],
    template: {
      todoCommon: {
        name: '',
        type: 'common',
        timeWay: 'down',
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
        timeWay: 'down',
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
        timeWay: 'down',
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
      id: 0,
      sid: 0,
      name: '普通',
      type: 'common',
      timeWay: 'down',
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
      background: '/card/back5.jpg'
    }
  },
  getters: {
    getAllTodos (state) {
      const todos = state.todos
      const focus = state.focus
      const reminders = state.reminders
      const focusObj = {}
      const remindersObj = {}

      focus.forEach(item => {
        focusObj[item.tid] = focusObj[item.tid] || []
        focusObj[item.tid].push(item)
      })
      reminders.forEach(item => {
        remindersObj[item.tid] = remindersObj[item.tid] || []
        remindersObj[item.tid].push(item)
      })
      return todos.map(todo => {
        return {
          ...todo,
          focus: focusObj[todo.id] || [],
          reminders: remindersObj[todo.id] || []
        }
      })
    },
    getTodoById: (state, getters) => (id) => {
      return getters.getAllTodos.find(todo => todo.id === id) || {}
    },
    getTodosNormal (state, getters) {
      const data = []

      getters.getAllTodos.forEach(todo => {
        if (!(todo.sid >= 0)) {
          data.push(todo)
        }
      })
      return data
    },
    getTodosBySet: (state, getters) => (sid) => {
      const data = []

      state.todoSets.some((set) => {
        if (set.id === sid) {
          getters.getAllTodos.forEach(todo => {
            if (todo.sid === set.id) {
              data.push(todo)
            }
          })
          return true
        }
      })
      return data
    }
  },
  mutations: {
    setIsGetTodos (state, isGet) {
      state.isGetTodos = isGet
    },
    setShowBoxSortTodo (state, show) {
      state.showBoxSortTodo = show
    },
    setShowBoxSortSet (state, show) {
      state.showBoxSortSet = show
    },
    addTodo (state, todo) {
      const obj = {
        id: state.todos[state.todos.length - 1].id + 1,
        ...todo
      }
      const imgs = state.todos.map((todo) => {
        return parseInt(todo.background.match(/\d+/g)[0])
      })
      const upper = 7
      const lower = 0
      let seed = null

      if (upper - lower + 1 <= imgs.length) {
        seed = new randomSeed(lower, upper)
      } else {
        seed = new randomSeed(lower, upper, imgs)
      }
      obj.background = `/card/back${seed.do()}.jpg`
      obj.color = config.colors[state.todos.length % config.colors.length].darken20
      state.todos.push(obj)
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
      state.todos.some(todo => {
        if (todo.id === obj.tid) {
          todo.sid = obj.sid
          return true
        }
      })
      state.todos = Object.assign([], state.todos)
    },
    modifyTodoSet (state, { set, index }) {
      state.todoSets[index] = set
    },
    setTodoSets (state, sets) {
      state.todoSets = sets
    },
    setTarget (state, id) {
      state.target = state.todos.find(todo => todo.id === id)
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
        if (todo.timeWay === 'up') {
          delete todo.loopTimes
          delete todo.timeDuration
        } else if (todo.timeWay === 'none') {
          delete todo.loopTimes
          delete todo.restTime
          delete todo.timeDuration
        }
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
    addFocus (state, obj) {
      state.focus.push({
        id: state.focus[state.focus.length - 1].id + 1,
        ...obj
      })
    },
    editFocus (state, obj) {
      state.focus.some(item => {
        if (item.id === obj.id) {
          Object.assign(item, obj)
          return true
        }
      })
    },
    deleteFocus (state, id) {
      state.focus.some((item, index) => {
        if (item.id === id) {
          state.focus.splice(index, 1)
          return true
        }
      })
    },
    addReminder (state, data) {
      state.reminders.push({
        id: state.reminders[state.reminders.length - 1].id + 1,
        ...data
      })
    },
    editReminder (state, data) {
      state.reminders.some(item => {
        if (item.id === data.id) {
          Object.assign(item, data)
          return true
        }
      })
    },
    deleteReminder (state, id) {
      state.reminders.some((item, index) => {
        if (item.id === id) {
          state.reminders.splice(index, 1)
          return true
        }
      })
    }
  },
  actions: {}
}