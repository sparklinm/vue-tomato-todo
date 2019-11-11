<template>
  <div class="nav-wrap">
    <div class="nav">
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
    />
    <BoxAddToDoSet
      :show.sync="showBoxAddToDoSet"
    />
  </div>
</template>

<script>
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
    page () {
      const maps = {
        todo: '待办',
        set: '待办集'
      }

      const path = this.$route.path.slice(1)
      const name = path || 'todo'

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
          event: this.addToDo,
          limits: ['todo']
        },
        {
          name: 'addTodoSet',
          icon: 'plus-square',
          event: this.addToDoSet,
          limits: ['set']
        },
        {
          name: 'more',
          icon: 'ellipsis-v',
          event: () => {}
        }
      ]

      const page = {
        title: maps[name]
      }

      page.buttons = buttons.filter(item => {
        if (!item.limits) {
          return item
        }
        return item.limits.some(limit => limit === name)
      })

      return page
    }
  },
  methods: {
    addToDo () {
      // this.$store.commit('toggleBoxAddToDo', true, null)
      this.showBoxAddToDo = true
    },
    addToDoSet () {
      this.showBoxAddToDoSet = true
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
