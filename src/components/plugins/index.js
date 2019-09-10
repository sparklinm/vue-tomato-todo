import creatAlertPlugin from './alert'
import creatMessagePlugin from './message'
const MyPlugins = {
  install (Vue, options) {
    creatAlertPlugin(Vue, options)
    creatMessagePlugin(Vue, options)
  }
}
export default MyPlugins