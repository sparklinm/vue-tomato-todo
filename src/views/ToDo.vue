<template>
  <div>
    <ListToDo
      :todos="todos"
      @update-todos="setToDos($event)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ListToDo from '../components/todo/ListToDo'


export default {
  components: {
    ListToDo
  },
  data () {
    return {}
  },
  computed: {
    ...mapState({
      todos: state => state.todos
    })
  },
  mounted () {

  },
  methods: {
    ...mapMutations(['setToDos'])
  }
}
</script>

<style>
</style>
