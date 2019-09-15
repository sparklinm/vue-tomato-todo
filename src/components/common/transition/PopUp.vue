<template>
  <transition
    name="slide"
  >
    <slot />
  </transition>
</template>

<script>
export default {
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
  bottom: 0 !important;
  transform: translate(-50%, 200%) !important;
}
</style>
