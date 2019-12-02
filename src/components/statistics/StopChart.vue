c
<template>
  <DataPanel
    :title="panelTitle"
    class="stop-chart"
    @previous="$emit('previous')"
    @next="$emit('next')"
  >
    <CPie
      ref="pie"
      class="stop-pie"
      :radius="0.16"
    />
  </DataPanel>
</template>

<script>
import util from '@/util.js'
import DataPanel from './DataPanel'
import CPie from './chart/CPie'
export default {
  components: {
    DataPanel,
    CPie
  },
  props: {
    data: {
      type: Array,
      default: null
    },
    period: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      filterValue: 'day'
    }
  },
  computed: {
    panelTitle () {
      return (
        this.$t('todo.stop_reason_distribution') +
        ' ' +
        util.formatTime(this.period[0], {
          unit: true,
          hide: {
            day: true
          }
        })
      )
    }
  },
  watch: {
    data: {
      handler (data) {
        const legend = []
        const seriesData = []
        const reasonStats = {}
        data.forEach(item => {
          if (reasonStats[item.reason]) {
            reasonStats[item.reason]++
            return
          }
          legend.push(item.reason)
          reasonStats[item.reason] = 1
        })
        for (const [key, value] of Object.entries(reasonStats)) {
          seriesData.push({
            name: key,
            value: value
          })
        }
        const chart = this.$refs.pie
        const options = chart.options
        options.legend.data = legend
        options.series[0].data = seriesData
        options.series[0].label.formatter = `{c}${this.$t('word.times')}`
        options.legend.formatter = name => {
          let cname = name
          if (cname.length > 8) {
            cname = name.slice(0, 8) + '...'
          }
          return cname
        }
        chart.setHeight()
      }
    }
  }
}
</script>

<style lang="less">
.stop-pie {
  height:3.2rem;
}
</style>
