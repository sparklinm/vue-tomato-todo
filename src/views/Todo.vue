<template>
  <div>
    <ListTodo
      :todos="todos"
      @update-todos="setTodos($event)"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import ListTodo from '../components/todo/ListTodo'


export default {
  components: {
    ListTodo
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters('todo', {
      // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
      todos: 'getTodosNormal'
    })
  },
  mounted () {

  },
  methods: {
    ...mapMutations('todo', ['setTodos'])
  }
}
</script>

<style>
</style>
