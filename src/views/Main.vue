<template>
  <div style="height:100%">
    <Nav />
    <main
      class="main"
      :style="{backgroundImage:`url(${appearance.mainPageBackground})`}"
    >
      <vue-router-cache-animate
        :caches="caches"
      >
        <router-view />
      </vue-router-cache-animate>
    </main>
    <TabBar />
  </div>
</template>

<script>
import Nav from '../components/nav/Nav.vue'
import TabBar from '../components/tabbar/TabBar.vue'
import { mapState } from 'vuex'

export default {
  name: 'Main',
  components: {
    Nav,
    TabBar
  },
  data () {
    return {
      caches: [
        {
          // 路由name和路由组件的name
          names: {
            include: ['Todo']
            // exclude: ['Statistics']
          },
          // 在哪些路由上被缓存
          cachedOn: {
            // include: ['Statistics', 'TimeAxis'],
            exclude: ['Statistics', 'TimeAxis']
          }
        }
      ]
    }
  },
  beforeRouteUpdate: (to, from, next) => {
    // console.log(this)
    // console.log(from)
    next()
  },
  computed: {
    ...mapState('settings', {
      appearance: 'appearance'
    })
  }
}
</script>