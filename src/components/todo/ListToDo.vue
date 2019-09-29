<template>
  <div class="list-todo">
    <ListItem
      v-for="(data,index) in datas"
      :key="index"
      v-bind="{...data}"
      class="item"
      @start="start(index)"
      @edit="edit(index)"
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
    <ComPopup
      :show.sync="showBoxInfo"
      :title="todo.name"
      class="box-edit-todo"
    >
      <template v-slot:headerIcon>
        <div class="btn-container">
          <span>
            <i class="fa fa-clock-o" />
            <span>定时提醒/学霸</span>
          </span>
          <span>
            <i
              class="fa fa-picture-o"
              aria-hidden="true"
            />
            <span>更换背景</span>
          </span>
          <span>
            <i
              class="fa fa-mobile"
              aria-hidden="true"
            />
            <span>独立白名单</span>
          </span>
        </div>
      </template>
      <template v-slot:content>
        <div />
      </template>
    </ComPopup>
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
      showBoxInfo: false,
      todo: {

      }
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
  watch: {
  },
  mounted () {
    console.log(this.datas)


  },
  methods: {
    start () {
      console.log('start')

    },
    edit (index) {
      this.todo = this.todos[index]
      console.log(this.todo)

      console.log('info')
      this.showBoxInfo = true

    }

  }
}
</script>

<style lang="less">
.list-todo{
  padding: 0 12px;

  .item{
    margin-top: 8px;
  }

  .btn-container {
    .flex();

    &>span {

      .flex(@flex-direction: column;@align-items: center;);

      .fa {
        font-size:20px;
      }

      span {
        margin-top: 6px;
        font-size: 10px;
        .scale(0.7;center;center);
        letter-spacing: 0.5px;
      }
    }
  }
}

</style>
