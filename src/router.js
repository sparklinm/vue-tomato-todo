import Vue from 'vue'
import Router from 'vue-router'
import Todo from './views/Todo.vue'
import TodoSet from './views/TodoSet.vue'
import DoTodo from './views/DoTodo.vue'
import Statistics from './views/Statistics.vue'
import TimeAxis from './views/TimeAxis.vue'
import FuturePlan from './views/FuturePlan.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Todo
    },
    {
      path: '/set',
      component: TodoSet
    },
    {
      path: '/do',
      component: DoTodo
    },
    {
      path: '/statistics',
      component: Statistics
    },
    {
      path: '/time_axis',
      component: TimeAxis
    },
    {
      path: '/future_plan',
      component: FuturePlan
    }
  ]
})


