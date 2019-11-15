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
  mounted () {
    window.addEventListener('resize', () => {
      document.documentElement.style.fontSize =
        (document.documentElement.clientWidth / 414) * 50 + 'px'
    })
    document.documentElement.style.fontSize =
      (document.documentElement.clientWidth / 414) * 50 + 'px'
    document.body.className = 'theme-1'
  }
}
</script>

<style lang="less"></style>
