<template>
  <label class="com-checkbox">
    <span
      v-if="left"
      class="com-checkbox__content"
    >
      {{ content }}
    </span>
    <span class="com-checkbox__area">
      <input
        v-model="currentValue"
        type="checkbox"
        class="com-checkbox__inner"
        @input="$emit('input',currentValue)"
      >
      <ComIcon
        name="check"
        class="com-checkbox__icon-checked"
      />
    </span>
    <span
      v-if="!left"
      class="com-checkbox__content"
    >
      {{ content }}
    </span>
  </label>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    },
    left: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'default'
    }
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    }
  },
  methods: {}
}
</script>

<style lang="less">
.com-checkbox {
  position: relative;
}

.com-checkbox__content {
  font-size: 14px;
}

@checkbox-w: 20px;
@checkbox-h: 20px;

.checkbox-wh {
  width: @checkbox-w;
  height: @checkbox-h;
}

.com-checkbox__inner {
  vertical-align: middle;
  background: #fff;
  border: 1px solid black;
  border-radius: 2px;
  appearance: none;
  outline: none;
  .checkbox-wh;

  &:checked {
    background: darken(@theme-base-color-1, 20%);
    border: none;
  }

  &:checked + .com-checkbox__icon-checked {
    display: inline-block;
  }
}

.com-checkbox__icon-checked {
  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
  color: white;

  .come-icon__inner {
    font-size: 16px;
  }
}

.com-checkbox__area {
  position: relative;
}
</style>
