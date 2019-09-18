<template>
  <div
    id="app"
    class="theme-1"
  >
    <Nav />
    <router-view />
  </div>
</template>

<script>
import Nav from './components/header/Nav.vue'
export default {
  components: {
    Nav
  },
  data () {
    return {

    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      document.documentElement.style.fontSize = document.documentElement.clientWidth / 414 * 50 + 'px'
    })
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 414 * 50 + 'px'
  }
}
</script>

<style lang="less">
</style>
