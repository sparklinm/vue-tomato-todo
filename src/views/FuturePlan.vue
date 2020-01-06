<template>
  <div class="future-plan main">
    <ListFuturePlan />
  </div>
</template>

<script>
import ListFuturePlan from '../components/future-plan/ListFuturePlan'
export default {
  components: {
    ListFuturePlan
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