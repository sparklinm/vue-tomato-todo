<template>
  <div style="height:100%">
    <Nav />
    <main class="main">
      <router-view />
    </main>
    <TabBar />
  </div>
</template>

<script>
import Nav from '../components/nav/Nav.vue'
import TabBar from '../components/tabbar/TabBar.vue'

export default {
  name: 'Main',
  components: {
    Nav,
    TabBar
  },
  data () {
    return {}
  }
}
</script>