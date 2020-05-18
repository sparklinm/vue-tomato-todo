<template>
  <div class="box-add-todo">
    <ComPopup
      :title="this.$t('todo.add_todo')"
      top-btn
      :show="show"
      :submit="submitAddTodo"
      :before-open="beforeBoxAddTodoOpen"
      :z-index="2010"
      :class="customClass"
      :close-on-click-mask="false"
      @closed="$emit('update:show', false)"
    >
      <ComInput
        ref="input-name"
        v-model="todo.name"
        type="textarea"
        icon="question"
        placeholder="请输入待办名称"
        :tips="description.todo.name"
        autofocus
        maxlength="30"
      />
      <div class="config-todo">
        <div class="type">
          <ul>
            <li
              v-for="(item, index) in todoType"
              :key="index"
            >
              <label>
                <input
                  type="radio"
                  name="type"
                  :checked="item.checked"
                >
                <span @click="onTypeClick(index)">{{ item.text }}</span>
              </label>
            </li>
          </ul>
        </div>
        <div
          v-show="showConfigGoal || showConfigHabit"
          class="config-extra"
        >
          <div
            v-show="showConfigGoal"
            class="config-goal"
          >
            <div class="row">
              我想在
              <span
                class="goal-key"
                @click="showBoxPickDate=true"
              >
                {{ goalDeadlineView }}
              </span>
              之前
            </div>
            <div class="row">
              一共完成
              <input
                v-model.number="todo.goal.total"
                type="number"
                class="key-input goal-key goal-input"
                placeholder="填写完成量"
              >
              <select
                v-model="unit"
                @change="handleUnitChange"
              >
                <option
                  v-for="item in selUnits"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.text }}
                </option>
              </select>
            </div>
          </div>
          <div
            v-show="showConfigHabit"
            class="config-habit"
          >
            <div class="row">
              我想
              <select
                v-model="todo.habit.frequency"
              >
                <option value="1">
                  每天
                </option>
                <option value="7">
                  每周
                </option>
                <option value="month">
                  每月
                </option>
              </select>
            </div>
            <div class="row">
              完成
              <input
                v-model.number="todo.habit.piece"
                type="number"
                class="key-input habit-key habit-input"
                placeholder="填写完成量"
              >
              <select
                v-model="unit"
                @change="handleUnitChange"
              >
                <option
                  v-for="item in selUnits"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.text }}
                </option>
              </select>
            </div>
          </div>
          <div class="row">
            最后一步设置单个番茄钟的时间：
          </div>
        </div>
        <div class="time-way">
          <ul>
            <li
              v-for="(item, index) in todoTimeWay"
              :key="index"
            >
              <label>
                <input
                  :checked="item.checked"
                  type="radio"
                  name="way"
                >
                <span @click="onTimeWayClick(item)">{{ item.text }}</span>
              </label>
            </li>
          </ul>
        </div>
        <div
          v-show="showTimeDuration"
          class="time-duration"
        >
          <ul>
            <li
              v-for="(item, index) in todoTimeDuration"
              :key="index"
            >
              <label>
                <input
                  type="radio"
                  name="duration"
                  :checked="item.checked"
                  @click="onTimeDurationClick(item)"
                >
                <span>{{ item.text }}</span>
              </label>
            </li>
          </ul>
        </div>
        <div class="tips-time-duration">
          {{ tipTimeDuration }}
        </div>
        <div class="advanced-setting">
          <span @click="onAdvancedSettingsClick">{{
            btnAdvancedSettings
          }}</span>
        </div>
      </div>
    </ComPopup>
    <ComPopup
      title="自定义Todo时间"
      class="custom-time fade"
      bottom-confirm-btn
      :show.sync="showBoxCustomTime"
      :z-index="2050"
      :animationed="false"
      :submit="submitCustomTimeDuration"
      :cancel="cancelCustomTimeDuration"
    >
      <ComInput
        ref="input-time-duration"
        v-model="customTimeDuration.value"
        :placeholder="todo.timeDuration + '分钟'"
        :min="customTimeDuration.min"
        :max="customTimeDuration.max"
        type="positiveInteger"
      />
    </ComPopup>
    <ComPopup
      title="高级设置"
      top-btn
      class="box-advanced-setting fade"
      :show.sync="showBoxAdvancedSettings"
      :z-index="2050"
      :animationed="false"
      :cancel="cancelAdvancedSettings"
      :submit="submitAdvancedSettings"
    >
      <ComCheckbox
        v-model="advancedSettings.hideAfterComplete.value"
        content="完成后第二天不再显示"
      />
      <div class="setting-list">
        <ComInput
          ref="input-task-notes"
          v-model="advancedSettings.taskNotes.value"
          type="textarea"
          placeholder="任务备注"
          maxlength="50"
        />
        <ComInput
          v-show="showInputLoopTimes"
          v-model="advancedSettings.loopTimes.value"
          type="positiveInteger"
          placeholder="单次预期循环次数"
          :tips="description.todo.loopTimes"
          icon="question"
          class="item-1"
        />
        <ComInput
          v-show="showInputRestTime"
          v-model="advancedSettings.restTime.value"
          type="positiveInteger"
          placeholder="自定义休息时间"
        />
      </div>
    </ComPopup>


    <ComPopup
      class="box-input-quantifier fade"
      no-header
      :show.sync="showBoxQuantifier"
      :close-on-click-mask="false"
      :z-index="2050"
      @open="initQuantifier"
      @opened="$refs.inputQuantifier.focus()"
    >
      <ComInput
        ref="inputQuantifier"
        v-model="quantifier"
        class="input-quantifier"
        :placeholder="$t('tips.please_input_quantifier')"
        autofocus
        maxlength="30"
      />

      <div
        class="tip-text"
        v-html="$t('message.input_quantifier')"
      />


      <template v-slot:footer>
        <button
          class="com-popup__footer-btn"
          @click="addUnit"
        >
          {{ $t("action.confirm") }}
        </button>
        <button
          class="com-popup__footer-btn"
          @click=" cancelAddUnit"
        >
          {{ $t("action.cancel") }}
        </button>
      </template>
    </ComPopup>

    <ComPopup
      class="box-pick-date fade"
      no-header
      :show.sync="showBoxPickDate"
      :close-on-click-mask="false"
      :z-index="2060"
      @open="showCalendar = true"
      @closed="showCalendar = false"
    >
      <ev-calendar
        v-if="showCalendar"
        v-model="goalDate"
        :options="calendarOptions"
      />

      <template v-slot:footer>
        <button
          class="com-popup__footer-btn"
          @click="setGoalDeadline"
        >
          {{ $t("action.confirm") }}
        </button>
        <button
          class="com-popup__footer-btn"
          @click="cancelSetGoalDeadline"
        >
          {{ $t("action.cancel") }}
        </button>
      </template>
    </ComPopup>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import util from '@/js/util.js'

export default {
  props: {
    data: {
      type: Object,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      todo: {
        name: '',
        type: 'common',
        timeWay: 'down',
        timeDuration: 25,
        taskNotes: '',
        goal: {
          deadline: new Date(2019, 9, 2),
          total: 10,
          complete: 0
        },
        habit: {
          frequency: 1,
          piece: 10,
          complete: 0
        },
        loopTimes: {
          value: 1,
          custom: ''
        },
        restTime: {
          value: 5,
          custom: ''
        }
      },
      todoCommon: {},
      todoType: [
        {
          value: 'common',
          text: '普通番茄钟',
          checked: true
        },
        {
          value: 'goal',
          text: '定目标',
          checked: false
        },
        {
          value: 'habit',
          text: '养习惯',
          checked: false
        }
      ],
      todoTimeWay: [
        {
          text: '倒计时',
          value: 'down',
          description: '*倒计时25分钟即标准番茄钟时间',
          checked: true
        },
        {
          text: '正向计时',
          value: 'up',
          description: '*适合碎片时间记录，随用随计',
          checked: false
        },
        {
          text: '不计时',
          value: 'none',
          description: '*适合不需要计时的待办，比如：取快递，喝水 等',
          checked: false
        }
      ],
      todoTimeDuration: [
        {
          text: '25分钟',
          value: 25,
          checked: true
        },
        {
          text: '35分钟',
          value: 35,
          checked: false
        },
        {
          text: '自定义',
          value: -1,
          checked: false
        }
      ],
      customTimeDuration: {
        value: '',
        min: 0,
        max: 180
      },
      advancedSettings: {
        hideAfterComplete: {
          value: false,
          default: false,
          origin: false
        },
        taskNotes: {
          value: '',
          default: '',
          origin: ''
        },
        loopTimes: {
          value: '',
          default: '',
          origin: '',
          min: 1,
          max: 50
        },
        restTime: {
          value: '',
          default: '',
          origin: '',
          min: 0,
          max: 50
        }
      },
      unit: 'hour',
      selUnits: [
        {
          value: 'hour',
          text: this.$t('settings.hour')
        },
        {
          value: 'minute',
          text: this.$t('word.minute')
        },
        {
          value: 'times',
          text: this.$t('word.times')
        },
        {
          value: 'custom',
          text: this.$t('word.customize')
        }
      ],
      showBoxQuantifier: false,
      quantifier: '',
      showBoxPickDate: false,
      showCalendar: false,
      goalDate: new Date(),
      calendarOptions: {
        color: '',
        min: ''
      },
      showBoxCustomTime: false,
      showBoxAdvancedSettings: false,
      btnAdvancedSettings: '展开更多高级设置',
      description: {
        todo: {
          name: {
            title: '什么是番茄钟？',
            content:
              '<p>番茄钟是全身心工作25分钟，休息5分钟的工作法。</p><p>输入事项名称，点击<i aria-hidden="true" class="fa fa-check"></i>按钮即可以添加一个标准的番茄钟待办。</p>点击待办卡片上的开始按钮就可以开始一个番茄钟啦。</p>'
          },
          loopTimes: {
            title: '什么是单次预期循环次数？',
            content:
              '<p>番茄钟是全身心工作25分钟，休息5分钟的工作法。</p><p>输入事项名称，点击<i aria-hidden="true" class="fa fa-check"></i>按钮即可以添加一个标准的番茄钟待办。</p>点击待办卡片上的开始按钮就可以开始一个番茄钟啦。</p>'
          }
        }
      },
      error: {
        todo: {
          name: '待办名称不能为空',
          timeDuration: '单个番茄时间不能超过180分钟',
          loopTimes: '预期次数不能超过50次',
          restTime: '休息时间不能超过50分钟'
        }
      }
    }
  },
  computed: {
    ...mapState('settings', {
      todoSettings: 'todo',
      theme: 'currentTheme'
    }),
    ...mapState('todo', {
      todos: 'todos'
    }),
    showTimeDuration () {
      return this.todo.timeWay === 'down'
    },
    showConfigGoal () {
      return this.todo.type === 'goal'
    },
    showConfigHabit () {
      return this.todo.type === 'habit'
    },
    showInputLoopTimes () {
      return this.todo.timeWay === 'down'
    },
    showInputRestTime () {
      return this.todo.timeWay !== 'none'
    },
    tipTimeDuration () {
      return this.todoTimeWay.find(item => {
        return item.value === this.todo.timeWay
      }).description
    },
    goalDeadlineView () {
      return util.dateFormatter(this.todo.goal.deadline, 'yyyy-MM-dd') || this.$t('todo.set_goal_deadline')
    }
  },
  watch: {
    showBoxAdvancedSettings (val) {
      if (!val) {
        this.setBtnAdvancedSettings()
      }
    },
    'todo.name' (val) {
      this.todoCommon.name = val
    }
  },
  mounted () {
    this.todoCommon = {
      name: '',
      type: 'common',
      timeWay: 'down',
      timeDuration: 25,
      taskNotes: '',
      goal: {
        deadline: '',
        total: '',
        complete: 0,
        unit: 'hour'
      },
      habit: {
        frequency: 1,
        piece: '',
        complete: 0,
        unit: 'hour'
      },
      loopTimes: {
        value: 1,
        custom: ''
      },
      restTime: {
        value: 5,
        custom: ''
      },
      hideAfterComplete: this.todoSettings.hideAfterComplete
    }
    if (this.data) {
      this.init(this.data.type)
    } else {
      this.init()
    }

    const myDate = new Date()
    const tomorrow = new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate() + 1)

    this.calendarOptions.color = this.theme.darken10
    this.calendarOptions.min = tomorrow
  },
  methods: {
    ...mapMutations('todo', [
      'addTodo',
      'toggleBoxAddTodo',
      'editTodo'
    ]),
    checkNumber ({ value, max }) {
      return util.checkLess({
        value,
        max
      })
    },
    setBtnAdvancedSettings () {
      for (const setting of Object.values(this.advancedSettings)) {
        if (setting.value !== setting.origin) {
          this.btnAdvancedSettings = '已添加高级设置'
          return
        }
      }
      this.btnAdvancedSettings = '展开更多高级设置'
    },
    setChecked (configs, value) {
      let checked = false

      configs.forEach(item => {
        item.checked = item.value === value
        if (item.checked) {
          checked = true
        }
      })
      if (!checked) {
        configs[0].checked = true
      }
    },
    setAdvancedSettings () {
      for (const [key, setting] of Object.entries(this.advancedSettings)) {
        if (this.todo[key] !== undefined) {
          if (key === 'loopTimes' || key === 'restTime') {
            setting.value = setting.default = this.todo[key].custom
          } else {
            setting.value = setting.default = this.todo[key]
          }
        }
      }
    },
    init (type = 'common') {
      if (this.data && type === this.data.type) {
        this.todo = _.cloneDeep(Object.assign({}, this.todoCommon, this.data))
      } else {
        this.todo = _.cloneDeep(Object.assign({}, this.data, this.todoCommon))
        this.todo.type = type
      }

      if (this.todo.timeDuration >= 0 && this.todo.timeDuration !== 25 && this.todo.timeDuration !== 35) {
        this.todoTimeDuration[2].text = this.todo.timeDuration + '分钟'
        this.todoTimeDuration[2].value = this.todo.timeDuration
        this.customTimeDuration.value = this.todo.timeDuration
      } else {
        this.todoTimeDuration[2].text = '自定义'
        this.todoTimeDuration[2].value = -1
        this.customTimeDuration.value = ''
      }

      this.setChecked(this.todoType, this.todo.type)
      this.setChecked(this.todoTimeWay, this.todo.timeWay)
      this.setChecked(this.todoTimeDuration, this.todo.timeDuration)
      this.setAdvancedSettings()
      this.setBtnAdvancedSettings()
      this.initUnits()
      if (this.todo.type === 'goal') {
        this.goalDate = this.todo.goal.deadline || new Date()
      }
    },
    initUnits () {
      const defaultUnits = ['hour', 'minute', 'times']

      if (this.todo.type === 'common') {
        return
      }
      const { [this.todo.type]: obj } = this.todo

      if (!defaultUnits.includes(obj.unit)) {
        this.selUnits.pop()
        this.selUnits.push({
          value: obj.unit,
          text: obj.unit
        })
      } else {
        this.selUnits.pop()
        this.selUnits.push({
          value: 'custom',
          text: this.$t('word.customize')
        })
      }
      this.unit = obj.unit
    },
    submitCustomTimeDuration (done) {
      const { value } = this.customTimeDuration

      if (this.value === '') {
        return
      }
      if (this.checkNumber(this.customTimeDuration)) {
        this.todo.timeDuration = value
        this.todoTimeDuration[2].text = value + '分钟'
        this.todoTimeDuration[2].value = value
        done()
        this.$refs['input-name'].focus()
      } else {
        this.$tips(this.error.todo.timeDuration)
      }
    },
    cancelCustomTimeDuration (done) {
      this.customTimeDuration.value = ''
      this.setChecked(this.todoTimeDuration, this.todo.timeDuration)
      done()
      this.$refs['input-name'].focus()
    },
    onTypeClick (index) {
      const type = this.todoType[index].value

      this.init(type)
    },
    onTimeWayClick (obj) {
      this.setChecked(this.todoTimeWay, obj.value)
      this.todo.timeWay = obj.value
    },
    onTimeDurationClick (obj) {
      if (obj.value !== 25 && obj.value !== 35) {
        this.showBoxCustomTime = true
        this.$nextTick(() => {
          this.$refs['input-time-duration'].focus()
        })
      } else {
        this.todo.timeDuration = obj.value
      }
      this.setChecked(this.todoTimeDuration, obj.value)
    },
    onAdvancedSettingsClick () {
      this.showBoxAdvancedSettings = true
      this.$nextTick(() => {
        this.$refs['input-task-notes'].focus()
      })
    },
    cancelAdvancedSettings (done) {
      for (const key of Object.keys(this.advancedSettings)) {
        this.advancedSettings[key].value = this.advancedSettings[key].default
      }
      done()
      this.$refs['input-name'].focus()
    },
    submitAdvancedSettings (done) {
      let showBoxAdvancedSettings = false
      let isChecked = true

      for (const key of Object.keys(this.advancedSettings)) {
        const { max = 'NO_VALUE' } = this.advancedSettings[key]

        if (
          max !== 'NO_VALUE' &&
          !this.checkNumber(this.advancedSettings[key])
        ) {
          this.$tips(this.error.todo[key])
          showBoxAdvancedSettings = true
          isChecked = false
        }
      }

      if (isChecked) {
        for (const [key, setting] of Object.entries(this.advancedSettings)) {
          const { value } = setting

          setting.default = value
          if (key === 'loopTimes' || key === 'restTime') {
            this.todo[key].custom = value
          } else {
            this.todo[key] = value
          }
        }
        this.$refs['input-name'].focus()
      }

      if (!showBoxAdvancedSettings) {
        done()
      }
    },
    beforeBoxAddTodoOpen (done) {
      this.$nextTick(() => {
        done()
      })
    },
    handleUnitChange () {
      if (this.unit === 'custom') {
        this.showBoxQuantifier = true
      }
    },
    initQuantifier () {
      this.quantifier = ''
    },
    addUnit () {
      if (this.quantifier === '') {
        this.$tips(this.$t('tips.please_input_correct_quantifier'))
        return
      }
      this.selUnits.pop()
      this.selUnits.push({
        value: this.quantifier,
        text: this.quantifier
      })
      this.unit = this.quantifier
      this.showBoxQuantifier = false
    },
    cancelAddUnit () {
      this.showBoxQuantifier = false
      this.unit = 'hour'
    },
    setGoalDeadline () {
      this.todo.goal.deadline = this.goalDate
      this.showBoxPickDate = false
    },
    cancelSetGoalDeadline () {
      this.showBoxPickDate = false
      setTimeout(() => {
        this.goalDate = this.todo.goal.deadline || new Date()
      }, 300)
    },
    initCompletedNum () {
      if (this.todo.goal.unit !== this.unit) {
        this.todo.goal.complete = 0
        return
      }

      if (this.todo.habit.unit !== this.unit) {
        this.todo.habit.complete = 0
        return
      }
    },
    submitAddTodo (done) {
      const { name, id } = this.todo

      if (name === '') {
        this.$message({
          title: this.$t('word.tip'),
          content: this.error.todo.name
        })
        return
      }

      if (name.length > 30) {
        this.$message({
          title: this.$t('word.tip'),
          content: this.$t('tips.name_length')
        })
        return
      }

      const hasSameName = this.todos.some(todo => {
        if (id >= 0) {
          if (id !== todo.id) {
            return todo.name === name
          }
          return false
        }

        return todo.name === name
      })

      if (hasSameName) {
        this.$message({
          title: this.$t('word.tip'),
          content: this.$t('tips.already_has_same_todo')
        })
        return
      }

      if (this.todo.type === 'goal') {
        const { deadline, total } = this.todo.goal

        if (!deadline || total <= 0) {
          this.$message({
            title: this.$t('word.tip'),
            content: this.$t('tips.not_input_goal_or_complete')
          })
          return
        }
        this.initCompletedNum()
        this.todo.goal.unit = this.unit
        delete this.todo.habit
      } else if (this.todo.type === 'habit') {
        const { piece } = this.todo.habit

        if (!piece) {
          this.$message({
            title: this.$t('word.tip'),
            content: this.$t('tips.not_input_goal_or_complete')
          })
          return
        }
        this.initCompletedNum()
        this.todo.habit.unit = this.unit
        delete this.todo.goal
      } else {
        delete this.todo.habit
        delete this.todo.goal
      }

      if (this.todo.timeWay === 'up') {
        delete this.todo.loopTimes
        delete this.todo.timeDuration
      } else if (this.todo.timeWay === 'none') {
        delete this.todo.loopTimes
        delete this.todo.restTime
        delete this.todo.timeDuration
      }


      if (this.data) {
        delete this.todo.focus
        delete this.todo.reminders
        delete this.todo.completedTime
        this.editTodo(this.todo)
      } else {
        this.todo.creat = new Date()
        this.addTodo(this.todo)
      }

      this.$emit('submit', this.todo)
      done()
    }
  }
}
</script>

<style lang="less">
.box-add-todo {
  .com-popup__content {
    text-align: center;
  }

  .config-todo {
    display: inline-block;
    max-width: 375px;
    margin-top: 12px;
    letter-spacing: 1px;
    color: @gray;

    & > div {
      font-size: 15px;
      text-align: center;

      &:not(:first-child) {
        margin-top: 5px;
      }

      &:nth-child(2) {
        margin-top: 10px;
      }
    }
    .config-item {
      display: inline-block;
      padding: 8px;
      background-color: rgb(245, 245, 245);
      border-radius: 5px;
    }

    .config-item-checked {
      color: rgb(90, 141, 199);
      background: rgb(232, 243, 255);
    }

    .time-way,
    .time-duration {
      font-size: 13px;
    }

    .tips-time-duration {
      font-size: 12px;
      transform: scale(0.8);
      text-align: center;
    }

    .advanced-setting {
      font-size: 12px;
      transform: scale(0.9);
      span {
        .config-item;
        .config-item-checked;
      }
    }

    ul {
      li {
        display: inline-block;

        span {
          .config-item;
        }

        &:not(:last-child) {
          margin-right: 12px;
        }

        input[type="radio"] {
          width: 0;

          &:checked + span {
            .config-item-checked;
          }
        }
      }
    }

    .config-extra {
      font-size: 12px;
      text-align: left;

      .goal-key {
        background: rgb(253, 224, 212);
        color: rgb(202, 75, 25);
        display: inline-block;
        border-radius: 5px;
        padding: 5px;
        margin: 0 4px;
      }

      .habit-key {
        background: rgb(243, 212, 255);
        color: #000;
        display: inline-block;
        border-radius: 5px;
        padding: 5px;
        margin: 0 4px;
      }

      .key-input {
        border: none;
        outline: none;
        width: 60px;
        text-align: center;
      }

      .goal-input {
        &::-webkit-input-placeholder {
          color: rgb(202, 75, 25);
        }

        &:-moz-placeholder {
          color: rgb(202, 75, 25);
        }

        &::-moz-placeholder {
          color: rgb(202, 75, 25);
        }

        &:-ms-input-placeholder {
          color: rgb(202, 75, 25);
        }
      }

      .habit-input {
        &::-webkit-input-placeholder {
          color: #272727;
        }

        &:-moz-placeholder {
          color: #272727;
        }

        &::-moz-placeholder {
          color: #272727;
        }

        &:-ms-input-placeholder {
          color: #272727;
        }
      }

      select {
        border: none;
        background: white;
        padding: 0 20px 0 5px;
        vertical-align: middle;
        outline: none;
        color: #272727;
        //      appearance: none;
        //       -moz-appearance:none;
        // -webkit-appearance:none;
      }

      .row {
        padding: 4px 15px;
      }
    }
  }

  .custom-time {
    .com-popup__header {
      padding: 20px 15px;
    }

    .com-popup__content {
      padding: 10px 35px;
    }
  }

  .box-advanced-setting {
    letter-spacing: 1px;
    font-size: 14px;

    .setting-list {
      padding-right: 20px;
    }

    .com-popup__header {
      font-size: 14px;
    }

    .com-popup__content {
      padding: 10px 70px 20px;
    }

    .com-input {
      font-size: 12px;
      margin-top: 10px;
    }

    .item-1 {
      .com-input__icon {
        position: absolute;
        right: 0;
        font-size: 22px;
        transform: translateX(100%);
      }
    }
  }
}

.box-input-quantifier {
  .com-popup__content .com-input.input-quantifier {
    margin-bottom: 12px;
  }
}

.box-pick-date {
  .com-popup {
    width: 6rem;
  }

  .com-popup__content {
    padding: 0;
  }

  .com-popup__footer {
    padding: 0 20px;
    text-align: right;
  }

  .com-popup__footer-btn {
    font-size: 12px;
    width: 23%;
    color: black;
    margin-left: 12px;
  }

  .ev-calendar__header {
    padding: 15px 20px;
  }

  .ev-calendar__body {
    padding: 10px 20px;
  }
}
</style>
