<script>
import Vue from 'vue'

export default {
  props: {
    content: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
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
        this.creatContent()
      } else {
        this.removeContent()
      }
      this.$emit('update:show', val)
    }
  },
  mounted () {
    this.$el.addEventListener('click', () => {
      this.curShow = true
    })
    if (this.curShow) {
      this.creatContent()
    }
  },
  methods: {
    creatContent () {
    // 创建content组件
      const Content = Vue.extend({
        render: (createElement) => {
          return createElement(
            'div',
            {
              style: {
                position: 'absolute'
              },
              props: {
                show: {
                  type: Object,
                  default: false
                }
              }
            },
            this.$slots.content
          )
        }
      })

      this.tipContent = new Content()
      // 创建父容器com-tooltip，fixed定位且全屏
      this.container = document.createElement('div')
      this.container.className = 'com-tooltip'
      this.container.style.zIndex = 5000
      // content组件挂载元素
      this.container.innerHTML = '<div id="com-tooltip-content"></div>'
      // 点击父容器时，关闭content
      this.container.addEventListener('click', e => {
        if (e.target.className.includes('com-tooltip')) {
          this.curShow = false
        }
      })
      document.body.appendChild(this.container)
      // 挂载
      this.tipContent.$mount('#com-tooltip-content')
      // 动画效果
      this.tipContent.$el.classList.add('com-tooltip__content_ani-in')
      this.tipContent.$el.addEventListener('animationend', () => {
        this.tipContent.$el.classList.remove('com-tooltip__content_ani-in')
      })
      this.setPosition(this.tipContent.$el, this.$el)
    },
    setPosition (element, target) {
      const targetRect = target.getBoundingClientRect()

      element.style.left =
          targetRect.left + (targetRect.width - element.clientWidth) / 2 + 'px'
      element.style.top = targetRect.bottom + 'px'
    },
    removeContent () {
      this.tipContent.$el.classList.add('com-tooltip__content_ani-out')
      this.tipContent.$el.addEventListener('animationend', () => {
        document.body.removeChild(this.container)
      })
    }
  },

  render () {
    return this.$slots.default && this.$slots.default[0] || this.$el
  }
}
</script>

<style lang="less">
.com-tooltip {
  .fixed-full-screen();
  background-color: transparent;
  font-size: 10px;
  transition: all;
}

.com-tooltip__content_ani-in {
  animation: fade 0.15s ease-out;
}

.com-tooltip__content_ani-out {
  animation: fade 0.15s ease-out reverse;
}
</style>
