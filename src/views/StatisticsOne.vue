<template>
  <div style="height:100%;position:relative;z-index:5000">
    <div
      class="statistical-hd-con"
    >
      <div
        class="statistical-hd"
      >
        <div class="statistical-hd__left">
          <ComIcon
            class="calendar-return-btn"
            name="arrow-left"
            @click="toLastPage"
          />
          <span>{{ name }}</span>
        </div>
      </div>
    </div>
    <div class="sub-main page-statistics">
      <CumulativeData
        show-header
        :todos="todos"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import CumulativeData from '../components/statistics/CumulativeData'

export default {
  components: {
    CumulativeData
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('todo', {
      sets: 'todoSets',
      todos: 'todos'
    }),
    ...mapGetters('todo', {
      getTodoById: 'getTodoById',
      getTodosBySet: 'getTodosBySet',
      getSetById: 'getSetById',
      allTodos: 'getAllTodos'
    }),

    set () {
      const type = this.$route.query.type
      const id = this.$route.params.id

      if (type === 'set' && id !== 'all') {
        return this.getSetById(parseInt(id))
      }
      return null
    },
    todo () {
      const type = this.$route.query.type
      const id = this.$route.params.id

      if (type === 'todo' && id !== 'all') {
        return this.getTodoById(parseInt(id))
      }
      return null
    },
    name () {
      if (this.todo) {
        return this.todo.name
      }
      if (this.set) {
        return this.set.name
      }
      return this.$t('menu.statistics_by_all_sets')
    },
    todos () {
      if (this.todo) {
        return [this.todo]
      }
      if (this.set) {
        return this.set.todos
      }

      return this.allTodos || []
    }
  },
  methods: {
    toLastPage () {
      history.back()
    }
  }
}
</script>

<style lang='less'>


</style>
