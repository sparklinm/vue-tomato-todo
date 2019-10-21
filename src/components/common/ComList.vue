<template>
  <div class="com-list">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang='less'>


</style>
