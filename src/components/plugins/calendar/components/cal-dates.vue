<template>
  <div
    class="ev-calendar__dates"
  >
    <div
      v-for="(item,index) in dayList"
      :key="index"
      class="ev-calendar__dates-item"
      :class="[
        ...item.customClass
      ]"
    >
      <span
        class="ev-calendar__dates-value"
        :style="item.style"
        :class="{'ev-calendar__dates-value_gray':item.status!=='cur'}"
        @click="selectDay(item.date)"
      >
        {{ item.value }}
      </span>
    </div>
  </div>
</template>

<script>
import util from '../tools.js'
export default {
  inject: ['options'],
  props: {
    events: {
      type: Array,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    selectedDay: {
      type: [Date, String],
      required: false
    }
  },
  data () {
    return {
      curSelectedDay: new Date(),
      util: util
    }
  },
  computed: {
    fullTime () {
      const curDate = this.date
      return {
        year: curDate.getFullYear(),
        month: curDate.getMonth(),
        date: curDate.getDate(),
        day: curDate.getDay()
      }
    },
    today () {
      const date = new Date()
      return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    },
    customColor () {
      return this.options.color
    },
    dayList () {
      const day = this.fullTime.day
      const result = []

      // 上一个月
      const preMonth = util.getPreMonth(this.date)
      const preMonthDays = util.getMonthDays(preMonth)
      for (let i = day - 1; i >= 0; i--) {
        const iDate = new Date(preMonth)
        iDate.setDate(preMonthDays - i)
        const obj = {
          value: preMonthDays - i,
          date: iDate,
          status: 'pre'
        }
        result.push(obj)
      }

      // 本月
      const monthDays = util.getMonthDays(this.date)
      for (let i = 0; i < monthDays; i++) {
        const iDate = new Date(this.date)
        iDate.setDate(i + 1)
        const obj = {
          value: i + 1,
          date: iDate,
          status: 'cur',
          customClass: []
        }

        this.events.forEach(event => {
          if (util.isEqualDateFuzzy(obj.date, event.date, 'hour')) {
            obj.style = {
              borderColor: this.customColor
            }
            if (event.customClass) obj.customClass.push(event.customClass)
          }
        })

        if (util.isEqualDateFuzzy(obj.date, this.today, 'hour')) {
          obj.style = obj.style || {}
          obj.style.color = this.customColor
        }

        if (util.isEqualDateFuzzy(obj.date, this.curSelectedDay, 'hour')) {
          obj.style = obj.style || {}
          Object.assign(obj.style, {
            background: this.customColor,
            color: '#fff'
          })
        }
        result.push(obj)
      }

      // 下月
      const newxMonth = util.getNextMonth(this.date)
      const lastDay = result[result.length - 1].date.getDay()
      for (let i = 0; i < 6 - lastDay; i++) {
        const iDate = new Date(newxMonth)
        iDate.setDate(i + 1)
        const obj = {
          value: i + 1,
          date: iDate,
          status: 'nex'
        }
        result.push(obj)
      }
      return result
    }
  },
  watch: {
    selectedDay (val) {
      this.selectDay(val)
    }
  },
  mounted () {
    this.curSelectedDay = this.today
  },
  methods: {
    selectDay (date) {
      this.curSelectedDay = date
      this.$emit('select-day', date)
    }
  }
}
</script>

<style lang='less'>


</style>
