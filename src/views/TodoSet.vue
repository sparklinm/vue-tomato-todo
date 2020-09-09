<template>
  <div>
    <ListTodoSet class="main-page" />
  </div>
</template>

<script>
import ListTodoSet from '@/components/todo/ListTodoSet'

export default {
  name: 'TodoSet',
  components: {
    ListTodoSet
  },
  data () {
    return {}
  },
  computed: {},

  mounted () {

  },
  methods: {}
}
</script>

<style lang='less' scoped>

</style>
