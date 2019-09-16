import creatTipsPlugin from './tips'
import creatMessagePlugin from './message'
const MyPlugins = {
  install (Vue, options) {
    creatTipsPlugin(Vue, options)
    creatMessagePlugin(Vue, options)



    Vue.directive('focus', {
      update (el) {
        console.log('up')

        function doFocus (el) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            console.log(el.tagName)
            el.focus()
          } else {
            for (let i = 0; i < el.children.length; i++) {
              doFocus(el.children[i])
            }
          }
        }
        doFocus(el)
      },
      componentUpdated (el, binding, vnode, oldVnode) {
        console.log('upd')
        console.log(binding)
        console.log(vnode)
        console.log(oldVnode)

        function doFocus (el) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            console.log(el.tagName)
            el.focus()
          } else {
            for (let i = 0; i < el.children.length; i++) {
              doFocus(el.children[i])
            }
          }
        }
        doFocus(el)
      },
      inserted (el) {
        console.log('inserted')

        function doFocus (el) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            console.log(el.tagName)

            el.focus()
          } else {
            for (let i = 0; i < el.children.length; i++) {
              doFocus(el.children[i])
            }
          }
        }
        doFocus(el)
      }
    })
  }
}
export default MyPlugins