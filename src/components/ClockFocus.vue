<template>
  <ComPopup
    :title="$t('menu.clock_and_save')"
    :show.sync="showBoxFocusClock"
    class="box-clock box-focus-clock"
    remove-node
    @opened="handleBoxOpened"
    @open="handleBoxOpen"
    @closed="handleBoxClosed"
  >
    <template v-slot:header-icon>
      <ComIcon
        name="tint"
        class="box-clock__head-btn"
        @click="blurBackground"
      />
      <ComIcon
        name="download"
        class="box-clock__head-btn"
        @click="download"
      />
      <ComIcon
        name="rotate-left"
        class="box-clock__head-btn"
        @click="setClockBackground"
      />
      <ComIcon
        name="times"
        class="box-clock__head-btn"
        @click="showBoxFocusClock = false"
      />
    </template>
    <div
      ref="card"
      class="clock-card"
    >
      <div class="clock-card-background clock-card-default-background" />
      <img
        ref="focusCardBackground"
        :src="background"
        alt=""
        class="clock-card-background img-fit-container"
        @load="showImg"
      >
      <div class="background-shadow" />

      <div class="clock-card-inline">
        <div class="card-header">
          <div class="card-info">
            <div>
              <span class="time">{{ focusCard.date }}</span>
            </div>
            <div class="tags">
              <span class="tag">{{
                $t("todo.total_focus_0_days", [focusDays.total])
              }}</span>
              <span class="tag">{{
                $t("todo.continue_focus_0_days", [focusDays.continuation])
              }}</span>
            </div>
          </div>
        </div>
        <div class="content">
          <DataPanel
            :title="focusCard.focusPanelTitle"
            class="focus-data clock-panel"
            @next="nextDayFocus"
            @previous="preDayFocus"
          >
            <div class="column">
              <span class="text">{{ $t("todo.focus_times") }}</span>
              <span class="number">{{ focusCard.focusTimes }}</span>
            </div>
            <div class="column">
              <span class="text">{{ $t("todo.focus_duration") }}</span>
              <span class="focus-data-inlne">
                <span class="number">{{ focusCard.focusDuration }}</span>
                <span class="unit">{{ $t("word.minute") }}</span>
              </span>
            </div>
          </DataPanel>
          <div class="filters">
            <div class="filters-inline">
              <ComGroup
                v-model="filterValue"
                @change="handleFilterChange"
              >
                <ComRadio
                  label="chart"
                  name="chartmode"
                >
                  {{ this.$t("word.distribution") }}
                </ComRadio>
                <ComRadio
                  label="axis"
                  name="chartmode"
                >
                  {{ this.$t("word.time_axis") }}
                </ComRadio>
              </ComGroup>
            </div>
          </div>
          <div style="min-height:230px">
            <FocusChart
              v-if="showFocusChart"
              ref="focusChart"
              :data="focusChart.data"
              :period="focusChart.period"
              :top-btn="false"
              :options="focusChart.options"
              @change="initFocusChart"
              @previous="changeChart(focusChart, 'minus')"
              @next="changeChart(focusChart, 'add')"
            />
            <DataPanel
              v-show="showFocusAxis"
              :title="focusAxis.title"
              class="time-axis clock-panel"
              :top-btn="false"
            >
              <div
                v-for="item in focusAxis.data"
                :key="item.id"
                class="ev-events__item"
              >
                <div class="ev-events__hd">
                  <span class="ev-events__hd-text">
                    <span>
                      {{ item.end }}
                    </span>
                    <span>
                      {{ item.start }}
                    </span>
                  </span>
                </div>

                <div class="ev-events__bd">
                  <span class="ev-events__dot" />
                  <div class="ev-events__content">
                    <div class="cm-list-item">
                      <div class="left">
                        <div class="hd">
                          {{ item.name }}
                        </div>
                      </div>
                      <div class="right">
                        <div class="hd">
                          <div class="hd-text">
                            {{ item.duration + $t("word.minute") }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DataPanel>
          </div>
        </div>
        <div class="footer">
          {{ sentence }}
        </div>
        <div class="copyright">
          {{ $t("common.copyright") }}
          <img
            :src="productIcon"
            alt=""
            class="copyright-icon"
          >
        </div>
      </div>
    </div>
  </ComPopup>
</template>

<script>
import DataPanel from '@/components/statistics/DataPanel'
import FocusChart from '@/components/statistics/FocusChart'
import screenshot from '@/js/screenshot'
import util from '@/js/util'
import todo from '@/js/todo'
import setting from '@/js/setting'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    DataPanel,
    FocusChart
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showBoxFocusClock: this.show,
      focusCard: {
        date: '2020年03月31日',
        focusPanelTitle: this.$t('todo.today_focus'),
        focusTimes: 0,
        focusDuration: 0
      },
      sentence: '',
      focusPanelDate: new Date(),
      today: new Date(),
      filterValue: 'chart',
      focusChart: {
        data: [],
        period: [],
        range: 'day',
        options: {
          legend: {
            textStyle: {
              color: '#fff'
            }
          },
          series: [
            {
              label: {
                color: '#fff'
              },
              labelLine: {
                lineStyle: {
                  color: '#fff'
                }
              }
            }
          ]
        }
      },
      focusAxis: {
        title: this.$t('todo.tomato_time_axis'),
        data: []
      },
      showFocusChart: false,
      showFocusAxis: false,
      background: ''
    }
  },
  computed: {
    ...mapState('todo', {
      focus: state => state.focus
    }),
    ...mapState('user', {
      headIcon: state => state.user.headIcon
    }),
    ...mapGetters('todo', {
      todos: 'getAllTodos'
    }),
    ...mapState('settings', {
      productIcon: state => state.productIcon
    }),
    focusDays () {
      const data = todo.formatFocus(this.focus)
      const days = Object.keys(data)

      return {
        total: days.length,
        continuation: util.getContinueDays(days.map(day => parseInt(day)))
      }
    }
  },
  watch: {
    show (val) {
      this.showBoxFocusClock = val
    },
    showBoxFocusClock (val) {
      this.$emit('update:show', val)
    }
  },
  mounted () {
    this.today = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate()
    )
    this.initTimeAxis()
    this.setClockBackground()
    this.formatFocusCard(this.today)
  },
  methods: {
    handleBoxOpened () {
      this.showFocusChart = true
      this.showFocusAxis = false
      this.$nextTick(() => {
        this.initFocusChart('day')
      })
    },
    handleBoxClosed () {
      this.showFocusChart = false
      this.showFocusAxis = false
    },
    blurBackground () {
      const img = this.$refs.focusCardBackground

      if (img.src.startsWith('data')) {
        return
      }
      const canvas = document.createElement('canvas')

      StackBlur.image(img, canvas, 20)
      img.src = canvas.toDataURL()
      canvas.remove()
    },
    download () {
      screenshot.downloadImage(this.$refs.card, 'test.png')
    },
    setClockBackground () {
      this.changeSrc(setting.getClockImage())
    },
    changeSrc (src) {
      const img = this.$refs.focusCardBackground

      Object.assign(img.style, {
        opacity: 0
      })
      setTimeout(() => {
        img.src = src
      })
    },
    showImg (e) {
      const el = e.target

      setTimeout(() => {
        Object.assign(el.style, {
          opacity: 1,
          transition: 'opacity 0.5s ease'
        })

        el.addEventListener('transitionend', () => {
          Object.assign(el.style, {
            transition: 'initial'
          })
        })
      }, 300)
    },
    handleBoxOpen () {
      this.filterValue = 'chart'
      this.sentence = this.$t(setting.getSentence())
      this.setClockBackground()
    },
    focusDurationClock () {
      this.formatFocusCard(this.today)
      this.showClock = false
      this.showBoxFocusClock = true
    },
    formatFocusCard (date) {
      let endDate = new Date(date).setDate(date.getDate() + 1)

      endDate = new Date(endDate)
      const focus = todo.getFocusByTime(this.focus, date, endDate)
      const countFocus = todo.countFocus(focus)
      const obj = {
        date: util.dateFormatter(date, this.$t('time.format_unit')),
        focusPanelTitle: util.dateFormatter(
          date,
          this.$t('time.format_unit_month_day')
        ),
        focusTimes: countFocus.times,
        focusDuration: countFocus.duration
      }

      if (this.today === date) {
        obj.focusPanelTitle = this.$t('todo.today_focus')
      }

      this.focusCard = obj
      this.focusPanelDate = date
    },
    nextDayFocus () {
      const date = new Date(
        this.focusPanelDate.setDate(this.focusPanelDate.getDate() + 1)
      )

      this.formatFocusCard(date)
    },
    preDayFocus () {
      const date = new Date(
        this.focusPanelDate.setDate(this.focusPanelDate.getDate() - 1)
      )

      this.formatFocusCard(date)
    },
    handleFilterChange (val) {
      this.showFocusChart = val === 'chart'
      this.showFocusAxis = !this.showFocusChart
      if (this.showFocusChart) {
        this.$nextTick(() => {
          this.initFocusChart('day')
        })
      }
    },
    initTimeAxis () {
      const todayTodos = todo.getTodosByFocusTime(
        this.todos,
        ...this.getPeriod('day')
      )
      const focus = []

      todayTodos.forEach(todo => {
        todo.focus.forEach(item => {
          const obj = {
            name: todo.name,
            ...item
          }

          obj.start = util.dateFormatter(obj.start, 'hh:mm')
          obj.end = util.dateFormatter(obj.end, 'hh:mm')
          focus.push(obj)
        })
      })
      focus.sort((a, b) => b.start - a.start)
      this.focusAxis.data = focus
    },
    getPeriod (unit, cdate = new Date()) {
      const year = cdate.getFullYear()
      const month = cdate.getMonth()
      const date = cdate.getDate()
      const day = cdate.getDay() || 7
      const oneDay = 24 * 60 * 60 * 1000
      const today = new Date(year, month, date)

      if (unit === 'day') {
        return [today, new Date(today.getTime() + oneDay)]
      }
      if (unit === 'week') {
        return [
          new Date(today.getTime() - (day - 1) * oneDay),
          new Date(today.getTime() + (8 - day) * oneDay)
        ]
      }
      if (unit === 'month') {
        const startDate = 1
        let nextMonth = ''

        if (month === 11) {
          nextMonth = new Date(year + 1, 0, 1)
        } else {
          nextMonth = new Date(year, month + 1, 1)
        }
        return [new Date(year, month, startDate), nextMonth]
      }
      if (unit === 'year') {
        return [new Date(year, 0, 1), new Date(year + 1, 0, 1)]
      }
    },
    initFocusChart (range) {
      const chart = this.focusChart

      this.initPeriod(chart, range)
      this.initTodos(chart)
    },
    initPeriod (chart, range) {
      let period = []

      if (range && range.value === 'custom') {
        period = range.times
      } else {
        period = this.getPeriod(range)
      }

      chart.period = period
      chart.range = range
    },
    initTodos (chart) {
      chart.data = todo.getTodosByFocusTime(this.todos, ...chart.period)
    },
    changeChart (chart, type) {
      this.changePeriod(chart, type)
      if ([this.focusChart].includes(chart)) {
        this.initTodos(chart)
        return
      }
    },
    changePeriod (chart, type) {
      const oneDay = 24 * 60 * 60 * 1000
      let targetDay = null

      if (type === 'minus') {
        targetDay = chart.period[0].getTime() - oneDay
      } else {
        targetDay = chart.period[1].getTime()
      }
      chart.period = this.getPeriod(chart.range, new Date(targetDay))
    }
  }
}
</script>

<style lang="less">
.box-focus-clock {
  .time {
    font-size: 24px;
    margin-bottom: 5px;
  }

  .tag {
    margin-right: 8px;
    margin-top: 3px;
    padding: 3px 4px;
  }

  .clock-card-inline {
    box-sizing: border-box;
    padding: 18px 12px 0;
  }

  .content {
    padding: 8px 0;
  }

  .data-panel.clock-panel {
    background: rgba(0, 0, 0, 0.4);
    padding: 8px;
    color: #fff;
  }

  .data-panel__hd-btn {
    font-size: 20px;
  }

  .focus-data {
    .data-panel__hd {
      padding-bottom: 2px;
    }

    .text {
      margin-bottom: 5px;
    }
  }

  .filters {
    text-align: center;
    margin: 8px 0;
  }

  .com-radio-group {
    display: inline-block;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
  }

  .custom-radio__text {
    display: inline-block;
  }

  .custom-radio__inline:checked + span {
    background: rgba(255, 255, 255, 0.4);
    color: white;
  }

  .custom-radio:not(:last-child) .custom-radio__text {
    border-right: 1px solid rgb(212, 212, 212);
  }

  .custom-radio:first-child .custom-radio__text {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .custom-radio:last-child .custom-radio__text {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .pie-contianer {
    width: 5.7rem;
  }

  .data-panel.focus-chart {
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
  }
  .focus-chart {
    .custom-radio__text {
      font-size: 12px;
      box-sizing: border-box;
    }

    .filters {
      margin-bottom: 0;
    }

    .filters-inline {
      border: none;
    }

    .pie-contianer {
      height: 3rem;
    }
  }

  .time-axis {
    .data-panel__bd {
      display: block;
      min-height: 200px;
    }

    * {
      box-sizing: border-box;
    }

    .ev-events__hd {
      padding: 0;
    }

    .ev-events__bd {
      margin-left: 40px;
      padding: 3px 10px 3px 10px;
    }

    .ev-events__dot {
      background-image: radial-gradient(circle, #43bbf2 20%, #fdf4ec);
      width: 8px;
      height: 8px;
      margin: -4px -5px;
    }

    .ev-events__hd-text {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      font-size: 12px;
    }
  }

  .cm-list-item {
    background-color: rgba(69, 143, 204, 0.4);
    padding: 12px 12px;
    font-size: 12px;

    .left {
      .hd {
        font-size: 12px;
      }
    }
  }
}
</style>
