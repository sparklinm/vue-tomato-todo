<template>
  <div
    class="ev-calendar"
    :style="containerStyle"
  >
    <div
      class="ev-calendar__header"
      :style="{background:options.color}"
    >
      <div class="ev-calendar__title">
        <slot name="headerLeftBtn" />
        {{ curSelectedDayView }}
        <span class="ev-calendar_title-year">
          {{ curSelectedYear }}
        </span>
      </div>
      <svg
        class="ev-calendar_today-icon"
        style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2415"
        @click="today"
      ><path
        d="M753.6 222.4h24c19.2 0 33.6-14.4 33.6-32V57.6c0-19.2-14.4-33.6-33.6-33.6h-24c-19.2 0-33.6 14.4-33.6 33.6v131.2c0 19.2 14.4 33.6 33.6 33.6zM251.2 222.4h24c19.2 0 33.6-14.4 33.6-32V57.6c0-19.2-14.4-33.6-33.6-33.6h-24c-19.2 0-33.6 14.4-33.6 33.6v131.2c0 19.2 14.4 33.6 33.6 33.6z"
        fill="#2C2C2C"
        p-id="2416"
      /><path
        d="M928 134.4h-68.8v56c0 41.6-33.6 76.8-80 76.8h-24c-43.2 0-80-33.6-80-76.8V134.4h-320v56c0 41.6-33.6 76.8-80 76.8h-24c-43.2 0-80-33.6-80-76.8V134.4H105.6c-38.4 0-68.8 28.8-68.8 67.2v731.2c0 38.4 30.4 67.2 68.8 67.2h820.8c38.4 0 68.8-28.8 70.4-67.2V201.6c0-38.4-30.4-67.2-68.8-67.2zM105.6 932.8V355.2h820.8s0 577.6 1.6 577.6H105.6z"
        fill="#2C2C2C"
        p-id="2417"
      /><path
        d="M500.8 548.8l-49.6 33.6c14.4 16 33.6 41.6 60.8 75.2l54.4-35.2c-19.2-22.4-40-46.4-65.6-73.6z"
        fill="#2C2C2C"
        p-id="2418"
      /><path
        d="M553.6 451.2l14.4-14.4v-1.6H480c-51.2 68.8-118.4 121.6-196.8 155.2 11.2 12.8 25.6 28.8 41.6 54.4 80-40 142.4-89.6 188.8-148.8 43.2 59.2 102.4 107.2 180.8 144 14.4-19.2 27.2-35.2 41.6-52.8-76.8-30.4-137.6-76.8-182.4-136zM339.2 716.8h246.4c-30.4 43.2-62.4 81.6-94.4 116.8l60.8 33.6c49.6-56 89.6-108.8 123.2-155.2v-54.4h-336v59.2z"
        fill="#2C2C2C"
        p-id="2419"
      /></svg>
    </div>
    <div
      class="ev-calendar__body"
    >
      <div
        class="ev-calendar__weeks"
        :style="{color:options.color}"
      >
        <span
          v-for="(dayName, dayIndex) in i18n[options.locale].dayNames"
          :key="dayIndex"
          class="ev-calendar__weeks-item"
        >
          {{ dayName }}
        </span>
      </div>

      <div class="ev-calendar__main-container">
        <div
          ref="main"
          class="ev-calendar__main"
        >
          <cal-dates
            v-if="calendar.preDate"
            ref="pre"
            :events="events"
            :date="calendar.preDate"
            :selected-day="curSelectedDay"
            @select-day="selectDay"
          />
          <cal-dates
            ref="cur"
            :events="events"
            :date="calendar.curDate"
            :selected-day="curSelectedDay"
            @select-day="selectDay"
          />
          <cal-dates
            v-if="calendar.nextDate"
            ref="next"
            :events="events"
            :date="calendar.nextDate"
            :selected-day="curSelectedDay"
            @select-day="selectDay"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '../i18n.js'
import util, { dateTimeFormatter } from '../tools.js'
import Broadcast from './Broadcast.js'
import calDates from './cal-dates.vue'

export default {
  inject: ['options'],
  components: {
    calDates
  },
  props: {
    events: {
      type: Array,
      required: true
    },
    calendar: {
      type: Object,
      required: true
    },
    selectedDay: {
      type: [Date, String],
      default: () => (new Date())
    }
  },
  data () {
    return {
      i18n,
      curSelectedDay: this.selectedDay,
      broadcast: null
    }
  },
  computed: {
    curSelectedDayView () {
      return dateTimeFormatter(
        this.curSelectedDay,
        this.i18n[this.options.locale].month_dates
      )
    },
    curSelectedYear () {
      return this.curSelectedDay.getFullYear()
    },
    containerStyle () {
      if (this.events.length) {
        return {
          borderBottom: `1px solid ${this.options.color}`
        }
      }
      return {}
    }
  },
  watch: {
    options: {
      handler (val) {
        console.log(val)

      },
      deep: true
    },
    selectedDay (val) {
      this.curSelectedDay = val
    }
  },
  mounted () {
    this.broadcast = new Broadcast(this.$refs.main, {
      loop: false,
      timingHeight: true
    })
    this.initCard()
    this.broadcast.on('onFirstItem', () => {
      this.$parent.calendarHeight = this.broadcast.conHeight
      this.$emit('pre-month')
      this.$nextTick(() => {
        this.initCard()
      })
    })
    this.broadcast.on('onLastItem', () => {
      this.$emit('next-month')
      this.$nextTick(() => {
        this.initCard()
      })
    })
  },
  methods: {
    pre () {
      this.broadcast.pre()
    },
    next () {
      this.broadcast.next()
    },
    today () {
      this.$emit('to-month', new Date())
      this.$nextTick(() => {
        this.broadcast.init()
        this.broadcast.toItem(1, false)
      })
    },
    selectDay (date) {
      this.curSelectedDay = date
      this.$emit('select-day', date)
    },
    initCard () {
      if (this.broadcast) {
        this.broadcast.destroy()
      }
      this.broadcast.init()
      if (this.calendar.preDate) {
        this.broadcast.toItem(1, false)
      }
    }
  }
}
</script>
