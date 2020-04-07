import creatTipsPlugin from './tips'
import creatMessagePlugin from './message'
import creatMaskPlugin from './mask'
import creatLoadingPlugin from './loading'
import ToolTip from '../common/ComToolTip.vue'

function creatToolTip (Vue, options) {
  Vue.prototype.$toolTip = function (el) {
    const ToolTipComponent = Vue.extend(ToolTip)
    const instance = new ToolTipComponent()

    instance.$mount(el)
  }
}
const MyPlugins = {
  install (Vue, options) {
    creatTipsPlugin(Vue, options)
    creatMessagePlugin(Vue, options)
    creatMaskPlugin(Vue, options)
    creatToolTip(Vue, options)
    creatLoadingPlugin(Vue, options)




    // Vue.directive('focus', {
    //   update (el) {
    //     console.log('up')

    //     function doFocus (el) {
    //       if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    //         console.log(el.tagName)
    //         el.focus()
    //       } else {
    //         for (let i = 0; i < el.children.length; i++) {
    //           doFocus(el.children[i])
    //         }
    //       }
    //     }
    //     doFocus(el)
    //   },
    //   componentUpdated (el, binding, vnode, oldVnode) {
    //     console.log('upd')
    //     console.log(binding)
    //     console.log(vnode)
    //     console.log(oldVnode)

    //     function doFocus (el) {
    //       if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    //         console.log(el.tagName)
    //         el.focus()
    //       } else {
    //         for (let i = 0; i < el.children.length; i++) {
    //           doFocus(el.children[i])
    //         }
    //       }
    //     }
    //     doFocus(el)
    //   },
    //   inserted (el) {
    //     console.log('inserted')

    //     function doFocus (el) {
    //       if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    //         console.log(el.tagName)

    //         el.focus()
    //       } else {
    //         for (let i = 0; i < el.children.length; i++) {
    //           doFocus(el.children[i])
    //         }
    //       }
    //     }
    //     doFocus(el)
    //   }
    // })

    Vue.directive('marquee', {
      // 当被绑定的元素插入到 DOM 中时……
      inserted: function (el, binding) {
        const opt = binding.value || {}
        const visibleWidth = opt.width || el.parentNode.offsetWidth || 200
        const gapWidth = opt.gap || visibleWidth / 3
        const width = el.offsetWidth
        const maxTranslateX = -(width + gapWidth)

        if (width <= visibleWidth) {
          return
        }

        const container = document.createElement('div')
        const div1 = document.createElement('div')
        const div2 = document.createElement('div')
        const copy1 = el.cloneNode(true)
        const copy2 = el.cloneNode(true)

        div1.appendChild(copy1)
        div2.appendChild(copy2)
        container.appendChild(div1)
        container.appendChild(div2)

        el.removeChild(...el.childNodes)
        el.appendChild(container)

        Object.assign(div1.style, {
          display: 'inline-block',
          marginRight: gapWidth + 'px'
        })
        Object.assign(div2.style, {
          display: 'inline-block'
        })
        Object.assign(container.style, {
          display: 'inline-block'
        })
        Object.assign(el.style, {
          display: 'inline-block',
          overflow: 'hidden',
          width: visibleWidth + 'px'
        })

        const piece = 1
        let translateX = piece

        function marquee () {
          translateX -= piece
          let timeout = 25

          if (translateX > maxTranslateX && translateX < 0) {
            container.style.transform = `translateX(${translateX}px)`
          } else if (translateX === 0) {
            container.style.transform = `translateX(${translateX}px)`
            timeout = 300
          } else {
            container.style.transform = `translateX(${maxTranslateX}px)`
            translateX = piece
          }
          setTimeout(() => {
            marquee()
          }, timeout)
        }

        marquee()
      }
    })
  }
}

export default MyPlugins