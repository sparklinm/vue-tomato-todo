<template>
  <div
    v-show="show"
    class="mask"
    @click.prevent="cancel"
  />
</template>

<script>
export default {
  data () {
    return {
      show: false

    }
  },
  methods: {

  }
}
</script>

<style lang='less'>


</style>
