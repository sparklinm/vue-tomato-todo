<template>
  <span>{{ tweeningValue }}</span>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      default: 500
    }
  },
  data: function () {
    return {
      tweeningValue: 0
    }
  },
  watch: {
    value: function (newValue, oldValue) {
      let endValue = newValue
      let startValue = oldValue

      if (typeof newValue !== 'number') {
        endValue = 0
      }

      if (typeof startValue !== 'number') {
        startValue = 0
      }
      this.tween(startValue, endValue)
    }
  },
  mounted: function () {
    this.tween(0, this.value)
  },
  methods: {
    tween: function (startValue, endValue) {
      const vm = this

      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }

      new TWEEN.Tween({
        tweeningValue: startValue
      })
        .to(
          {
            tweeningValue: endValue
          },
          this.duration
        )
        .onUpdate(function () {
          vm.tweeningValue = this.tweeningValue.toFixed()
        })
        .start()

      animate()
    }
  }
}
</script>

<style lang="less"></style>
