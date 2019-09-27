<template>
  <div class="box-add-todo">
    <ComPopup
      title="添加待办"
      top-option-btn
      :show="showBoxAddToDo"
      :submit="submitAddToDo"
      :before-open="beforeBoxAddToDoOpen"
      @closed="toggleBoxAddToDo(false)"
    >
      <template v-slot:content>
        <ComInput
          ref="input-name"
          v-model="todo.name"
          type="textarea"
          icon="question"
          placeholder="请输入代办名称"
          :tips="description.todo.name"
          autofocus
        />
        <div class="config-todo">
          <div class="type">
            <ul>
              <li
                v-for="(item,index) in todoType"
                :key="index"
              >
                <label>
                  <input
                    type="radio"
                    name="type"
                    :checked="index===0"
                  >
                  <span @click="onTypeClick(index)">{{ item.text }}</span>
                </label>
              </li>
            </ul>
          </div>
          <div class="config-extra">
            <div
              v-show="showConfigGoal"
              class="config-goal"
            >
              我想在
              <input type="text">
              之前一共完成
              <input type="text">
              <select
                id
                name
              >
                <option value="小时">
                  小时
                </option>
              </select>
            </div>
            <div
              v-show="showConfigHabit"
              class="config-habit"
            >
              我想
              <select
                id
                name
              >
                <option value="每天">
                  每天
                </option>
              </select>
              完成
              <input type="text">
              <select
                id
                name
              >
                <option value="小时">
                  小时
                </option>
              </select>
            </div>
          </div>
          <div class="time-way">
            <ul>
              <li
                v-for="(item,index) in todoTimeWay"
                :key="index"
              >
                <label>
                  <input
                    :checked="item.checked"
                    type="radio"
                    name="way"
                  >
                  <span @click="onTimeWayClick(item)">{{ item.value }}</span>
                </label>
              </li>
            </ul>
          </div>
          <div class="time-duration">
            <ul>
              <li
                v-for="(item,index) in todoTimeDuration"
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
            <span @click="onAdvancedSettingsClick">{{ btnAdvancedSettings }}</span>
          </div>
        </div>
      </template>
    </ComPopup>
    <Fade>
      <div v-show="showBoxCustomTime">
        <ComPopup
          title="自定义Todo时间"
          class="custom-time"
          bottom-confirm-btn
          :show.sync="showBoxCustomTime"
          :z-index="2050"
          :animationed="false"
          :submit="submitCustomTimeDuration"
          :cancel="cancelCustomTimeDuration"
        >
          <template v-slot:content>
            <ComInput
              ref="input-time-duration"
              v-model="customTimeDuration.value"
              :placeholder="todo.timeDuration+'分钟'"
              :min="customTimeDuration.min"
              :max="customTimeDuration.max"
              type="positiveInteger"
            />
          </template>
        </ComPopup>
      </div>
    </Fade>
    <Fade>
      <div v-show="showBoxAdvancedSettings">
        <ComPopup
          title="高级设置"
          top-option-btn
          class="box-advanced-setting"
          :show.sync="showBoxAdvancedSettings"
          :z-index="2050"
          :animationed="false"
          :cancel="cancelAdvancedSettings"
          :submit="submitAdvancedSettings"
        >
          <template v-slot:content>
            <label class="label-checkbox">
              <input
                v-model="advancedSettings.hideAfterComplete.value"
                type="checkbox"
              >
              <span class="icon-checked">
                <i
                  aria-hidden="true"
                  class="fa fa-check"
                />
              </span>
              <span>完成后第二天不再显示</span>
            </label>
            <div class="setting-list">
              <ComInput
                ref="input-task-notes"
                v-model="advancedSettings.taskNotes.value"
                type="textarea"
                placeholder="任务备注"
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
          </template>
        </ComPopup>
      </div>
    </Fade>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      todo: this.data || {
        name: '',
        type: '普通番茄时钟',
        timeWay: '倒计时',
        timeDuration: 25
      },
      todoCommon: {
        name: '',
        type: '普通番茄时钟',
        timeWay: '倒计时',
        timeDuration: 25,
        taskNotes: '',
        loopTimes: '',
        restTime: '',
        hideAfterComplete: false
      },
      todoGoal: {
        name: '',
        type: '定目标',
        timeWay: '倒计时',
        timeDuration: 25,
        goal: {
          deadline: new Date(2019, 9, 2),
          total: 10,
          complete: 0
        },
        taskNotes: '',
        loopTimes: '',
        restTime: '',
        hideAfterComplete: false
      },
      todoHabit: {
        name: '',
        type: '养习惯',
        timeWay: '倒计时',
        timeDuration: 25,
        habit: {
          frequency: 1,
          piece: 10,
          complete: 0
        },
        taskNotes: '',
        loopTimes: '',
        restTime: '',
        hideAfterComplete: false
      },
      todoType: [
        {
          name: 'common',
          text: '普通番茄钟',
          checked: true
        },
        {
          name: 'goal',
          text: '定目标',
          checked: false
        },
        {
          name: 'habit',
          text: '养习惯',
          checked: false
        }
      ],
      todoTimeWay: [
        {
          value: '倒计时',
          description: '*倒计时25分钟即标准番茄钟时间',
          checked: true
        },
        {
          value: '正向计时',
          description: '*适合碎片时间记录，随用随计',
          checked: false
        },
        {
          value: '不计时',
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
    showConfigGoal () {
      return this.todo.type === this.todoGoal.type
    },
    showConfigHabit () {
      return this.todo.type === this.todoHabit.type
    },
    showInputLoopTimes () {
      return this.todo.timeWay === '倒计时'
    },
    showInputRestTime () {
      return this.todo.timeWay !== '不计时'
    },
    tipTimeDuration () {
      return this.todoTimeWay.find(item => {
        return item.value === this.todo.timeWay
      }).description
    },
    ...mapState({
      showBoxAddToDo: state => state.showBoxAddToDo
    })
  },
  watch: {
    showBoxAdvancedSettings (val) {
      if (!val) {
        this.setBtnAdvancedSettings()
      }
    },
    'todo.name' (val) {
      this.todoCommon.name = this.todoGoal.name = this.todoHabit.name = val
    }
  },
  mounted () {
    this.todo = this.todoCommon
  },
  methods: {
    ...mapMutations(['addToDo', 'toggleBoxAddToDo']),
    checkNumber ({ value, max }) {
      return value - max <= 0
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
      configs.forEach(item => {
        item.checked = item.value === value
      })
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
      const type =
        this.todoType[index].name.slice(0, 1).toUpperCase() +
        this.todoType[index].name.slice(1)
      this.todo = this['todo' + type]

      this.setChecked(this.todoTimeWay, this.todo.timeWay)

      this.setChecked(this.todoTimeDuration, this.todo.timeDuration)

      for (const [key, setting] of Object.entries(this.advancedSettings)) {
        setting.value = this.todo[key]
      }

      this.setBtnAdvancedSettings()
    },
    onTimeWayClick (obj) {
      this.setChecked(this.todoTimeWay, obj.value)
      this.todo.timeWay = obj.value
    },
    onTimeDurationClick (obj) {
      if (obj.value === -1) {
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
          !max === 'NO_VALUE' &&
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
          this.todo[key] = setting.default = value
        }
        this.$refs['input-name'].focus()
      }

      if (!showBoxAdvancedSettings) {
        done()
      }
    },
    beforeBoxAddToDoOpen (done) {
      this.$nextTick(() => {
        done()
      })
    },
    submitAddToDo (done) {
      const { name, loopTimes, restTime } = this.todo
      if (name === '') {
        this.$message({
          title: '提示',
          content: this.error.todo.name
        })
        return
      }
      this.todo.loopTimes = loopTimes || 1
      this.todo.restTime = restTime || 5

      if (this.todo.timeWay === '正向计时') {
        delete this.todo.loopTimes
        delete this.todo.timeDuration
      } else if (this.todo.timeWay === '不计时') {
        delete this.todo.loopTimes
        delete this.todo.restTime
        delete this.todo.timeDuration
      }

      if (this.todo.type === '定目标') {
        this.todo.type = '目标'
      } else if (this.todo.type === '养习惯') {
        this.todo.type = '习惯'
      }

      this.addToDo(this.todo)
      done()
    }
  }
}
</script>

<style lang="less">
.box-add-todo {
  .config-todo {
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
      font-size: 10px;
      transform: scale(0.8);
      text-align: center;
    }

    .advanced-setting {
      font-size: 10px;
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
  }

  .custom-time {
    .title {
      padding: 20px 15px;
    }

    .content {
      padding: 10px 35px;
    }
  }

  .box-advanced-setting {
    letter-spacing: 1px;
    font-size: 14px;

    .label-checkbox {
      position: relative;
      @checkbox-w: 20px;
      @checkbox-h: 20px;

      .checkbox-wh {
        width: @checkbox-w;
        height: @checkbox-h;
      }

      input[type="checkbox"] {
        vertical-align: middle;
        margin-right: 8px;
        background: #fff;
        border: 1px solid black;
        border-radius: 2px;
        appearance: none;
        outline: none;
        .checkbox-wh;

        &:checked {
          background: darken(@theme-base-color-1, 20%);
          border: none;
        }

        &:checked + .icon-checked {
          display: inline-block;
          position: absolute;
          left: 0;
          text-align: center;
          color: white;
          .checkbox-wh;

          i {
            line-height: @checkbox-h;
          }
        }
      }

      .icon-checked {
        display: none;
      }

      span {
        vertical-align: middle;
      }
    }

    .setting-list {
      padding-right: 20px;
    }

    .title {
      font-size: 14px;
    }

    .content {
      padding: 10px 70px 20px;
    }

    .com-input {
      font-size: 12px;
      margin-top: 10px;
    }

    .item-1 {
      .tips {
        position: absolute;
        right: 0;
        font-size: 22px;
        transform: translateX(100%);
      }
    }
  }
}
</style>
