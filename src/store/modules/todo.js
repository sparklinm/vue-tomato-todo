export default {
  namespaced: true,
  state: {
    todos: [
      {
        name: '普通',
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
            time: new Date(2019, 8, 24),
            duration: 30
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
        name: '普通2',
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
            time: new Date(),
            duration: 30
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
        name: '普通3',
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
            time: new Date(2019, 8, 24),
            duration: 30
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
        name: '普通4',
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
            time: new Date(),
            duration: 30
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
        loopTimes: {
          default: 1,
          custom: 10
        },
        restTime: {
          default: 5,
          custom: 30
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
        loopTimes: {
          default: 1,
          custom: 5
        },
        restTime: {
          default: 5,
          custom: 20
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
        resetTimeSingle: '',
        resetTimeAll: '',
        continuousExcute: true,
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
            }
          },
          {
            name: '普通',
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
                time: new Date(),
                duration: 30
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
            name: '普通2',
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
                time: new Date(),
                duration: 30
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
            name: '普通3',
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
                time: new Date(),
                duration: 30
              }
            ],
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
        resetTimeSingle: '',
        resetTimeAll: '',
        continuousExcute: true,
        todos: [
          {
            name: '普通',
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
                time: new Date(),
                duration: 30
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
            name: '普通2',
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
                time: new Date(),
                duration: 30
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
            name: '普通3',
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
                time: new Date(),
                duration: 30
              }
            ],
            reminders: [
              {
                time: '17:33',
                day: '每天'
              }
            ]
          }
        ]
      }
    ],
    target: {
      name: '目标',
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
    }
  },
  actions: {}
}
