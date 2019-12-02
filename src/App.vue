<template>
  <div id="app">
    <Nav />
    <router-view />
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
    return {}
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
  mounted () {
  }
}
</script>

<style lang="less">
#app .echarts {
  width: 100%;
  height: 100%;
}
</style>
