<template>
  <div class="time-axis">
    <ev-calendar
      :options="options"
      @select-day="selectDay"
    >
      <template #headerLeftBtn>
        <ComIcon
          v-if="showReturn"
          class="calendar-return-btn"
          name="arrow-left"
          @click="$emit('return')"
        />
      </template>
      <template #events="scope">
        <ev-event
          v-for="(todo, index) in completedTodos"
          :key="index"
          :event="{ date: todo.start }"
        >
          <div
            class="cm-list-item"
            @click="edit(index)"
          >
            <div class="left">
              <div
                v-ellipsis="15"
                class="hd"
              >
                {{ todo.name }}
              </div>
              <div
                v-ellipsis="60"
                class="bd"
              >
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
                  v-ellipsis="10"
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
      append-to-body
      :show.sync="showBoxInfo"
      :z-index="3050"
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
              <span class="time">{{
                dateFormatter(curTodo.start, timePattern)
              }}</span>
            </div>
            <div class="row">
              <div class="title">
                <span>{{ $t("todo.end_time") }}</span>
              </div>
              <span class="time">{{
                dateFormatter(curTodo.end, timePattern)
              }}</span>
            </div>
            <div class="row">
              <div class="title">
                <span>{{ $t("todo.focus_time") }}</span>
              </div>
              <span>{{ curTodo.duration || $t('todo.not_record') }}</span>
            </div>
            <div class="row">
              <div class="title">
                <span>{{ $t("todo.time_status") }}</span>
              </div>
              <div class="time-status">
                <span>{{ curTodo.status }}</span>
                <div
                  v-if="curTodo.reason"
                  class="abandon-reason"
                >
                  {{ curTodo.reason }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="cell btn">
          <div
            v-if="curTodo.data.experience"
            class="cell-footer experience"
          >
            <span
              class=""
              @click="editExperience"
            >
              {{ curTodo.experience }}
            </span>
          </div>
          <div
            v-else
            class="cell-footer fill-experience"
          >
            <span @click="editExperience">
              {{ $t('todo.click_fill_in_experience'), }}
            </span>
          </div>
        </div>
      </div>
    </ComPopup>
    <ComPopup
      class="box-edit-duration"
      :show.sync="showBoxDuration"
      :z-index="3100"
      no-header
      append-to-body
      @closed="focusDuration = ''"
    >
      <ComInput
        v-model.number="focusDuration"
        type="number"
        :placeholder="$t('todo.modify_focus_duration')"
        autofocus
      />

      <div class="tip-setting ">
        {{ this.$t("tips.modify_focus_duration", [curTodo.duration]) }}
      </div>
      <template v-slot:footer>
        <button
          class="com-popup__footer-btn"
          @click="submitEditDuration"
        >
          {{ $t("action.confirm") }}
        </button>
        <button
          class="com-popup__footer-btn"
          @click="showBoxDuration = false"
        >
          {{ $t("action.cancel") }}
        </button>
      </template>
    </ComPopup>
    <BoxEditText
      v-model="experience"
      :show.sync="showBoxText"
      :z-index="3100"
      :title="$t('word.experience')"
      append-to-body
      @submit="submitEditExperience"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ProgressCircle from '@/components/todo/ProgressCircle'
import BoxEditText from '../todo/BoxEditText'
import util from '@/js/util.js'

export default {
  components: {
    ProgressCircle,
    BoxEditText
  },
  props: {
    showReturn: {
      type: Boolean,
      default: false
    },
    todos: {
      type: Array,
      default: () => {
        []
      }
    }
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
      curTodo: {
        data: {}
      },
      showBoxDuration: false,
      focusDuration: '',
      showBoxText: false,
      experience: '',
      error: {
        focusDuration: this.$t('message.modify_focus_duration'),
        delete: this.$t('message.confirm_delete')
      }
    }
  },
  computed: {
    ...mapState('settings', {
      calendarColor: state => state.currentTheme.darken10
    }),
    completedTodos () {
      const data = []

      if (!this.todos.length) {
        return
      }
      this.todos.forEach(todo => {
        if (todo.focus) {
          todo.focus.forEach(item => {
            if (util.isEqualDateFuzzy(item.start, this.selectedDay, 'hour')) {
              const duration =
                item.duration || this.getTimeDif(item.start, item.end)
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
        if (!todos.length) return
        const events = []

        todos.forEach(todo => {
          if (todo.focus) {
            todo.focus.forEach(item => {
              events.push({
                date: item.start
              })
            })
          }
        })
        this.options.events = events
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
    },
    submitEditExperience () {
      this.editFocus({
        id: this.curTodo.data.id,
        experience: this.experience
      })
    }
  }
}
</script>

<style lang="less">
.time-axis {
  height: 100%;
  background: white;
}

.box-edit-completed {
  font-size: 12px;
  .cell {
    .row {
      width: auto;

      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }

    .time {
      letter-spacing: 0;
    }
  }

  .cell-bd {
    padding: 0;
  }

  .cell-footer {
    padding: 8px;
  }

  .time-status {
    text-align: right;
    max-width: 3rem;
  }

  .abandon-reason {
    margin-top: 5px;
  }

  .experience {
    padding: 10px;
    text-align: left;
    line-height: 1.5;
    font-size: 12px;
  }

  .fill-experience {
    padding: 20px 10px;
    text-align: center;
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

.calendar-return-btn {
  margin-right: 10px;
}
</style>
