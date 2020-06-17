<template>
  <div
    class="com-tooltip"
    @click="hide"
  >
    <transition
      name="com-tooltip-content"
      @after-leave="afterLeave"
    >
      <div
        v-show="showContent"
        id="com-tooltip-content"
        ref="content"
        style="position:absolute"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    // ToolTip组件的引用
    component: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showContent: false
    }
  },
  watch: {
    show (val) {
      this.showContent = val
    }
  },
  mounted () {
    this.showContent = true
    this.$nextTick(() => {
      this.component.setPosition(this.$refs.content, this.component.$el)
    })
  },
  methods: {
    hide () {
      this.showContent = false
    },
    afterLeave () {
      this.$el.remove()
      this.component.curShow = false
      this.component.$emit('update:show', false)
    }
  }
}
</script>

<style lang="less">
.com-tooltip {
  .fixed-full-screen();
  background-color: transparent;
  font-size: 12px;
  transition: all;
  z-index: 5000;
}

.com-tooltip-content-enter-active {
  animation: fade 0.15s ease-out;
}

.com-tooltip-content-leave-active {
  animation: fade 0.15s ease-out reverse;
}
</style>
