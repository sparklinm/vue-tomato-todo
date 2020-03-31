<template>
  <div
    v-if="todos.length"
    class="list-todo"
  >
    <ListItem
      v-for="(data, index) in datas"
      :key="index"
      v-bind="{ ...data }"
      class="list-todo__item"
      :style="{ 'background-image': `url(${data.img})` }"
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
      :header-background="background"
      @closed="handleBoxInfoClosed"
    >
      <template v-slot:header-icon>
        <span
          class="btn-header"
          @click="setReminder"
        >
          <i class="fa fa-clock-o" />
          <span class="text">{{ $t("todo.timed_reminder") }}</span>
        </span>
        <ComToolTip :show.sync="showChangeBackground">
          <span class="btn-header">
            <i
              class="fa fa-picture-o"
              aria-hidden="true"
            />
            <span class="text">{{ $t("todo.change_background") }}</span>
          </span>
          <template v-slot:content>
            <div class="drop-list_simple">
              <ul>
                <li @click="changeBackgroundRandom">
                  {{ $t("common.random_one_picture") }}
                </li>
              </ul>
            </div>
          </template>
        </ComToolTip>
        <!-- <span class="btn-header">
          <i
            class="fa fa-mobile"
            aria-hidden="true"
          />
          <span class="text">{{ $t("todo.independent_white_list") }}</span>
        </span> -->
      </template>
      <div class="cells">
        <div class="cell">
          <div class="cell-bd">
            <span
              class="btn btn-small"
              @click="editTodo"
            >{{
              $t("action.edit")
            }}</span>

            <ComToolTip :show.sync="showSortMove">
              <span
                ref="btnMove"
                class="btn btn-small"
              >{{ $t("action.sort") }}|{{ $t("action.move") }}</span>
              <template v-slot:content>
                <div
                  ref="moveDrop"
                  class="drop-list_simple"
                >
                  <ul>
                    <li @click="sort">
                      {{ $t("todo.sort_up_and_down") }}
                    </li>
                    <li @click="moveToSet">
                      {{ $t("todo.move_to_set") }}
                    </li>
                  </ul>
                </div>
              </template>
            </ComToolTip>
            <span
              class="btn btn-small"
              @click="deleteTodo(todoIndex)"
            >{{
              $t("action.delete")
            }}</span>
          </div>
        </div>
        <div class="cell">
          <div class="cell-bd">
            <span
              class="btn btn-middle"
              @click="toTimeAxis"
            >
              {{ $t("todo.history_record_time_axis") }}
            </span>
            <span
              class="btn btn-middle"
              @click="toStatistics"
            >{{
              $t("todo.data_analysis")
            }}</span>
          </div>
        </div>
        <div class="cell btn data">
          <div class="cell-hd">
            {{ $t("todo.cumulative_data") }}
          </div>
          <div class="cell-bd">
            <div class="column">
              <span class="text">{{ $t("todo.focus_times") }}</span>
              <span class="number">{{ todo.focus.length }}</span>
            </div>
            <div class="column">
              <span class="text">{{ $t("todo.focus_duration") }}</span>
              <span class="number">{{ focusDuration }}</span>
              <span class="unit">{{ $t("word.minute") }}</span>
            </div>
          </div>
        </div>
        <div
          class="cell btn time-reminder"
          @click="setReminder"
        >
          <div class="cell-hd">
            {{ $t("todo.timed_reminder") }}
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
                {{ reminder.time }}
                <span
                  v-for="item in reminder.days"
                  :key="item"
                >
                  {{ days[item] }}
                </span>
              </li>
            </div>
            <div
              v-else
              class="default"
            >
              {{ $t("todo.no_timed_reminder") }}
            </div>
          </div>
        </div>
        <div
          v-if="showProgress"
          class="cell btn data progress"
        >
          <div class="cell-hd">
            {{ progress.hd }}
          </div>
          <div class="cell-bd">
            <div class="column">
              <span class="text">{{ progress.bd.completed }}</span>
              <span class="number">{{ progress.data.complete }}</span>
              <span class="unit">{{
                progress.data.customUnit || $t("word.minute")
              }}</span>
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
              <span class="unit">{{
                progress.data.customUnit || $t("word.minute")
              }}</span>
            </div>
          </div>
          <div class="cell-footer">
            <div class="row">
              <div class="title">
                <span>1</span>
                <span>{{ $t("todo.stick_days_total") }}</span>
              </div>
              <span>{{ stickDays.total }} {{ $t("word.day") }}</span>
            </div>
            <div class="row">
              <div class="title">
                <span>2</span>
                <span>{{ $t("todo.stick_days_continue") }}</span>
              </div>
              <span>{{ stickDays.continuation }} {{ $t("word.day") }}</span>
            </div>
            <div class="row">
              <div class="title">
                <span>3</span>
                <span>{{ $t("todo.creat_time") }}</span>
              </div>
              <span>{{ creatTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </ComPopup>

    <ComPopup
      :title="$t('todo.long_press_drag_sort')"
      class="box-sort"
      :show.sync="showBoxSort"
      :z-index="2050"
      top-btn
      :submit="submitSort"
      @opened="initSort"
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
      <ComList ref="sortContainer">
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
              @click="deleteTodo(item.id)"
            />
          </template>
        </ComCell>
      </ComList>
    </ComPopup>

    <ComPopup
      class="box-move-todo"
      :show.sync="showBoxMove"
      z-index="2050"
      no-header
    >
      <div class="title">
        {{ $t("todo.move_to_set") }}
      </div>
      <ul>
        <li
          v-for="(set, index) in sets"
          :key="set.name"
          class="set-item"
          @click="submitMoveToSet(set)"
        >
          <input
            type="radio"
            class="radio"
          >
          <span class="set-name">
            {{ set.name }}
          </span>
        </li>
      </ul>
    </ComPopup>

    <ComPopup
      :title="$t('todo.timed_reminder')"
      class="box-time-reminder"
      :show.sync="showBoxTimeReminder"
    >
      <template v-slot:header-icon>
        <span class="btn-header">
          <ComIcon
            name="question-circle"
            class="com-popup__header-icon"
            @click="$message(description.timeReminder)"
          />
          <ComIcon
            name="plus"
            class="com-popup__header-icon"
            @click="addReminder"
          />
          <ComIcon
            name="times"
            class="com-popup__header-icon"
            @click="showBoxTimeReminder = false"
          />
        </span>
      </template>
      <div class="reminders">
        <div
          v-show="!todo.reminders.length"
          class="reminders-title"
        >
          {{ this.$t("todo.no_reminder_and_add") }}
        </div>
        <ComCell
          v-for="(item, index) in todo.reminders"
          :key="index"
          :title="item.time"
          :lable="getReminderCycle(item.days)"
        >
          <template v-slot:right-icon>
            <ComIcon
              name="pencil"
              class="com-cell__icon"
              @click="editReminder(item)"
            />
            <ComIcon
              name="trash"
              class="com-cell__icon"
              @click="deleteReminder(item.id)"
            />
          </template>
        </ComCell>
      </div>
    </ComPopup>

    <ComPopup
      :title="$t('todo.set_time_reminder')"
      class="box-add-time-reminder"
      :show.sync="showBoxAddTimeReminder"
      :submit="submitAddReminder"
      z-index="2050"
      top-btn
    >
      <div
        class="set-time"
        @click="setReminderTime"
      >
        {{ curReminder.time || $t("todo.click_set_time_reminder") }}
      </div>
      <div>
        <div class="set-cycle">
          {{ $t("todo.set_cycle") }}
        </div>
        <div class="check-days">
          <ComGroup v-model="curReminder.days">
            <ComCheckboxButton
              v-for="(value, key) in days"
              :key="key"
              :label="key"
              :content="value"
              class="check-day"
            />
          </ComGroup>
        </div>
      </div>
    </ComPopup>

    <BoxAddTodo
      v-if="showBoxAddTodo"
      :show.sync="showBoxAddTodo"
      :data="todo"
      @submit="submitEditTodo"
    />
    <DatePicker
      v-model="reminderTime"
      :show.sync="showBoxSetReminderTime"
      :submit="submitSetReminderTime"
      z-index="2100"
    />
  </div>
</template>

<script>
import ListItem from './ListItem'
import ProgressCircle from './ProgressCircle'
import BoxAddTodo from '@/components/todo/add/BoxAddTodo'
import DatePicker from '../DatePicker'
import util from '@/js/util.js'
import todo from '@/js/todo.js'
import Sorter from '@/sort.js'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    ListItem,
    ProgressCircle,
    BoxAddTodo,
    DatePicker
  },
  props: {
    todos: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      curTodos: [],
      showBoxInfo: false,
      todo: this.todos[0],
      todoIndex: 0,
      background: '',
      showBoxAddTodo: false,
      showBoxSort: false,
      showBoxMove: false,
      description: {
        sortTodo: {
          title: this.$t('word.help'),
          content: this.$t('message.sort_todo')
        },
        timeReminder: {
          title: this.$t('word.tip'),
          content: this.$t('message.todo_time_reminder')
        }
      },
      sorter: null,
      showSortMove: false,
      showChangeBackground: false,
      showBoxTimeReminder: false,
      showBoxAddTimeReminder: false,
      showBoxSetReminderTime: false,
      days: {
        1: this.$t('word.monday'),
        2: this.$t('word.tuesday'),
        3: this.$t('word.wednesday'),
        4: this.$t('word.thursday'),
        5: this.$t('word.friday'),
        6: this.$t('word.saturday'),
        7: this.$t('word.sunday')
      },
      curReminder: {
        time: []
      },
      reminderTime: [9, 5],
      isAddReminder: false,
      showTimeAxis: false
    }
  },

  computed: {
    ...mapState('todo', {
      sets: state => state.todoSets,
      isGetTodos: 'isGetTodos'
    }),
    datas () {
      if (!this.curTodos.length) {
        return {}
      }

      return this.curTodos.map(todo => {
        let description = ''
        let progress = ''
        let deadline = ''
        let progressBar = ''
        const type2text = {
          common: this.$t('todo.common_todo'),
          goal: this.$t('word.goal'),
          habit: this.$t('word.habit'),
          up: this.$t('todo.time_up'),
          down: this.$t('todo.time_down'),
          none: this.$t('todo.time_none')
        }

        if (todo.timeDuration) {
          description += `${todo.timeDuration} ${this.$t('word.minute')}`
        } else {
          description += type2text[todo.timeWay]
        }
        if (todo.type !== 'common') {
          description += `-${type2text[todo.type]}`
        }

        if (todo.goal) {
          progress += `${todo.goal.complete}/${todo.goal.total} ${todo.goal
            .customUnit || this.$t('word.minute')}`
          progressBar = this.getProgress(todo.goal.complete, todo.goal.total)
          deadline = this.$t('todo.time_remain_end_plan', [Math.ceil((todo.goal.deadline - new Date()) / (1000 * 60 * 60 * 24))])
        } else if (todo.habit) {
          progress += `${this.$t('word.today')}:${todo.habit.complete}/${
            todo.habit.piece
          } ${todo.habit.customUnit || this.$t('word.minute')}`

          progressBar = this.getProgress(todo.habit.complete, todo.habit.piece)
        }

        return {
          name: todo.name,
          description: description,
          progress: progress,
          deadline: deadline,
          progressBar: progressBar,
          img: todo.background
        }
      })
    },
    creatTime () {
      return util.formatTime(this.todo.create, {
        unit: true
      })
    },
    showReminders () {
      return this.todo.reminders.length
    },
    showProgress () {
      return this.todo.goal || this.todo.habit
    },
    focusDuration () {
      return this.todo.focus.reduce((total, item) => {
        return total + item.duration
      }, 0)
    },
    stickDays () {
      const focusData = this.getFocusDays()
      const days = Object.keys(focusData)

      return {
        total: days.length,
        continuation: util.getContinueDays(days.map(day => parseInt(day)))
      }
    },
    progress () {
      let hd = ''
      const bd = {}
      let data = {}
      const { goal, habit } = this.todo

      bd.completed = this.$t('todo.plan_already_complete')
      bd.total = this.$t('todo.plan_total')

      if (goal) {
        hd = this.$t('todo.goal_deadline', [
          util.formatTime(goal.deadline, {
            cut: '-'
          }),
          382
        ])
        bd.progress = this.$t('todo.long_plan_completion')
        data = goal
        data.number = this.getProgress(goal.complete, goal.total)
      } else if (habit) {
        hd = this.$t('todo.habit_cycle')
        bd.progress = this.$t('todo.habit_completion')
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
  watch: {
    isGetTodos (val) {
      if (val) {
        this.getData()
        this.storeSetIsGetTodos(false)
      }
    }
  },
  mounted () {
    console.log(this.datas)
    console.log(this.todos)
    console.log(Sorter)
    this.getData()
  },
  methods: {
    ...mapMutations('todo', {
      storeEditTodo: 'editTodo',
      storeDeleteTodo: 'deleteTodo',
      storeAddReminder: 'addReminder',
      storeEditReminder: 'editReminder',
      storeDeleteReminder: 'deleteReminder',
      storeAddTodoToSet: 'addTodoToSet',
      storeSetShowTimeAxis: 'setShowTimeAxis',
      storeSetShowStatistics: 'setShowStatistics',
      storeSetTarget: 'setTarget',
      storeSetIsGetTodos: 'setIsGetTodos'
    }),
    getData () {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.curTodos = _.cloneDeep(this.todos)
          if (this.todo) {
            this.todo =
              this.curTodos.find(item => item.id === this.todo.id) ||
              this.curTodos[0]
            this.background = this.todo.background
            resolve()
          }
        })
      })
    },
    start () {
      document.documentElement.requestFullscreen()
      this.$router.push({
        path: `/do/${this.todo.id}`
      })
    },
    getProgress (complete, total) {
      return Math.ceil((complete / total) * 100)
    },
    getFocusDays () {
      return todo.formatFocus(this.todo.focus)
    },
    edit (index) {
      this.todo = this.curTodos[index]
      this.background = this.todo.background
      this.todoIndex = index
      this.showBoxInfo = true
    },
    editTodo () {
      this.showBoxAddTodo = true
      this.showBoxInfo = false
    },
    submitEditTodo (todo) {
      this.storeEditTodo(todo)
      this.getData()
    },
    handleBoxInfoClosed () {
      if (!this.showBoxSort) {
        this.getData()
      }
    },
    sort () {
      this.showBoxSort = true
      this.showSortMove = false
      this.showBoxInfo = false
    },
    initSort () {
      if (this.sorter) {
        this.sorter.destroy()
      }

      this.sorter = new Sorter(this.$refs.sortContainer.$el, this.todos)
      this.sorter.init()
    },
    moveToSet () {
      this.showBoxMove = true
      this.showSortMove = false
    },
    submitMoveToSet (set) {
      this.storeAddTodoToSet({
        sid: set.id,
        tid: this.todo.id
      })
      this.showBoxMove = false
      this.showBoxInfo = false
      this.$tips(this.$t('tips.already_move_to_set', [set.name]))
    },
    deleteTodo (id) {
      this.storeDeleteTodo(id)
      this.showBoxInfo = false
    },
    submitSort () {
      if (this.sorter) {
        this.$emit('update-todos', this.sorter.getData())
        this.sorter.destroy()
      }
      this.showBoxSort = false
      this.getData()
    },
    changeBackgroundRandom () {
      const randomBackground = `/background/back${Math.floor(
        Math.random() * 8
      )}.jpg`

      this.storeEditTodo({
        id: this.todo.id,
        background: randomBackground
      })
      this.background = randomBackground
      this.showChangeBackground = false
    },
    getReminderCycle (days) {
      if (days.length === 7) {
        return this.$t('word.everyday')
      }
      let text = ''

      days.forEach(day => {
        text += this.days[day] + ' '
      })
      return text
    },
    getReminderTime (time) {
      const date = new Date('2020-1-5 ' + time)

      return {
        hour: date.getHours(),
        minute: date.getMinutes()
      }
    },
    setReminder () {
      this.showBoxTimeReminder = true
      this.showBoxInfo = false
    },
    editReminder (obj) {
      this.curReminder = _.cloneDeep(obj)
      this.showBoxAddTimeReminder = true
      this.isAddReminder = false
    },
    addReminder () {
      this.curReminder = {
        days: [1, 2, 3, 4, 5, 6, 7],
        time: 0
      }
      this.showBoxAddTimeReminder = true
      this.isAddReminder = true
      this.getData()
    },
    submitAddReminder (done) {
      if (this.isAddReminder) {
        if (!this.curReminder.time) {
          this.$tips(this.$t('tips.set_reminder_time'))
          return
        }
        this.curReminder.tid = this.todo.id
        this.storeAddReminder(this.curReminder)
      } else {
        this.storeEditReminder(this.curReminder)
      }
      done()
      this.getData()
    },
    setReminderTime () {
      this.showBoxSetReminderTime = true
      const time = this.getReminderTime(this.curReminder.time)

      this.reminderTime = [time.hour, time.minute]
    },
    submitSetReminderTime (done) {
      const time = this.reminderTime.map(item => {
        return util.addZero(item, 10)
      })

      this.curReminder.time = time.join(':')
      done()
    },
    deleteReminder (id) {
      this.storeDeleteReminder(id)
      this.getData()
    },
    toTimeAxis () {
      this.$router.push({
        path: `/time_axis/${this.todo.id}`
      })
    },
    toStatistics () {
      this.$router.push({
        path: `/statistics/${this.todo.id}`
      })
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
      .scale-font(0.7;center;center);
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
    line-height: 50px;
    font-size: 11px;
  }

  .cell {
    width: 100%;

    &:not(:last-child) {
      margin-bottom: 7px;
    }
  }

  .cell-hd {
    font-size: 10px;
    .scale-font(0.95);
    padding: 8px 12px;
    text-align: left;
  }

  .cell-bd {
    .flex(@justify-content: space-between;);
    padding-bottom: 6px;
  }

  .cell-bd:last-child {
    padding-bottom: 0px;
  }

  .cell-footer {
    padding: 8px;
  }

  .row {
    width: 100%;
    .flex(@align-items: center; @justify-content: space-between;);

    &:not(:last-child) {
      margin-bottom: 8px;
    }

    .title {
      span:first-child {
        margin-right: 10px;
      }
    }
  }

  .data {
    text-align: left;

    .column {
      .flex(@flex-direction: column; @align-items: center;);
      width: 50%;
    }

    .text {
      .scale-font(0.9;center;center);
      opacity: 0.7;
    }

    .number {
      font-size: 24px;
    }

    .unit {
      .scale-font(0.8;center;center);
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

.box-move-todo {
  .title {
    margin-bottom: 12px;
  }

  .set-item {
    padding: 10px 0;
    white-space: nowrap;
    overflow: hidden;
  }

  .radio {
    width: 16px;
    height: 16px;
    background: white;
    vertical-align: middle;
  }

  .set-name {
    margin-left: 10px;
    vertical-align: middle;
  }
}

.box-time-reminder {
  .com-popup__header {
    padding: 12px;
    font-size: 14px;
  }

  .com-popup__header-icon {
    margin-left: 25px;
    font-size: 18px;
  }

  .com-popup__content {
    padding: 5px 18px 5px;
    height: 200px;
    overflow: scroll;
  }

  .reminders {
    min-height: 200px;
  }

  .reminders-title {
    font-size: 12px;
    line-height: 200px;
    text-align: center;
  }

  .com-cell {
    padding: 8px 0;
  }

  .com-cell__hd-title {
    font-size: 16px;
    font-weight: 600;
  }

  .com-cell__hd-lable {
    max-width: 120px;
    line-height: 1.4;
    margin-top: 0px;
  }

  .com-cell__icon {
    margin-left: 20px;
    font-size: 16px;
    color: @gray-d;
  }
}

.box-add-time-reminder {
  .com-popup__content {
    padding: 20px 15px 12px;
  }

  .set-time {
    margin-bottom: 20px;
  }

  .set-cycle {
    margin-bottom: 8px;
  }

  .check-days {
    max-width: 70%;
  }

  .check-day {
    margin-right: 4px;
    margin-bottom: 5px;
  }
}
</style>
