import Vue from 'vue'
import Router from 'vue-router'
const Main = () => import('./views/Main.vue')
const Todo = () => import('./views/Todo.vue')
const TodoSet = () => import('./views/TodoSet.vue')
const DoTodo = () => import('./views/DoTodo.vue')
const Statistics = () => import('./views/Statistics.vue')
const StatisticsOne = () => import('./views/StatisticsOne.vue')
const TimeAxis = () => import('./views/TimeAxis.vue')
const TimeAxisOne = () => import('./views/TimeAxisOne.vue')
const FuturePlan = () => import('./views/FuturePlan.vue')
const Setting = () => import('./views/Setting.vue')
const PomodoroSetting = () => import('./views/PomodoroSetting.vue')
const CustomMotto = () => import('./views/CustomMotto.vue')
const AppearanceSetting = () => import('./views/AppearanceSetting.vue')
const OtherSettings = () => import('./views/OtherSettings.vue')
const Login = () => import('./views/Login.vue')
const Me = () => import('./views/Me.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Main,
      name: 'Main',
      children: [
        {
          path: '',
          component: Todo,
          name: 'Todo',
          meta: {
            parent: true,
            keepAlive: true
          }
        },
        {
          path: '/set',
          component: TodoSet,
          name: 'TodoSet',
          meta: {
            parent: true,
            keepAlive: true
          }
        },
        {
          path: '/statistics',
          component: Statistics,
          name: 'Statistics',
          meta: {
            parent: true
          }
        },
        {
          path: '/time_axis',
          component: TimeAxis,
          name: 'TimeAxis',
          meta: {
            parent: true
          }
        },
        {
          path: '/future_plan',
          component: FuturePlan,
          name: 'FuturePlan',
          meta: {
            parent: true
          }
        },
        {
          path: '/me',
          component: Setting,
          name: 'Settings',
          meta: {
            parent: true
          }
        }
      ]

    },
    {
      name: 'DoTodo',
      path: '/do/:id',
      component: DoTodo,
      meta: {
        child: true
      }
    },
    {
      path: '/statistics/:id',
      component: StatisticsOne,
      name: 'StatisticsOne',
      meta: {
        child: true,
        keepAlive: true
      }
    },
    {
      path: '/time_axis/:id',
      component: TimeAxisOne,
      name: 'TimeAxisOne',
      meta: {
        child: true,
        keepAlive: true
      }
    },
    {
      path: '/pomodoro_setting',
      component: PomodoroSetting,
      name: 'PomodoroSetting',
      meta: {
        parent: true,
        child: true
      }
    },
    {
      path: '/custom_motto',
      name: 'CustomMotto',
      component: CustomMotto,
      meta: {
        child: true
      }
    },
    {
      path: '/appearance_setting',
      name: 'AppearanceSetting',
      component: AppearanceSetting,
      meta: {
        child: true
      }
    },
    {
      path: '/other_setting',
      name: 'OtherSettings',
      component: OtherSettings,
      meta: {
        child: true
      }
    },
    {
      path: '/login',
      component: Login,
      name: 'Login',
      meta: {
        child: true
      }
    },
    {
      path: '/modify_me',
      component: Me,
      name: 'Me',
      meta: {
        child: true
      }
    }
  ],
  mode: 'history'
})

export default router


