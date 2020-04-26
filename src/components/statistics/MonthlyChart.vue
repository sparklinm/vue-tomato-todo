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
      options: {},
      test: {
        title: {
          text: '456'
        }
      }
    }
  },
  computed: {
    ...mapState('settings', {
      chart: 'chart'
    }),
    panelTitle () {
      return (
        this.$t('todo.monthly_statistics') +
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
        const time = this.period[0]
        const year = time.getFullYear()
        const month = time.getMonth()
        const day = time.getDate()
        const monthDays = util.getMonthDays(time)
        const xAxisData = []
        const seriesData = []

        let unit = 'minute'

        if (this.chart.chartDurationUnit === 'hour') {
          const values = Object.values(data)

          if (Math.max(...values) >= 60) {
            unit = 'hour'
          }
        }


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

        const today = new Date().get

        const options = {
          xAxis: [
            {
              data: xAxisData
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
        if (this.chart.monthlyStatisticsDisplayRange === 'whole_month') {
          options.dataZoom = [
            {
              endValue: 31,
              zoomLock: false
            }
          ]
          options.xAxis[0].axisLabel = {
            interval: 'auto'
          }
        } else if (this.chart.monthlyStatisticsDisplayRange === 'seven_days') {
          const today = new Date().getDate()

          options.dataZoom = [
            {
              startValue: today - 3,
              endValue: today - 3 + 6
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
