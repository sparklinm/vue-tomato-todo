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
        <ComIcon
          v-for="item in page.buttons"
          :key="`${item.icon+Math.random()}`"
          :name="item.icon"
          @click="item.event"
        />
      </div>
    </div>
    <BoxAddTodo
      v-if="showBoxAddTodo"
      :show.sync="showBoxAddTodo"
      @submit="addTodo($event)"
    />
    <BoxAddTodoSet
      :show.sync="showBoxAddTodoSet"
    />
    <BoxAddFuturePlan :show.sync="showBoxAddPlan" />
  </div>
</template>

<script>
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
      showBoxAddPlan: false
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
          limits: [
            'todo',
            'set',
            'statistics',
            'time_axis',
            'future_plan'
          ]
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
            'future_plan'
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
    ...mapMutations('todo', ['addTodo']),
    showBox (key) {
      this[key] = true
    }
  }
}
</script>

<style lang='less'>
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
</style>
