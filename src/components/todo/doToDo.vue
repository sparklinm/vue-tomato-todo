<template>
  <div class="do-todo-container">
    <div class="do-todo">
      <div class="verse">
        <span class="quo-marks">
          “
        </span>
        <div class="sentence">
          喜欢安定，也不怕漂泊。喜欢结伴，也不怕多行。
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
      <div class="description">
        以上是暂停的限制时间 <br>
        同一个代办最多可暂停3分钟，以免打断 <br>
        番茄工作法流程
      </div>
      <template v-slot:footer>
        <button
          class="com-popup__footer-btn"
          @click="continueTime"
        >
          继续计时
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
        placeholder="请输入循环次数"
        autofocus
      />
      <ComInput
        v-model="currentToDo.restTime.long"
        type="number"
        placeholder="循环结束后长休息分钟数"
        autofocus
      />

      <template v-slot:footer>
        <button
          class="com-popup__footer-btn com-popup__footer-btn_w-auto"
          @click="submitSetLoopTimes"
        >
          无限循环
        </button>
        <button
          class="com-popup__footer-btn"
          @click="submitSetLoopTimes"
        >
          确定
        </button>
        <button
          class="com-popup__footer-btn"
          @click="showBoxSetLoop=false"
        >
          取消
        </button>
      </template>
    </ComPopup>

    <ComPopup
      class="box-skip-time fade"
      :show.sync="showBoxSkipTime"
      title="请选择你的操作"
    >
      <ul>
        <li />
      </ul>
    </ComPopup>
  </div>
</template>

<script>
import ProgressCircle from './ProgressCircle'
import { mapState } from 'vuex'
import util from '@/util.js'
export default {
  components: {
    ProgressCircle
  },
  data () {
    return {
      status: '正在进行中',
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
          name: '默认背景音乐|默认白噪音',
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
      showBoxSkipTime: false
    }
  },
  computed: {
    ...mapState('todo', {
      todo: state => state.doToDo
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
        return `还剩 ${customTimes} 次`
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
        this.status = '正在进行中'
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
            this.status = '休息中'
            this.initRestDuration()
            this.setRestDuration()
            return
          }
          this.duration++
          break
        case 'down':
          if (this.duration <= 0) {
            this.isDoing = false
            this.status = '休息中'
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
        this.currentToDo.restTime.custom = ''
        this.submitSetLoopTimes()
      }
    },
    submitSetLoopTimes () {
      // this.todo = this.currentToDo
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
</style>
