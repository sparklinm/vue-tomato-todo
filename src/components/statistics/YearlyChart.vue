<template>
  <DataPanel
    :title="panelTitle"
    class="focus-chart"
    @previous="$emit('previous')"
    @next="$emit('next')"
  >
    <CLine
      ref="line"
      :options="options"
    />
  </DataPanel>
</template>

<script>
import util from '@/js/util.js'
import DataPanel from './DataPanel'
import CLine from './chart/CLine'
import { mapState } from 'vuex'

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
      options: {}
    }
  },
  computed: {
    ...mapState('settings', {
      chart: 'chart'
    }),
    panelTitle () {
      return (
        this.$t('todo.yearly_statistics') +
        ' ' +
        util.dateFormatter(this.period[0], 'yyyy')
      )
    }
  },
  watch: {
    data: {
      handler (data) {
        const time = this.period[0]
        const year = time.getFullYear()
        const xAxisData = []
        const seriesData = []

        let unit = 'minute'

        if (this.chart.chartDurationUnit === 'hour') {
          const values = Object.values(data)

          if (Math.max(...values) >= 60) {
            unit = 'hour'
          }
        }

        for (let i = 0; i < 12; i++) {
          const date = new Date(year, i, 1)

          xAxisData.push(
            util.formatTime(date, {
              cut: '-',
              hide: {
                day: true
              }
            })
          )

          const item = Object.entries(data).find(item => {
            return parseInt(item[0]) === i
          })

          if (item) {
            if (unit === 'hour') {
              let yValue = item[1] / 60

              if (yValue < 1) {
                yValue = yValue.toFixed(2)
              } else {
                yValue = yValue.toFixed(1)
              }
              seriesData.push([parseInt(item[0]), yValue, yValue + ' ' + this.$t('settings.hour')])
            } else {
              seriesData.push([parseInt(item[0]), item[1], item[1] + ' ' + this.$t('word.minute')])
            }
          } else {
            seriesData.push([i, 0, 0])
          }
        }

        const month = new Date().getMonth()
        const options = {
          xAxis: [
            {
              data: xAxisData
            }
          ],
          dataZoom: [
            {
              startValue: month - 3,
              endValue: month - 3 + 6
            }
          ],
          series: [
            {
              name: this.panelTitle,
              data: seriesData,
              label: {
                formatter: '{@[2]}'
              }
            }
          ]
        }

        if (unit === 'hour') {
          options.yAxis = [
            {
              axisLabel: {
                fontSize: 10,
                formatter: `{value} ${this.$t('settings.hour')}`
              }
            }
          ]
        }
        this.options = options
      }
    }
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="less">

</style>
