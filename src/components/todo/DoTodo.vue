<template>
  <div class="do-todo-container">
    <div class="do-todo">
      <div class="verse">
        <span class="quo-marks">
          “
        </span>
        <div class="sentence">
          {{ $t('sentence.one') }}
        </div>
      </div>
      <div class="todo-info">
        <ProgressCircle
          :width="timeClockWidth"
          :progress="progress"
          type="arc"
          :text="time"
          :font-size="timeClockFont"
        />
        <div class="name">
          {{ todo.name }}
        </div>
        <div class="status">
          {{ status }} {{ timesLeft }}
        </div>
      </div>
      <div class="options">
        <span
          class="btns-group btn-option"
        >
          <ComIcon
            name="music"
            :class="{'btn_close':isMusicClose}"
            @click="closeMusic"
          />
          <ComIcon
            name="angle-down"
            class="icon-down"
            size="24"
            @click="showBoxChangeMusic = true"
          />
        </span>

        <ComIcon
          v-if="isDoing"
          name="pause"
          class="btn-option"
          @click.native="pause"
        />
        <ComIcon
          name="circle-o"
          class="btn-option"
          :class="{'btn_close':!isLoop}"
          @click="setLoopTimes"
        />
        <ComIcon
          name="stop"
          class="btn-option"
          @click="stop"
        />
      </div>
    </div>
    <ComPopup
      class="box-pause fade"
      :show.sync="showBoxPause"
      no-header
    >
      <div class="time">
        {{ timePause }}
      </div>
      <div
        class="description"
        v-html="$t('message.pause_todo')"
      />
      <template v-slot:footer>
        <button
          class="com-popup__footer-btn"
          @click="continueTime"
        >
          {{ $t('todo.continue_time') }}
        </button>
      </template>
    </ComPopup>

    <ComPopup
      class="box-change-music fade"
      :show.sync="showBoxChangeMusic"
      no-header
    >
      <ul>
        <li
          v-for="(music, index) in musics"
          :key="music.name"
          class="music"
          :class="{ 'todo-music-default': index === 0 }"
          :style="{ background: music.cover }"
          @click="changeMusic"
        >
          {{ music.name }}
        </li>
      </ul>
    </ComPopup>

    <ComPopup
      class="box-set-loop"
      no-header
      :show.sync="showBoxSetLoop"
    >
      <ComInput
        v-model="loopTimes.value"
        type="number"
        :placeholder="$t('todo.input_loop_times')"
        autofocus
      />
      <ComInput
        v-model="restTimeLong.value"
        type="number"
        :placeholder="$t('todo.loop_end_rest_time')"
        autofocus
      />

      <template v-slot:footer>
        <button
          class="com-popup__footer-btn com-popup__footer-btn_w-auto"
          @click="infiniteLoop"
        >
          {{ $t('todo.infinite_loop') }}
        </button>
        <button
          class="com-popup__footer-btn"
          @click="submitSetLoopTimes"
        >
          {{ $t('action.confirm') }}
        </button>
        <button
          class="com-popup__footer-btn"
          @click="cancleSetLoopTimes"
        >
          {{ $t('action.cancel') }}
        </button>
      </template>
    </ComPopup>

    <ComPopup
      class="box-skip-time fade"
      :show.sync="showBoxSkipTime"
      :title="$t('todo.choose_your_operation')"
      :close-on-click-mask="false"
      @closed="submitSkipTime"
    >
      <ul v-if="isDoing">
        <li
          class="option text-red"
          @click="abandonTime"
        >
          <span class="option-text">
            {{ $t('todo.abandon_time') }}
          </span>
        </li>
        <li
          class="option"
          @click="skipTime"
        >
          <span class="option-text">
            {{ $t('todo.complete_time_advance') }}
          </span>
        </li>
        <li
          class="option"
          @click="cancleSkipTime"
        >
          <span class="option-text">
            {{ $t('action.cancel') }}
          </span>
        </li>
      </ul>
      <ul v-else>
        <li
          class="option"
          @click="skipTime"
        >
          <span class="option-text">
            {{ $t('todo.skip_rest_time') }}
          </span>
        </li>
        <li
          class="option"
          @click="skipAllTime"
        >
          <ComCell
            :title="$t('todo.skip_all_time')"
            :lable="$t('todo.in_this_todo')"
          />
        </li>
        <li
          class="
            option"
          @click="cancleSkipTime"
        >
          <span class="option-text">
            {{ $t('action.cancel') }}
          </span>
        </li>
      </ul>
    </ComPopup>
    <ComPopup
      class="box-abandon-reason fade"
      :show.sync="showBoxAbandonReason"
      no-header
      :close-on-click-mask="false"
    >
      <ComInput
        v-model="abandonReason"
        :placeholder="$t('todo.please_input_abandon_reason')"
        autofocus
      />
      <div class="options">
        <button
          class="com-popup__footer-btn"
          @click="submitAbandonTime"
        >
          {{ $t('action.confirm') }}
        </button>
        <button
          class="com-popup__footer-btn"
          @click="cancelAbandonTime"
        >
          {{ $t('action.cancel') }}
        </button>
      </div>
      <!-- <chart /> -->
    </ComPopup>
  </div>
</template>

<script>
import ProgressCircle from './ProgressCircle'
import { mapState, mapMutations } from 'vuex'
import util from '@/util.js'
export default {
  components: {
    ProgressCircle
  },
  data () {
    return {
      timeClockWidth: 220,
      timeClockFont: 36,
      showBoxPause: false,
      showBoxChangeMusic: false,
      totalDuration: 0,
      duration: 0,
      isDoing: true,
      restDuration: 0,
      pauseDuration: 180,
      timer: null,
      pasueTimer: null,
      musics: [
        {
          name: `${this.$t('music.defalut')}|${this.$t('music.defalut_white_noise')}`,
          cover: ''
        },
        {
          name: '无声',
          cover: 'yellow'
        },
        {
          name: '无声2',
          cover: 'blue'
        },
        {
          name: '无声3',
          cover: 'red'
        },
        {
          name: '无声4',
          cover: 'black'
        }
      ],
      isMusicClose: false,
      isLoop: false,
      showBoxSetLoop: false,
      currentTodo: {
        loopTimes: {},
        restTime: {}
      },
      error: {
        loopTimes: this.$t('message.loop_times'),
        restTime: this.$t('message.long_rest_time'),
        total: this.$t('tips.do_todo_duration')
      },
      restTimeLong: {
        value: '',
        max: 50
      },
      loopTimes: {
        value: '',
        max: 100
      },
      showBoxSkipTime: false,
      isSkipTime: false,
      showBoxAbandonReason: false,
      abandonReason: ''
    }
  },
  computed: {
    ...mapState('todo', {
      todo: state => state.target
    }),
    progress () {
      if (this.isDoing) {
        return (this.duration / (this.todo.timeDuration * 60)) * 100
      }
      return (this.restDuration / this.getRestDuration()) * 100
    },
    time () {
      if (this.isDoing) {
        return util.getTimeView(this.duration)
      }
      return util.getTimeView(this.restDuration)

    },
    timesLeft () {
      const { custom: customTimes } = this.currentTodo.loopTimes
      if (customTimes > 0) {
        return this.$t('todo.remain_time', [customTimes])
      } if (customTimes === -1) {
        return this.$t('todo.infinite_loop')
      }
      return ''
    },
    timePause () {
      return util.getTimeView(this.pauseDuration)
    },
    status () {
      return this.isDoing && this.$t('todo.is_doing') || this.$t('todo.is_resting')
    }
  },
  watch: {
    isDoing (val) {
      clearTimeout(this.timer)
      if (val) {
        this.currentTodo.loopTimes.custom--
        this.initDuration()
        this.setDuration()
      } else {
        this.initRestDuration()
        this.setRestDuration()
      }
    }
  },
  mounted () {
    this.currentTodo = _.cloneDeep(this.todo)
    this.initDuration()
    this.setDuration()
    this.initRestDuration()
    this.setTimeClockWidth()
    window.addEventListener('resize', this.setTimeClockWidth)
  },
  destroyed () {
    clearTimeout(this.timer)
    clearTimeout(this.pasueTimer)
    window.removeEventListener('resize', this.setTimeClockWidth)
  },
  methods: {
    ...mapMutations('todo', ['modifyTarget']),
    setTimeClockWidth () {
      this.timeClockWidth = (document.documentElement.clientWidth / 414) * 250
      this.timeClockWidth = this.timeClockWidth > 300 ? 300 : this.timeClockWidth
      this.timeClockFont = this.timeClockWidth / 250 * 36
    },
    initRestDuration () {
      this.restDuration = this.getRestDuration()
    },
    getRestDuration () {
      const {
        default: defaultTime,
        custom: customTime
      } = this.currentTodo.restTime
      return customTime >= 0 ? customTime * 60 : defaultTime * 60
    },
    setRestDuration () {
      if (this.restDuration <= 0) {
        this.isDoing = true
        return
      }
      this.restDuration--
      this.timer = setTimeout(() => {
        this.setRestDuration()
      }, 1000)
    },
    initDuration () {
      switch (this.todo.timeWay) {
        case 'up' :
          this.duration = 0
          break
        case 'down':
          this.duration = this.currentTodo.timeDuration * 60
          break
        default:
          break
      }
    },
    setDuration () {
      this.timer = setTimeout(() => {
        this.totalDuration++
        switch (this.todo.timeWay) {
          case 'up':
            this.duration++
            if (this.duration >= this.currentTodo.timeDuration * 60) {
              this.isDoing = false
              return
            }
            break
          case 'down':
            this.duration--
            if (this.duration <= 0) {
              this.isDoing = false
              return
            }
            break
          default:
            break
        }
        this.setDuration()
      }, 1000)
    },
    setPauseDuration () {
      if (this.pauseDuration <= 0) {
        return
      }
      this.pauseDuration--
      this.pasueTimer = setTimeout(() => {
        this.setPauseDuration()
      }, 1000)
    },
    pause () {
      this.showBoxPause = true
      clearTimeout(this.timer)
      this.setPauseDuration()
    },
    continueTime () {
      this.showBoxPause = false
      this.setDuration()
      clearTimeout(this.pasueTimer)
    },
    closeMusic () {
      this.isMusicClose = !this.isMusicClose
    },
    changeMusic () {},

    setLoopTimes () {
      this.isLoop = !this.isLoop
      if (this.isLoop === true) {
        this.showBoxSetLoop = true
      } else {
        this.currentTodo.loopTimes.custom = ''
        this.currentTodo.restTime.long = ''
        this.showBoxSetLoop = false
      }
    },
    infiniteLoop () {
      this.currentTodo.loopTimes.custom = -1
      this.showBoxSetLoop = false
    },
    checkValue (key, { value, max }) {
      if (!util.checkLess({
        value,
        max
      })) {
        this.$message({
          title: this.$t('word.tip'),
          content: this.error[key]
        })
        return false
      }
      return true
    },
    submitSetLoopTimes () {
      const { loopTimes, restTime } = this.currentTodo

      if (!this.checkValue('loopTimes', this.loopTimes)) {
        return
      }
      if (!this.checkValue('restTime', this.restTimeLong)) {
        return
      }

      loopTimes.custom = this.loopTimes.value
      restTime.long = this.restTimeLong.value
      this.showBoxSetLoop = false
    },
    cancleSetLoopTimes () {
      this.loopTimes.value = ''
      this.restTimeLong.value = ''
      this.showBoxSetLoop = false
    },
    stop () {
      if (this.totalDuration < 5) {
        this.$tips(this.error.total)
        history.back()
        return
      }
      this.showBoxSkipTime = true
    },
    skipTime () {
      this.showBoxSkipTime = false
      this.isSkipTime = true
    },
    cancleSkipTime () {
      this.showBoxSkipTime = false
      this.isSkipTime = false
    },
    submitSkipTime () {
      if (this.isSkipTime) {
        this.isDoing = !this.isDoing
      }
    },
    abandonTime () {
      this.showBoxAbandonReason = true
      this.showBoxSkipTime = false
    },
    submitAbandonTime () {
      const obj = {
        time: new Date(),
        reason: this.abandonReason
      }
      this.currentTodo.abandons.push(obj)
      this.modifyTarget({
        abandons: this.currentTodo.abandons
      })
      this.showBoxAbandonReason = false
      this.skipAllTime()
    },
    cancelAbandonTime () {
      this.showBoxAbandonReason = false
      this.abandonReason = ''
    },
    skipAllTime () {
      this.showBoxSkipTime = false
      history.back()
    }
  }
}
</script>

<style lang="less">
.do-todo {
  .fixed-full-screen();
  text-align: left;
  padding: 50px 1.4rem 70px;
  background: rgb(51, 51, 51);
  color: white;
  .flex(@justify-content:space-between; @flex-direction:column;@align-items:center;);

  .verse {
    max-width: 360px;
  }

  .quo-marks {
    font-size: 44px;
    margin-left: -55px;
  }

  .sentence {
    margin-top: -15px;
  }

  .todo-info {
    text-align: center;
    margin-top: 50px;
    font-size: 14px;
    letter-spacing: 2px;

    .name {
      margin-top: 30px;
    }

    .status {
      margin-top: 10px;
      font-weight: 300;
      opacity: 0.9;
      .scale-font(0.8;center;center);
    }
  }

  .options {
    padding: 0 20px;
    width: 100%;
    max-width: 360px;
    .flex(@justify-content:space-between);

    .btns-group {
      .flex(@flex-direction:column; @align-items: center);
    }

    .icon-down {
      margin-top: 5px;
    }

    .btn_close {
      opacity: 0.5;
    }
  }

  .progress-bar-circle {
    display: inline-block;

    .progress-bar__circle-arc {
      fill: transparent;
      stroke: #474747;
    }

    .progress-bar__arc {
      stroke: white;
    }
  }

  .progress-bar__text {
    font-size: 36px;
  }
}

.box-pause {
  .com-popup {
    text-align: center;
  }

  .com-popup__content {
    padding-top: 20px;
  }

  .com-popup .com-popup__footer-btn {
    font-size: 12px;
    width: 30%;
    color: white;
    background: #1c1c47;
    padding: 15px 6px;
    border-radius: 4px;
  }

  .time {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 12px;
  }

  .description {
    font-size: 12px;
    line-height: 1.4;
  }
}

.box-change-music {
  font-size: 12px;
  color: white;

  .com-popup {
    width: 4rem;
  }

  .com-popup__content {
    padding: 0;
  }

  .music {
    padding: 15px;
    text-align: center;
  }
}

.box-set-loop {
  .com-popup__footer {
    margin-top: 15px;
  }
}

.box-skip-time {
  .com-popup {
    width: 6rem;
  }

  .com-popup__header {
    padding: 15px 20px;
  }

  .com-popup__header-text {
    font-size: 12px;
  }

  .option {
    padding: 20px 0 13px;
    letter-spacing: 1px;
  }

  .option-text {
    display: block;
    font-size: 12px;
  }

  .com-popup__content {
    padding: 0 20px;
  }

  .com-cell {
    padding: 0;
  }
}

.box-abandon-reason {
  .com-popup {
    width: 6rem;
  }

  .com-popup__content {
    padding: 20px 15px 12px;
  }

  .com-input {
    letter-spacing: 1px;
  }

  .com-input__box {
    padding: 10px 0;
  }

  .com-popup__footer-btn {
    width: 30%;
    background: @gray-l-p;
    color: black;
    font-size: 12px;
    margin-left: 8px;
    padding: 11px 0;
  }

  .options .com-popup__footer-btn {
    color: rgb(43, 42, 42);
  }

  .options {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
