<template>
  <CalendarView
    class="right-page"
    show-return
    :todos="todo"
    @return="toLastPage"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import CalendarView from '../components/calendar/CalendarView'

export default {
  components: {
    CalendarView
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters('todo', {
      getTodoById: 'getTodoById',
      getAllTodos: 'getAllTodos'
    }),
    todo () {
      if (this.$route.params.id === 'all') {
        return this.getAllTodos
      }
      return [this.getTodoById(parseInt(this.$route.params.id))]
    }
  },
  watch: {},
  mounted () {

  },
  methods: {
    toLastPage () {
      history.back()
    }
  }
}
</script>

<style>
</style>
