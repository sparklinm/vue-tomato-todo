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
    const vNode = this.$slots.default[0]
    console.log(vNode)
    console.log(this.$slots.content)

    this.$el.addEventListener('click', () => {
      const Content = Vue.extend({
        render: () => this.$slots.content
      })
      const content = new Content()
      const container = document.createElement('div')
      container.className = 'com-tooltip'
      container.style.zIndex = 5000
      container.innerHTML = '<div id="com-tooltip-content"></div>'
      container.addEventListener('click', e => {
        if (e.target.className.includes('com-tooltip')) {
          content.$el.classList.add('com-tooltip__content_ani-out')
          content.$el.addEventListener('animationend', () => {
            document.body.removeChild(container)
          })
        }
      })
      document.body.appendChild(container)
      content.$mount('#com-tooltip-content')
      content.$el.classList.add('com-tooltip__content_ani-in')
      content.$el.addEventListener('animationend', () => {
        content.$el.classList.remove('com-tooltip__content_ani-in')
      })
      this.setPosition(content.$el, this.$el)
    })
  },
  methods: {
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
