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
    options: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data () {
    return {
      selectedDayEvents: {
        events: this.events || [] // default show all event
      },
      curDate: new Date(),
      nextDate: null,
      preDate: null,
      curOptions: this.$EventCalendar
    }
  },
  computed: {
    events () {
      return this.options.events
    },
    calendarOptions () {
      return {
        curDate: this.curDate,
        preDate: this.preDate,
        nextDate: this.nextDate,
        curEventsDate: 'all'
      }
    }
  },
  watch: {
    events () {
      this.selectedDayEvents = {
        date: 'all',
        events: this.events || []
      }
    },
    options: {
      handler (val) {
        Object.assign(this.curOptions, val)
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.initSelectedDayEvents()
    const date = new Date()
    this.curDate = new Date(date.getFullYear(), date.getMonth())
    this.initDate()
  },
  methods: {
    initSelectedDayEvents () {
      this.selectedDayEvents = {
        date: 'all',
        events: this.events || []
      }
    },
    selectDay (date) {
      const events = this.events.filter(function (event) {
        return util.isEqualDateFuzzy(date, event.date, 'hour')
      })

      this.selectedDayEvents = {
        date: date,
        events: events
      }
      this.$emit('select-day', date)
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
      this.preDate = this.getPreMonthDate(this.curDate)
      this.nextDate = this.getNextMonthDate(this.curDate)
    },
    nextMonth () {
      this.curDate = this.getNextMonthDate(this.curDate)
      this.initDate()
    },
    preMonth () {
      this.curDate = this.getPreMonthDate(this.curDate)
      this.initDate()
    },
    toMonth (date) {
      this.curDate = date
      this.initDate()
    }
  }
}
</script>
<style lang="less"></style>
