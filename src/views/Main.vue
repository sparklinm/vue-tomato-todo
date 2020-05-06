<template>
  <div style="height:100%">
    <Nav />
    <main
      class="main"
      :style="{backgroundImage:`url(${appearance.mainPageBackground})`}"
    >
      <router-view />
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
    return {}
  },
  computed: {
    ...mapState('settings', {
      appearance: 'appearance'
    })
  }
}
</script>