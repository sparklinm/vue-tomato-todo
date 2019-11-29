<template>
  <div>
    <ListTodo
      :todos="todos"
      @update-todos="setTodos($event)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ListTodo from '../components/todo/ListTodo'


export default {
  components: {
    ListTodo
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('todo', {
      todos: state => state.todos
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
