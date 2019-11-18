<script>
import Vue from 'vue'
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showBtnMoveDrop: false
    }
  },
  mounted () {
    this.$el.addEventListener('click', () => {
      this.creatContent()
    })
  },
  methods: {
    creatContent () {
    // 创建content组件
      const Content = Vue.extend({
        render: () => this.$slots.content
      })
      const content = new Content()
      // 创建父容器com-tooltip，fixed定位且全屏
      const container = document.createElement('div')
      container.className = 'com-tooltip'
      container.style.zIndex = 5000
      // content组件挂载元素
      container.innerHTML = '<div id="com-tooltip-content"></div>'
      // 点击父容器时，关闭content
      container.addEventListener('click', e => {
        if (e.target.className.includes('com-tooltip')) {
          content.$el.classList.add('com-tooltip__content_ani-out')
          content.$el.addEventListener('animationend', () => {
            document.body.removeChild(container)
          })
        }
      })
      document.body.appendChild(container)
      // 挂载
      content.$mount('#com-tooltip-content')
      // 动画效果
      content.$el.classList.add('com-tooltip__content_ani-in')
      content.$el.addEventListener('animationend', () => {
        content.$el.classList.remove('com-tooltip__content_ani-in')
      })
      this.setPosition(content.$el, this.$el)
    },
    setPosition (element, target) {
      const targetRect = target.getBoundingClientRect()
      element.style.left =
          targetRect.left + (targetRect.width - element.clientWidth) / 2 + 'px'
      element.style.top = targetRect.bottom + 'px'
    }
  },
  render () {
    return this.$slots.default[0]
  }
}
</script>

<style lang="less">
.com-tooltip {
  .fixed-full-screen();
  background-color: transparent;
  font-size: 10px;
  color: white;
  transition: all;
}

.com-tooltip__content_ani-in {
  animation: fade 0.15s ease-out;
}

.com-tooltip__content_ani-out {
  animation: fade 0.15s ease-out reverse;
}
</style>
