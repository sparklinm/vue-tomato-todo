<template>
  <label
    v-if="type==='default'"
    class="custom-radio"
  >
    <input
      ref="radio"
      v-model="curValue"
      type="radio"
      :name="name"
      class="custom-radio__inline"
      :value="label"
      @change="handleChange"
    >
    <span class="custom-radio__text">
      <slot />
      <span v-if="showContent">
        {{ content||label }}
      </span>
    </span>
  </label>

  <label
    v-else
    class="custom-radio"
  >
    <input
      ref="radio"
      v-model="curValue"
      type="radio"
      :name="name"
      class="custom-radio__inline"
      :value="label"
      @change="handleChange"
    >
    <span class="custom-radio__icon" />
    <span class="custom-radio__text">
      <slot />
      <span v-if="showContent">
        {{ content||label }}
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
        Array
      ],
      default: 0
    },
    label: {
      type: [
        String,
        Number,
        Object,
        Array
      ],
      default: ''
    },
    name: {
      type: String,
      default: 'name'
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
  computed: {
    showContent () {
      return !(this.$slots.default && this.$slots.default.length)
    }
  },
  watch: {
    value (val) {
      this.curValue = val
    },
    '$parent.value' (val) {
      // if (val === this.label) {
      //   this.$refs.radio.checked = true
      // }
      this.curValue = val
    }
  },
  mounted () {
    // if (this.$parent.value === this.label) {
    //   this.$refs.radio.checked = true
    // }
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
.custom-radio {
  display: inline-block;
}

.custom-radio__text {
  display: inline-block;
  padding: 0.08rem 0.32rem;
  text-align: center;
  vertical-align: middle;
}

.custom-radio__inline {
  width: 0;
  height: 0;
  &:checked + span {
    background: rgb(255, 221, 221);
    color: rgb(194, 60, 60);
  }
}

.custom-radio__icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50% 50%;
  box-sizing: border-box;
  border: 2px solid rgb(160, 160, 160);
  vertical-align: middle;
  margin-right: 10px;
  text-align: center;
  font-size: 0;
  transition: all 0.3s ease;

  &::after {
    content: '';
    transition: all 0.3s ease;
    background: white;
  }

  &::before {
    content: '';
    display:inline-block;
    height: 100%;
    vertical-align: middle;
  }
}

.custom-radio__inline:checked + .custom-radio__icon {
  border: 2px solid rgb(0, 128, 187);

  &::after {
    content: '';
    display:inline-block;
    width: 8px;
    height: 8px;
    vertical-align: middle;
    border-radius: 50% 50%;
    background: rgb(0, 128, 187);
  }

  &::before {
    content: '';
    display:inline-block;
    height: 100%;
    vertical-align: middle;
  }
}
</style>
