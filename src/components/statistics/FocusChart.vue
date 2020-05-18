c
<template>
  <DataPanel
    :title="focusPanelTitle"
    class="focus-chart"
    :top-btn="topBtn"
    @previous="$emit('previous')"
    @next="$emit('next')"
  >
    <div class="filters">
      <div class="filters-inline">
        <ComGroup
          v-model="filterValue"
          @change="handleFilterChange"
        >
          <ComRadio label="day">
            {{ this.$t("word.day1") }}
          </ComRadio>
          <ComRadio label="week">
            {{ this.$t("word.week") }}
          </ComRadio>
          <ComRadio label="month">
            {{ this.$t("word.month") }}
          </ComRadio>
          <ComRadio label="customize">
            {{ this.$t("word.customize") }}
          </ComRadio>
        </ComGroup>
      </div>
    </div>
    <CPie
      ref="pie"
      :options="chartOptions"
    />
    <DatePicker
      v-model="times"
      is-range
      type="date"
      :show.sync="showBoxPeriod"
      :submit="customPeriod"
      :cancel="cancelCustomPeriod"
      z-index="2100"
      append-to-body
    />
  </DataPanel>
</template>

<script>
import util from '@/js/util.js'
import DataPanel from './DataPanel'
import CPie from './chart/CPie'
import DatePicker from '../DatePicker'

export default {
  components: {
    DataPanel,
    CPie,
    DatePicker
  },
  props: {
    data: {
      type: Array,
      default: null
    },
    period: {
      type: Array,
      default: () => ([])
    },
    topBtn: {
      type: Boolean,
      default: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      filterValue: 'day',
      chart: null,
      chartOptions: {},
      showBoxPeriod: false,
      times: [new Date(), new Date()]
    }
  },
  computed: {
    focusPanelTitle () {
      if (!this.period.length) {
        return
      }

      const text = this.$t('todo.focus_duration_distribution') +
        ' ' +
        util.formatTime(this.period[0], {
          cut: '-'
        })

      if (this.filterValue === 'day') {
        return text
      }
      return (
        this.$t('todo.focus_duration_distribution') +
        ' ' +
        util.formatTime(this.period[0], {
          cut: '-'
        }) +
        ' ~ ' +
        util.formatTime(this.period[1], {
          cut: '-'
        })
      )
    }
  },
  watch: {
    data: {
      handler (todos) {
        const legend = []
        const data = todos.map(todo => {
          legend.push(todo.name)
          return {
            name: todo.name,
            value: todo.focus.reduce((total, item) => {
              return total + item.duration
            }, 0)
          }
        })
        const total = this.getTotalDuration(data)
        const ave = this.getAveDuration(total)
        const chart = this.$refs.pie

        this.chartOptions = {
          legend: {
            data: legend,
            formatter: name => {
              const item = data.find(item => {
                return item.name === name
              })
              let cname = name

              if (cname.length > 8) {
                cname = name.slice(0, 8) + '...'
              }
              if (!item) {
                return
              }
              return `${cname}(${item.value}${this.$t('word.minute')})`
            }
          },
          series: [
            {
              label: {
                formatter: params => {
                  let cname = params.data.name
                  const value = params.data.value

                  if (cname.length > 8) {
                    cname = cname.slice(0, 8) + '...'
                  }

                  return `${cname}(${value}${this.$t('word.minute')})`
                }
              },
              data: data

            }
          ]
        }

        if (this.filterValue !== 'day') {
          this.chartOptions.graphic = {
            id: 'text',
            type: 'text',
            z: 100,
            right: 2,
            top: '73%',
            style: {
              fill: '#fff',
              text: [
                `${this.$t('todo.total')} ${total}${this.$t('word.minute')}`,
                `${this.$t('todo.day_average')} ${ave}${this.$t('word.minute')}`
              ].join(' '),
              font: '8px Microsoft YaHei'
            }
          }
        } else {
          this.chartOptions.graphic = {
            id: 'text',
            $action: 'remove'
          }
        }
        chart.setHeight()
      }
    },
    options (val) {
      this.chartOptions = val
    }
  },
  mounted () {
    this.chart = this.$refs.pie.$refs.chart
    this.chartOptions = this.options
  },
  methods: {
    handleFilterChange (filter) {
      if (filter === 'customize') {
        this.showBoxPeriod = true
        return
      }
      this.$emit('change', filter)
    },
    customPeriod () {
      this.showBoxPeriod = false
      this.$emit('change', {
        value: 'custom',
        times: this.times
      })
      this.times = [new Date(), new Date()]
    },
    cancelCustomPeriod () {
      this.filterValue = 'day'
      this.showBoxPeriod = false
      this.times = [new Date(), new Date()]
    },
    getTotalDuration (data) {
      return data.reduce((total, item) => {
        return total + item.value
      }, 0)
    },
    getAveDuration (total) {
      const days = new Date().getDate() - this.period[0].getDate()

      return Math.floor(total / days)
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
  }

  .custom-radio__text {
    display: inline-block;
    text-align: center;
  }

  .custom-radio:not(:last-child) .custom-radio__text {
    border-right: 1px solid white;
  }

  .custom-radio:first-child .custom-radio__text {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .custom-radio:last-child .custom-radio__text {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
</style>
