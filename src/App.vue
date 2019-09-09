<template>
  <div
    id="app"
    class="theme-1"
  >
    <router-view />
    <BoxAddToDo />
  </div>
</template>

<script>
import BoxAddToDo from './components/BoxAddToDo'
export default {
  components: {
    BoxAddToDo
  },
  data () {
    return {

    }
  }

}
</script>

<style lang="less">
</style>
