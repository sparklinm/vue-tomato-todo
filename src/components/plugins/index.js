import creatTipsPlugin from './tips'
import creatMessagePlugin from './message'
const MyPlugins = {
  install (Vue, options) {
    creatTipsPlugin(Vue, options)
    creatMessagePlugin(Vue, options)
  }
}
export default MyPlugins