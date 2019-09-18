<template>
  <transition
    name="fade"
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
.fade-enter-active,
.fade-leave-active {
  transition: all 0.1s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
