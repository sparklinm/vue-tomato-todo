import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import 'normalize.css'
import 'font-awesome/css/font-awesome.css'
import '@/styles/index.less'
import MyPlugins from './components/plugins'
import VueI18n from 'vue-i18n'
import ECharts from 'vue-echarts'
import 'echarts'
import roma from './roma'


ECharts.registerTheme('roma', roma.theme)

// 自动化全局注册common目录下的组件
const requireComponent = require.context('./components/common', true, /\.vue$/)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  // 剥路径`/xx`和文件类型`.xx`
  const componentName = fileName.split('/').pop().replace(/\.\w+$/, '')
  // 全局注册组件
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})


Vue.use(MyPlugins)
Vue.use(VueI18n)
Vue.component('v-chart', ECharts)


const i18n = new VueI18n({
  locale: 'zh', // 语言标识
  messages: {
    'zh': require('./assets/lang/zh')
  }
})

Vue.config.productionTip = false


new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')