<template>
  <CalendarView
    class="page-time-axis-one"
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
.page-time-axis-one {
  position: relative;
  z-index: 5000;
}
</style>
