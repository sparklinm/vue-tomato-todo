<template>
  <div
    ref="chartContainer"
    class="line-container"
  >
    <v-chart
      id="line"
      ref="chart"
      :init-options="chartInitOptions"
      :options="chartOptions"
      autoresize
      theme="roma"
    />
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      chartInitHeight: 0,
      chartInitOptions: {},
      chartOptions: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow',
            shadowStyle: {}
          },
          textStyle: {
            fontSize: 10
          },
          formatter: obj => {
            return `${obj[0].axisValueLabel}<br>${this.$t('todo.focus_duration')}:${obj[0].data[1]}`
          }
        },
        legend: {
          left: 'center',
          bottom: 0,
          padding: 0,
          textStyle: {
            fontSize: 9,
            color: '#fff'
          },
          itemWidth: 14,
          itemHeight: 14,
          icon: 'rect'
        },
        grid: {
          top: '15%',
          left: '1%',
          right: '5%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            splitLine: {
              show: false
            },
            axisLabel: {
              fontSize: 8,
              interval: 0
            },
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            },
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLabel: {
              fontSize: 10,
              formatter: `{value} ${this.$t('word.minute')}`
            },
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 0, // 数据窗口范围的起始百分比,
            endValue: 6,
            zoomLock: true
          }
        ],
        series: [
          {
            name: '',
            type: 'line',
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: {
              width: 1
            },
            label: {
              show: true,
              position: 'top',
              fontSize: 8
            },
            itemStyle: {
              color: '#fff'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#fff'
                  },
                  {
                    offset: 1,
                    color: '#fff'
                  }
                ],
                global: false // 缺省为 false
              }
            },
            smooth: 0.4,
            smoothMonotone: 'x',
            data: []
          }
        ],
        animationDuration: 2000
      }
    }
  },
  watch: {
    options (val) {
      if (!_.isEmpty(val)) {
        Object.assign(this.chartOptions, val)
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.chartOptions.series = [
        {
          areaStyle: {
            color: {
              colorStops: [
                {
                  offset: 0,
                  color: '#fff'
                },
                {
                  offset: 1,
                  color: window.getComputedStyle(document.querySelector('.data-panel')).backgroundColor
                }
              ]
            }
          }
        }
      ]
    })
  }
}
</script>

<style lang="less">
.line-container {
  width: 7.56rem;
  height: 3rem;
}
</style>
