<template>
  <div>
    <ListToDo :todos="todos" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ListToDo from '../components/todo/ListToDo'


export default {
  components: {
    ListToDo
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      todos: state => state.todos
    })
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style>
</style>
