<template>
  <div class="com-cell">
    <i
      v-if="icon"
      class="fa"
      aria-hidden="true"
      :class="iconObj"
    />
    <div
      v-if="title!==''"
      class="com-cell__hd"
    >
      <span>{{ title }}</span>
      <div>{{ label }}</div>
    </div>
    <div
      v-if="text!==''"
      class="com-cell__bd"
    >
      <span>{{ text }}</span>
    </div>
    <div
      v-if="false"
      class="com-cell__ft"
    />
    <!-- <i
      class="fa"
      aria-hidden="true"
      :class="rightIconObj"
    />-->
    <slot name="right-icon" />
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
      return { ['fa' + this.icon]: true }
    },
    rightIconObj () {
      return { ['fa' + this.rightIcon]: true }
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
