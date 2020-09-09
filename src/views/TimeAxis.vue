<template>
  <div class="page-time-axis">
    <CalendarView :todos="todos" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CalendarView from '../components/calendar/CalendarView'

export default {
  name: 'TimeAxis',
  components: {
    CalendarView
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
.page-time-axis {
  height: 100%;
}
</style>