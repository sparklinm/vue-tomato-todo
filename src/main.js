import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import 'font-awesome/css/font-awesome.css'
import '@/styles/index.less'

import MyPlugins from './components/plugins'
Vue.use(MyPlugins)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
