<template>
  <div class="page-statistics">
    <CumulativeData :todos="todos" />
  </div>
</template>

<script>
import '@/lib/echart'
import { mapGetters } from 'vuex'
import CumulativeData from '../components/statistics/CumulativeData'

export default {
  name: 'Statistics',
  components: {
    CumulativeData
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters('todo', {
      todos: 'getAllTodos'
    })
  },
  methods: {}
}
</script>

<style lang="less">
.page-statistics {
  height: 100%;
  overflow-y:scroll;
  .scroll-hide-bar()
}
</style>