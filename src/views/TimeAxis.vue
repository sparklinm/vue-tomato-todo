<template>
  <div class="page-time-axis main">
    <CalendarView :todos="todos" />
  </div>
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
      todos: 'getAllTodos'
    })
  },
  methods: {}
}
</script>

<style lang="less">

</style>