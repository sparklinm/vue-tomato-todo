<template>
  <div class="nav-wrap">
    <div
      class="nav"
    >
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

        <ComIcon
          v-if="page.buttons.includes('setting')"
          name="cog"
        />

        <span v-if="page.buttons.includes('more')">
          <ComToolTip :show.sync="showDropListMore">
            <ComIcon
              name="ellipsis-v"
            />
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
      @submit="submintAddTodo"
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
        />
      </template>
      <div
        ref="card"
        class="clock-card"
      >
        <img
          ref="getUpCardBackground"
          :src="background"
          alt=""
          class="clock-card-background"
        >

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
              <div>
                <span class="tag">{{ getUpCard.status }}</span>
                <span class="tag tag_purple">{{
                  $t("todo.continue_focus_0_days", [focusDays.total])
                }}</span>
              </div>
              <div>
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
        />
      </template>
      <div
        ref="card"
        class="clock-card"
      >
        <img
          ref="sleepCardBackground"
          :src="background"
          alt=""
          class="clock-card-background"
        >

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
              <div>
                <span class="tag">{{ sleepCard.status }}</span>
                <span class="tag tag_purple">{{
                  $t("todo.continue_focus_0_days", [focusDays.total])
                }}</span>
              </div>
              <div>
                <span class="tag">{{
                  $t("todo.total_focus_0_days", [focusDays.total])
                }}</span>
                <span class="tag">{{
                  $t("user.continue_sleep_early_days", [
                    sleepDays.continuation
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
      :show.sync="showBoxFocusClock"
      class="box-clock box-focus-clock"
      remove-node
      @opened="initFocusChart('day')"
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
        />
      </template>
      <div
        ref="card"
        class="clock-card"
      >
        <img
          ref="focusCardBackground"
          :src="background"
          alt=""
          class="clock-card-background"
        >

        <div class="clock-card-inline">
          <div class="card-header">
            <div class="card-info">
              <div>
                <span class="time">{{ focusCard.date }}</span>
              </div>
              <div>
                <span class="tag">{{
                  $t("todo.total_focus_0_days", [focusDays.total])
                }}</span>
                <span class="tag">{{
                  $t("todo.continue_focus_0_days", [focusDays.continuation])
                }}</span>
              </div>
            </div>
          </div>
          <div class="content">
            <DataPanel
              :title="focusCard.focusPanelTitle"
              class="focus-data clock-panel"
              @next="nextDayFocus"
              @previous="preDayFocus"
            >
              <div class="column">
                <span class="text">{{ $t("todo.focus_times") }}</span>
                <span class="number">{{ focusCard.focusTimes }}</span>
              </div>
              <div class="column">
                <span class="text">{{ $t("todo.focus_duration") }}</span>
                <span class="focus-data-inlne">
                  <span class="number">{{ focusCard.focusDuration }}</span>
                  <span class="unit">{{ $t("word.minute") }}</span>
                </span>
              </div>
            </DataPanel>
            <div class="filters">
              <div class="filters-inline">
                <ComGroup
                  v-model="filterValue"
                  @change="handleFilterChange"
                >
                  <ComRadio
                    label="chart"
                    name="chartmode"
                  >
                    {{ this.$t("word.distribution") }}
                  </ComRadio>
                  <ComRadio
                    label="axis"
                    name="chartmode"
                  >
                    {{ this.$t("word.time_axis") }}
                  </ComRadio>
                </ComGroup>
              </div>
            </div>
            <FocusChart
              v-if="showBoxFocusClock && showFocusChart"
              ref="focusChart"
              :data="focusChart.data"
              :period="focusChart.period"
              :top-btn="false"
              @change="initFocusChart"
              @previous="changeChart(focusChart, 'minus')"
              @next="changeChart(focusChart, 'add')"
            />
            <DataPanel
              v-show="!showFocusChart"
              :title="focusAxis.title"
              class="time-axis clock-panel"
              :top-btn="false"
            >
              <div
                v-for="item in focusAxis.data"
                :key="item.id"
                class="ev-events__item"
              >
                <div class="ev-events__hd">
                  <span class="ev-events__hd-text">
                    <span>
                      {{ item.end }}
                    </span>
                    <span>
                      {{ item.start }}
                    </span>
                  </span>
                </div>

                <div class="ev-events__bd">
                  <span class="ev-events__dot" />
                  <div class="ev-events__content">
                    <div class="completed-item list-item">
                      <div class="left">
                        <div class="hd">
                          {{ item.name }}
                        </div>
                      </div>
                      <div class="right">
                        <div class="hd">
                          <div class="hd-text">
                            {{ item.duration +$t('word.minute') }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DataPanel>
          </div>
          <div class="footer">
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
  </div>
</template>

<script>
import screenshot from '@/js/screenshot'
import util from '@/js/util'
import todo from '@/js/todo'
import setting from '@/js/setting'
import { mapState, mapGetters, mapMutations } from 'vuex'
import BoxAddTodo from '@/components/todo/add/BoxAddTodo'
import BoxAddTodoSet from '@/components/todo/add/BoxAddTodoSet'
import BoxAddFuturePlan from '@/components/future-plan/BoxAddFuturePlan'
import DataPanel from '@/components/statistics/DataPanel'
import FocusChart from '@/components/statistics/FocusChart'

export default {
  components: {
    BoxAddTodo,
    BoxAddTodoSet,
    BoxAddFuturePlan,
    DataPanel,
    FocusChart
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
      focusCard: {
        date: '2020年03月31日',
        focusPanelTitle: this.$t('todo.today_focus'),
        focusTimes: 0,
        focusDuration: 0
      },
      sentence: '',
      focusPanelDate: new Date(),
      today: new Date(),
      filterValue: 'chart',
      focusChart: {
        data: [],
        period: [],
        range: 'day'
      },
      focusAxis: {
        title: this.$t('todo.tomato_time_axis'),
        data: []
      },
      showFocusChart: true,
      background: '',
      showDropListMore: false
    }
  },
  computed: {
    ...mapState('todo', {
      focus: state => state.focus
    }),
    ...mapState('user', {
      getUpTimes: state => state.getUpClocks,
      sleepTimes: state => state.sleepClocks,
      headIcon: state => state.user.headIcon
    }),
    ...mapGetters('todo', {
      todos: 'getAllTodos'
    }),
    ...mapState('settings', {
      clockBackgrounds: state => state.clockBackgrounds,
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
          limits: ['todo', 'set', 'statistics', 'time_axis', 'future_plan', 'me']
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
          limits: ['me']
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
    this.today = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate()
    )
    this.initTimeAxis()
    this.setClockBackground()
  },
  methods: {
    ...mapMutations('todo', [
      'addTodo',
      'setIsGetTodos',
      'setShowBoxSortTodo',
      'setShowBoxSortSet'
    ]),
    showBox (key) {
      this[key] = true
    },
    submintAddTodo (data) {
      this.addTodo(data)
      this.setIsGetTodos(true)
    },
    setClockBackground () {
      this.background = setting.getClockBackground()
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
      this.formatFocusCard(this.today)
      this.showClock = false
      this.showBoxFocusClock = true
    },
    formatFocusCard (date) {
      let endDate = new Date(date).setDate(date.getDate() + 1)

      endDate = new Date(endDate)
      const focus = todo.getFocusByTime(this.focus, date, endDate)
      const countFocus = todo.countFocus(focus)
      const obj = {
        date: util.dateFormatter(date, this.$t('time.format_unit')),
        focusPanelTitle: util.dateFormatter(
          date,
          this.$t('time.format_unit_month_day')
        ),
        focusTimes: countFocus.times,
        focusDuration: countFocus.duration
      }

      if (this.today === date) {
        obj.focusPanelTitle = this.$t('todo.today_focus')
      }

      this.focusCard = obj
      this.focusPanelDate = date
    },
    nextDayFocus () {
      const date = new Date(
        this.focusPanelDate.setDate(this.focusPanelDate.getDate() + 1)
      )

      this.formatFocusCard(date)
    },
    preDayFocus () {
      const date = new Date(
        this.focusPanelDate.setDate(this.focusPanelDate.getDate() - 1)
      )

      this.formatFocusCard(date)
    },
    blurBackground () {
      let img = null

      if (this.showBoxGetUpClock) {
        img = this.$refs.getUpCardBackground
      } else if (this.showBoxFocusClock) {
        img = this.$refs.focusCardBackground
      } else {
        img = this.$refs.sleepCardBackground
      }

      if (img.src.startsWith('data')) {
        return
      }
      const canvas = document.createElement('canvas')

      StackBlur.image(img, canvas, 20)
      img.src = canvas.toDataURL()
      canvas.remove()
    },
    download () {
      screenshot.downloadImage(this.$refs.card, 'test.png')
    },
    handleFilterChange (val) {
      this.showFocusChart = val === 'chart'
      if (this.showFocusChart) {
        this.$nextTick(() => {
          this.initFocusChart('day')
        })
      }
    },
    initTimeAxis () {
      const todayTodos = todo.getTodosByFocusTime(this.todos, ...this.getPeriod('day'))
      const focus = []

      todayTodos.forEach(todo => {
        todo.focus.forEach(item => {
          const obj = {
            name: todo.name,
            ...item
          }

          obj.start = util.dateFormatter(obj.start, 'hh:mm')
          obj.end = util.dateFormatter(obj.end, 'hh:mm')
          focus.push(obj)
        })
      })
      focus.sort((a, b) => b.start - a.start)
      this.focusAxis.data = focus
    },
    getPeriod (unit, cdate = new Date()) {
      const year = cdate.getFullYear()
      const month = cdate.getMonth()
      const date = cdate.getDate()
      const day = cdate.getDay() || 7
      const oneDay = 24 * 60 * 60 * 1000
      const today = new Date(year, month, date)

      if (unit === 'day') {
        return [today, new Date(today.getTime() + oneDay)]
      }
      if (unit === 'week') {
        return [
          new Date(today.getTime() - (day - 1) * oneDay),
          new Date(today.getTime() + (8 - day) * oneDay)
        ]
      }
      if (unit === 'month') {
        const startDate = 1
        let nextMonth = ''

        if (month === 11) {
          nextMonth = new Date(year + 1, 0, 1)
        } else {
          nextMonth = new Date(year, month + 1, 1)
        }
        return [new Date(year, month, startDate), nextMonth]
      }
      if (unit === 'year') {
        return [new Date(year, 0, 1), new Date(year + 1, 0, 1)]
      }
    },
    initFocusChart (range) {
      const chart = this.focusChart

      this.initPeriod(chart, range)
      this.initTodos(chart)
    },
    initPeriod (chart, range) {
      const period = this.getPeriod(range)

      chart.period = period
      chart.range = range
    },
    initTodos (chart) {
      chart.data = todo.getTodosByFocusTime(this.todos, ...chart.period)
    },
    changeChart (chart, type) {
      this.changePeriod(chart, type)
      if ([this.focusChart].includes(chart)) {
        this.initTodos(chart)
        return
      }
    },
    changePeriod (chart, type) {
      const oneDay = 24 * 60 * 60 * 1000
      let targetDay = null

      if (type === 'minus') {
        targetDay = chart.period[0].getTime() - oneDay
      } else {
        targetDay = chart.period[1].getTime()
      }
      chart.period = this.getPeriod(chart.range, new Date(targetDay))
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

    &>span {
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
  }

  .clock-card-background {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
  }

  .clock-card-inline {
    position: relative;
    z-index: 10;
    width: 100%;
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
    font-size: 8px;
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

.box-get-up-clock,.box-sleep-clock {
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
    font-size: 8px;
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

.box-focus-clock {
  .time {
    font-size: 24px;
    margin-bottom: 5px;
  }

  .tag {
    margin-right: 8px;
    margin-top: 3px;
    padding: 3px 4px;
  }

  .clock-card-inline {
    box-sizing: border-box;
    padding: 18px 12px 0;
  }

  .content {
    padding: 8px 0;
  }

  .data-panel.clock-panel {
    background: rgba(0, 0, 0, 0.4);
    padding: 8px;
  }

  .data-panel__hd-btn {
    font-size: 20px;
  }

  .focus-data {

    .data-panel__hd {
      padding-bottom: 2px;
    }

    .text {
      margin-bottom: 5px;
    }
  }

  .filters {
    text-align: center;
    margin: 8px 0;
  }

  .com-radio-group {
    display: inline-block;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
  }

  .custom-radio__text {
    display: inline-block;
    padding: 6px 10px;
  }

  .custom-radio__inline:checked + span {
    background: rgba(255, 255, 255, 0.4);
    color: white;
  }

  .custom-radio:not(:last-child) .custom-radio__text {
    border-right: 1px solid rgb(212, 212, 212);
  }

  .custom-radio:first-child .custom-radio__text {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .custom-radio:last-child .custom-radio__text {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .pie-contianer {
    width: 5.7rem;
  }

  .data-panel.focus-chart {
    background: rgba(0, 0, 0, 0.4);
  }
  .focus-chart {
    .custom-radio__text {
      font-size: 10px;
      width: 1.1rem;
      box-sizing: border-box;
    }

    .filters {
      margin-bottom: 0;
    }

    .filters-inline {
      border: none;
    }

    .pie-contianer {
      height: 3.0rem;
    }
  }

  .time-axis {
    .data-panel__bd {
      display: block;
      min-height: 200px;
    }

    * {
      box-sizing: border-box;
    }

    .ev-events__hd {
      padding: 0;
    }

    .ev-events__bd {
      margin-left: 40px;
      padding: 3px 10px 3px 10px;
    }

    .ev-events__dot {
      background-image: radial-gradient(circle, #43bbf2 20%, #fdf4ec);
      width: 8px;
      height: 8px;
      margin: -4px -5px;
    }

    .ev-events__hd-text {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      font-size: 9px;
    }

    .completed-item {
      background-color: rgba(69, 143, 204, 0.4);
      padding: 6px 12px;
      font-size: 12px;
    }
  }
}
</style>
