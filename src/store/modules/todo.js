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
        name: '运动半小时-普通',
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
        name: '看书100页-目标',
        type: 'goal',
        timeWay: 'down',
        timeDuration: 25,
        goal: {
          deadline: new Date(2019, 9, 28),
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
        create: new Date(2019, 10, 24),
        background: '/card/back1.jpg',
        color: '#996699'
      },
      {
        id: 2,
        name: '听力20分钟-普通',
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
        create: new Date(2019, 11, 24),
        background: '/card/back6.jpg',
        color: '#333366'
      },
      {
        id: 3,
        name: '每天学习3小时-习惯',
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
        create: new Date(2019, 12, 24),
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
        // 今日
        start: new Date(new Date().getTime() - 20 * 60 * 1000),
        end: new Date(),
        status: 'completed',
        experience: '心得1',
        duration: 20
      },
      {
        id: 1,
        tid: 0,
        // 一天前
        start: new Date(new Date().getTime() - 25 * 60 * 60 * 1000),
        end: new Date(new Date().getTime() - 24.5 * 60 * 60 * 1000),
        status: 'stopped',
        reason: '来客人了',
        duration: 25
      },
      {
        id: 3,
        tid: 1,
        // 2天前
        start: new Date(new Date().getTime() - 52 * 60 * 60 * 1000),
        end: new Date(new Date().getTime() - 51.3 * 60 * 60 * 1000),
        status: 'completed',
        experience: '心得2',
        duration: 30
      },
      {
        id: 4,
        tid: 1,
        // 一周前
        start: new Date(new Date().getTime() - 7.3 * 24 * 60 * 60 * 1000),
        end: new Date(new Date().getTime() - 7.2 * 24 * 60 * 60 * 1000),
        status: 'stopped',
        reason: '同学叫帮忙',
        duration: 10
      },
      {
        id: 5,
        tid: 2,
        // 一周前
        start: new Date(new Date().getTime() - 7.5 * 24 * 60 * 60 * 1000),
        end: new Date(new Date().getTime() - 7.45 * 24 * 60 * 60 * 1000),
        status: 'completed',
        experience: '心得5',
        duration: 12
      },
      {
        id: 6,
        tid: 2,
        // 一月前
        start: new Date(new Date().getTime() - 32 * 24 * 60 * 60 * 1000),
        end: new Date(new Date().getTime() - 32.1 * 24 * 60 * 60 * 1000),
        status: 'stopped',
        reason: '想偷懒，休息一会',
        duration: 23
      },
      {
        id: 7,
        tid: 3,
        // 一月前
        start: new Date(new Date().getTime() - 32.4 * 24 * 60 * 60 * 1000),
        end: new Date(new Date().getTime() - 32.35 * 24 * 60 * 60 * 1000),
        status: 'completed',
        experience: '心得7',
        duration: 68
      },
      {
        id: 8,
        tid: 3,
        // 今天
        start: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
        end: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
        status: 'stopped',
        experience: '心得8',
        reason: '没心思了，听会歌',
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