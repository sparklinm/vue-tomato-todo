c
<template>
  <DataPanel
    :title="focusPanelTitle"
    class="focus-chart"
    @previous="$emit('previous')"
    @next="$emit('next')"
  >
    <div class="filters">
      <div class="filters-inline">
        <ComRadioGroup
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
        </ComRadioGroup>
      </div>
    </div>
    <CPie
      ref="pie"
      :options="options"
    />
  </DataPanel>
</template>

<script>
import util from '@/util.js'
import DataPanel from './DataPanel'
import CPie from './chart/CPie'
export default {
  components: {
    DataPanel,
    CPie
  },
  props: {
    data: {
      type: Array,
      default: null
    },
    period: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      filterValue: 'day',
      options: {}
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
        this.options = {
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
              data: data
            }
          ]
        }

        if (this.filterValue !== 'day') {
          this.options.graphic = {
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
          this.options.graphic = {
            id: 'text',
            $action: 'remove'
          }
        }
        chart.setHeight()
      }
    }
  },
  methods: {
    handleFilterChange (filter) {
      this.$emit('change', filter)
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
}
</style>
