<template>
  <DataPanel
    :title="panelTitle"
    class="focus-chart"
    @previous="$emit('previous')"
    @next="$emit('next')"
  >
    <CLine ref="line" />
  </DataPanel>
</template>

<script>
import util from '@/util.js'
import DataPanel from './DataPanel'
import CLine from './chart/CLine'
export default {
  components: {
    DataPanel,
    CLine
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
    return {
      chartInitHeight: 0,
      initOptions: {}
    }
  },
  computed: {
    panelTitle () {
      return (
        this.$t('todo.get_up_clock_distribution') +
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
        const chart = this.$refs.line
        const options = chart.options
        const time = this.period[0]
        const year = time.getFullYear()
        const month = time.getMonth()
        const day = time.getDate()
        const monthDays = util.getMonthDays(time)
        const xAxisData = []
        const seriesData = []
        for (let i = 0; i < monthDays; i++) {
          const date = new Date(year, month, day + i)
          xAxisData.push(
            util.formatTime(date, {
              cut: '-',
              hide: {
                year: true
              }
            })
          )
          const item = data.find(item => {
            const day = item.getDate()
            const hours = item.getHours()
            const minutes = item.getMinutes()
            if ((day - 1) === i) {
              seriesData.push([i, hours + minutes / 60, util.addZero(hours, 10), util.addZero(minutes, 10)])
              return true
            }
          })
          if (!item) {
            seriesData.push([i, 0, '', ''])
          }
        }
        options.xAxis[0].data = xAxisData
        options.series[0].data = seriesData
        options.series[0].label.formatter = params => {
          const data = params.data
          return this.getUpTime(data[2], data[3])
        }
        options.series[0].name = this.panelTitle
        options.yAxis[0].axisLabel.formatter = `{value} ${this.$t('word.oclock')}`
        options.legend.formatter = `${this.$t('todo.get_up_time_average')} ${this.getAverageClockTime(data)}`
        options.tooltip.formatter = obj => {
          const getUp = this.getUpTime(obj[0].data[2], obj[0].data[3])
          const text = `${obj[0].axisValueLabel}<br>${this.$t('todo.get_up_time')}:`
          if (getUp) {
            return text + getUp
          }
          return text + this.$t('todo.not_record')
        }
      }
    }
  },
  mounted () {

  },
  methods: {
    getAverageClockTime (data) {
      const total = data.reduce((total, item) => {
        return total + new Date(
          2000,
          0,
          1,
          item.getHours(),
          item.getMinutes(),
          item.getSeconds(),
          item.getMilliseconds()
        ).getTime()
      }, 0)
      const aveDate = new Date(total / data.length)
      const hours = util.addZero(aveDate.getHours(), 10)
      const minutes = util.addZero(aveDate.getMinutes(), 10)
      return `${hours}:${minutes}`
    },
    getUpTime (hours, minutes) {
      if (hours !== '') {
        return `${hours}:${minutes}`
      }
      return ''
    }
  }
}
</script>

<style lang="less">
.focus-chart {
  .data-panel__bd {
    display: block;
  }

  .filters {
    text-align: right;
  }

  .filters-inline {
    display: inline-block;
    border: 1px solid white;
    border-radius: 4px;
    font-size: 12px;
    .scale-font(0.9;right;center);
  }

  .custom-radio__text {
    display: inline-block;
    width: 1.1rem;
    padding: 0.08rem 0;
    text-align: center;
  }

  .custom-radio:not(:last-child) .custom-radio__text {
    border-right: 1px solid white;
  }

  .custom-radio__inline {
    width: 0;
    &:checked + span {
      background: white;
      color: black;
    }
  }

  .chart-container {
    width: 7.56rem;
    height: 3.8rem;
  }

  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>
