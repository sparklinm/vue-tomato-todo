<template>
  <div class="data-panel">
    <div class="data-panel__hd">
      <span class="data-panel__hd-text">
        {{ title }}
      </span>
    </div>
    <div class="data-panel__bd">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    topBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style lang="less">
.data-panel {
  padding: 0.16rem 0.16rem 0.24rem;
  border-radius: 0.12rem;
}

.data-panel__hd {
  .flex(@justify-content: space-between;);
  padding: 0 0 0.16rem;
  text-align: left;
}

.data-panel__hd-text {
  .scale-font(0.9);
}

.data-panel__bd {
  .flex(@justify-content: space-between;);
}
</style>
