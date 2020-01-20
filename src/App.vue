<template>
  <div id="app">
    <transition
      :name="transitionName"
      :css="css"
    >
      <keep-alive :include="$root.keepAlive.join(',')">
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      transitionName: 'none',
      css: false
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
      const rootFont = (document.documentElement.clientWidth / 414) * 50 + 'px'

      document.documentElement.style.fontSize = rootFont
    })
    document.documentElement.style.fontSize =
      (document.documentElement.clientWidth / 414) * 50 + 'px'
    document.body.className = 'theme-1'
  },
  mounted () {}
}
</script>

<style lang="less">
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
  transform: scale(0,0)
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
  transform: scale(1,1);
}
</style>
