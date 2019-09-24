<template>
  <div>
    <ListToDo :todos="todos" />
    <BoxAddToDo v-if="showBoxAddToDo" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ListToDo from '../components/todo/ListToDo'
import BoxAddToDo from '../components/todo/add/BoxAddToDo'


export default {
  components: {
    ListToDo,
    BoxAddToDo
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      showBoxAddToDo: state => state.showBoxAddToDo,
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
