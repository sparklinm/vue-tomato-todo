import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'
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
      component: Main,
      children: [
        {
          path: '',
          component: Todo,
          meta: {
            parent: true
          }
        },
        {
          path: '/set',
          component: TodoSet,
          meta: {
            parent: true
          }
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

    },
    {
      name: 'do',
      path: '/do/:id',
      component: DoTodo,
      meta: {
        child: true
      }
    },
    {
      path: '/statistics/:id',
      component: StatisticsOne,
      meta: {
        child: true
      }
    },
    {
      path: '/time_axis/:id',
      component: TimeAxisOne,
      meta: {
        child: true
      }
    }
  ]
})

export default router


