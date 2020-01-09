<template>
  <div class="com-radio-group">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [
        String,
        Number,
        Object,
        Array
      ],
      default: ''
    }
  },
  data () {
    return {}
  },
  created () {

  },
  mounted () {
  },
  methods: {}
}
</script>

<style lang='less'>


</style>
