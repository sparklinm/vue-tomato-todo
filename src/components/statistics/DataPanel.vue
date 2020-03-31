<template>
  <div class="data-panel">
    <div class="data-panel__hd">
      <span class="data-panel__hd-text">
        {{ title }}
      </span>
      <div
        v-if="topBtn"
        class="data-panel__hd-btns"
      >
        <ComIcon
          name="angle-left"
          class="data-panel__hd-btn"
          @click="$emit('previous')"
        />
        <ComIcon
          name="angle-right"
          class="data-panel__hd-btn"
          @click="$emit('next')"
        />
      </div>
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
      default: true
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
  color: white;
}

.data-panel__hd {
  .flex(@justify-content: space-between;@align-items:center;);
  padding: 0 0 0.16rem;
  text-align: left;
}

.data-panel__hd-text {
  font-size: 12px;
}

.data-panel__hd-btn {
  margin-left: 0.4rem;
  padding: 0 5px;
}

.data-panel__bd {
  .flex(@justify-content: space-between;);
}

</style>
