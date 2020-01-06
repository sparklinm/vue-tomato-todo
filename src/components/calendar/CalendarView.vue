<template>
  <div>
    <ev-calendar
      :options="options"
      @select-day="selectDay"
    >
      <template #events="scope">
        <ev-event
          v-for="(todo, index) in completedTodos"
          :key="index"
          :event="{ date: todo.start }"
        >
          <div
            class="completed-item"
            @click="edit(index)"
          >
            <div class="left">
              <div class="hd">
                {{ todo.name }}
              </div>
              <div class="bd">
                {{ todo.experience }}
              </div>
              <div
                v-if="todo.duration"
                class="ft"
              >
                <span>{{ todo.duration }}</span>
              </div>
            </div>
            <div class="right">
              <div
                class="hd"
                :class="{ 'text-red': todo.reason }"
              >
                <div class="hd-text">
                  {{ todo.status }}
                </div>
                <div
                  v-if="todo.reason"
                  class="hd-description"
                >
                  {{ todo.reason }}
                </div>
              </div>
              <div
                v-if="todo.progress"
                class="ft"
              >
                <ProgressCircle :width="18" />
              </div>
            </div>
          </div>
        </ev-event>
      </template>
    </ev-calendar>

    <ComPopup
      class="box-edit box-edit-completed"
      :title="curTodo.name"
      :show.sync="showBoxInfo"
    >
      <div class="cells">
        <div class="cell">
          <div class="cell-bd">
            <span
              class="btn btn-middle"
              @click="editDuration"
            >{{ $t("todo.edit_duration") }}
            </span>
            <span
              class="btn btn-middle"
              @click="submitDeleteFocus"
            >{{ $t("action.delete") }}
            </span>
          </div>
        </div>
        <div class="cell btn">
          <div class="cell-footer">
            <div class="row">
              <div class="title">
                <span>{{ $t("todo.start_time") }}</span>
              </div>
              <span class="time">{{ dateFormatter(curTodo.start,timePattern) }}</span>
            </div>
            <div class="row">
              <div class="title">
                <span>{{ $t("todo.end_time") }}</span>
              </div>
              <span class="time">{{ dateFormatter(curTodo.end,timePattern) }}</span>
            </div>
            <div class="row">
              <div class="title">
                <span>{{ $t("todo.focus_time") }}</span>
              </div>
              <span>{{ curTodo.duration }}</span>
            </div>
            <div class="row">
              <div class="title">
                <span>{{ $t("todo.time_status") }}</span>
              </div>
              <div>
                <span>{{ curTodo.status }}</span>
                <div v-if="curTodo.reason">
                  {{ curTodo.reason }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="cell">
          <div class="cell-bd">
            <span
              class="btn btn-big"
              @click="editExperience"
            >
              {{ curTodo.experience }}
            </span>
          </div>
        </div>
      </div>
    </ComPopup>
    <ComPopup
      class="box-edit-duration"
      :show.sync="showBoxDuration"
      :z-index="2050"
      no-header
    >
      <ComInput
        v-model="focusDuration"
        type="number"
        :placeholder="$t('todo.modify_focus_duration')"
        autofocus
      />

      <div class="tip-setting ">
        {{ this.$t('tips.modify_focus_duration',[curTodo.duration]) }}
      </div>
      <template v-slot:footer>
        <button
          class="com-popup__footer-btn"
          @click="submitEditDuration"
        >
          {{ $t('action.confirm') }}
        </button>
        <button
          class="com-popup__footer-btn"
          @click="showBoxDuration=false"
        >
          {{ $t('action.cancel') }}
        </button>
      </template>
    </ComPopup>

    <ComPopup
      class="box-edit-text"
      :show.sync="showBoxText"
      :z-index="2050"
      :title="$t('word.experience')"
    >
      <template v-slot:header-icon>
        <ComIcon
          name="pencil"
          @click="changeCanEdit"
        />
        <ComIcon
          name="check"
          @click="submitEditExperience"
        />
      </template>
      <ComInput
        ref="inputExperience"
        v-model="experience"
        type="textarea"
        :disabled="disableEditExperience"
        :placeholder="inputExperiencePlaceHolder"
        autofocus
      />
    </ComPopup>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ProgressCircle from '@/components/todo/ProgressCircle'
import util from '@/util.js'
export default {
  components: {
    ProgressCircle
  },
  data () {
    return {
      options: {
        color: '#f29543',
        events: []
      },
      timePattern: 'yyyy-MM-dd hh:mm',
      selectedDay: new Date(),
      showBoxInfo: false,
      curTodo: {},
      showBoxDuration: false,
      focusDuration: '',
      showBoxText: false,
      experience: '',
      disableEditExperience: false,
      inputExperiencePlaceHolder: '',
      error: {
        focusDuration: this.$t('message.modify_focus_duration'),
        delete: this.$t('message.confirm_delete')
      }
    }
  },
  computed: {
    ...mapState('todo', {
      todos: state => state.todos
    }),
    ...mapState('settings', {
      calendarColor: state => state.currentTheme.darken10
    }),
    completedTodos () {
      const data = []
      this.todos.forEach(todo => {
        if (todo.focus) {
          todo.focus.forEach(item => {
            if (util.isEqualDateFuzzy(item.start, this.selectedDay, 'hour')) {
              const duration = item.duration || this.getTimeDif(item.start, item.end)
              let progress = ''
              if (todo.timeDuration) {
                progress = duration / todo.timeDuration
              }
              const durationTxt =
                duration > 0 ? duration + this.$t('word.minute') : ''
              const obj = {
                start: item.start,
                end: item.end,
                name: todo.name,
                experience:
                  item.experience || this.$t('todo.click_fill_in_experience'),
                duration: durationTxt,
                status: item.reason
                  ? this.$t('todo.abandon_in_half')
                  : this.$t('word.completed'),
                reason: item.reason || '',
                progress: progress,
                data: item
              }
              data.push(obj)
            }
          })
        }
      })
      return data
    }
  },
  watch: {
    todos: {
      handler (todos) {
        todos.forEach(todo => {
          if (todo.focus) {
            todo.focus.forEach(item => {
              this.options.events.push({
                date: item.start
              })
            })
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.selectDay(new Date())
    this.options.color = this.calendarColor
  },
  methods: {
    dateFormatter: util.dateFormatter,
    ...mapMutations('todo', ['editFocus', 'deleteFocus']),
    getTimeDif (start, end) {
      return Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
    },
    getProgress (duration, total) {
      return Math.floor(duration / total) * 100
    },
    selectDay (date) {
      this.selectedDay = date
    },
    edit (index) {
      this.showBoxInfo = true
      this.curTodo = this.completedTodos[index]
    },
    editDuration () {
      this.showBoxDuration = true
    },
    submitEditDuration () {
      if (this.focusDuration > this.curTodo.data.duration) {
        this.error.focusDuration = this.$t('message.modify_focus_duration', [this.curTodo.data.duration])
        this.$message({
          title: this.$t('word.tip'),
          content: this.error.focusDuration
        })
        return
      }
      this.editFocus({
        id: this.curTodo.data.id,
        duration: this.focusDuration
      })
      this.showBoxDuration = false
    },
    submitDeleteFocus () {
      this.$message({
        title: this.$t('word.tip'),
        content: this.error.delete,
        options: {
          showCancel: true
        }
      }).then(() => {
        this.deleteFocus(this.curTodo.data.id)
        this.showBoxInfo = false
      })
    },
    editExperience () {
      this.showBoxText = true
      this.experience = this.curTodo.data.experience
      this.disableEditExperience = Boolean(this.experience)
      this.inputExperiencePlaceHolder = this.experience ? '' : this.$t('todo.please_input_experience')
      this.$nextTick(() => {
        this.$refs.inputExperience.focus()
      })
    },
    submitEditExperience () {
      this.editFocus({
        id: this.curTodo.data.id,
        experience: this.experience
      })
      this.showBoxText = false
      this.showBoxInfo = false
    },
    changeCanEdit () {
      this.disableEditExperience = false
      this.$nextTick(() => {
        this.$refs.inputExperience.focus()
      })
    }
  }
}
</script>

<style lang="less">
.completed-item {
  padding: 8px 8px 8px 15px;
  background-color: rgb(49, 159, 202);
  color: white;
  border-radius: 5px;
  box-shadow: 0 0 5px 0px @gray;
  font-size: 12px;
  .flex(@justify-content: space-between);

  .left {
    .flex(@flex-direction: column);

    .bd {
      margin-top: 10px;
      font-size: 12px;
      opacity: 0.8;
    }

    .ft {
      margin-top: 10px;
    }
  }

  .right {
    text-align: right;
    .flex(@justify-content: space-between; @flex-direction: column);
  }

  .progress-bar-circle {
    display: inline-block;
  }

  .progress-bar__sector {
    display: none;
  }

  .progress-bar__text {
    font-size: 6px;
  }
}

.box-edit-completed {
  font-size: 12px;
  .cell {
    .cell-bd {
      padding: 0;
    }

    .row {
      width: auto;

      &:not(:last-child){
        margin-bottom: 8px;
      }
    }

    .cell-footer {
      padding: 8px;
    }

    .time {
      letter-spacing: 0;
    }
  }
}

.box-wrap.box-edit-duration {
  .com-input:first-child {
    margin-bottom: 10px;
  }
}

.box-edit-text {
  .com-icon {
    font-size: 16px;
    margin-left: 20px;
  }

  .com-input__box {
    height: 300px;
  }
}
</style>
