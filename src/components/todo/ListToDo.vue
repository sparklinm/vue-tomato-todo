<template>
  <div class="list">
    <ListItem
      v-for="(data,index) in datas"
      :key="index"
      v-bind="{...data}"
      class="item"
    >
      <template
        v-slot:progressBar
      >
        <ProgressCircle
          v-if="data.progressBar"
          :width="18"
          :progress="data.progressBar"
        />
      </template>
    </ListItem>
  </div>
</template>

<script>
import ListItem from './ListItem'
import ProgressCircle from './ProgressCircle'
export default {
  components: {
    ListItem,
    ProgressCircle
  },
  props: {
    todos: {
      type: Array,
      default: null
    }
  },
  data () {
    return {

    }
  },
  computed: {
    datas () {
      return this.todos.map((todo) => {
        let description = ''
        let progress = ''
        let deadline = ''
        let progressBar = ''


        if (todo.timeDuration) {
          description += `${todo.timeDuration} 分钟`
        } else {
          description += todo.timeWay
        }
        if (todo.type !== '普通番茄时钟') {
          description += `-${todo.type}`
        }

        if (todo.goal) {
          progress += `${todo.goal.complete}/${todo.goal.total} ${todo.goal.customUnit || '分钟'}`
          progressBar = Math.ceil(todo.goal.complete / todo.goal.total * 100)
          deadline = `离计划结束:${Math.ceil((todo.goal.deadline - new Date()) / (1000 * 60 * 60 * 24))}天`
        } else if (todo.habit) {
          progress += `今日:${todo.habit.complete}/${todo.habit.piece} ${todo.habit.customUnit || '分钟'}`
          progressBar = Math.ceil(todo.habit.complete / todo.habit.piece * 100)
        }


        return {
          name: todo.name,
          description: description,
          progress: progress,
          deadline: deadline,
          progressBar: progressBar
        }
      })
    }
  },
  mounted () {
    console.log(this.datas)


  },
  methods: {

  }
}
</script>

<style lang="less">
.list{
  padding: 0 12px;

  .item{
    margin-top: 8px;
  }
}

</style>
