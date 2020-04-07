<template>
  <span
    v-if="name"
    class="com-icon"
    :class="{ flex: text }"
    @click="$emit('click')"
  >
    <span :class="iconColorClass">
      <i
        class="come-icon__inner"
        :class="classObj"
        :style="{ fontSize: size + 'px' }"
      />
    </span>
    <span
      v-if="text"
      class="come-icon__text"
    >{{ text }}</span>
  </span>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    size: {
      type: [Number, String],
      default: ''
    },
    iconColor: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  computed: {
    classObj () {
      return {
        fa: true,
        ['fa-' + this.name]: true
      }
    },
    iconColorClass () {
      const calssName = this.iconColor ? `come-icon__inner_${this.iconColor}` : ''

      return {
        [calssName]: true,
        'come-icon__area': calssName
      }
    }
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="less">
.flex {
  .flex(@flex-direction: column; @align-items: center);
}

.come-icon {
  font-size: 20px;
}

.come-icon__inner {
}

.come-icon__text {
  margin-top: 6px;
  font-size: 10px;
}

.come-icon__area {
  display: inline-block;
  width: 25px;
  height: 25px;
  border-radius: 50% 50%;
  text-align: center;
  font-size: 21px;

  i {
    font-size: 14px;
    vertical-align: middle;
  }
}

.come-icon__inner_purple {
  background: rgb(238, 223, 252);
  color: rgb(175, 103, 243);
}

.come-icon__inner_red {
  background: rgb(252, 231, 231);
  color: rgb(238, 82, 62);
}

.come-icon__inner_yellow {
  background: rgb(252, 235, 223);
  color: rgb(255, 126, 41);
}

.come-icon__inner_green {
  background: rgb(223, 252, 235);
  color: rgb(48, 95, 83);
}

.come-icon__inner_blue {
  background: rgb(228, 244, 255);
  color: rgb(80, 159, 224);
}

.come-icon__inner_cyan {
  background: rgb(214, 252, 244);
  color: rgb(66, 175, 161);
}
</style>
