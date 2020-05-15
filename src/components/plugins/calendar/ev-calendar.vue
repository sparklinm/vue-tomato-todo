<template>
  <div class="ev-calendar-wrapper">
    <cal-panel
      :events="events"
      :calendar="calendarOptions"
      :selected-day="selectedDayEvents.date"
      @select-day="selectDay"
      @pre-month="preMonth"
      @next-month="nextMonth"
      @to-month="toMonth"
    >
      <template #headerLeftBtn>
        <slot
          name="headerLeftBtn"
        />
      </template>
    </cal-panel>
    <div class="ev-events">
      <div class="ev-events__inner">
        <slot
          name="events"
          :curDay="selectedDayEvents"
        />
      </div>
    </div>
  </div>
</template>
<script>
import util from './tools.js'
import calPanel from './components/cal-panel.vue'

export default {
  name: 'VueEventCalendar',
  provide () {
    return {
      options: this.curOptions
    }
  },
  components: {
    'cal-panel': calPanel
  },
  props: {
    // locale: 'zh',
    // color: '#f29543'
    // width:''(暂无用)
    // events
    options: {
      type: Object,
      required: false,
      default: () => ({})
    },
    // 初始选择的日期，只需要年、月、日匹配
    value: {
      type: Date,
      default: () => (new Date())
    }
  },
  data () {
    const defaultOptions = {
      locale: 'zh',
      color: '#f29543',
      events: [],
      // 可选日期最小值
      min: '',
      // 可选日期最大值
      max: ''
    }

    return {
      selectedDayEvents: {
        events: this.events || [],
        date: this.value
      },
      curDate: new Date(),
      nextDate: null,
      preDate: null,
      curOptions: this.$EventCalendar
    }
  },
  computed: {
    events () {
      return this.options.events || []
    },
    calendarOptions () {
      return {
        // 月份中的任何一天
        curDate: this.curDate,
        preDate: this.preDate,
        nextDate: this.nextDate,
        curEventsDate: 'all'
      }
    }
  },
  watch: {
    options: {
      handler (val) {
        Object.assign(this.curOptions, val)
      },
      deep: true,
      immediate: true
    },
    value (val) {
      this.setSelectedDayEvents(val)
    }
  },
  created () {
    const date = this.value

    // 初始化
    if (this.options.min && this.value < this.options.min) {
      this.curDate = new Date(this.options.min.getFullYear(), this.options.min.getMonth())
    } else {
      this.curDate = new Date(date.getFullYear(), date.getMonth())
    }
    this.initDate()
    this.setSelectedDayEvents(this.value)
  },
  methods: {
    initSelectedDayEvents () {
      this.selectedDayEvents = {
        date: 'all',
        events: this.events || []
      }
    },
    setSelectedDayEvents (date) {
      let selectedDay = date

      // 选择日期不能低于最小值
      if (date < this.options.min) {
        selectedDay = this.options.min
      }
      const events = this.events.filter(function (event) {
        return util.isEqualDateFuzzy(selectedDay, event.date, 'hour')
      })

      this.selectedDayEvents = {
        date: selectedDay,
        events: events
      }
    },
    selectDay (date) {
      this.setSelectedDayEvents(date)
      this.$emit('input', this.selectedDayEvents.date)
      this.$emit('select-day', this.selectedDayEvents.date)
    },
    getAllTime (dateObj) {
      return {
        year: dateObj.getFullYear(),
        month: dateObj.getMonth(),
        date: dateObj.getDate()
      }
    },
    getPreMonthDate (dateObj) {
      const allTime = this.getAllTime(dateObj)
      let { year, month } = allTime

      if (month > 0) {
        month--
      } else {
        year--
        month = 11
      }
      return new Date(year, month, 1)
    },
    getNextMonthDate (dateObj) {
      const allTime = this.getAllTime(dateObj)
      let { year, month } = allTime

      if (month < 11) {
        month++
      } else {
        year++
        month = 0
      }
      return new Date(year, month, 1)
    },
    getPreYearDate (dateObj) {
      const allTime = this.getAllTime(dateObj)
      const { year, month } = allTime

      return new Date(year - 1, month, 1)
    },
    getNextYearDate (dateObj) {
      const allTime = this.getAllTime(dateObj)
      const { year, month } = allTime

      return new Date(year + 1, month, 1)
    },
    initDate () {
      const fisrtDay = new Date(this.curDate.getFullYear(), this.curDate.getMonth())
      const lastDay = new Date(fisrtDay)

      lastDay.setMonth(lastDay.getMonth() + 1)
      if (this.options.min && this.options.min >= fisrtDay && this.options.min < lastDay) {
        this.preDate = null
        this.nextDate = this.getNextMonthDate(this.curDate)
      } else {
        this.preDate = this.getPreMonthDate(this.curDate)
        this.nextDate = this.getNextMonthDate(this.curDate)
      }
    },
    autoSelectDay () {
      // 如果显示的这个月与今天在同一月，自动选择今天
      if (util.isEqualDateFuzzy(this.curDate, new Date(), 'date')) {
        this.selectDay(new Date())
        return
      }
      // 否则，选择那个月的第一天
      this.selectDay(this.curDate)
    },
    nextMonth () {
      this.curDate = this.getNextMonthDate(this.curDate)
      this.initDate()
      this.autoSelectDay()
    },
    preMonth () {
      this.curDate = this.getPreMonthDate(this.curDate)
      this.initDate()
      this.autoSelectDay()
    },
    toMonth (date) {
      this.curDate = date
      this.initDate()
      this.autoSelectDay()
    }
  }
}
</script>
<style lang="less"></style>
