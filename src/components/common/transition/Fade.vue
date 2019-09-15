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
    console.log('sss')

  },
  methods: {
  }
}
</script>

<style lang='less'>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
