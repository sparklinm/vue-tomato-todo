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

    <BoxAddToDo
      v-if="showBoxAddToDo"
      :show.sync="showBoxAddToDo"
      @submit="addToDo($event)"
    />
    <BoxAddToDoSet
      :show.sync="showBoxAddToDoSet"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import BoxAddToDo from '@/components/todo/add/BoxAddToDo'
import BoxAddToDoSet from '@/components/todo/add/BoxAddToDoSet'
export default {
  components: {
    BoxAddToDo,
    BoxAddToDoSet
  },
  data () {
    return {
      showBoxAddToDo: false,
      showBoxAddToDoSet: false
    }
  },
  computed: {
    pathName () {
      const path = this.$route.path.slice(1)
      return path || 'todo'
    },
    page () {
      const maps = {
        todo: '待办',
        set: '待办集'
      }

      const buttons = [
        {
          name: 'clock',
          icon: 'clock-o',
          event: () => {},
          limits: ['todo', 'set']
        },
        {
          name: 'addTodo',
          icon: 'plus',
          event: this.showBox.bind(this, 'showBoxAddToDo'),
          limits: ['todo']
        },
        {
          name: 'addTodoSet',
          icon: 'plus-square',
          event: this.showBox.bind(this, 'showBoxAddToDoSet'),
          limits: ['set']
        },
        {
          name: 'more',
          icon: 'ellipsis-v',
          event: () => {},
          limits: ['todo', 'set']
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
    ...mapMutations('todo', ['addToDo']),
    showBox (key) {
      this[key] = true
    }
  }
}
</script>

<style lang='less'>
.nav {
  padding: 18px 15px;
  font-size: 16px;
  color: white;
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
