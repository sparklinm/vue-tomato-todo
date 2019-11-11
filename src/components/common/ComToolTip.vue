<template>
  <div class="com-tool-tip">
    <slot />
    <slot name="content" />
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showBtnMoveDrop: false
    }
  },
  mounted () {
    console.log(this)
    const vNode = this.$slots.default[0]
    const node = this.extend(vNode)
    console.log(node)


    // const node = this.$slots.default[0].elm
    // const content = this.$slots.content[0].elm
    // const parent = node.parentNode
    // const grandParent = parent.parentNode
    // grandParent.insertBefore(node, parent)
    // grandParent.removeChild(parent)
  },
  methods: {

    setPosition (element, target) {
      this.$nextTick(() => {
        const targetRect = target.getBoundingClientRect()
        element.style.left =
          targetRect.left + (targetRect.width - element.clientWidth) / 2 + 'px'
        element.style.top = targetRect.bottom + 'px'
      })
    }
  }
}
</script>

<style lang='less'>
.com-tool-tip{
  display: inline-block;
}

</style>
