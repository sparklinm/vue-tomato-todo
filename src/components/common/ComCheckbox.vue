<template>
  <label class="com-checkbox">
    <span v-if="type==='default'">
      <span
        v-if="left"
        class="com-checkbox__content"
      >
        {{ content }}
        <slot />
      </span>
      <span class="com-checkbox__area">
        <input
          v-model="curValue"
          type="checkbox"
          class="com-checkbox__inner"
          :value="label"
          @change="handleChange"
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
        <slot />
      </span>
    </span>
    <span
      v-else
      class="com-checkbox__area"
    >
      <input
        v-model="curValue"
        type="checkbox"
        class="com-checkbox__inner"
        :value="label"
        @change="handleChange"
      >
      <span>
        <slot />
      </span>
    </span>
  </label>
</template>

<script>
export default {
  props: {
    value: {
      type: [
        String,
        Number,
        Object,
        Array,
        Boolean
      ],
      default: 0
    },
    label: {
      type: [
        String,
        Number,
        Object
      ],
      default: ''
    },
    left: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    }
  },
  data () {
    return {
      curValue: this.value
    }
  },
  watch: {
    value (val) {
      this.curValue = val
    },
    '$parent.value' (val) {
      this.curValue = val
    }
  },
  mounted () {
    if (typeof this.$parent.value !== 'undefined') {
      this.curValue = this.$parent.value
    }
  },
  methods: {
    handleChange (e) {
      this.$emit('input', this.curValue)
      this.$emit('change', this.curValue)
      this.$parent.$emit('input', this.curValue)
      this.$parent.$emit('change', this.curValue)
    }
  }
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
