<template>
  <div class="page-me">
    <Setting />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Setting from '@/components/setting/Setting'

export default {
  components: {
    Setting
  },
  data () {
    return {}
  },

  computed: {
    ...mapGetters('todo', {
      todos: 'getAllTodos'
    })
  },
  methods: {}
}
</script>

<style lang="less">

</style>