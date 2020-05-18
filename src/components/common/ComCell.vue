<template>
  <div class="com-cell">
    <div
      class="com-cell__hd"
      @click="$emit('click-hd')"
    >
      <ComIcon
        v-if="icon"
        :name="icon"
        :icon-color="iconColor"
        class="com-cell__hd_icon"
        :class="{iconClass:true}"
      />
      <div
        v-if="title !== ''"
        class="com-cell__hd-inner"
      >
        <span
          v-marquee
          class="com-cell__hd-title"
        >{{ title }}</span>
        <div
          v-if="lable || $slots.lable && $slots.lable.length"
          class="com-cell__hd-lable"
        >
          <slot name="lable" />
          {{ lable }}
        </div>
      </div>
    </div>
    <div class="com-cell__bd">
      <div
        v-if="text !== ''"
        class="com-cell__bd-inner"
      >
        <span class="com-cell__bd-text">{{ text }}</span>
        <div
          v-if="desc || $slots.desc && $slots.desc.length"
          class="com-cell__bd-desc"
        >
          <span v-html="desc" />
          <slot name="desc" />
        </div>
      </div>
      <slot name="right-icon" />
    </div>
    <!-- <div class="com-cell__ft">
      <div
        v-if="false"
        class="com-cell__ft-inner"
      />
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: ''
    },
    title: {
      type: String || Number,
      default: ''
    },
    lable: {
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
    },
    desc: {
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

<style lang="less">
.com-cell {
  padding: 15px 15px;
  .flex(@justify-content: space-between; @align-items: center);
}

.com-cell__hd {
  font-size: 12px;
  .flex(@justify-content: space-between; @align-items: center);
  margin-right: 10px;
}


.com-cell__hd_icon {
  font-size: 16px;
  margin-right: 12px;
}

.com-cell__hd-lable {
  margin-top: 5px;
  color: rgb(138, 138, 138);
  font-size: 12px;
}

.com-cell__bd {
  font-size: 12px;
  flex-shrink: 0;
}


.com-cell__bd-inner {
  text-align: right;
}

.com-cell__bd-desc {
  font-size: 12px;
  margin-top: 5px;
  color: rgb(138, 138, 138);
}
</style>
