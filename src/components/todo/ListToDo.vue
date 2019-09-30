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
      <template v-slot:content>
        <div class="cells">
          <div class="cell">
            <div class="cell-bd">
              <span class="btn btn-small">编辑</span>
              <span class="btn btn-small">排序|移动</span>
              <span class="btn btn-small">删除</span>
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
                  v-for="(reminder,index) in todo.reminders"
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
              目标截止日期：2020-10-23 剩余:382天
            </div>
            <div class="cell-bd">
              <div class="column">
                <span class="text">计划已完成</span>
                <span class="number">1</span>
                <span class="unit">小时</span>
              </div>
              <div class="column">
                <span class="text">长期计划完成度</span>
                <span class="number">10</span>
              </div>
              <div class="column">
                <span class="text">计划总数</span>
                <span class="number">100</span>
                <span class="unit">小时</span>
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
                <span>2019年09月22日</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </ComPopup>

    <!-- <div class="serve-error">
      <svg
        class="icon icon-serve"
        style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="9872"
      ><path
        d="M734.608696 624.788406c-26.713043 0-46.005797-17.808696-46.005797-46.005797s17.808696-46.005797 46.005797-46.005797c26.713043 0 46.005797 17.808696 46.005797 46.005797s-19.292754 46.005797-46.005797 46.005797zM838.492754 0h-652.985508c-25.228986 0-44.521739 19.292754-44.521739 44.521739v934.956522c0 25.228986 19.292754 44.521739 44.521739 44.521739h652.985508c25.228986 0 44.521739-19.292754 44.521739-44.521739v-934.956522c0-25.228986-19.292754-44.521739-44.521739-44.521739z m-289.391305 608.463768c-20.776812 0-37.101449-16.324638-37.101449-37.101449s16.324638-37.101449 37.101449-37.101449 37.101449 16.324638 37.10145 37.101449-16.324638 37.101449-37.10145 37.101449z m185.507247 44.521739c-40.069565 0-74.202899-32.649275-74.202899-74.202898s32.649275-74.202899 74.202899-74.202899c40.069565 0 74.202899 32.649275 74.202898 74.202899s-34.133333 74.202899-74.202898 74.202898z m74.202898-207.768116h-593.623188v-148.405797h593.623188v148.405797z m0-222.608695h-593.623188v-148.405797h593.623188v148.405797z"
        p-id="9873"
      /></svg>

      <svg
        class="icon icon-error"
        style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="10177"
      ><path
        d="M525.659648 48.634675c-246.56169 0-446.670438 199.901798-446.670438 446.651699s200.108749 446.651699 446.670438 446.651699 446.670438-199.901798 446.670438-446.651699S772.221338 48.634675 525.659648 48.634675zM596.332134 765.460685 459.35278 765.460685l0-109.974717 136.979377 0L596.332157 765.460666zM596.332134 435.334963c0 11.116134-1.191219 25.409741-3.373978 43.275571-2.183782 11.116134-16.676454 140.148941-16.676454 140.148941l-100.252399 0c0 0-22.234317-170.123674-20.050432-183.424614L455.978871 215.185944l140.354383 0L596.333254 435.334923z"
        p-id="10178"
      /></svg>
    </div>-->
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
      todo: this.todos[0]
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
    },
    showReminders () {
      return this.todo.reminders.length
    },
    showProgress () {
      return this.todo.goal || this.todo.habit
    }
  },
  watch: {

  },
  mounted () {
    console.log(this.datas)
    console.log(this.todos)

  },
  methods: {
    start () { },
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
    .flex(@flex-direction: column; @align-items: center;);
    font-size: 20px;

    .text {
      margin-top: 6px;
      letter-spacing: 0.5px;
      .scale(0.7;center;center);
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
      .scale(0.95);
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
      .scale(0.9;center;center);
      opacity: 0.7;
    }

    .number {
      font-size: 24px;
    }

    .unit {
      .scale(0.8;center;center);
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

    .text,.unit {
      opacity: 0.9;
    }

    .number {
      margin-top: 5px;
    }

    .row {
      width: 80%;
      margin:0 auto 8px;
      .flex(@align-items: center;@justify-content: space-between;);

      .title {
        span:first-child {
          margin-right: 10px;
        }
      }
    }
  }
}

.serve-error {
  position: absolute;
  width: 200px;
  height: 200px;

  .icon-serve,
  .icon-error {
    position: absolute;
  }

  .icon-serve {
    font-size: 200px;
    color: #3c8dbc;
  }

  .icon-error {
    font-size: 100px;
    color: rgb(148, 49, 49);
    bottom: -10px;
    right: 0;
  }
}
</style>
