export default {
  namespaced: true,
  state: {
    plans: [
      {
        id: 0,
        name: '考研考研考研考研考研考研考研考研考研考研考研考研考研',
        description: '考上心仪的大学',
        creat: new Date(2019, 11, 21),
        deadline: new Date(2020, 10, 21),
        completed: false
      },
      {
        id: 1,
        name: '运动',
        description: '每天运动一小时',
        creat: new Date(2019, 11, 21),
        deadline: new Date(2020, 0, 21),
        completed: false
      }
    ]
  },
  getters: {},
  mutations: {
    addPlan (state, plan) {
      state.plans.push(plan)
    },
    deletePlan (state, id) {
      const index = state.plans.findIndex(item => item.id === id)

      state.plans.splice(index, 1)
    },
    editPlan (state, obj) {
      const plan = state.plans.find(item => item.id === obj.id)

      Object.assign(plan, obj)
    }

  },
  actions: {}
}