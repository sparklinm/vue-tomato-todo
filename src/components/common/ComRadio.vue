<template>
  <label class="custom-radio">
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
      default: ''
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
.custom-radio__text {
  display: inline-block;
  width: 1.1rem;
  padding: 0.08rem 0;
  text-align: center;
}

.custom-radio__inline {
  width: 0;
  &:checked + span {
    background: white;
    color: black;
  }
}
</style>
