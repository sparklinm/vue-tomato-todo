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
          :width="220"
          :progress="progress"
          type="arc"
          :text="time"
        />
        <div class="name">
          {{ todo.name }}
        </div>
        <div class="status">
          {{ status }} {{ timesLeft }}
        </div>
      </div>
      <div class="options">
        <span class="btns-group">
          <ComIcon
            name="music"
            class="btn-option"
            :class="{'btn_close':isMusicClose}"
            @click="closeMusic"
          />
          <ComIcon
            name="angle-down"
            class="btn-option icon-down"
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
          :class="{'btn_close':isNoLoop}"
          @click="setLoopTimes"
        />
        <ComIcon
          name="stop"
          class="btn-option"
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
        v-html="$t('tips.pause_todo')"
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
        v-model="currentToDo.loopTimes.custom"
        type="number"
        :placeholder="$t('todo.input_loop_times')"
        autofocus
      />
      <ComInput
        v-model="currentToDo.restTime.long"
        type="number"
        :placeholder="$t('todo.loop_end_rest_time')"
        autofocus
      />

      <template v-slot:footer>
        <button
          class="com-popup__footer-btn com-popup__footer-btn_w-auto"
          @click="submitSetLoopTimes"
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
          @click="showBoxSetLoop=false"
        >
          {{ $t('action.cancel') }}
        </button>
      </template>
    </ComPopup>

    <ComPopup
      class="box-skip-time fade"
      :show.sync="showBoxSkipTime"
      :title="$t('todo.choose_your_operation')"
    >
      <ul v-if="isDoing">
        <li class="option">
          <span>
            {{ $t('todo.abandon_time') }}
          </span>
        </li>
        <li class="option">
          <span>
            {{ $t('todo.complete_time_advance') }}
          </span>
        </li>
        <li class="option">
          <span>
            {{ $t('action.cancel') }}
          </span>
        </li>
      </ul>
      <ul v-else>
        <li class="option">
          <span>
            {{ $t('todo.complete_time_advance') }}
          </span>
        </li>
      </ul>
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
      status: this.$t('todo.is_doing'),
      showBoxPause: false,
      showBoxChangeMusic: false,
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
      isNoLoop: false,
      showBoxSetLoop: false,
      currentToDo: {
        loopTimes: {},
        restTime: {}
      },
      showBoxSkipTime: true
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
      const { custom: customTimes } = this.todo.loopTimes
      if (customTimes > 0) {
        return this.$t('todo.remain_time', [customTimes])
      }
      return ''
    },
    timePause () {
      return util.getTimeView(this.pauseDuration)
    }
  },
  mounted () {
    this.initDuration()
    this.setDuration()
    this.initRestDuration()
    this.currentToDo = _.cloneDeep(this.todo)
  },
  methods: {
    ...mapMutations('todo', ['modifyTarget']),
    initRestDuration () {
      this.restDuration = this.getRestDuration()
    },
    getRestDuration () {
      const {
        default: defaultTime,
        custom: customTime
      } = this.todo.restTime
      return customTime >= 0 ? customTime * 60 : defaultTime * 60
    },
    setRestDuration () {
      if (this.restDuration <= 0) {
        this.isDoing = true
        this.status = this.$t('todo.is_doing')
        this.initDuration()
        this.setDuration()
        return
      }
      this.restDuration--
      setTimeout(() => {
        this.setRestDuration()
      }, 1000)
    },
    initDuration () {
      switch (this.todo.timeWay) {
        case 'up' :
          this.duration = 0
          break
        case 'down':
          this.duration = this.todo.timeDuration * 60
          break
        default:
          break
      }
    },
    setDuration () {
      switch (this.todo.timeWay) {
        case 'up':
          if (this.duration >= this.todo.timeDuration * 60) {
            this.isDoing = false
            this.status = this.$t('todo.is_resting')
            this.initRestDuration()
            this.setRestDuration()
            return
          }
          this.duration++
          break
        case 'down':
          if (this.duration <= 0) {
            this.isDoing = false
            this.status = this.$t('todo.is_resting')
            this.initRestDuration()
            this.setRestDuration()
            return
          }
          this.duration--
          break
        default:
          break
      }
      this.timer = setTimeout(() => {
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
      this.isNoLoop = !this.isNoLoop
      if (this.isNoLoop === false) {
        this.showBoxSetLoop = true
        this.currentToDo = _.cloneDeep(this.todo)
      } else {
        this.currentToDo.loopTimes.custom = ''
        this.currentToDo.restTime.long = ''
        this.submitSetLoopTimes()
      }
    },
    submitSetLoopTimes () {
      this.modifyTarget(this.currentToDo)
      this.showBoxSetLoop = false
    },
    infiniteLoog () {
      this.currentToDo.loopTimes.custom = -1
      this.submitSetLoopTimes()
    }
  }
}
</script>

<style lang="less">
.do-todo {
  .fixed-full-screen();
  text-align: left;
  padding: 50px 70px 70px;
  background: rgb(51, 51, 51);
  color: white;
  .flex(@justify-content:space-between; @flex-direction:column;);

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
  .com-popup__header-text {
    .scale-font(0.9);
  }

  .option {
    line-height: 3;
    letter-spacing: 1px;
    span {
      display: block;
      .scale-font(0.9);
    }
  }
}
</style>
