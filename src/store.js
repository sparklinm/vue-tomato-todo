import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos: [],
    todoSet: [],
    showBoxAddToDo: true

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
