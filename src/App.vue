<template>
  <div id="app">
    <vue-router-cache-animate
      :caches="caches"
      :transitions="transitions"
    >
      <router-view />
    </vue-router-cache-animate>
  </div>
</template>

<script>
window.addEventListener('load', () => {
  import('@/lib/echart')
})
import config from './config'
import { mapMutations, mapState, mapGetters } from 'vuex'
import { log } from 'util'

export default {
  data () {
    return {
      transitionName: 'none',
      css: false,
      caches: [
        {
          // 路由name和路由组件的name
          names: {
            include: ['Main'],
            exclude: undefined
          },
          // 在哪些路由上被缓存
          cachedOn: {
            include: ['StatisticsOne', 'TimeAxisOne'],
            exclude: undefined
          }
        }
      ],
      transitions: [
        {
          name: 'slide-left',
          reverseName: 'slide-right',
          from: ['Main'],
          to: [
            'DoTodo',
            'StatisticsOne',
            'TimeAxisOne',
            'PomodoroSetting',
            'CustomMotto',
            'AppearanceSetting',
            'OtherSettings',
            'Login',
            'Me'
          ]
        }
      ]
    }
  },
  computed: {},

  watch: {
    $route (to, from) {
      if (to.meta.child && from.meta.parent) {
        this.transitionName = 'slide-left'
        this.css = true
      } else if (to.meta.parent && from.meta.child) {
        this.transitionName = 'slide-right'
        this.css = true
      } else {
        this.transitionName = ''
        this.css = false
      }
    }
  },
  created () {
    window.addEventListener('resize', () => {
      let rootFont = (document.body.clientWidth / 414) * 50

      if (rootFont > 60) {
        rootFont = 60
      }
      document.documentElement.style.fontSize = rootFont + 'px'
    })

    let rootFont = (document.body.clientWidth / 414) * 50

    if (rootFont > 60) {
      rootFont = 60
    }
    document.documentElement.style.fontSize = rootFont + 'px'

    document.addEventListener('fullscreenchange', () => {
      document.documentElement.classList.add(
        'full-screen',
        'full-screen-enter',
        'full-screen-enter-active'
      )
      setTimeout(() => {
        if (!document.fullscreenElement) {
          Object.assign(document.documentElement.style, {
            width: 'auto',
            height: 'auto',
            left: 'auto',
            top: 'auto',
            transform: 'none',
            position: 'static'
          })
        } else {
          let rootWidth = 0
          let rootHeight = 0
          let rotate = 0

          if (window.screen.width > window.screen.height) {
            rootWidth = window.screen.height
            rootHeight = window.screen.width
            rotate = -90
            Object.assign(document.documentElement.style, {
              width: rootWidth + 'px',
              height: rootHeight + 'px',
              left: rootHeight / 2 - rootWidth / 2 + 'px',
              top: -rootHeight / 2 + rootWidth / 2 + 'px',
              transform: `rotate(${rotate}deg)`,
              position: 'fixed'
            })
          }
        }
        document.documentElement.classList.remove('full-screen-enter')

        setTimeout(() => {
          document.documentElement.classList.remove(
            'full-screen',
            'full-screen-active'
          )
        }, 200)
      }, 300)
    })

    window.onbeforeunload = () => {
      // user
      const storeState = this.$store.state

      localStorage.setItem('storeState', JSON.stringify(storeState))
    }

    const state = JSON.parse(localStorage.getItem('storeState'))

    if (state) {
      this.createDate(state.user.getUpClocks)
      this.createDate(state.user.sleepClocks)
      this.createDate(state.user.user, 'creat')

      this.createDate(state.plan.plans, 'creat')
      this.createDate(state.plan.plans, 'deadline')

      this.createDate(state.todo.todos, 'create')
      this.createDate(state.todo.todos, 'goal.deadline')
      this.createDate(state.todo.focus, 'start')
      this.createDate(state.todo.focus, 'end')

      this.$store.replaceState(state)
    }
    this.setUser()
  },
  mounted () {
    document.querySelector('.cm-enter-loading').remove()
    const theme = config.getTheme()

    this.storeSetCurrentTheme(theme)
  },
  methods: {
    ...mapMutations('user', {
      storeSetUser: 'setUser'
    }),
    ...mapMutations('settings', {
      storeSetCurrentTheme: 'setCurrentTheme'
    }),
    fullScreen () {
      this.$refs.img.requestFullscreen()
      // document.documentElement.requestFullscreen()
    },
    setUser () {
      const user = {
        headIcon: require('@/assets/setting/product.png'),
        nickname: this.$t('user.not_login'),
        accound: '0000000000',
        signature: this.$t('user.click_default_head_login'),
        creat: new Date(),
        background: require('@/assets/user/user_cover.jpg')
      }

      this.storeSetUser(user)
    },
    createDate (obj, key) {
      function setAttr (o, key) {
        const keys = key.split('.')
        let subO = o

        keys.some((key, index) => {
          if (typeof subO[key] === 'object') {
            subO = subO[key]
          } else {
            if (index === keys.length - 1) {
              subO[key] = new Date(subO[key])
            }
            return true
          }
        })
      }

      if (key) {
        if (obj[key]) {
          setAttr(obj, key)
        } else if (Array.isArray(obj)) {
          obj.forEach((item) => {
            if (typeof item === 'object') {
              setAttr(item, key)
            }
          })
        }
        return
      }
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          obj[index] = new Date(item)
        })
      }
    }
  }
}
</script>

<style lang="less">
html,
body {
  // min-height: 100%;
  height: 100%;
}

#app {
  height: 100%;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
}
// #app div:not(:last-child) {
//   display: none;
// }
.container {
  background: red;
  text-align: center;
  color: white;
}

@media screen and (orientation: portrait) {
  .container {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 100000;
    width: 100vh;
    height: 100vw;
    transform: translate(-50%, -50%) rotate(90deg);
  }
}

@media screen and (orientation: landscape) {
  .container {
    width: 100vw;
    height: 100vh;
  }
}

.full-screen {
  background: black;
}

.full-screen-enter * {
  opacity: 0;
}

.full-screen-enter-active * {
  transition: opacity 0.2s ease;
}

#app .echarts {
  width: 100%;
  height: 100%;
}

.slide-right-enter {
  transform: translate(-100%, 0);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
}

.slide-right-leave-to {
  transform: translate(100%, 0);
}

.slide-left-enter {
  transform: translate(100%, 0);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
}

.slide-left-leave-to {
  transform: translate(-100%, 0);
}

.zoom-in-enter {
  transform: scale(0, 0);
}

.zoom-in-enter-active,
.zoom-in-leave-active {
  transition: transform 0.8s ease;
  transform-origin: 50% 50%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  box-sizing: border-box;
}

.zoom-in-leave-to {
  transform: scale(1, 1);
}
</style>
