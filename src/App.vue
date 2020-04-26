<template>
  <div
    id="app"
    :style="{backgroundImage:`url(${appearance.mainPageBackground})`}"
  >
    <!-- <div
      class="test"
      style="position:fixed;z-index:99999;min-width:50px;min-height:40px;background:yellow;color:red;padding:10px;left:0;top:0"
    /> -->
    <transition
      :name="transitionName"
      :css="css"
    >
      <keep-alive :include="$root.keepAlive.join(',')">
        <router-view />
      </keep-alive>
    </transition>
    <!--
    <button @click="toImage">
      sss
    </button> -->

    <!-- <div
      class="container"
    >
      <span>
        春风十里
      </span>
    </div> -->
    <!-- <img
      id="full-screen"
      ref="img"
      src="/background/test.png"
      style="width:100px;height:200px;background:red"
      alt=""
    >
    <div
      ref="img"
      style="width:100px;height:200px;background:red"
    />
    <button @click="fullScreen">
      全屏
    </button> -->
  </div>
</template>

<script>
import screenshot from '@/js/screenshot'
import config from './config'
import { mapMutations, mapState } from 'vuex'

export default {
  data () {
    return {
      transitionName: 'none',
      css: false
    }
  },
  computed: {
    ...mapState('settings', {
      appearance: 'appearance'
    })
  },
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
      const rootFont = (document.documentElement.clientWidth / 414) * 50 + 'px'

      document.documentElement.style.fontSize = rootFont
    })
    document.documentElement.style.fontSize =
      (document.documentElement.clientWidth / 414) * 50 + 'px'
    document.body.className = 'theme-1'

    // document.documentElement.addEventListener('transitionend', () => {
    //   document.documentElement.classList.remove('full-screen', 'full-screen-active')
    // })

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

        document.querySelector('.test').innerHTML = `
       <p>orientation:${window.orientation}</p>
       <p>innerWidth:${window.innerWidth}</p>
       <p>innerHeight:${window.innerHeight}</p>
       <p>clientWidth:${document.documentElement.clientWidth}</p>
       <p>clientHeight:${document.documentElement.clientHeight}</p>
       <p>screenWidth:${window.screen.width}</p>
       <p>screenHeight:${window.screen.height}</p>
      `
      }, 300)
    })
    this.setUser()
  },
  mounted () {
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
    toImage () {
      screenshot.downloadImage(document.body, 'test.png')
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
    }
  }
}
</script>

<style lang="less">
html,body {
  // min-height: 100%;
  height: 100%;
}

#app {
  height: 100%;
  background-size: 100% 100%;
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

html:fullscreen {
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
  position: fixed;
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
  position: fixed;
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
