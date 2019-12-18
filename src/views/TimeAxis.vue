<template>
  <div class="page-time-axis main">
    <CalendarView />
  </div>
</template>

<script>
import CalendarView from '../components/calendar/CalendarView'
export default {
  components: {
    CalendarView
  },
  data () {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style lang="less">
.page-statistics {
  padding: 0.2rem;

  .data-panel {
    margin-bottom: 0.2rem;
  }
}
</style>