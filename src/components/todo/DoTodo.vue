<template>
  <div class="do-todo-wrapper">
    <div class="do-todo">
      <div class="do-todo-poster">
        <img
          ref="poster"
          alt=""
        >
      </div>
      <div class="poster-shadow" />
      <div style="position:relative">
        <div class="tool">
          <ComIcon
            name=""
            class="tool-btn"
          />
          <!-- <ComIcon
            name="share-alt"
            class="tool-btn"
          /> -->
          <ComIcon
            name="download"
            class="tool-btn"
            @click.native="showBoxFocusClock=true"
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
              v-if="Boolean(todo.timeDuration) || !isDoing"
              :width="timeClockWidth"
              :progress="progress"
              type="arc"
              :class="{ 'text-completed': textCompleted }"
              :text="textCompleted || time"
              :font-size="timeClockFont"
              @click.native="editExperience"
            />
            <div
              v-else
              class="time-text"
              :class="{ 'ani-text-completed': textCompleted }"
              :style="{width:timeClockWidth+'px',height:timeClockWidth+'px',fontSize:timeClockFont+'px'}"
            >
              {{ textCompleted || time }}
            </div>
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
            <span class="btns-group btn-option">
              <ComIcon
                name="music"
                :class="{ btn_close: isMusicClose }"
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
              :class="{ btn_close: !isLoop }"
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
        v-html="$t('message.pause_todo',[this.todoSettings.stopUpperLimit])"
      />
      <template v-slot:footer>
        <button
          class="com-popup__footer-btn"
          @click="continueTime"
        >
          {{ $t("todo.continue_time") }}
        </button>
      </template>
    </ComPopup>

    <RadioListMusic
      v-model="music"
      :show.sync="showBoxChangeMusic"
      :data="todoMusic"
      :show-custom="false"
      @change="changeMusic"
    />

    <ComPopup
      class="box-set-loop"
      no-header
      :show.sync="showBoxSetLoop"
      @cancel="cancleSetLoopTimes"
    >
      <ComInput
        v-model.number="loopTimes.value"
        type="positiveInteger"
        :placeholder="$t('todo.input_loop_times')"
        autofocus
        :min="0"
      />
      <ComInput
        v-model.number="restTimeLong.value"
        type="positiveInteger"
        :placeholder="$t('todo.loop_end_rest_time')"
        autofocus
        :min="0"
      />

      <template v-slot:footer>
        <button
          class="com-popup__footer-btn com-popup__footer-btn_w-auto"
          @click="infiniteLoop"
        >
          {{ $t("todo.infinite_loop") }}
        </button>
        <button
          class="com-popup__footer-btn"
          @click="submitSetLoopTimes"
        >
          {{ $t("action.confirm") }}
        </button>
        <button
          class="com-popup__footer-btn"
          @click="doCancleSetLoopTimes"
        >
          {{ $t("action.cancel") }}
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
            {{ $t("todo.abandon_time") }}
          </span>
        </li>
        <li
          class="option"
          @click="completeAdvance"
        >
          <span class="option-text">
            {{ $t("todo.complete_time_advance") }}
          </span>
        </li>
        <li
          class="option"
          @click="cancleSkipTime"
        >
          <span class="option-text">
            {{ $t("action.cancel") }}
          </span>
        </li>
      </ul>
      <ul v-else>
        <li
          class="option"
          @click="skipTime"
        >
          <span class="option-text">
            {{ $t("todo.skip_rest_time") }}
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
            {{ $t("action.cancel") }}
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
            {{ $t("common.confirm_abandon") }}
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

    <ClockFocus :show.sync="showBoxFocusClock" />

    <audio
      ref="music"
      autoplay
      loop
    />
    <audio
      ref="tone"
      :src="todoSettings.tone.src"
    />
  </div>
</template>

<script>
import ProgressCircle from './ProgressCircle'
import StopChart from '@/components/statistics/StopChart'
import BoxEditText from './BoxEditText'
import RadioListMusic from '@/components/setting/RadioListMusic'
import ClockFocus from '@/components/ClockFocus'
import { mapState, mapGetters, mapMutations } from 'vuex'
import util from '@/js/util.js'
import todoUtil from '@/js/todo.js'
import setting from '@/js/setting'
import LoadImg from '@/js/LoadImg'

export default {
  components: {
    ProgressCircle,
    StopChart,
    BoxEditText,
    RadioListMusic,
    ClockFocus
  },
  data () {
    return {
      timeClockWidth: 220,
      timeClockFont: 36,
      showBoxPause: false,
      totalLoopTimes: 1,
      totalDuration: 0,
      // 计时时长，用于计算进度条
      timeDuration: 0,
      duration: 0,
      toState: '',
      isDoing: true,
      // 当前休息时长
      restDuration: 0,
      // 单次总共休息时长
      oneRestDuration: 0,
      pauseDuration: 180,
      timer: null,
      timerPause: null,
      showBoxChangeMusic: false,
      music: {},
      isMusicClose: true,
      isLoop: false,
      showBoxSetLoop: false,
      currentTodo: {
        loopTimes: {},
        restTime: {}
      },
      // 最后一次循环结束后的长休息时长
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
      randomLocalBackgroundSeed: null,
      randomCustomMottoSeed: null,
      showPosterShadow: false,
      showBoxFocusClock: false,
      tone: {
        src: ''
      }
    }
  },
  computed: {
    ...mapGetters('todo', {
      getTodoById: 'getTodoById'
    }),
    ...mapState('settings', {
      posters: 'todoPosters',
      appearance: 'appearance',
      todoSettings: state => state.todo,
      beeps: state => state.beeps,
      todoMusic: state => state.todoMusic,
      motto: 'motto'
    }),
    todo () {
      return this.getTodoById(this.id)
    },
    progress () {
      if (this.isDoing) {
        if (!this.todo.timeDuration) {
          return 0
        }
        return (this.timeDuration / (this.todo.timeDuration * 60)) * 100
      }
      return (this.timeDuration / this.oneRestDuration) * 100
    },
    time () {
      return util.getTimeView(this.timeDuration)
    },
    timesLeft () {
      if (this.totalLoopTimes > 0 && this.isLoop) {
        return this.$t('todo.remain_time', [this.totalLoopTimes])
      }
      if (this.totalLoopTimes < 0 && this.isLoop) {
        return this.$t('todo.infinite_loop')
      }
      return ''
    },
    timePause () {
      return util.getTimeView(this.pauseDuration)
    },
    status () {
      if (this.totalLoopTimes === 0) {
        return this.$t('tips.timer_end')
      }
      return (this.isDoing && this.$t('todo.is_doing')) || this.$t('todo.is_resting')
    },
    isLastLoop () {
      return this.totalLoopTimes === 1
    }
  },
  watch: {
    isDoing (val) {
      if (this.isLastLoop && val) {
        this.skipAllTime()
        return
      }
      clearTimeout(this.timer)
      if (val) {
        this.totalLoopTimes--
        this.startDoingTime()
      } else {
        this.playTone()
        this.startRestTime()
      }
    }
  },
  mounted () {
    this.currentTodo = _.cloneDeep(this.todo)
    setTimeout(() => {
      this.startDoingTime()
    }, 400)
    this.setTimeClockWidth()
    this.randomLocalBackgroundSeed = setting.creatNonRepeatRandom(
      0,
      this.posters.length - 1
    )
    this.randomCustomMottoSeed = setting.creatNonRepeatRandom(
      0,
      this.motto.length - 1
    )
    this.getMotto()
    this.totalLoopTimes = this.getLoopTimes()
    if (this.currentTodo.loopTimes && this.currentTodo.loopTimes.custom > 0) {
      this.isLoop = true
    }
    this.pauseDuration = this.todoSettings.stopUpperLimit * 60
    setTimeout(() => {
      this.setPoster()
    }, 1000)
    window.addEventListener('resize', this.setTimeClockWidth)
  },
  destroyed () {
    clearTimeout(this.timer)
    clearTimeout(this.timerPause)
    window.removeEventListener('resize', this.setTimeClockWidth)
  },
  methods: {
    ...mapMutations('todo', ['addFocus']),
    getMotto () {
      if (this.todoSettings.randomMottoWay === 'system') {
        this.sentence = this.$t(setting.getSentence())
      } else if (this.todoSettings.randomMottoWay === 'custom') {
        this.sentence = this.motto[this.randomCustomMottoSeed()]
      } else {
        const systemMotto = this.$t(setting.getSentence())
        const Custom = this.motto[this.randomCustomMottoSeed()]
        const random = Math.floor(Math.random() * 2)

        this.sentence = random === 0 ? systemMotto : Custom
      }
    },
    getRandomBackground () {
      const posterRandomMode = this.appearance.posterRandomMode
      let img = ''

      if (posterRandomMode === 'online') {
        img = setting.getClockBackground()
      } else if (posterRandomMode === 'local') {
        img = this.posters[this.randomLocalBackgroundSeed()]
      } else {
        const onlinePoster = setting.getTodoCardBackground()
        const localPoster = this.posters[this.randomLocalBackgroundSeed()]
        const random = Math.floor(Math.random() * 2)

        img = random === 0 ? onlinePoster : localPoster
      }
      return img
    },
    setPoster () {
      const background = this.getRandomBackground()

      new LoadImg(this.$refs.poster).setSrc(background).then(() => {
        this.music = this.todoSettings.backgroundMusic
        this.$refs.music.src = this.music.src
        this.playMusic()
      })
    },
    initStopChart () {
      this.stopData = todoUtil.getStopData(
        [this.todo],
        ...util.getPeriod('month')
      )
    },
    setTimeClockWidth () {
      this.timeClockWidth = (document.documentElement.clientWidth / 414) * 250
      this.timeClockWidth =
        this.timeClockWidth > 300 ? 300 : this.timeClockWidth
      this.timeClockFont = (this.timeClockWidth / 250) * 36
    },
    timeFast (val, duration = 0) {
      return new Promise((resolve) => {
        clearTimeout(this.timer)
        const total = 300

        if (val === 'end') {
          const d = Math.ceil(4 * this.timeDuration / total)
          const doTime = (() => {
            this.timer = setTimeout(() => {
              if (this.timeDuration <= duration) {
                this.timeDuration = duration
                clearTimeout(this.timer)
                resolve()
                return
              }
              this.timeDuration -= d
              doTime()
            }, 4)
          })

          doTime()
        } else {
          const d = Math.ceil(4 * duration / total)
          const doTime = (() => {
            this.timer = setTimeout(() => {
              if (this.timeDuration >= duration) {
                this.timeDuration = duration
                clearTimeout(this.timer)
                resolve()
                return
              }

              this.timeDuration += d
              doTime()
            }, 4)
          })

          doTime()
        }
      })
    },
    getLoopTimes () {
      if (!this.currentTodo.loopTimes) {
        return 1
      }
      const {
        default: defaultTimes,
        custom: customTimes
      } = this.currentTodo.loopTimes

      return customTimes || defaultTimes
    },
    getRestDuration () {
      let {
        default: defaultTime,
        custom: customTime
      } = this.currentTodo.restTime

      if (this.todoSettings.restDuration) {
        defaultTime = this.todoSettings.restDuration
      }


      const duration = typeof customTime === 'number' && customTime >= 0
        ? customTime * 60
        : defaultTime * 60

      if (this.isLastLoop) {
        return this.longRestTime * 60 || duration
      }
      return duration
    },
    startRestTime () {
      this.timeDuration = 0
      this.initRestDuration()
      this.timeFast('start', this.oneRestDuration).then(() => {
        this.setRestDuration()
      })
    },
    initRestDuration () {
      this.oneRestDuration = this.getRestDuration()
    },
    setRestDuration () {
      this.timer = setTimeout(() => {
        if (this.timeDuration <= 0) {
          this.isDoing = true
          return
        }
        this.totalDuration++
        this.timeDuration--
        this.setRestDuration()
      }, 1000)
    },
    startDoingTime () {
      this.timeDuration = 0
      this.initDuration()
      this.timeFast('start', this.duration).then(() => {
        this.setDuration()
      })
    },
    initDuration () {
      switch (this.todo.timeWay) {
        case 'up':
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
            this.timeDuration++
            if (this.timeDuration >= this.currentTodo.timeDuration * 60) {
              this.isDoing = false
              return
            }
            break
          case 'down':
            this.timeDuration--
            if (this.timeDuration <= 0) {
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
        this.showBoxPause = false
        this.$tips(this.$t('tips.pause_timer_end'))
        return
      }
      this.totalDuration++
      this.pauseDuration--
      this.timerPause = setTimeout(() => {
        this.setPauseDuration()
      }, 1000)
    },
    pause () {
      if (this.pauseDuration <= 0) {
        this.$message({
          title: this.$t('word.tip'),
          content: this.$t('message.not_pause_todo')
        })
      }
      this.showBoxPause = true
      clearTimeout(this.timer)
      this.setPauseDuration()
    },
    continueTime () {
      this.showBoxPause = false
      this.setDuration()
      clearTimeout(this.timerPause)
    },
    playMusic () {
      if (this.isMusicClose) {
        this.$refs.music.pause()
      } else {
        this.$refs.music.play()
      }
    },
    changeMusic (val) {
      this.$refs.music.src = val.src
      this.playMusic()
    },
    playTone () {
      if (this.todoSettings.beep) {
        this.$refs.tone.play()
        setTimeout(() => {
          this.$refs.tone.pause()
        }, 2000)
      }
    },
    closeMusic () {
      this.isMusicClose = !this.isMusicClose
      this.playMusic()
    },
    setLoopTimes () {
      if (this.currentTodo.timeWay === 'up') {
        this.$tips(this.$t('tips.up_time_not_enable_loop'), {
          style: {
            bottom: '100px'
          }
        })
        return
      }
      if (this.currentTodo.timeWay === 'none') {
        this.$tips(this.$t('tips.none_time_not_enable_loop'), {
          style: {
            bottom: '100px'
          }
        })
        return
      }
      if (this.isLoop === false) {
        this.showBoxSetLoop = true
      } else {
        this.$tips(this.$t('tips.closed_loop'), {
          style: {
            bottom: '100px'
          }
        })
        this.isLoop = false
        this.totalLoopTimes = 1
        this.longRestTime = ''
        this.showBoxSetLoop = false
      }
    },
    infiniteLoop () {
      this.totalLoopTimes = -1
      this.isLoop = true
      this.$tips(this.$t('tips.enabled_loop'), {
        style: {
          bottom: '100px'
        }
      })
      this.showBoxSetLoop = false
    },
    checkValue (key, { value, max }) {
      if (
        !util.checkLess({
          value,
          max
        })
      ) {
        this.$message({
          title: this.$t('word.tip'),
          content: this.error[key]
        })
        return false
      }
      return true
    },
    submitSetLoopTimes () {
      if (!this.checkValue('loopTimes', this.loopTimes)) {
        return
      }
      if (!this.checkValue('restTime', this.restTimeLong)) {
        return
      }

      if (this.loopTimes.value !== '') {
        this.isLoop = true
        this.$tips(this.$t('tips.enabled_loop'), {
          style: {
            bottom: '100px'
          }
        })
        this.totalLoopTimes = this.loopTimes.value
      }
      if (this.restTimeLong.value !== '') {
        this.longRestTime = this.restTimeLong.value
      }
      this.showBoxSetLoop = false
    },
    cancleSetLoopTimes (val) {
      if (!val) {
        this.doCancleSetLoopTimes()
      }
    },
    doCancleSetLoopTimes () {
      this.isLoop = false
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
        this.timeFast('end').then(() => {
          this.isDoing = !this.isDoing
        })
        this.isSkipTime = false
      }
    },
    completeAdvance () {
      this.showBoxSkipTime = false
      this.isSkipTime = true
    },
    abandonTime () {
      this.showBoxAbandonReason = true
      this.showBoxSkipTime = false
    },
    // 放弃计时
    submitAbandonTime () {
      this.showBoxAbandonReason = false
      setTimeout(() => {
        history.back()
      }, 1000)
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
      clearTimeout(this.timer)
      this.timeDuration = 999999
      this.totalLoopTimes = 0
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
          this.toLastPage()
        }, 2000)
      } else {
        focus.reason = this.abandonReason
        this.addFocus(focus)
        this.toLastPage()
      }
      this.focusObj = focus
    },
    toLastPage () {
      if (this.todoSettings.autoToMainPage) {
        history.back()
      }
    }
  }
}
</script>

<style lang="less">
.do-todo {
  .fixed-full-screen();
  text-align: center;
  // padding: 20px 0.6rem 50px;
  background-size: 100% 100%;
  color: white;
  transition: all 0.3s linear;
  background-image: linear-gradient(
    to bottom,
    rgb(1, 104, 173),
    rgb(1, 58, 97)
  );

  .do-todo-poster {
    .fixed-full-screen();

    img {
      width: 100%;
      height: 100%;
    }
  }

  .poster-shadow {
    .fixed-full-screen();
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
  }

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

    .time-text {
      text-align: center;
      &::after{
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
      }
    }

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

    .progress-bar-track {
      animation: flash 0.6s linear 0s infinite alternate;
      transform-origin: 50% 50%;
    }
  }

  .ani-text-completed {
    animation: flash 0.6s ease 0s infinite alternate;
  }

  .options {
    padding: 0 40px;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    bottom: 30px;
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
