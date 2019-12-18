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
      options: {}
    }
  },
  computed: {
    panelTitle () {
      return (
        this.$t('todo.yearly_statistics') +
        ' ' +
        util.formatTime(this.period[0], {
          unit: true,
          hide: {
            day: true,
            month: true
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
        const xAxisData = []
        const seriesData = []
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
