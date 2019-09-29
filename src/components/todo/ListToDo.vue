<template>
  <div class="list-todo">
    <ListItem
      v-for="(data,index) in datas"
      :key="index"
      v-bind="{...data}"
      class="list-todo__item"
      @start="start(index)"
      @edit="edit(index)"
    >
      <template v-slot:progressBar>
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
      class="box-edit"
    >
      <template v-slot:headerIcon>
        <span class="box-edit__btn">
          <i class="fa fa-clock-o" />
          <span class="box-edit__text">定时提醒/学霸</span>
        </span>
        <span class="box-edit__btn">
          <i
            class="fa fa-picture-o"
            aria-hidden="true"
          />
          <span class="box-edit__text">更换背景</span>
        </span>
        <span class="box-edit__btn">
          <i
            class="fa fa-mobile"
            aria-hidden="true"
          />
          <span class="box-edit__text">独立白名单</span>
        </span>
      </template>
      <template v-slot:content>
        <div class="box-edit__cells">
          <div class="box-edit__cell">
            <span class="box-edit__cell-btn box-edit__cell-btn_small">
              编辑
            </span>
            <span class="box-edit__cell-btn box-edit__cell-btn_small">
              排序|移动
            </span>
            <span class="box-edit__cell-btn box-edit__cell-btn_small">
              删除
            </span>
          </div>
          <div class="box-edit__cell">
            <span class="box-edit__cell-btn box-edit__cell-btn_middle">
              历史记录时间轴
            </span>
            <span class="box-edit__cell-btn box-edit__cell-btn_middle">
              数据分析
            </span>
          </div>

          <div class="box-edit__cell">
            <div class=""/>
          </div>
        </div>
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
      return this.todos.map(todo => {
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
          progress += `${todo.goal.complete}/${todo.goal.total} ${todo.goal
            .customUnit || '分钟'}`
          progressBar = Math.ceil((todo.goal.complete / todo.goal.total) * 100)
          deadline = `离计划结束:${Math.ceil(
            (todo.goal.deadline - new Date()) / (1000 * 60 * 60 * 24)
          )}天`
        } else if (todo.habit) {
          progress += `今日:${todo.habit.complete}/${todo.habit.piece} ${todo
            .habit.customUnit || '分钟'}`
          progressBar = Math.ceil(
            (todo.habit.complete / todo.habit.piece) * 100
          )
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
    start () {},
    edit (index) {
      this.todo = this.todos[index]
      console.log(this.todo)
      this.showBoxInfo = true
    }
  }
}
</script>

<style lang="less">
.list-todo {
  padding: 0 12px;

  .list-item {
    margin-top: 8px;
  }

  .com-popup__header {
    padding: 10px 5px 10px 10px;
  }
}


.box-edit {
  .btn-header {

  }
}
.box-edit__btn {
  .flex(@flex-direction: column; @align-items: center;);
  font-size: 20px;
}

.box-edit__text {
  margin-top: 6px;
  letter-spacing: 0.5px;
  .scale(0.7;center;center);
}

.box-edit__cell {
  .flex(@justify-content: space-between);

  &:not(:last-child) {
    margin-bottom: 7px;
  }
}

.box-edit__cell-btn {
  display: inline-block;
  text-align: center;
  border-radius: 8px;
  color: white;
  font-size: 12px;
  cursor: pointer;
}

.box-edit__cell-btn_small {
  width: 32%;
  line-height: 32px;
}

.box-edit__cell- {
  width: 48%;
  line-height: 30px;
  font-size: 11px;
}
</style>
