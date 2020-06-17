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
      <div
        class="ev-calendar__dates-item__inline"
        :style="item.style"
        :class="{'ev-calendar__dates-item__inline_gray':item.status!=='cur'}"
        @click="selectDay(item)"
      >
        <span class="ev-calendar__dates-value">
          {{ item.value }}
        </span>
      </div>
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
    // 显示月份中的任何一天
    date: {
      type: Date,
      required: true
    },
    selectedDay: {
      type: [Date, String],
      default: () => (new Date())
    }
  },
  data () {
    return {
      curSelectedDay: this.selectedDay,
      util: util
    }
  },
  computed: {
    curMonth () {
      const curDate = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        1
      )

      return {
        year: curDate.getFullYear(),
        month: curDate.getMonth(),
        date: curDate.getDate(),
        day: curDate.getDay()
      }
    },
    min () {
      const min = this.options.min

      if (min) {
        const minDay = new Date(min.getFullYear(), min.getMonth(), min.getDate())

        return minDay
      }
      return ''
    },
    max () {
      const max = this.options.max

      if (max) {
        const maxDay = new Date(max.getFullYear(), max.getMonth(), max.getDate())

        return maxDay
      }
      return ''
    },
    today () {
      const date = new Date()

      return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    },
    customColor () {
      return this.options.color
    },
    dayList () {
      const day = this.curMonth.day
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
        const iDate = new Date(this.date.getFullYear(), this.date.getMonth())

        iDate.setDate(i + 1)
        const obj = {
          value: i + 1,
          date: iDate,
          status: 'cur',
          customClass: []
        }

        if (this.min && obj.date < this.min) {
          obj.status = 'non'
        }

        if (this.max && obj.date > this.max) {
          obj.status = 'non'
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
      this.curSelectedDay = val
    }
  },
  mounted () {
  },
  methods: {
    selectDay (item) {
      if (item.status !== 'cur') {
        return
      }
      this.curSelectedDay = item.date
      this.$emit('select-day', item.date)
    }
  }
}
</script>

<style lang='less'>


</style>
