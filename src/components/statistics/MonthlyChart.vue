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
        console.log(data)

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
            return parseInt(item[0]) === i + 1
          })

          if (item) {
            if (unit === 'hour') {
              let yValue = item[1] / 60

              if (yValue < 1) {
                yValue = yValue.toFixed(2)
              } else {
                yValue = yValue.toFixed(1)
              }

              seriesData.push([i, yValue, yValue + ' ' + this.$t('settings.hour')])
            } else {
              seriesData.push([i, item[1], item[1] + ' ' + this.$t('word.minute')])
            }
          } else {
            seriesData.push([i, 0, 0])
          }
        }

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

        // const options = {
        //   title: {
        //     text: ''
        //   },
        //   tooltip: {
        //     trigger: 'axis',
        //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
        //       type: 'shadow', // 默认为直线，可选为：'line' | 'shadow',
        //       shadowStyle: {}
        //     },
        //     textStyle: {
        //       fontSize: 10
        //     },
        //     formatter: obj => {
        //       return `${obj[0].axisValueLabel}<br>${this.$t('todo.focus_duration')}:${obj[0].data[2]}`
        //     }
        //   },
        //   legend: {
        //     left: 'center',
        //     bottom: 0,
        //     padding: 0,
        //     textStyle: {
        //       fontSize: 9,
        //       color: '#555'
        //     },
        //     itemWidth: 14,
        //     itemHeight: 14,
        //     icon: 'rect'
        //   },
        //   grid: {
        //     top: '15%',
        //     left: '1%',
        //     right: '5%',
        //     bottom: '12%',
        //     containLabel: true
        //   },
        //   xAxis: [
        //     {
        //       type: 'category',
        //       splitLine: {
        //         show: false
        //       },
        //       axisLabel: {
        //         fontSize: 8,
        //         interval: 0
        //       },
        //       axisTick: {
        //         show: false,
        //         alignWithLabel: true
        //       },
        //       axisLine: {
        //         show: false
        //       },
        //       boundaryGap: false,
        //       data: xAxisData
        //     }
        //   ],
        //   yAxis: [
        //     {
        //       type: 'value',
        //       splitLine: {
        //         show: false
        //       },
        //       axisLabel: {
        //         fontSize: 10,
        //         formatter: `{value} ${this.$t('word.minute')}`
        //       },
        //       axisTick: {
        //         show: false,
        //         alignWithLabel: true
        //       },
        //       axisLine: {
        //         show: false
        //       }
        //     }
        //   ],
        //   dataZoom: [
        //     {
        //       type: 'inside',
        //       xAxisIndex: [0],
        //       start: 0, // 数据窗口范围的起始百分比,
        //       endValue: 6,
        //       zoomLock: true
        //     }
        //   ],
        //   series: [
        //     {
        //       type: 'line',
        //       symbol: 'circle',
        //       symbolSize: 4,
        //       lineStyle: {
        //         width: 1
        //       },
        //       name: this.panelTitle,
        //       data: seriesData,
        //       label: {
        //         show: true,
        //         position: 'top',
        //         fontSize: 8,
        //         color: '#555',
        //         formatter: '{@[2]}'
        //       },
        //       itemStyle: {
        //         color: '#555'
        //       },
        //       areaStyle: {
        //         color: {
        //           type: 'linear',
        //           x: 0,
        //           y: 0,
        //           x2: 0,
        //           y2: 1,
        //           colorStops: [
        //             {
        //               offset: 0.5,
        //               color: '#555'
        //             },
        //             {
        //               offset: 1,
        //               color: '#fff'
        //             }
        //           ],
        //           global: false // 缺省为 false
        //         }
        //       },
        //       smooth: 0.4,
        //       smoothMonotone: 'x'
        //     }
        //   ],
        //   animationDuration: 2000
        // }

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
              startValue: today - 4,
              endValue: today - 4 + 6
            }
          ]
        }
        this.options = options
        setTimeout(() => {
          // console.log(this.$refs.line.$refs.chart.computedOptions)
          // const today = new Date().getDate()

          // this.$refs.line.$refs.chart.dispatchAction({
          //   type: 'dataZoom',
          //   // 开始位置的数值
          //   startValue: today - 4,
          //   endValue: today - 4 + 6
          // })
        }, 10000)
      }
    }
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="less">

</style>
