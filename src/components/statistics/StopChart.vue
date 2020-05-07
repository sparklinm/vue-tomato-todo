<template>
  <DataPanel
    :title="panelTitle"
    class="stop-chart"
    :top-btn="topBtn"
    @previous="$emit('previous')"
    @next="$emit('next')"
  >
    <CPie
      ref="pie"
      class="stop-pie"
      :radius="0.16"
      :options="options"
    />
  </DataPanel>
</template>

<script>
import util from '@/js/util.js'
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
      default: () => ([])
    },
    topBtn: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      filterValue: 'day',
      options: {}
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
        if (!data.length) {
          return
        }
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

        this.options = {
          legend: {
            data: legend,
            formatter: name => {
              let cname = name

              if (cname.length > 8) {
                cname = name.slice(0, 8) + '...'
              }
              return cname
            }
          },
          series: [
            {
              data: seriesData,
              label: {
                formatter: `{b}({c}${this.$t('word.times')})`
              }
            }
          ]
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
