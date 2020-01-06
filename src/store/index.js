import Vue from 'vue'
import Vuex from 'vuex'
import todo from './modules/todo'
import user from './modules/user'
import settings from './modules/settings'
import plan from './modules/plan'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    todo,
    user,
    settings,
    plan
  }
})