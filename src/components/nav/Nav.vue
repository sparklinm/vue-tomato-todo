<template>
  <div class="nav-wrap">
    <div
      class="nav"
      :style="navStyle"
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
                  <li>
                    {{ $t("menu.sleep_clock") }}
                  </li>
                </ul>
              </div>
            </template>
          </ComToolTip>

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
            v-if="page.buttons.includes('more')"
            name="ellipsis-v"
          />
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
      :show.sync="showBoxFocusClock"
      class="box-clock"
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
          @click="download"
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
          ref="backgroundImg"
          src="/background/back4.jpg"
          alt=""
          class="clock-card-background"
        >
      </div>
    </ComPopup>
  </div>
</template>

<script>
import screenshot from '@/js/screenshot'
import { mapMutations } from 'vuex'
import BoxAddTodo from '@/components/todo/add/BoxAddTodo'
import BoxAddTodoSet from '@/components/todo/add/BoxAddTodoSet'
import BoxAddFuturePlan from '@/components/future-plan/BoxAddFuturePlan'

export default {
  components: {
    BoxAddTodo,
    BoxAddTodoSet,
    BoxAddFuturePlan
  },
  data () {
    return {
      showBoxAddTodo: false,
      showBoxAddTodoSet: false,
      showBoxAddPlan: false,
      showClock: false,
      showBoxFocusClock: true
    }
  },
  computed: {
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
        future_plan: this.$t('plan.future_plan')
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
          limits: ['todo', 'set', 'statistics', 'time_axis', 'future_plan']
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
    },
    navStyle () {
      const styleObj = {}

      if (this.pathName === 'do') {
        styleObj.background = 'transparent'
      }
      return styleObj
    }
  },
  methods: {
    ...mapMutations('todo', ['addTodo', 'setIsGetTodos']),
    showBox (key) {
      this[key] = true
    },
    submintAddTodo (data) {
      this.addTodo(data)
      this.setIsGetTodos(true)
    },
    getUpClock () {},
    focusDurationClock () {},
    blurBackground () {
      const img = this.$refs.backgroundImg
      const canvas = document.createElement('canvas')

      StackBlur.image(img, canvas, 20)
      img.src = canvas.toDataURL()
      canvas.remove()
    },
    download () {
      screenshot.downloadImage(this.$refs.card, 'test.png')
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
    span {
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
  .com-popup {
  }

  .com-popup__header {
    padding: 8px 12px;
  }

  .com-popup__content {
    padding: 0;
  }

  .box-clock__head-btn {
    margin-left: 20px;
    padding: 5px;
  }

  .clock-card {
    position: relative;
    height: 400px;
  }

  .clock-card-background {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>
