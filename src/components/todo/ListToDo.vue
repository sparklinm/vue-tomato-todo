<template>
  <div class="list-todo">
    <ListItem
      v-for="(data, index) in datas"
      :key="index"
      v-bind="{ ...data }"
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
      <template v-slot:header-icon>
        <span class="btn-header">
          <i class="fa fa-clock-o" />
          <span class="text">定时提醒/学霸</span>
        </span>
        <span class="btn-header">
          <i
            class="fa fa-picture-o"
            aria-hidden="true"
          />
          <span class="text">更换背景</span>
        </span>
        <span class="btn-header">
          <i
            class="fa fa-mobile"
            aria-hidden="true"
          />
          <span class="text">独立白名单</span>
        </span>
      </template>
      <div class="cells">
        <div class="cell">
          <div class="cell-bd">
            <span
              class="btn btn-small"
              @click="editToDo"
            >编辑</span>

            <ComToolTip>
              <span
                ref="btnMove"
                class="btn btn-small"
              >排序|移动</span>
              <template v-slot:content>
                <!-- <transition name="fade"> -->
                <div
                  ref="moveDrop"
                  class="drop-list_simple"
                >
                  <ul>
                    <li @click="sort">
                      上下位置排序
                    </li>
                    <li @click="moveToSet">
                      移动到待办集
                    </li>
                  </ul>
                </div>
                <!-- </transition> -->
              </template>
            </ComToolTip>
            <span
              class="btn btn-small"
              @click="deleteTodo(todoIndex)"
            >删除</span>
          </div>
        </div>
        <div class="cell">
          <div class="cell-bd">
            <span class="btn btn-middle">历史记录时间轴</span>
            <span class="btn btn-middle">数据分析</span>
          </div>
        </div>
        <div class="cell btn-big btn data">
          <div class="cell-hd">
            累计数据
          </div>
          <div class="cell-bd">
            <div class="column">
              <span class="text">专注次数</span>
              <span class="number">{{ todo.focus.number }}</span>
            </div>
            <div class="column">
              <span class="text">专注时长</span>
              <span class="number">{{ todo.focus.duration }}</span>
              <span class="unit">分钟</span>
            </div>
          </div>
        </div>
        <div class="cell btn-big btn time-reminder">
          <div class="cell-hd">
            定时提醒
          </div>
          <div class="cell-bd">
            <div
              v-if="showReminders"
              class="list"
            >
              <li
                v-for="(reminder, index) in todo.reminders"
                :key="index"
              >
                {{ reminder.time }} {{ reminder.day }}
              </li>
            </div>
            <div
              v-else
              class="default"
            >
              没有设置定时提醒
            </div>
          </div>
        </div>
        <div
          v-if="showProgress"
          class="cell btn-big btn data progress"
        >
          <div class="cell-hd">
            {{ progress.hd }}
          </div>
          <div class="cell-bd">
            <div class="column">
              <span class="text">{{ progress.bd.completed }}</span>
              <span class="number">{{ progress.data.complete }}</span>
              <span class="unit">{{ progress.data.customUnit || "分钟" }}</span>
            </div>
            <div class="column">
              <span class="text">{{ progress.bd.progress }}</span>
              <ProgressCircle
                :width="40"
                :progress="progress.data.number"
                type="arc"
              />
            </div>
            <div class="column">
              <span class="text">{{ progress.bd.total }}</span>
              <span class="number">{{
                progress.data.total || progress.data.piece
              }}</span>
              <span class="unit">{{ progress.data.customUnit || "分钟" }}</span>
            </div>
          </div>
          <div class="cell-footer">
            <div class="row">
              <div class="title">
                <span>1</span>
                <span>总共坚持天数</span>
              </div>
              <span>{{ todo.stickDays.total }} 天</span>
            </div>
            <div class="row">
              <div class="title">
                <span>2</span>
                <span>连续坚持天数</span>
              </div>
              <span>{{ todo.stickDays.continuation }} 天</span>
            </div>
            <div class="row">
              <div class="title">
                <span>3</span>
                <span>创建日期</span>
              </div>
              <span>{{ creatTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </ComPopup>

    <ComPopup
      title="长按拖动排序"
      class="box-sort"
      :show.sync="showBoxSort"
      :z-index="2050"
      top-option-btn
      :submit="submitSort"
    >
      <template v-slot:header-icon>
        <span class="btn-header">
          <i
            aria-hidden="true"
            class="fa fa-question-circle"
            @click="$message(description.sortTodo)"
          />
        </span>
      </template>
      <ComList :id="'container' + _uid">
        <ComCell
          v-for="(item, index) in todos"
          :id="'item' + index"
          :key="item.name + Math.random()"
          ref="sortCell"
          :title="item.name"
          class="sort-cell"
        >
          <template v-slot:right-icon>
            <i
              :id="'item' + index"
              class="fa fa-trash delete-icon"
              aria-hidden="true"
              draggable="true"
              @click="deleteTodo(index)"
            />
          </template>
        </ComCell>
      </ComList>
    </ComPopup>

    <BoxAddToDo
      v-if="showBoxAddToDo"
      :show.sync="showBoxAddToDo"
      :data="todo"
    />
  </div>
</template>

<script>
import ListItem from './ListItem'
import ProgressCircle from './ProgressCircle'
import BoxAddToDo from '@/components/todo/add/BoxAddToDo'
import util from '@/util.js'
import Sorter from '@/sort.js'
export default {
  components: {
    ListItem,
    ProgressCircle,
    BoxAddToDo
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
      todo: this.todos[0],
      todoIndex: 0,
      showBoxAddToDo: false,
      showBoxSort: false,
      description: {
        sortTodo: {
          title: '帮助',
          content:
            '<p>排序->长按并拖动</p><p>删除->点击删除按钮</p><p>注意，由于已完成的待办始终排在最后面，若对它们排序，会将它们的状态变为待完成时才生效。</p>'
        }
      },
      sorter: null
    }
  },
  computed: {
    datas () {
      return this.todos.map(todo => {
        let description = ''
        let progress = ''
        let deadline = ''
        let progressBar = ''
        const type2tex = {
          common: '普通番茄时钟',
          goal: '目标',
          habit: '习惯'
        }

        if (todo.timeDuration) {
          description += `${todo.timeDuration} 分钟`
        } else {
          description += todo.timeWay
        }
        if (todo.type !== 'common') {
          description += `-${type2tex[todo.type]}`
        }

        if (todo.goal) {
          progress += `${todo.goal.complete}/${todo.goal.total} ${todo.goal
            .customUnit || '分钟'}`
          progressBar = this.getProgress(todo.goal.complete, todo.goal.total)
          deadline = `离计划结束:${Math.ceil(
            (todo.goal.deadline - new Date()) / (1000 * 60 * 60 * 24)
          )}天`
        } else if (todo.habit) {
          progress += `今日:${todo.habit.complete}/${todo.habit.piece} ${todo
            .habit.customUnit || '分钟'}`
          progressBar = this.getProgress(todo.habit.complete, todo.habit.piece)
        }

        return {
          name: todo.name,
          description: description,
          progress: progress,
          deadline: deadline,
          progressBar: progressBar
        }
      })
    },
    creatTime () {
      return util.timeFormat(this.todo.create, {
        unit: true
      })
    },
    showReminders () {
      return this.todo.reminders.length
    },
    showProgress () {
      return this.todo.goal || this.todo.habit
    },
    progress () {
      let hd = ''
      const bd = {}
      let data = {}
      const { goal, habit } = this.todo
      bd.completed = '计划内已完成'
      bd.total = '计划总数'

      if (goal) {
        hd = `目标截止日期：${util.timeFormat(goal.deadline, {
          cut: '-'
        })} 剩余:382天`
        bd.progress = '长期计划完成度'
        data = goal
        data.number = this.getProgress(goal.complete, goal.total)
      } else if (habit) {
        hd = '习惯周期:今天'
        bd.progress = '习惯完成度'
        data = habit
        data.number = this.getProgress(habit.complete, habit.piece)
      }

      return {
        hd,
        bd,
        data
      }
    }
  },
  watch: {},
  mounted () {
    console.log(this.datas)
    console.log(this.todos)
    console.log(Sorter)
  },
  methods: {
    start () {
      this.$router.push({
        path: '/do'
      })
    },
    getProgress (complete, total) {
      return Math.ceil((complete / total) * 100)
    },
    edit (index) {
      this.todo = this.todos[index]
      this.todoIndex = index
      this.showBoxInfo = true
    },
    editToDo () {
      this.showBoxAddToDo = true
      this.showBoxInfo = false
    },
    sort () {
      this.showBoxSort = true
      this.showBtnMoveDrop = false
      this.showBoxInfo = false
      this.sorter = new Sorter(`#container${this._uid}`, this.todos)
      setTimeout(() => {
        this.sorter.init()
      }, 300)
    },
    moveToSet () {
      this.showMoveBox = true
      this.showBtnMoveDrop = false
    },
    deleteTodo (index) {
      this.todos.splice(index, 1)
    },
    submitSort () {
      if (this.sorter) {
        this.$emit('update-todos', this.sorter.getData())
        this.sorter.destroy()
      }
      this.showBoxSort = false
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
}

.box-edit {
  .com-popup__header {
    padding: 10px 5px 10px 10px;
  }

  .btn-header {
    .flex(@flex-direction: column; @align-items: center;);
    font-size: 20px;

    .text {
      margin-top: 6px;
      letter-spacing: 0.5px;
      .sacle-font(0.7;center;center);
    }
  }

  .btn {
    display: inline-block;
    text-align: center;
    border-radius: 8px;
    color: white;
    font-size: 12px;
    cursor: pointer;
  }

  .btn-small {
    width: 32%;
    line-height: 32px;
  }

  .btn-middle {
    width: 48%;
    line-height: 30px;
    font-size: 11px;
  }

  .btn-big {
    width: 100%;
  }

  .cell {
    &:not(:last-child) {
      margin-bottom: 7px;
    }

    .cell-hd {
      font-size: 10px;
      .sacle-font(0.95);
      padding: 8px 12px;
      text-align: left;
    }

    .cell-bd {
      .flex(@justify-content: space-between;);
      padding-bottom: 6px;
    }
  }

  .data {
    text-align: left;

    .column {
      .flex(@flex-direction: column; @align-items: center;);
      width: 50%;
    }

    .text {
      .sacle-font(0.9;center;center);
      opacity: 0.7;
    }

    .number {
      font-size: 24px;
    }

    .unit {
      .sacle-font(0.8;center;center);
      opacity: 0.7;
    }
  }

  .time-reminder {
    text-align: left;

    .default {
      flex: 1;
      padding-bottom: 4px;
      text-align: center;
    }

    .list {
      list-style: none;
      padding: 0 12px 4px;

      li {
        &:not(:last-child) {
          margin-bottom: 8px;
        }
      }
    }
  }

  .progress {
    .cell-hd {
      letter-spacing: 0;
    }

    .text,
    .unit {
      opacity: 0.9;
    }

    .number {
      margin-top: 5px;
    }

    .row {
      width: 80%;
      margin: 0 auto 8px;
      .flex(@align-items: center; @justify-content: space-between;);

      .title {
        span:first-child {
          margin-right: 10px;
        }
      }
    }
  }
}

.box-sort {
  .delete-icon {
    font-size: 18px;
    color: rgb(90, 90, 90);
  }

  .com-popup__content {
    padding: 0;
  }

  .com-cell {
    padding: 15px 25px;
    position: relative;
  }
}

.sort-cell {
  transition: all 0.1s ease;
}
</style>
