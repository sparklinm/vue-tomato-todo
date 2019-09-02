import Vue from 'vue'
import Router from 'vue-router'
import ToDo from './views/ToDo.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: ToDo
    }
  ]
})


