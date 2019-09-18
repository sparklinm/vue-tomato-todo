import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos: [],
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
