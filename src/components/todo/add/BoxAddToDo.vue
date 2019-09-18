<template>
  <div class="box-add-todo">
    <ComPopup
      title="添加待办"
      top-option-btn
      :show.sync="showAddToDoBox"
      @cancel="cancelAddToDo"
      @submit="submitAddToDo"
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
          <div class="time-way">
            <ul>
              <li
                v-for="(item,index) in todoTimeWay"
                :key="index"
              >
                <label>
                  <input
                    type="radio"
                    name="way"
                    :checked="index===0"
                  >
                  <span @click="onTimeWayClick(index)">{{ item.text }}</span>
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
                    :checked="index===0"
                    @click="onTimeDurationClick(index)"
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
      <div v-show="showCustomTimeBox">
        <ComPopup
          title="自定义Todo时间"
          class="custom-time"
          bottom-confirm-btn
          :show.sync="showCustomTimeBox"
          :z-index="2050"
          :animationed="false"
          @submit="submitCustomTimeDuration"
          @cancel="cancelCustomTimeDuration"
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
      <div v-show="showAdvancedSettingsBox">
        <ComPopup
          title="高级设置"
          top-option-btn
          class="box-advanced-setting"
          :show.sync="showAdvancedSettingsBox"
          :z-index="2050"
          :animationed="false"
          @cancel="cancelAdvancedSettings"
          @submit="submitAdvancedSettings"
        >
          <template v-slot:content>
            <label class="label-checkbox">
              <input
                v-model="advancedSettings.hideAfterComplete"
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
import { mapMutations } from 'vuex'
export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      todoType: [
        {
          text: '普通番茄钟',
          checked: true
        },
        {
          text: '定目标',
          checked: false
        },
        {
          text: '养习惯',
          checked: false
        }
      ],
      todoTimeWay: [
        {
          text: '倒计时',
          description: '*倒计时25分钟即标准番茄钟时间'
        },
        {
          text: '正向计时',
          description: '*适合碎片时间记录，随用随计'
        },
        {
          text: '不计时',
          description: '*适合不需要计时的待办，比如：取快递，喝水 等'
        }
      ],
      todoTimeDuration: [
        {
          text: '25分钟',
          value: 25
        },
        {
          text: '35分钟',
          value: 35
        },
        {
          text: '自定义',
          value: -1
        }
      ],
      todo: this.data || {
        name: '',
        type: '普通番茄时钟',
        timeWay: '倒计时',
        timeDuration: 25,
        goal: {
          deadline: '',
          total: ''
        },
        habit: {
          frequency: '',
          piece: ''
        },
        taskNotes: '',
        loopTimes: 1,
        restTime: 5,
        hideAfterComplete: false
      },
      customTimeDuration: {
        value: '',
        min: 0,
        max: 180
      },
      advancedSettings: {
        hideAfterComplete: {
          value: false,
          default: false
        },
        taskNotes: {
          value: '',
          default: ''
        },
        loopTimes: {
          value: '',
          default: '',
          min: 1,
          max: 50
        },
        restTime: {
          value: '',
          default: '',
          min: 0,
          max: 50
        }
      },
      showAddToDoBox: true,
      showCustomTimeBox: false,
      showAdvancedSettingsBox: false,
      btnAdvancedSettings: '展开更多高级设置',
      description: {
        todo: {
          name: {
            title: '什么是番茄钟？',
            content: '<p>番茄钟是全身心工作25分钟，休息5分钟的工作法。</p><p>输入事项名称，点击<i aria-hidden="true" class="fa fa-check"></i>按钮即可以添加一个标准的番茄钟待办。</p>点击待办卡片上的开始按钮就可以开始一个番茄钟啦。</p>'
          },
          loopTimes: {
            title: '什么是单次预期循环次数？',
            content: '<p>番茄钟是全身心工作25分钟，休息5分钟的工作法。</p><p>输入事项名称，点击<i aria-hidden="true" class="fa fa-check"></i>按钮即可以添加一个标准的番茄钟待办。</p>点击待办卡片上的开始按钮就可以开始一个番茄钟啦。</p>'
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
    showInputLoopTimes () {
      return this.todo.timeWay === '倒计时'
    },
    showInputRestTime () {
      return this.todo.timeWay !== '不计时'
    },
    tipTimeDuration () {
      return this.todoTimeWay.find((item) => {
        return item.text === this.todo.timeWay
      }).description
    }
  },
  watch: {
    showAdvancedSettingsBox (val) {
      if (!val) {
        for (const setting of Object.values(this.advancedSettings)) {
          if (setting.value !== setting.default) {
            this.btnAdvancedSettings = '已添加高级设置'
            return
          }
        }
        this.btnAdvancedSettings = '展开更多高级设置'
      }
    }
  },
  methods: {
    ...mapMutations(['addToDo']),
    checkNumber ({ value, max }) {
      return value - max <= 0
    },
    submitCustomTimeDuration () {
      const { value } = this.customTimeDuration
      if (this.value === '') {
        return
      }
      if (this.checkNumber(this.customTimeDuration)) {
        this.todo.timeDuration = value
        this.todoTimeDuration[2].text = value + '分钟'
        this.todoTimeDuration[2].value = value
        this.showCustomTimeBox = false
        this.$refs['input-name'].focus()
      } else {
        this.$tips(this.error.todo.timeDuration)
      }
    },
    cancelCustomTimeDuration () {
      this.customTimeDuration.value = ''
      this.$refs['input-name'].focus()
    },
    onTypeClick (index) {
      this.todo.type = this.todoType[index].text
    },
    onTimeWayClick (index) {
      this.todo.timeWay = this.todoTimeWay[index].text
    },
    onTimeDurationClick (index) {
      if (this.todoTimeDuration[index].value === -1) {
        this.showCustomTimeBox = true
        this.$nextTick(() => {
          this.$refs['input-time-duration'].focus()
        })
      } else {
        this.todo.timeDuration = this.todoTimeDuration[index].value
      }
    },
    onAdvancedSettingsClick () {
      this.showAdvancedSettingsBox = true
      this.$nextTick(() => {
        this.$refs['input-task-notes'].focus()
      })
    },
    cancelAdvancedSettings () {
      for (const key of Object.keys(this.advancedSettings)) {
        this.advancedSettings[key].value = this.advancedSettings[key].default
      }
      this.$refs['input-name'].focus()
    },
    submitAdvancedSettings () {
      let showAdvancedSettingsBox = false
      for (const key of Object.keys(this.advancedSettings)) {
        const { value, max = 'NO_VALUE' } = this.advancedSettings[key]
        if (max === 'NO_VALUE') {
          this.todo[key] = value
        } else {
          if (this.checkNumber(this.advancedSettings[key])) {
            this.todo[key] = value
            this.$refs['input-name'].focus()
          } else {
            this.$tips(this.error.todo[key])
            showAdvancedSettingsBox = true
          }
        }
      }
      this.showAdvancedSettingsBox = showAdvancedSettingsBox
    },
    resetToDo () {
      this.todo = this.data || {
        name: '',
        type: '普通番茄时钟',
        timeWay: '倒计时',
        timeDuration: 25,
        goal: {
          deadline: '',
          total: ''
        },
        habit: {
          frequency: '',
          piece: ''
        },
        taskNotes: '',
        loopTimes: 1,
        restTime: 5,
        hideAfterComplete: false
      }
    },
    cancelAddToDo () {
    },
    submitAddToDo () {
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

      console.log(this.todo)

      this.addToDo(this.todo)
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
      };

      &:nth-child(2){
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
