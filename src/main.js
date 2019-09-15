import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import 'font-awesome/css/font-awesome.css'
import '@/styles/index.less'

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


import MyPlugins from './components/plugins'
Vue.use(MyPlugins)


Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')