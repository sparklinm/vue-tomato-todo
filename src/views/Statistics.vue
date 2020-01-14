<template>
  <div class="page-statistics main">
    <CumulativeData :todos="todos" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CumulativeData from '../components/statistics/CumulativeData'
export default {
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

</style>