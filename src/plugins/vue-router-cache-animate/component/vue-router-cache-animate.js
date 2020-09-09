import { findRouter } from '../util'

const canAnimate = function (fromNames, fromRouter, toNames, toRouter) {
  return (
    fromNames.some((name) => {
      return findRouter(name, fromRouter)
    }) &&
    toNames.some((name) => {
      return findRouter(name, toRouter)
    })
  )
}

const instances = new Set()

export default {
  props: {
    caches: {
      type: [Array, String],
      default: () => [
        {
          // 路由name和路由组件的name
          names: {
            include: undefined,
            exclude: undefined
          },
          // 在哪些路由上被缓存
          cachedOn: {
            include: undefined,
            exclude: undefined
          }
        }
      ]
    },
    // 返回时不缓存（history.back()，浏览器后退）
    noCacheOnBack: {
      type: Boolean,
      default: true
    },
    transitions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      include: undefined,
      exclude: [],
      transitionName: '',
      css: false
    }
  },
  watch: {
    $route (to, from) {
      this.transitions.some((transition) => {
        if (canAnimate(transition.from, from, transition.to, to)) {
          this.transitionName = transition.name
          this.css = true
          return true
        }
        if (canAnimate(transition.from, to, transition.to, from)) {
          this.transitionName = transition.reverseName
          this.css = true
          return true
        }
        this.transitionName = ''
        this.css = false
      })
    }
  },
  created () {
    instances.add(this)
  },
  destroyed () {
    instances.delete(this)
  },
  render (h) {
    const vNode = this.$slots.default && this.$slots.default[0]

    return h(
      'transition',
      {
        props: {
          ...this.$attrs,
          name: this.transitionName,
          css: this.css
        },
        on: this.$listeners
      },
      [
        h(
          'keep-alive',
          {
            props: {
              include: this.include,
              exclude: this.exclude
            }
          },
          [vNode]
        )
      ]
    )
  }
}

export { instances }
