<template>
  <div class="statistical">
    <div class="statistical-data">
      <DataPanel
        :title="$t('todo.cumulative_data')"
        class="focus-data"
        :top-btn="false"
      >
        <div class="column">
          <span class="text">{{ $t('todo.focus_times') }}</span>
          <AnimatedInteger
            v-if="showAnimatedInteger"
            :value="allFocusData.times"
            :duration="800"
            class="number"
          />
          <span
            v-else
            class="number"
          >
            0
          </span>
        </div>
        <div class="column">
          <span class="text">{{ $t('todo.focus_duration') }}</span>
          <span class="focus-data-inlne">
            <AnimatedInteger
              v-if="showAnimatedInteger"
              :value="allFocusData.duration"
              :duration="800"
              class="number"
            />
            <span
              v-else
              class="number"
            >
              0
            </span>
            <span class="unit">{{ $t('word.minute') }}</span>
          </span>
        </div>
        <div class="column">
          <span class="text">{{ $t('todo.everyday_focus') }}</span>
          <span class="focus-data-inlne">
            <AnimatedInteger
              v-if="showAnimatedInteger"
              :value="allFocusData.average"
              :duration="800"
              class="number"
            />
            <span
              v-else
              class="number"
            >
              0
            </span>
            <span class="unit">{{ $t('word.minute') }}</span>
          </span>
        </div>
      </DataPanel>

      <DataPanel
        :title="$t('todo.today_data')"
        class="focus-data"
        :top-btn="false"
      >
        <div class="column">
          <span class="text">{{ $t('todo.focus_times') }}</span>
          <AnimatedInteger
            v-if="showAnimatedInteger"
            :value="todayFocusData.times"
            :duration="800"
            class="number"
          />
          <span
            v-else
            class="number"
          >
            0
          </span>
        </div>
        <div class="column">
          <span class="text">{{ $t('todo.focus_duration') }}</span>
          <span class="focus-data-inlne">
            <AnimatedInteger
              v-if="showAnimatedInteger"
              :value="todayFocusData.duration"
              :duration="800"
              class="number"
            />
            <span
              v-else
              class="number"
            >
              0
            </span>
            <span class="unit">{{ $t('word.minute') }}</span>
          </span>
        </div>
      </DataPanel>
      <FocusChart
        :data="focusChart.data"
        :period="focusChart.period"
        @change="initFocusChart"
        @previous="changeChart(focusChart,'minus')"
        @next="changeChart(focusChart,'add')"
      />
      <WorkTimeChart
        :data="workTimeChart.data"
        :period="workTimeChart.period"
        @previous="changeChart(workTimeChart,'minus')"
        @next="changeChart(workTimeChart,'add')"
      />
      <MonthlyChart
        :data="monthlyChart.data"
        :period="monthlyChart.period"
        @previous="changeChart(monthlyChart,'minus')"
        @next="changeChart(monthlyChart,'add')"
      />
      <ClockChart
        v-if="chartSettings.showClockChart"
        :data="clockChart.data"
        :period="clockChart.period"
        @previous="changeChart(clockChart,'minus')"
        @next="changeChart(clockChart,'add')"
      />
      <StopChart
        v-if="chartSettings.showStopChart"
        :data="stopChart.data"
        :period="stopChart.period"
        @previous="changeChart(stopChart,'minus')"
        @next="changeChart(stopChart,'add')"
      />
      <YearlyChart
        :data="yearlyChart.data"
        :period="yearlyChart.period"
        @previous="changeChart(yearlyChart,'minus')"
        @next="changeChart(yearlyChart,'add')"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import util from '@/js/util.js'
import todoUtil from '@/js/todo.js'
import DataPanel from './DataPanel'
import FocusChart from './FocusChart'
import WorkTimeChart from './WorkTimeChart'
import MonthlyChart from './MonthlyChart'
import ClockChart from './ClockChart'
import StopChart from './StopChart'
import YearlyChart from './YearlyChart'
import AnimatedInteger from '@/components/AnimatedInteger'

export default {
  components: {
    DataPanel,
    FocusChart,
    WorkTimeChart,
    MonthlyChart,
    ClockChart,
    StopChart,
    YearlyChart,
    AnimatedInteger
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    showHeader: {
      type: Boolean,
      default: false
    },
    todos: {
      type: Array,
      default: () => {[]}
    }
  },
  data () {
    return {
      allFocusData: {
        times: 0,
        duration: 0,
        average: 0
      },
      todayFocusData: {
        times: 0,
        duration: 0
      },
      focusChart: {
        data: [],
        period: [],
        range: 'day'
      },
      workTimeChart: {
        data: [],
        period: [],
        range: 'month'
      },
      monthlyChart: {
        data: [],
        period: [],
        range: 'month'
      },
      clockChart: {
        data: [],
        period: [],
        range: 'month'
      },
      stopChart: {
        data: [],
        period: [],
        range: 'month'
      },
      yearlyChart: {
        data: [],
        period: [],
        range: 'year'
      },
      showAnimatedInteger: false
    }
  },
  computed: {
    ...mapState('user', {
      clocks: state => state.getUpClocks
    }),
    ...mapState('settings', {
      chartSettings: 'chart'
    }),
    focus () {
      const focus = []

      this.todos.forEach(todo => {
        if (todo.focus) {
          focus.push(...todo.focus)
        }
      })
      return focus
    }
  },
  watch: {
    todos () {
      this.init()
    }
  },
  mounted () {
    this.init()
    setTimeout(() => {
      this.showAnimatedInteger = true
    })
  },
  methods: {
    init () {
      this.setAllFocusData()
      this.setTodayFocusData()
      this.initFocusChart('day')
      this.initWorkTimeChart()
      this.initMonthlyChart()
      this.initClockChart()
      this.initStopChart()
      this.initYearlyChart()
    },
    filterStopData (todo, start, end) {
      let stopData = []

      if (todo.focus && todo.focus.length) {
        stopData = todo.focus.filter(item => {
          return item.start >= start && item.start <= end && item.status === 'stopped'
        })
        return stopData
      }
      return stopData
    },
    filterFocusData (todo, startDate, endDate) {
      let focusData = []

      if (todo.focus && todo.focus.length) {
        focusData = todo.focus.filter(item => {
          return item.start >= startDate && item.start <= endDate && item.duration > 0
        })
        return focusData
      }
      return focusData
    },
    filterTodo (todo, startDate, endDate) {
      let currentTodo = null
      const focusData = this.filterFocusData(todo, startDate, endDate)

      if (focusData.length) {
        currentTodo = _.cloneDeep(todo)
        currentTodo.focus = []
        currentTodo.focus.push(...focusData)
      }
      return currentTodo
    },
    getTodosByFocusTime (startDate = new Date(2000), endDate = new Date()) {
      const currentTodos = []

      this.todos.forEach(todo => {
        const currentTodo = this.filterTodo(todo, startDate, endDate)

        if (currentTodo) {
          currentTodos.push(currentTodo)
        }
      })
      return currentTodos
    },
    getStopData (start = new Date(2000), end = new Date()) {
      const stopData = []

      this.todos.forEach(todo => {
        const data = this.filterStopData(todo, start, end)

        stopData.push(...data)
      })
      return stopData
    },
    getFocusDataByFocusTime (date = new Date(2000), endDate = new Date()) {
      const focusData = []

      this.todos.forEach(todo => {
        const data = this.filterFocusData(todo, date, endDate)

        focusData.push(...data)
      })
      return focusData
    },
    getAllFocus (start = new Date(2000), end = new Date()) {
      return todoUtil.getFocusByTime(this.focus, start, end)
    },
    getFocusStatistics (data, unit) {
      const result = {}

      if (unit === 'hour') {
        data.forEach(item => {
          const { start: time, duration } = item
          const days = util.getMonthDays(time)
          const date = time.getDate()
          const hours = time.getHours()
          const minutes = time.getMinutes()

          result[hours] = result[hours] || 0
          if (minutes + duration > 60) {
            const cduraion = 60 - minutes

            result[hours] += 60 - minutes
            if (date + 1 <= days) {
              const nextHours = hours + 1 > 23 ? 0 : hours + 1

              result[nextHours] = duration - cduraion
            }
          } else {
            result[hours] += duration
          }
        })
        return result
      }

      if (unit === 'day') {
        data.forEach(item => {
          const { start: time, duration } = item
          const days = util.getMonthDays(time)
          const date = time.getDate()
          const hours = time.getHours()

          result[date] = result[date] || 0
          if (hours + duration / 60 > 24) {
            const cduraion = (24 - hours) * 60

            result[date] += (24 - hours) * 60
            const nextDate = date + 1

            if (nextDate <= days) {
              result[nextDate] = duration - cduraion
            }
          } else {
            result[date] += duration
          }
        })
        return result
      }

      if (unit === 'month') {
        data.forEach(item => {
          const { start: time, duration } = item
          const days = util.getMonthDays(time)
          const month = time.getMonth()
          const date = time.getDate()
          const hours = time.getHours()

          result[month] = result[month] || 0
          if (hours + duration / 60 > 24) {
            const nextDate = date + 1

            if (nextDate > days) {
              const cduraion = (24 - hours) * 60

              result[month] += cduraion
              const nextMonth = month + 1

              if (nextMonth <= 11) {
                result[nextMonth] = duration - cduraion
              }
            } else {
              result[month] += duration
            }
          } else {
            result[month] += duration
          }
        })
        return result
      }
    },
    // 得到目标日期所在的时间段（日、周、月、年）
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
        return [new Date(today.getTime() - (day - 1) * oneDay), new Date(today.getTime() + (8 - day) * oneDay)]
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
    getClocks (start, end) {
      return this.clocks.filter(item => item >= start && item <= end)
    },
    setAllFocusData () {
      const focusData = this.getAllFocus()
      const times = focusData.length
      const duration = focusData.reduce((total, data) => {
        return total + data.duration
      }, 0)
      const average = duration / 5

      this.allFocusData = {
        times,
        duration,
        average
      }
    },
    setTodayFocusData () {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      const today = new Date(year, month, day)
      const focusData = this.getAllFocus(today)
      const times = focusData.length
      const duration = focusData.reduce((total, data) => {
        return total + data.duration
      }, 0)

      this.todayFocusData = {
        times,
        duration
      }
    },
    changeChart (chart, type) {
      this.changePeriod(chart, type)
      if ([this.focusChart].includes(chart)) {
        this.initTodos(chart)
        return
      }
      if ([this.workTimeChart].includes(chart)) {
        this.initFocus(chart, 'hour')
        return
      }
      if ([this.monthlyChart].includes(chart)) {
        this.initFocus(chart, 'day')
        return
      }
      if ([this.clockChart].includes(chart)) {
        this.initClocks(chart)
      }
      if ([this.yearlyChart].includes(chart)) {
        this.initFocus(chart, 'month')
        return
      }
      if ([this.stopChart].includes(chart)) {
        this.initStops(chart)
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
    },
    initTodos (chart) {
      if (chart.period[1] > new Date()) {
        chart.data = this.getTodosByFocusTime(chart.period[0], new Date())
        return
      }
      chart.data = this.getTodosByFocusTime(...chart.period)
    },
    initFocus (chart, unit) {
      let focus = []

      if (chart.period[1] > new Date()) {
        focus = this.getFocusDataByFocusTime(chart.period[0], new Date())
      } else {
        focus = this.getFocusDataByFocusTime(...chart.period)
      }
      chart.data = this.getFocusStatistics(focus, unit)
    },
    initClocks (chart) {
      if (chart.period[1] > new Date()) {
        chart.data = this.getClocks(chart.period[0], new Date())
        return
      }
      chart.data = this.getClocks(...chart.period)
    },
    initStops (chart) {
      if (chart.period[1] > new Date()) {
        chart.data = this.getStopData(chart.period[0], new Date())
        return
      }
      chart.data = this.getStopData(...chart.period)
    },
    initPeriod (chart, range) {
      const period = this.getPeriod(range)

      chart.period = period
      chart.range = range
    },
    initFocusChart (range) {
      const chart = this.focusChart

      this.initPeriod(chart, range)
      this.initTodos(chart)
    },
    initWorkTimeChart () {
      const chart = this.workTimeChart

      this.initPeriod(chart, 'month')
      this.initFocus(chart, 'hour')
    },
    initMonthlyChart () {
      const chart = this.monthlyChart

      this.initPeriod(chart, 'month')
      this.initFocus(chart, 'day')
    },
    initClockChart () {
      const chart = this.clockChart

      this.initPeriod(chart, 'month')
      this.initClocks(chart, 'day')
    },
    initYearlyChart () {
      const chart = this.yearlyChart

      this.initPeriod(chart, 'year')
      this.initFocus(chart, 'month')
    },
    initStopChart () {
      const chart = this.stopChart

      this.initPeriod(chart, 'month')
      this.initStops(chart)
    }
  }
}
</script>

<style lang="less">
.statistical-data {
  height: 100%;
  padding: 0.2rem;

  .data-panel {
    background: #fff;
    margin-bottom: 0.2rem;
  }
}

.statistical-hd-con {
  height: 50px;
}

.statistical-hd {
  .flex(@justify-content: space-between; @align-items: center;);
  position: fixed;
  top: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  color: white;
  font-size: 18px;
  z-index: 10;
}

.focus-data {
  color: white;
  text-align: left;

  .column {
    .flex(@flex-direction: column; @align-items: center;);
    flex: 1;
  }

  .text {
    .scale-font(0.9;center;center);
    opacity: 0.7;
  }

  .focus-data-inlne {
    position: relative;
  }

  .number {
    font-size: 24px;
  }

  .unit {
    .scale-font(0.6;left;center);
    opacity: 0.7;
    position: absolute;
    white-space: nowrap;
    bottom: 0;
    margin-left: 2px;
  }
}
</style>
