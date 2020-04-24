<template>
  <div class="">
    <ListTodo
      :todos="todos"
      class="main-page"
      @update-todos="setTodos($event)"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ListTodo from '../components/todo/ListTodo'

export default {
  name: 'Todo',
  components: {
    ListTodo
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters('todo', {
      todos: 'getTodosNormal'
    })
  },
  watch: {},
  methods: {
    ...mapMutations('todo', {
      setTodos: 'setTodos'
    })
  }
}
</script>

<style>
</style>
