<template>
  <div class="box-add-todo">
    <ComPopup
      title="添加待办"
      top-option-btn
    >
      <template v-slot:content>
        <ComInput
          icon="question"
          placeholder="请输入代办名称"
        />
        <div class="config-todo">
          <div class="type">
            <ul>
              <li
                v-for="(item,index) in todoType"
                :key="index"
                :class="{'li-clicked':item.checked}"
                @click="onTypeClick(index)"
              >
                {{ item.text }}
              </li>
            </ul>
          </div>
          <div class="time-way">
            <ul>
              <li
                v-for="(item,index) in todoTimeWay"
                :key="index"
                :class="{'li-clicked':item.checked}"
                @click="onTimeWayClick(index)"
              >
                {{ item.text }}
              </li>
            </ul>
          </div>
          <div class="time-duration">
            <ul>
              <li
                v-for="(item,index) in todoTimeDuration"
                :key="index"
                :class="{'li-clicked':item.checked}"
                @click="onTimeDurationClick(index)"
              >
                {{ item.text }}
              </li>
            </ul>
          </div>
        </div>
      </template>
    </ComPopup>
    <ComPopup
      title="自定义Todo时间"
      class="custom-time"
      bottom-confirm-btn
      :show.sync="showCustomTimeBox"
    >
      <template v-slot:content>
        <ComInput
          placeholder="25分钟"
        />
      </template>
    </ComPopup>
  </div>
</template>

<script>
import ComPopup from '@/components/common/ComPopup.vue'
import ComInput from '@/components/common/ComInput.vue'
export default {
  components: {
    ComPopup,
    ComInput
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
          checked: true
        },
        {
          text: '35分钟',
          checked: false
        },
        {
          text: '自定义',
          checked: false
        }
      ],
      todo: {
        type: '',
        timeWay: '',
        timeDuration: 25
      },
      showCustomTimeBox: false
    }
  },
  computed: {
  },
  methods: {
    checkItem (list, currentItem) {
      list.forEach((item) => {
        item.checked = false
      })
      currentItem.checked = true
    },
    onTypeClick (index) {
      this.todo.type = this.todoType[index].text
      this.checkItem(this.todoType, this.todoType[index])
    },
    onTimeWayClick (index) {
      this.todo.timeWay = this.todoTimeWay[index].text
      this.checkItem(this.todoTimeWay, this.todoTimeWay[index])
    },
    onTimeDurationClick (index) {
      if (this.todoTimeDuration[index].text === '自定义') {
        this.showCustomTimeBox = true
      }
      this.todo.timeDuration = this.todoTimeDuration[index].text
      this.checkItem(this.todoTimeDuration, this.todoTimeDuration[index])
    }
  }
}
</script>

<style lang="less">
.box-add-todo {
  .config-todo {
    margin-top: 12px;
    & > div {
      font-size: 16px;
      &:not(:first-child) {
        margin-top: 10px;
        font-size: 14px;
      }
    }
    ul {
      text-align: center;

      li {
        display: inline-block;
        padding: 8px;
        border-radius: 5px;
        background-color: rgb(245, 245, 245);
        &:not(:last-child) {
          margin-right: 10px;
        }
      }
      .li-clicked {
        color: rgb(90, 141, 199);
        background: rgb(232, 243, 255);
      }
    }
  }
  .custom-time {
    .title {
      padding: 20px 15px;
      background-color: @theme-base-color-1;
    }
    .content {
      padding: 10px 35px;
    }

  }
}
</style>
