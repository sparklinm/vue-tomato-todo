<template>
  <div class="page-statistics">
    <CumulativeData />
  </div>
</template>

<script>
import CumulativeData from '../components/statistics/CumulativeData'
export default {
  components: {
    CumulativeData
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