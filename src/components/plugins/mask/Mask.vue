<template>
  <Fade>
    <div
      v-show="show"
      class="mask"
      :style="{zIndex:zIndex}"
      @click.prevent="cancel"
    />
  </Fade>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      zIndex: 2000

    }
  },
  methods: {

  }
}
</script>

<style lang='less'>


</style>
