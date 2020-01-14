<template>
  <CumulativeData
    class="right-page"
    show-header
    :todos="[todo]"
    :name="todo.name"
    @return="toLastPage"
  />
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
      getTodoById: 'getTodoById'
    }),
    todo () {
      return this.getTodoById(parseInt(this.$route.params.id))
    }
  },
  methods: {
    toLastPage () {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style lang='less'>


</style>
