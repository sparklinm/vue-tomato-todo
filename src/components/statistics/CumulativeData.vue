<template>
  <div>
    <DataPanel
      :title="$t('todo.cumulative_data')"
      class="sta-data"
    >
      <div class="column">
        <span class="text">{{ $t('todo.focus_times') }}</span>
        <span class="number">{{ allFocusData.times }}</span>
      </div>
      <div class="column">
        <span class="text">{{ $t('todo.focus_duration') }}</span>
        <span class="sta-data-inlne">
          <span class="number">{{ allFocusData.duration }}</span>
          <span class="unit">{{ $t('word.minute') }}</span>
        </span>
      </div>
      <div class="column">
        <span class="text">{{ $t('todo.everyday_focus') }}</span>
        <span class="sta-data-inlne">
          <span class="number">{{ allFocusData.average }}</span>
          <span class="unit">{{ $t('word.minute') }}</span>
        </span>
      </div>
    </DataPanel>

    <DataPanel
      :title="$t('todo.cumulative_data')"
      class="sta-data"
    >
      <div class="column">
        <span class="text">{{ $t('todo.focus_times') }}</span>
        <span class="number">{{ todayFocusData.times }}</span>
      </div>
      <div class="column">
        <span class="text">{{ $t('todo.focus_duration') }}</span>
        <span class="sta-data-inlne">
          <span class="number">{{ todayFocusData.duration }}</span>
          <span class="unit">{{ $t('word.minute') }}</span>
        </span>
      </div>
    </DataPanel>
    <v-chart :options="polar" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DataPanel from './DataPanel'
export default {
  components: {
    DataPanel
  },
  data () {
    const data = []

    for (let i = 0; i <= 360; i++) {
      const t = i / 180 * Math.PI
      const r = Math.sin(2 * t) * Math.cos(2 * t)
      data.push([r, i])
    }
    return {
      polar: {
        title: {
          text: '极坐标双数值轴'
        },
        legend: {
          data: ['line']
        },
        polar: {
          center: ['50%', '54%']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        angleAxis: {
          type: 'value',
          startAngle: 0
        },
        radiusAxis: {
          min: 0
        },
        series: [
          {
            coordinateSystem: 'polar',
            name: 'line',
            type: 'line',
            showSymbol: false,
            data: data
          }
        ],
        animationDuration: 2000
      },
      allFocusData: {
        times: 0,
        duration: 0,
        average: 0
      },
      todayFocusData: {
        times: 0,
        duration: 0
      }
    }
  },
  computed: {
    ...mapState('todo', {
      todos: state => state.todos,
      todoSets: state => state.todoSets
    })
  },
  mounted () {
    this.setAllFocusData()
    this.setTodayFocusData()
  },
  methods: {
    getTodosByFocusTime (date = new Date(2000)) {
      const currentTodos = []
      const todos = this.todos.filter(todo => {

        return todo.focus.some(item => {
          return item.time > date && item.duration >= 1
        })
      })
      currentTodos.push(...todos)

      this.todoSets.forEach(sets => {
        const todos = sets.todos.filter(todo => {
          return todo.focus.some(item => {
            return item.time > date && item.duration >= 1
          })
        })
        currentTodos.push(...todos)
      })
      return currentTodos
    },
    getFocusDataByFocusTime (date = new Date(2000)) {
      const focusData = []
      this.todos.forEach(todo => {
        const data = todo.focus.filter(item => {
          return item.time > date && item.duration >= 1
        })
        focusData.push(...data)
      })
      this.todoSets.forEach(set => {
        set.todos.forEach(todo => {
          const data = todo.focus.filter(item => {
            return item.time > date && item.duration >= 1
          })
          focusData.push(...data)
        })
      })
      return focusData
    },
    setAllFocusData () {
      const focusData = this.getFocusDataByFocusTime()
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
      const focusData = this.getFocusDataByFocusTime(today)
      const times = focusData.length
      const duration = focusData.reduce((total, data) => {
        return total + data.duration
      }, 0)
      this.todayFocusData = {
        times,
        duration
      }
    }
  }
}
</script>

<style lang="less">
.sta-data {
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

  .sta-data-inlne {
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
