import Vue from 'vue'
import Router from 'vue-router'
import Todo from './views/Todo.vue'
import TodoSet from './views/TodoSet.vue'
import DoTodo from './views/DoTodo.vue'
import Statistics from './views/Statistics.vue'
import StatisticsOne from './views/StatisticsOne.vue'
import TimeAxis from './views/TimeAxis.vue'
import TimeAxisOne from './views/TimeAxisOne.vue'
import FuturePlan from './views/FuturePlan.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Todo,
      meta: {
        parent: true
      }
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
      path: '/statistics/:id',
      component: StatisticsOne,
      meta: {
        child: true
      }
    },
    {
      path: '/time_axis',
      component: TimeAxis
    },
    {
      path: '/time_axis/:id',
      component: TimeAxisOne,
      meta: {
        child: true
      }
    },
    {
      path: '/future_plan',
      component: FuturePlan
    }
  ]
})

export default router


