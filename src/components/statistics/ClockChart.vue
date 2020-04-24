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
        if (!data.length) {
          seriesData[seriesData.length - 1][1] = 10
        }
        this.options = {
          tooltip: {
            formatter: obj => {
              const getUp = this.getUpTime(obj[0].data[2], obj[0].data[3])
              const text = `${obj[0].axisValueLabel}<br>${this.$t('todo.get_up_time')}:`

              if (getUp) {
                return text + getUp
              }
              return text + this.$t('todo.not_record')
            }
          },
          xAxis: [
            {
              data: xAxisData
            }
          ],
          yAxis: [
            {
              axisLabel: {
                formatter: `{value} ${this.$t('word.oclock')}`
              }
            }
          ],
          legend: {
            formatter: `${this.$t('todo.get_up_time_average')} ${this.getAverageClockTime(data)}`
          },
          series: [
            {
              name: this.panelTitle,
              data: seriesData,
              label: {
                formatter: params => {
                  const data = params.data

                  return this.getUpTime(data[2], data[3])
                }
              }
            }
          ]
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

      if (!total) {
        return this.$t('todo.not_record')
      }
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
</style>
