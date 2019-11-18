import Vue from 'vue'
import Router from 'vue-router'
import ToDo from './views/ToDo.vue'
import ToDoSet from './views/ToDoSet.vue'
import doToDo from './views/doToDo.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: ToDo
    },
    {
      path: '/set',
      component: ToDoSet
    },
    {
      path: '/do',
      component: doToDo
    }
  ]
})


