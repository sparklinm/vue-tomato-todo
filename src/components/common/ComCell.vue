<template>
  <div class="com-cell">
    <div class="com-cell__hd">
      <ComIcon :name="icon" />
      <div
        v-if="title!==''"
        class="com-cell__hd-inner"
      />
      <span>{{ title }}</span>
      <div>{{ label }}</div>
    </div>
    <div class="com-cell__bd">
      <div
        v-if="text!==''"
        class="com-cell__bd-inner"
      >
        <span>{{ text }}</span>
      </div>
    </div>
    <div class="com-cell__ft">
      <div
        v-if="false"
        class="com-cell__ft-inner"
      />
      <slot name="right-icon" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String || Number,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    text: {
      type: String || Number,
      default: ''
    },
    rightIcon: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  computed: {
    iconObj () {
      return {
        ['fa' + this.icon]: true
      }
    },
    rightIconObj () {
      return {
        ['fa' + this.rightIcon]: true
      }
    }
  },
  methods: {}
}
</script>

<style lang='less'>
.com-cell {
  padding: 15px 15px;
  .flex(@justify-content: space-between; @align-items: center);
}

.com-cell__hd {
  font-size: 12px;
}
</style>
