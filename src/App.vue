<template>
  <div id="app">
    <Nav />
    <transition
      :name="transitionName"
      :css="css"
    >
      <keep-alive :include="$root.keepAlive.join(',')">
        <router-view />
      </keep-alive>
    </transition>
    <TabBar />
  </div>
</template>

<script>
import Nav from './components/nav/Nav.vue'
import TabBar from './components/tabbar/TabBar.vue'
export default {
  components: {
    Nav,
    TabBar
  },
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
  box-sizing: border-box;
}

.slide-left-leave-to {
  transform: translate(-100%, 0);
}
</style>
