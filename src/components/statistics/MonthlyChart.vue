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
      options: {},
      test: {
        title: {
          text: '456'
        }
      }

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

        this.options = {
          xAxis: [
            {
              data: xAxisData
            }
          ],
          series: [
            {
              name: this.panelTitle,
              data: seriesData,
              label: '{@[2]}'
            }
          ]
        }

      }
    }
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="less">

</style>
