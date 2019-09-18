<template>
  <div>
    <ListToDo />
    <BoxAddToDo />
  </div>
</template>

<script>
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
  },
  methods: {
  }
}
</script>

<style>
</style>
