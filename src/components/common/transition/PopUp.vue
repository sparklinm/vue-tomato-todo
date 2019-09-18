<template>
  <transition
    :name="animationed?'slide':'noAnimation'"
  >
    <slot />
  </transition>
</template>

<script>
export default {
  props: {
    animationed: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {

    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang='less'>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(100%) !important;
}
</style>
