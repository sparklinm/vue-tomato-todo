<template>
  <div class="nav-wrap">
    <div class="nav">
      <div class="left">
        {{ page.title }}
      </div>
      <div class="right">
        <!-- <ComIcon
          v-for="item in page.buttons"
          :key="`${item.icon+Math.random()}`"
          :name="item.icon"
          @click="item.event"
        /> -->
        <span v-if="page.buttons.includes('clock')">
          <ComToolTip :show.sync="showClock">
            <ComIcon name="clock-o" />
            <template v-slot:content>
              <div class="drop-list_simple nav-drop">
                <ul>
                  <li @click="getUpClock">
                    {{ $t("menu.get_up_clock") }}
                  </li>
                  <li @click="focusDurationClock">
                    {{ $t("menu.focus_duration_clock_today") }}
                  </li>
                  <li @click="sleepClock">
                    {{ $t("menu.sleep_clock") }}
                  </li>
                </ul>
              </div>
            </template>
          </ComToolTip>
        </span>

        <ComIcon
          v-if="page.buttons.includes('addTodo')"
          name="plus"
          @click="showBox('showBoxAddTodo')"
        />

        <ComIcon
          v-if="page.buttons.includes('addTodoSet')"
          name="plus-square"
          @click="showBox('showBoxAddTodoSet')"
        />

        <ComIcon
          v-if="page.buttons.includes('addFuturePlan')"
          name="plus"
          @click="showBox('showBoxAddPlan')"
        />

        <ComIcon
          v-if="page.buttons.includes('tip')"
          name="question-circle"
        />

        <span v-if="page.buttons.includes('setting')">
          <ComToolTip :show.sync="showDropListSetting">
            <ComIcon name="cog" />
            <template #content>
              <div class="drop-list_simple">
                <ul>
                  <li @click="toMe">
                    {{ $t('settings.user_info_set') }}
                  </li>

                  <li @click="toPomodoro">
                    {{ $t('settings.pomodoro_core_settings') }}
                  </li>
                </ul>
              </div>
            </template>
          </ComToolTip>
        </span>

        <span v-if="page.buttons.includes('more')">
          <ComToolTip :show.sync="showDropListMore">
            <ComIcon name="ellipsis-v" />
            <template #content>
              <div class="drop-list_white drop-list_right">
                <ul>
                  <li @click="sortTodos">
                    {{ $t("action.edit") }}{{ $t("action.sort") }}
                  </li>

                  <li @click="toTimeAxis">
                    {{ $t("todo.history_record_time_axis") }}
                  </li>
                </ul>
              </div>
            </template>
          </ComToolTip>
        </span>
      </div>
    </div>
    <BoxAddTodo
      v-if="showBoxAddTodo"
      :show.sync="showBoxAddTodo"
    />
    <BoxAddTodoSet :show.sync="showBoxAddTodoSet" />
    <BoxAddFuturePlan :show.sync="showBoxAddPlan" />
    <ComPopup
      :title="$t('menu.clock_and_save')"
      :show.sync="showBoxGetUpClock"
      class="box-clock box-get-up-clock"
      @open="handleBoxClockOpen"
    >
      <template v-slot:header-icon>
        <ComIcon
          name="tint"
          class="box-clock__head-btn"
          @click="blurBackground"
        />
        <ComIcon
          name="download"
          class="box-clock__head-btn"
          @click="download"
        />
        <ComIcon
          name="rotate-left"
          class="box-clock__head-btn"
          @click="setClockBackground"
        />
        <ComIcon
          name="times"
          class="box-clock__head-btn"
          @click="showBoxGetUpClock=false"
        />
      </template>
      <div
        ref="getUpCard"
        class="clock-card"
      >
        <div class="clock-card-background clock-card-default-background" />
        <img
          ref="getUpCardBackground"
          :src="background"
          alt=""
          class="clock-card-background img-fit-container"
          @load="showImg"
        >
        <div class="background-shadow" />

        <div class="clock-card-inline">
          <div class="card-header">
            <img
              :src="headIcon"
              alt=""
              class="head-icon"
            >
            <div class="card-info">
              <div>
                <span class="time">{{ getUpCard.time }}</span>
                <span>{{ getUpCard.date }}</span>
              </div>
              <div class="tags">
                <span class="tag">{{ getUpCard.status }}</span>
                <span class="tag tag_purple">{{
                  $t("todo.continue_focus_0_days", [focusDays.total])
                }}</span>
              </div>
              <div class="tags">
                <span class="tag">{{
                  $t("todo.total_focus_0_days", [focusDays.total])
                }}</span>
                <span class="tag">{{
                  $t("user.continue_get_up_early_days", [
                    getUpDays.continuation
                  ])
                }}</span>
              </div>
            </div>
          </div>
          <div class="content">
            {{ sentence }}
          </div>
          <div class="copyright">
            {{ $t("common.copyright") }}
            <img
              :src="productIcon"
              alt=""
              class="copyright-icon"
            >
          </div>
        </div>
      </div>
    </ComPopup>

    <ComPopup
      :title="$t('menu.clock_and_save')"
      :show.sync="showBoxSleepClock"
      class="box-clock box-sleep-clock"
      @open="handleBoxClockOpen"
    >
      <template v-slot:header-icon>
        <ComIcon
          name="tint"
          class="box-clock__head-btn"
          @click="blurBackground"
        />
        <ComIcon
          name="download"
          class="box-clock__head-btn"
          @click="download"
        />
        <ComIcon
          name="rotate-left"
          class="box-clock__head-btn"
          @click="setClockBackground"
        />
        <ComIcon
          name="times"
          class="box-clock__head-btn"
          @click="showBoxSleepClock=false"
        />
      </template>
      <div
        ref="sleepCard"
        class="clock-card"
      >
        <div class="clock-card-background clock-card-default-background" />
        <img
          ref="sleepCardBackground"
          :src="background"
          alt=""
          class="clock-card-background img-fit-container"
          @load="showImg"
        >
        <div class="background-shadow" />

        <div class="clock-card-inline">
          <div class="card-header">
            <img
              :src="headIcon"
              alt=""
              class="head-icon"
            >
            <div class="card-info">
              <div>
                <span class="time">{{ sleepCard.time }}</span>
                <span>{{ sleepCard.date }}</span>
              </div>
              <div class="tags">
                <span class="tag">{{ sleepCard.status }}</span>
                <span class="tag tag_purple">{{
                  $t("todo.continue_focus_0_days", [focusDays.total])
                }}</span>
              </div>
              <div class="tags">
                <span class="tag">{{
                  $t("todo.total_focus_0_days", [focusDays.total])
                }}</span>
                <span class="tag">{{
                  $t("user.continue_sleep_early_days", [sleepDays.continuation])
                }}</span>
              </div>
            </div>
          </div>
          <div class="content">
            {{ sentence }}
          </div>
          <div class="copyright">
            {{ $t("common.copyright") }}
            <img
              :src="productIcon"
              alt=""
              class="copyright-icon"
            >
          </div>
        </div>
      </div>
    </ComPopup>
    <ClockFocus :show.sync="showBoxFocusClock" />
  </div>
</template>

<script>
import screenshot from '@/js/screenshot'
import util from '@/js/util'
import todo from '@/js/todo'
import setting from '@/js/setting'
import { mapState, mapMutations } from 'vuex'
import BoxAddTodo from '@/components/todo/add/BoxAddTodo'
import BoxAddTodoSet from '@/components/todo/add/BoxAddTodoSet'
import BoxAddFuturePlan from '@/components/future-plan/BoxAddFuturePlan'
import ClockFocus from '@/components/ClockFocus'

export default {
  components: {
    BoxAddTodo,
    BoxAddTodoSet,
    BoxAddFuturePlan,
    ClockFocus
  },
  data () {
    return {
      showBoxAddTodo: false,
      showBoxAddTodoSet: false,
      showBoxAddPlan: false,
      showClock: false,
      showBoxGetUpClock: false,
      showBoxFocusClock: false,
      showBoxSleepClock: false,
      getUpCard: {
        time: '10:28',
        date: '2020-03-31',
        status: '晚起',
        continueGetUpDays: 1
      },
      sleepCard: {
        time: '10:28',
        date: '2020-03-31',
        status: '晚睡',
        continueSleepDays: 1
      },
      sentence: '',
      background: '',
      showDropListMore: false,
      showDropListSetting: false
    }
  },
  computed: {
    ...mapState('todo', {
      focus: state => state.focus
    }),
    ...mapState('user', {
      getUpTimes: state => state.getUpClocks,
      sleepTimes: state => state.sleepClocks,
      headIcon: state => state.user.headIcon,
      isLogin: state => state.isLogin
    }),
    ...mapState('settings', {
      productIcon: state => state.productIcon
    }),
    focusDays () {
      const data = todo.formatFocus(this.focus)
      const days = Object.keys(data)

      return {
        total: days.length,
        continuation: util.getContinueDays(days.map(day => parseInt(day)))
      }
    },
    getUpDays () {
      const getUpEarlyTimes = this.getUpTimes.filter(item => {
        const hours = item.getHours()

        return hours < 9
      })

      return {
        continuation: util.getContinueDays(getUpEarlyTimes)
      }
    },
    sleepDays () {
      const sleepEarlyTimes = this.sleepTimes.filter(item => {
        const hours = item.getHours()

        return hours < 23
      })

      return {
        continuation: util.getContinueDays(sleepEarlyTimes)
      }
    },
    pathName () {
      const path = this.$route.path.slice(1)

      return path || 'todo'
    },
    page () {
      const maps = {
        todo: this.$t('word.todo'),
        set: this.$t('word.todo_set'),
        statistics: this.$t('word.statistics'),
        time_axis: this.$t('todo.history_record_time_axis'),
        future_plan: this.$t('plan.future_plan'),
        me: this.$t('menu.my')
      }

      const buttons = [
        {
          name: 'clock',
          icon: 'clock-o',
          event: () => {},
          limits: ['todo', 'set', 'statistics', 'time_axis', 'future_plan']
        },
        {
          name: 'addTodo',
          icon: 'plus',
          event: this.showBox.bind(this, 'showBoxAddTodo'),
          limits: ['todo']
        },
        {
          name: 'addTodoSet',
          icon: 'plus-square',
          event: this.showBox.bind(this, 'showBoxAddTodoSet'),
          limits: ['set']
        },
        {
          name: 'addFuturePlan',
          icon: 'plus',
          event: this.showBox.bind(this, 'showBoxAddPlan'),
          limits: ['future_plan']
        },
        {
          name: 'more',
          icon: 'ellipsis-v',
          event: () => {},
          limits: [
            'todo',
            'set',
            'statistics',
            'time_axis',
            'future_plan',
            'me'
          ]
        },
        {
          // 旋转屏幕
          name: 'rotateScreen',
          icon: '',
          event: () => {},
          limits: ['do']
        },
        {
          // 分享
          name: 'share',
          icon: 'share-alt',
          event: () => {},
          limits: ['do']
        },
        {
          // 下载
          name: 'download',
          icon: 'download',
          event: () => {},
          limits: ['do']
        },
        {
          // 设置
          name: 'setting',
          icon: 'cog',
          event: () => {},
          limits: ['me']
        },
        {
          // 疑问
          name: 'tip',
          icon: 'question-circle',
          event: () => {},
          limits: ['none']
        }
      ]

      const page = {
        title: maps[this.pathName]
      }

      page.buttons = buttons.filter(item => {
        if (!item.limits) {
          return item
        }
        return item.limits.some(limit => limit === this.pathName)
      })

      page.buttons = page.buttons.map(item => {
        return item.name
      })
      return page
    }
  },
  mounted () {
    this.setClockBackground()
  },
  methods: {
    ...mapMutations('todo', [
      'addTodo',
      'setShowBoxSortTodo',
      'setShowBoxSortSet'
    ]),
    showBox (key) {
      this[key] = true
    },
    blurBackground () {
      const img = this.getImgEl()

      if (img.src.startsWith('data')) {
        return
      }
      const canvas = document.createElement('canvas')

      StackBlur.image(img, canvas, 20)
      img.src = canvas.toDataURL()
      canvas.remove()
    },
    download () {
      screenshot.downloadImage(this.getCard(), 'test.png')
    },
    getCard () {
      if (this.showBoxGetUpClock) {
        return this.$refs.getUpCard
      } if (this.showBoxSleepClock) {
        return this.$refs.sleepCard
      }
    },
    getImgEl () {
      let img = null

      if (this.showBoxGetUpClock) {
        img = this.$refs.getUpCardBackground
      } else if (this.showBoxFocusClock) {
        img = this.$refs.focusCardBackground
      } else {
        img = this.$refs.sleepCardBackground
      }
      return img
    },
    setClockBackground () {
      const img = setting.getClockImage()

      this.changeSrc(img)
    },
    changeSrc (src) {
      const img = this.getImgEl()

      Object.assign(img.style, {
        opacity: 0
      })
      setTimeout(() => {
        img.src = src
      })
    },
    showImg (e) {
      const el = e.target

      setTimeout(() => {
        Object.assign(el.style, {
          opacity: 1,
          transition: 'opacity 0.5s ease'
        })

        el.addEventListener('transitionend', () => {
          Object.assign(el.style, {
            transition: 'initial'
          })
        })
      }, 300)
    },
    handleBoxClockOpen () {
      this.sentence = this.$t(setting.getSentence())
      this.setClockBackground()
    },
    getUpClock () {
      const date = new Date()
      const hours = date.getHours()

      if (hours >= 12 || hours < 3) {
        // return false
      }
      const obj = {
        date: util.dateFormatter(date, 'yyyy-MM-dd'),
        time: util.dateFormatter(date, 'hh:mm')
      }

      if (hours < 9) {
        obj.status = this.$t('menu.get_up_early')
      } else {
        obj.status = this.$t('menu.get_up_late')
      }
      this.getUpCard = obj

      this.showClock = false
      this.showBoxGetUpClock = true
    },
    sleepClock () {
      const date = new Date()
      const hours = date.getHours()

      if (hours < 20 || hours >= 3) {
        // return false
      }
      const obj = {
        date: util.dateFormatter(date, 'yyyy-MM-dd'),
        time: util.dateFormatter(date, 'hh:mm')
      }

      if (hours < 23) {
        obj.status = this.$t('menu.sleep_early')
      } else {
        obj.status = this.$t('menu.sleep_late')
      }
      this.sleepCard = obj

      this.showClock = false
      this.showBoxSleepClock = true
    },
    focusDurationClock () {
      this.showClock = false
      this.showBoxFocusClock = true
    },
    toTimeAxis () {
      this.showDropListMore = false
      this.$nextTick(() => {
        this.$router.push({
          path: 'time_axis/all'
        })
      })
    },
    sortTodos () {
      if (this.pathName === 'todo') {
        this.showDropListMore = false
        this.setShowBoxSortTodo(true)
      } else if (this.pathName === 'set') {
        this.showDropListMore = false
        this.setShowBoxSortSet(true)
      } else {
        this.$tips(this.$t('tips.sort_limit'))
      }
    },
    toMe () {
      this.showDropListSetting = false
      if (!this.isLogin) {
        this.$nextTick(() => {
          this.$router.push({
            path: 'login'
          })
        })
        return
      }
      this.$nextTick(() => {
        this.$router.push({
          path: 'modify_me'
        })
      })
    },
    toPomodoro () {
      this.showDropListSetting = false
      this.$nextTick(() => {
        this.$router.push({
          path: 'pomodoro_setting'
        })
      })
    }
  }
}
</script>

<style lang="less">
.nav-wrap {
  height: 56px;
}

.nav {
  position: fixed;
  top: 0;
  color: white;
  font-size: 16px;
  width: 100%;
  z-index: 1234;
  padding: 0px 15px;
  height: 56px;
  box-sizing: border-box;
  .flex(@align-items: center; @justify-content: space-between;);

  .right {
    font-size: 18px;

    & > span {
      margin-left: 20px;
      padding: 5px;
    }
  }
}

.nav-drop.drop-list_simple {
  li {
    padding: 8px 12px;
  }
}

.box-clock {
  .com-popup__header {
    padding: 8px 12px;
  }

  .com-popup__header-text {
    font-size: 14px;
  }

  .com-popup__content {
    padding: 0;
  }

  .box-clock__head-btn {
    margin-left: 20px;
    padding: 5px;
    font-size: 18px;
    line-height: 1;
  }

  .clock-card {
    position: relative;
    color: white;
    overflow: hidden;
  }

  .clock-card-background {
    transition: all 0.5s ease;
  }

  .clock-card-default-background {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image:linear-gradient(to bottom,rgb(1, 104, 173), rgb(1, 58, 97));
  }

  .clock-card-inline {
    position: relative;
    z-index: 10;
    width: 100%;
  }

  .tags {
    .scale-font(0.8;left;center;)
  }

  .tag {
    display: inline-block;
    padding: 2px 4px;
    border-radius: 4px;
    background: rgb(238, 201, 201);
    color: rgb(173, 11, 11);
  }

  .tag_purple {
    background: rgb(206, 185, 223);
    color: rgb(72, 0, 131);
  }

  .copyright {
    color: white;
    text-align: right;
    .scale-font(0.9;right;center;);
    padding: 10px;
  }

  .copyright-icon {
    width: 14px;
    height: 14px;
    border-radius: 2px;
    vertical-align: middle;
    margin-left: 12px;
  }
}

.box-get-up-clock,
.box-sleep-clock {
  .card-header {
    padding: 30px 0px 0 20px;
  }

  .head-icon {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    vertical-align: middle;
  }

  .card-info {
    display: inline-block;
    color: white;
    vertical-align: middle;
    margin-left: 20px;
  }

  .card-info span {
    display: inline-block;
    margin-right: 8px;
    margin-bottom: 6px;
  }

  .time {
    font-size: 20px;
  }

  .content {
    padding: 140px 20px;
    color: white;
    font-size: 14px;
  }
}
</style>
