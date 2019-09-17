<template>
  <div class="box-add-todo">
    <ComPopup
      title="添加待办"
      top-option-btn
    >
      <template v-slot:content>
        <ComInput
          ref="input-name"
          type="textarea"
          icon="question"
          placeholder="请输入代办名称"
          :tips="tips.todo.name"
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
            *倒计时25分钟即标准番茄钟时间
          </div>
          <div class="advanced-setting">
            <span @click="onAdvancedSettingsClick">展开更多高级设置</span>
          </div>
        </div>
      </template>
    </ComPopup>
    <ComPopup
      title="自定义Todo时间"
      class="custom-time"
      bottom-confirm-btn
      :show.sync="showCustomTimeBox"
      @submit="submitCustomTimeDuration"
      @cancel="cancelCustomTimeDuration"
    >
      <template v-slot:content>
        <ComInput
          ref="input-time-duration"
          v-model="customTimeDuration.currentValue"
          :placeholder="customTimeDuration.lastValue+'分钟'"
          :min="customTimeDuration.min"
          :max="customTimeDuration.max"
          type="number"
        />
      </template>
    </ComPopup>
    <Fade>
      <div
        v-show="showAdvancedSettingsBox"
        class="456"
      >
        <ComPopup
          title="高级设置"
          top-option-btn
          class="box-advanced-setting"
          :show.sync="showAdvancedSettingsBox"
          @cancel="cancelAdvancedSettings"
          @submit="submitAdvancedSettings"
        >
          <template v-slot:content>
            <label class="label-checkbox">
              <input type="checkbox">
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
                v-model="advancedSettings.taskNotes.currentValue"
                type="textarea"
                placeholder="任务备注"
              />
              <ComInput
                v-model="advancedSettings.loopTimes.currentValue"
                type="Number"
                placeholder="单次预期循环次数"
                :tips="tips.todo.loopTimes"
                icon="question"
                class="item-1"
              />
              <ComInput
                v-model="advancedSettings.restTime.currentValue"
                type="Number"
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
export default {
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
          checked: true
        },
        {
          text: '正向计时',
          checked: false
        },
        {
          text: '不计时',
          checked: false
        }
      ],
      todoTimeDuration: [
        {
          text: '25分钟',
          checked: true,
          value: 25
        },
        {
          text: '35分钟',
          checked: false,
          value: 35
        },
        {
          text: '自定义',
          checked: false,
          value: -1
        }
      ],
      todo: {
        type: '',
        timeWay: '',
        timeDuration: 25,
        advancedSettings: {
          taskNotes: '',
          loopTimes: 1,
          restTime: 5
        }
      },
      customTimeDuration: {
        lastValue: 25,
        currentValue: '',
        min: 0,
        max: 180
      },
      advancedSettings: {
        taskNotes: {
          currentValue: ''
        },
        loopTimes: {
          currentValue: '',
          min: 1,
          max: 50
        },
        restTime: {
          currentValue: '',
          min: 0,
          max: 50
        }
      },
      showCustomTimeBox: false,
      showAdvancedSettingsBox: false,
      tips: {
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
      }
    }
  },
  computed: {

  },
  methods: {
    submitCustomTimeDuration () {
      let { currentValue, lastValue, max, min } = this.customTimeDuration
      currentValue = currentValue === '' ? lastValue : currentValue
      if (currentValue < min) {
        this.$tips('单个番茄时间不能低于0分钟')
      } else if (currentValue > max) {
        this.$tips('单个番茄时间不能超过180分钟')
      } else {
        this.customTimeDuration.lastValue = currentValue
        this.todo.timeDuration = currentValue
        this.todoTimeDuration[2].text = currentValue + '分钟'
        this.todoTimeDuration[2].value = currentValue
        this.showCustomTimeBox = false
        this.$refs['input-name'].focus()
      }
    },
    cancelCustomTimeDuration () {
      this.customTimeDuration.currentValue = ''
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
        this.advancedSettings[key].currentValue = ''
      }
      this.$refs['input-name'].focus()
    },
    submitAdvancedSettings () {
      for (const key of Object.keys(this.advancedSettings)) {
        const { currentValue, max, min } = this.advancedSettings[key]
        if (currentValue !== '') {
          if (currentValue < min) {
            this.$tips('单个番茄时间不能低于0分钟')
          } else if (currentValue > max) {
            this.$tips('单个番茄时间不能超过50分钟')
          } else {
            this.todo.advancedSettings[key] = currentValue
            this.showAdvancedSettingsBox = false
            this.$refs['input-name'].focus()
          }
        }
      }
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
