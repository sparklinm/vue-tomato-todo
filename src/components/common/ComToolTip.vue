<script>
import Vue from 'vue'
import ComToolTipContent from './ComToolTipContent'

export default {
  props: {
    content: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    showOnClick: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showBtnMoveDrop: false,
      curShow: this.show,
      container: null,
      tipContent: null
    }
  },
  watch: {
    show (val) {
      this.curShow = val
    },
    curShow (val) {
      if (val) {
        // 需要添加nextTick，才能获取到$slots中的值，原因待
        this.$nextTick(() => {
          this.creatContent()
        })
      }
    }
  },
  mounted () {
    if (this.showOnClick) {
      this.$el.addEventListener('click', () => {
        this.curShow = true
        this.$emit('update:show', true)
      })
    }
    if (this.curShow) {
      this.creatContent()
    }
  },
  methods: {
    creatContent () {
      // 创建content组件
      const that = this
      // const Content = Vue.extend({
      //   props: {
      //     show: {
      //       type: Boolean,
      //       default: false
      //     }
      //   },
      //   data () {
      //     return {
      //       showContent: false
      //     }
      //   },
      //   watch: {
      //     show (val) {
      //       this.showContent = val
      //     }
      //   },
      //   mounted () {
      //     this.showContent = true
      //     this.$nextTick(() => {
      //       that.setPosition(this.$refs.content, that.$el)
      //     })
      //   },
      //   methods: {
      //     hide () {
      //       this.showContent = false
      //     },
      //     afterLeave () {
      //       this.$el.remove()
      //       that.curShow = false
      //       that.$emit('update:show', false)
      //     }
      //   },
      //   render (createElement) {
      //     const content = createElement(
      //       'div',
      //       {
      //         style: {
      //           position: 'absolute'
      //         },
      //         attrs: {
      //           id: 'com-tooltip-content'
      //         },
      //         directives: [
      //           {
      //             name: 'show',
      //             value: this.showContent
      //           }
      //         ],
      //         ref: 'content'
      //       },
      //       that.$slots.content
      //     )

      //     return createElement(
      //       'div',
      //       {
      //         class: {
      //           'com-tooltip': true
      //         },
      //         props: {
      //           show: that.curShow
      //         },
      //         on: {
      //           click: this.hide
      //         }
      //       },
      //       [
      //         createElement(
      //           'transition',
      //           {
      //             attrs: {
      //               name: 'com-tooltip-content'
      //             },
      //             on: {
      //               'after-leave': this.afterLeave
      //             }
      //           },
      //           [content]
      //         )
      //       ]
      //     )
      //   }
      // })

      const Content = Vue.extend({
        render (createElement) {
          return createElement(
            ComToolTipContent,
            {
              props: {
                // 传递 show 控制显示
                show: that.curShow,
                // 传递 ToolTip 组件本身
                component: that
              }
            },
            // 将content插槽传递给content组件
            that.$slots.content
          )
        }
      })

      const div = document.createElement('div')

      document.body.appendChild(div)
      new Content().$mount(div)
    },
    setPosition (element, target) {
      const targetRect = target.getBoundingClientRect()

      element.style.left =
        targetRect.left + (targetRect.width - element.clientWidth) / 2 + 'px'
      element.style.top = targetRect.bottom + 'px'
    }
  },

  render () {
    return (this.$slots.default && this.$slots.default[0]) || this.$el
  }
}
</script>

<style lang="less">
.com-tooltip {
  .fixed-full-screen();
  background-color: transparent;
  font-size: 12px;
  transition: all;
  z-index: 5000;
}

.com-tooltip-content-enter-active {
  animation: fade 0.15s ease-out;
}

.com-tooltip-content-leave-active {
  animation: fade 0.15s ease-out reverse;
}
</style>
