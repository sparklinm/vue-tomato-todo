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

          const item = Object.entries(data).find(item => {
            return parseInt(item[0]) === i
          })
          if (item) {
            seriesData.push([parseInt(item[0]), item[1], item[1]])
          } else {
            seriesData.push([i, 0, ''])
          }
        }
        options.xAxis[0].data = xAxisData
        options.series[0].data = seriesData
        options.series[0].name = this.panelTitle
        options.series[0].label.formatter = '{@[2]}'
      }
    }
  },
  mounted () {},
  methods: {}
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
