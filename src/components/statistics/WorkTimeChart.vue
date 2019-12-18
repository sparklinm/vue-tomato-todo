<template>
  <DataPanel
    :title="panelTitle"
    @previous="$emit('previous')"
    @next="$emit('next')"
  >
    <CBar ref="bar" />
  </DataPanel>
</template>

<script>
import util from '@/util.js'
import DataPanel from './DataPanel'
import CBar from './chart/CBar'
export default {
  components: {
    DataPanel,
    CBar
  },
  props: {
    data: {
      type: [Object, Array],
      default: null
    },
    period: {
      type: Array,
      default: null
    }
  },
  data () {
    return {}
  },
  computed: {
    panelTitle () {
      return (
        this.$t('todo.work_duration_distribution') +
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
        const chart = this.$refs.bar
        const options = Object.assign({}, chart.chartOptions)
        const clocks = Object.keys(data)

        clocks.sort((a, b) => a - b)
        const dtime = clocks[clocks.length - 1] - clocks[0]
        for (let i = 0; i <= dtime; i++) {
          clocks[i] = parseInt(clocks[0]) + i
        }
        options.xAxis[0].data = clocks

        const legendData = []
        const series = []
        Object.entries(data).forEach((item, index) => {
          const seriesName = `${item[0]}${this.$t(
            'word.oclock'
          )}<br>` + this.$t('todo.focus_duration')
          series[index] = {
            name: seriesName,
            type: 'bar',
            barGap: '-100%',
            barCategoryGap: '3',
            label: {
              show: true,
              position: 'top',
              fontSize: 8
            },
            emphasis: {},
            data: []
          }
          series[index].data = [item]
          legendData.push(seriesName)
        })
        options.series = series
        options.legend.data = legendData
        options.legend.formatter = name => {
          if (name === legendData[legendData.length - 1]) {
            return this.panelTitle
          }
          return ''
        }

        options.xAxis[0].axisLabel.formatter = `{value}${this.$t(
          'word.oclock'
        )}`
        options.tooltip.formatter = obj => {
          return `${obj.seriesName}：${obj.data[1]}${this.$t('word.minute')}`
        }
        chart.chartOptions = options
      }
    }
  }
}
</script>

<style lang="less">
</style>
