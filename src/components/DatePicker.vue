<template>
  <div class="date-picker">
    <ComPopup
      :title="$t('common.choose_time')"
      class="box-date-picker"
      :show.sync="curShow"
      top-btn
      v-bind="boxAttrs"
      v-on="boxListeners"
      @closed="$emit('update:show',false)"
    >
      <div
        v-if="isRange"
        class="date-picker__start-title"
      >
        {{ $t('todo.start_time')+':' }}
      </div>
      <ComCascader
        v-model="curStartVal"
        :data="startData"
        @change="handleChange"
      />
      <div
        v-if="isRange"
        class="date-picker__end-title"
      >
        {{ $t('todo.end_time')+':' }}
      </div>
      <ComCascader
        v-if="isRange"
        v-model="curEndVal"
        :data="endData"
        @change="handleChange"
      />
    </ComPopup>
  </div>
</template>

<script>
import util from '@/js/util.js'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => {[]}
    },
    type: {
      type: String,
      default: 'time'
    },
    isRange: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      curStartVal: this.value,
      curEndVal: this.value,
      curShow: this.show,
      startData: [],
      endData: []
    }
  },
  computed: {
    boxListeners: function () {
      return this.$listeners
    },
    boxAttrs () {
      return this.$attrs
    }
  },
  watch: {
    show (val) {
      this.curShow = val
    },
    curShow (val) {
      if (val) {
        this.init()
      }
    },
    value (val) {
      if (this.isRange) {
        this.curStartVal = val[0]
        this.curEndVal = val[1]
      } else {
        this.curStartVal = val
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.initData()
      if (this.isRange) {
        this.endData = this.startData
        this.curStartVal = this.value[0]
        this.curEndVal = this.value[1]
      }
    },
    initData () {
      if (this.type === 'time') {
        this.startData = this.getHourMinute()
        return
      }
      if (this.type === 'date') {
        this.startData = this.getYearMonthDay()
        return
      }
    },
    getHourMinute () {
      const data = []

      for (let hour = 0; hour < 24; hour++) {
        const item = {
          value: hour,
          label: util.addZero(hour, 10) + '点',
          children: []
        }

        for (let minute = 0; minute < 60; minute++) {
          item.children.push({
            value: minute,
            label: util.addZero(minute, 10) + '分'
          })
        }
        data.push(item)
      }
      return data
    },
    getYearMonthDay () {
      const data = []

      for (let year = 2000; year <= 2050; year++) {
        const item = {
          value: year,
          label: year + '年',
          children: []
        }

        for (let month = 1; month <= 12; month++) {
          const secondChildren = {
            value: month,
            label: util.addZero(month, 10) + '月',
            children: []
          }

          item.children.push(secondChildren)
          for (let day = 1; day <= util.getMonthDays(new Date(year, month - 1)); day++) {
            const thirdChildren = {
              value: day,
              label: util.addZero(day, 10) + '日'
            }

            secondChildren.children.push(thirdChildren)
          }
        }
        data.push(item)
      }
      return data
    },
    handleChange () {
      if (this.isRange) {
        this.$emit('input', [this.curStartVal, this.curEndVal])
      } else {
        this.$emit('input', this.curStartVal)
      }
    }
  }
}
</script>

<style lang='less'>
.box-date-picker {
  .com-popup__content {
    padding: 0;
  }
}

.date-picker__start-title,.date-picker__end-title {
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 600;
}

.com-cascader {
  background: rgb(248, 248, 248);
}

.com-cascader__list-item {
  color: rgb(129, 129, 129);
}

</style>
