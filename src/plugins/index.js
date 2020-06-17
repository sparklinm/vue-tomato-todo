import creatTipsPlugin from './tips'
import creatMessagePlugin from './message'
import creatMaskPlugin from './mask'
import creatLoadingPlugin from './loading'


const MyPlugins = {
  install (Vue, options) {
    creatTipsPlugin(Vue, options)
    creatMessagePlugin(Vue, options)
    creatMaskPlugin(Vue, options)
    creatLoadingPlugin(Vue, options)
  }
}

export default MyPlugins
