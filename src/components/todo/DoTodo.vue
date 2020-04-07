<template>
  <div class="do-todo-wrapper">
    <div
      class="do-todo"
      :style="{'background-image':`url(${background})`}"
    >
      <div class="tool">
        <ComIcon
          name=""
          class="tool-btn"
        />
        <ComIcon
          name="share-alt"
          class="tool-btn"
        />
        <ComIcon
          name="download"
          class="tool-btn"
        />
      </div>
      <div class="do-todo-inline">
        <div class="verse">
          <span class="quo-marks">
            “
          </span>
          <div class="sentence">
            {{ sentence }}
          </div>
        </div>
        <div class="todo-info">
          <ProgressCircle
            :width="timeClockWidth"
            :progress="progress"
            type="arc"
            :class="{'text-completed':textCompleted}"
            :text="textCompleted||time"
            :font-size="timeClockFont"
            @click.native="editExperience"
          />
          <div class="name">
            {{ todo.name }}
          </div>
          <div class="status">
            {{ status }} {{ timesLeft }}
          </div>
        </div>
      </div>
      <div class="options">
        <div class="options-inline">
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
        :min="0"
      />
      <ComInput
        v-model="restTimeLong.value"
        type="number"
        :placeholder="$t('todo.loop_end_rest_time')"
        autofocus
        :min="0"
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
          @click="completeAdvance"
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
      :close-on-click-mask="false"
      :title="$t('common.fill_reason')"
      @opened="initStopChart"
    >
      <template #header-icon>
        <div>
          <span
            class="confirm"
            @click="submitAbandonTime"
          >
            {{ $t('common.confirm_abandon') }}
          </span>
          <ComIcon
            name="times"
            class="cancel"
            @click="cancelAbandonTime"
          />
        </div>
      </template>
      <ComInput
        v-model="abandonReason"
        :placeholder="$t('todo.please_input_abandon_reason')"
        autofocus
      />
      <StopChart
        v-if="showBoxAbandonReason"
        :data="stopData"
        :top-btn="false"
      />
    </ComPopup>
    <BoxEditText
      v-model="experience"
      :show.sync="showBoxText"
      :title="$t('word.experience')"
      @submit="submitEditExperience"
      @closed="toLastPage"
    />
  </div>
</template>

<script>
import ProgressCircle from './ProgressCircle'
import StopChart from '@/components/statistics/StopChart'
import BoxEditText from './BoxEditText'
import { mapGetters, mapMutations } from 'vuex'
import util from '@/js/util.js'
import todoUtil from '@/js/todo.js'
import setting from '@/js/setting'

export default {
  components: {
    ProgressCircle,
    StopChart,
    BoxEditText
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
      oneRestDuration: 0,
      pauseDuration: 180,
      timer: null,
      timerPause: null,
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
      longRestTime: '',
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
      abandonReason: undefined,
      id: parseInt(this.$route.params.id),
      start: 0,
      end: 0,
      stopData: [],
      textCompleted: '',
      showBoxText: false,
      experience: '',
      timerGoBack: null,
      focusObj: {},
      sentence: '',
      background: '/clock/back1.jpg'
    }
  },
  computed: {
    ...mapGetters('todo', {
      getTodoById: 'getTodoById'
    }),
    todo () {
      return this.getTodoById(this.id)
    },
    progress () {
      if (this.isDoing) {
        return (this.duration / (this.todo.timeDuration * 60)) * 100
      }
      return (this.restDuration / this.oneRestDuration) * 100
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
      } if (customTimes < 0) {
        return this.$t('todo.infinite_loop')
      }
      return ''
    },
    timePause () {
      return util.getTimeView(this.pauseDuration)
    },
    status () {
      return this.isDoing && this.$t('todo.is_doing') || this.$t('todo.is_resting')
    },
    isLastLoop () {
      const { default: defaultTimes, custom: customTimes } = this.currentTodo.loopTimes

      return customTimes === 0 || customTimes === 1 || customTimes === '' && defaultTimes === 1
    }
  },
  watch: {
    isDoing (val) {
      if (this.isLastLoop) {
        this.skipAllTime()
      }
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
    this.sentence = this.$t(setting.getSentence())
    this.background = setting.getClockBackground()
    this.currentTodo = _.cloneDeep(this.todo)
    this.initDuration()
    this.setDuration()
    this.initRestDuration()
    this.setTimeClockWidth()
    window.addEventListener('resize', this.setTimeClockWidth)
  },
  destroyed () {
    clearTimeout(this.timer)
    clearTimeout(this.timerPause)
    window.removeEventListener('resize', this.setTimeClockWidth)
  },
  methods: {
    ...mapMutations('todo', ['addFocus']),
    initStopChart () {
      this.stopData = todoUtil.getStopData([this.todo], ...util.getPeriod('month'))
    },
    setTimeClockWidth () {
      this.timeClockWidth = (document.documentElement.clientWidth / 414) * 250
      this.timeClockWidth = this.timeClockWidth > 300 ? 300 : this.timeClockWidth
      this.timeClockFont = this.timeClockWidth / 250 * 36
    },
    initRestDuration () {
      this.restDuration = this.oneRestDuration = this.getRestDuration()
    },
    getRestDuration () {
      const {
        default: defaultTime,
        custom: customTime
      } = this.currentTodo.restTime

      if (this.isLastLoop) {
        return this.longRestTime * 60
      }
      return typeof customTime === 'number' && customTime >= 0 ? customTime * 60 : defaultTime * 60
    },
    setRestDuration () {
      if (this.restDuration <= 0) {
        this.isDoing = true
        return
      }
      this.totalDuration++
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
        this.start = this.start || new Date()
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
      this.totalDuration++
      this.pauseDuration--
      this.timerPause = setTimeout(() => {
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
      clearTimeout(this.timerPause)
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
        this.longRestTime = ''
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
      const { loopTimes } = this.currentTodo

      if (!this.checkValue('loopTimes', this.loopTimes)) {
        return
      }
      if (!this.checkValue('restTime', this.restTimeLong)) {
        return
      }

      loopTimes.custom = this.loopTimes.value
      this.longRestTime = this.restTimeLong.value
      this.showBoxSetLoop = false
    },
    cancleSetLoopTimes () {
      this.loopTimes.value = ''
      this.restTimeLong.value = ''
      this.showBoxSetLoop = false
    },
    stop () {
      if (this.totalDuration < 0) {
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
    completeAdvance () {
      this.showBoxSkipTime = false
      this.skipAllTime()
    },
    abandonTime () {
      this.showBoxAbandonReason = true
      this.showBoxSkipTime = false
    },
    // 放弃计时
    submitAbandonTime () {
      this.showBoxAbandonReason = false
      this.skipAllTime()
    },
    cancelAbandonTime () {
      this.showBoxAbandonReason = false
      this.abandonReason = ''
    },
    editExperience () {
      if (this.textCompleted) {
        clearTimeout(this.timerGoBack)
        this.showBoxText = true
        this.experience = ''
      }
    },
    submitEditExperience () {
      this.focusObj.experience = this.experience
      this.addFocus(this.focusObj)
    },
    // 跳过所有计时
    skipAllTime () {
      this.showBoxSkipTime = false
      this.end = new Date(this.start)
      this.end.setSeconds(this.totalDuration)
      let status = 'completed'

      if (this.abandonReason !== undefined) {
        status = 'stopped'
      }
      const focus = {
        tid: this.id,
        start: this.start,
        end: this.end,
        status: status,
        duration: Math.floor(this.totalDuration / 60)
      }

      if (status === 'completed') {
        focus.experience = this.experience
        this.textCompleted = this.$t('todo.click_fill_in_experience')
        this.timeClockFont = 26
        this.timerGoBack = setTimeout(() => {
          this.addFocus(focus)
          history.back()
        }, 2000)
      } else {
        focus.reason = this.abandonReason
        this.addFocus(focus)
        history.back()
      }
      this.focusObj = focus
    },
    toLastPage () {
      history.back()
    }
  }
}
</script>

<style lang="less">
.do-todo {
  .fixed-full-screen();
  text-align: center;
  // padding: 20px 0.6rem 50px;
  background: rgb(51, 51, 51);
  background-size: 100% 100%;
  color: white;

  .tool {
    text-align: right;
    font-size: 20px;
    max-width: 420px;
    display: inline-block;
    width: 100%;
    padding: 20px 15px 0px;
    box-sizing: border-box;
  }

  .tool-btn {
    margin-left: 20px;
    padding: 5px;
  }

  .do-todo-inline {
    padding: 0 30px;
    box-sizing: border-box;
  }

  .verse {
    padding: 0 0px 0 30px;
    width: 100%;
    max-width: 400px;
    display: inline-block;
    text-align: left;
    box-sizing: border-box;
    font-size: 14px;
  }

  .quo-marks {
    font-size: 44px;
    margin-left: -35px;
  }

  .sentence {
    margin-top: -15px;
  }

  .todo-info {
    text-align: center;
    font-size: 14px;
    letter-spacing: 2px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -40%);

    .name {
      margin-top: 30px;
      font-size: 18px;
    }

    .status {
      margin-top: 10px;
      font-weight: 300;
      opacity: 0.9;
      font-size: 10px;
    }
  }

  .text-completed {
    .progress-bar__text {
      animation: flash 0.6s ease 0s infinite alternate;
    }
  }

  .options {
    padding: 0 40px;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    bottom: 50px;
    text-align: center;

    .btns-group {
      .com-icon {
        display: block;
      }
    }

    .icon-down {
      margin-top: 5px;
    }

    .btn_close {
      opacity: 0.5;
    }
  }

  .options-inline {
    max-width: 400px;
    display: inline-block;
    width: 100%;
  }

  .btn-option {
    display: inline-block;
    text-align: center;
    width: 25%;
    vertical-align: top;
    font-size: 18px;
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
  }

  .com-popup__footer-btn {
    width: 30%;
    background: @gray-l-p;
    color: black;
    font-size: 12px;
    margin-left: 8px;
    padding: 11px 0;
  }

  .confirm {
    font-size: 12px;
    margin-right: 20px;
  }

  .cancel {
    font-size: 18px;
  }
}
</style>
