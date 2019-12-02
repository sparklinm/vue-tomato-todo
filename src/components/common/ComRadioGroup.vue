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
        Object
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
    console.log(this.$slots.default)
    this.$slots.default[0].data.attrs.t = 5


  },
  methods: {}
}
</script>

<style lang='less'>


</style>
