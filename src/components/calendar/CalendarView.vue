<template>
  <div>
    <ev-calendar
      :options="options"
      @select-day="selectDay"
    >
      <template #events="scope">
        <ev-event
          v-for="(todo,index) in completedTodos"
          :key="index"
          :event="{date:todo.start}"
        >
          <ListItem
            :key="todo.name"
            class="completed-item"
            :name="todo.name"
            :description="todo.duration"
            :deadline="todo.status+todo.reason"
            :content="todo.experience"
          />
        </ev-event>
      </template>
    </ev-calendar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ListItem from '@/components/todo/ListItem'
import util from '@/util.js'
export default {
  components: {
    ListItem
  },
  data () {
    return {
      options: {
        baseColor: '#f29543',
        events: [
          {
            date: new Date('2019/12/5 10:25') // Required
          },
          {
            date: new Date('2020/1/2 5:30')
          }
        ]
      },
      completedTodos: []
    }
  },
  computed: {
    ...mapState('todo', {
      todos: state => state.todos
    }),
    ...mapState('todo', {
      sets: state => state.todoSets
    }),
    allTodos () {
      const all = this.todos
      this.sets.forEach(set => {
        all.push(...set.todos)
      })
      return all
    }
  },
  watch: {
    slotProps (val) {
      console.log(val)

    }
  },
  mounted () {
    console.log(this.events)

  },
  methods: {
    getCompletedTodos (date) {
      const data = []
      this.allTodos.forEach((todo) => {
        if (todo.completed) {
          todo.completed.forEach((item) => {
            if (util.isEqualDateFuzzy(item.start, date, 'hour')) {
              const duration = this.getTimeDif(item.start, item.end)
              let progress = ''
              if (todo.timeDuration) {
                progress = duration / todo.timeDuration
              }
              const obj = {
                start: item.start,
                end: item.end,
                name: todo.name,
                experience: item.experience || this.$t('todo.click_fill_in_experience'),
                duration: duration + this.$t('word.minute'),
                status: item.reason ? this.$t('todo.abandon_in_half') : this.$t('todo.completed'),
                reason: item.reason || '',
                progress: progress
              }
              data.push(obj)
            }
          })
        }
      })
      this.completedTodos = data
      console.log(this.completedTodos)

    },
    getTimeDif (start, end) {
      return Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
    },
    getProgress (duration, total) {
      return Math.floor(duration / total) * 100
    },
    selectDay (date) {
      this.getCompletedTodos(date)
    }
  }
}
</script>

<style lang="less">
.completed-item {
  padding: 8px 5px 8px 15px;

  .right .btn-start {
    display: none;
  }

  .left {
    .content {
      margin-top: 10px;
    }

    .card {
      margin-top: 10px;
    }
  }

  .right {
    width: 50px;
    text-align: right;

    .deadline {
      position: relative;
      top: 0;
      left: 0;
      transform: translate(0%, 0%) scale(1);
      font-size: 10px;
      letter-spacing: 1px;
      white-space: normal;
    }
  }
}
</style>
