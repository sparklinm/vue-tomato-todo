<template>
  <label class="custom-radio">
    <input
      ref="radio"
      type="radio"
      :name="name"
      class="custom-radio__inline"
      :value="label"
      @change="handleChange"
    >
    <span class="custom-radio__text">
      <slot />
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
        Object
      ],
      default: ''
    },
    label: {
      type: [
        String,
        Number,
        Object
      ],
      default: ''
    },
    name: {
      type: String,
      default: 'name'
    }
  },
  data () {
    return {}
  },
  watch: {
    '$parent.value' (val) {
      if (val === this.label) {
        this.$refs.radio.checked = true
      }
    }
  },
  mounted () {
    if (this.$parent.value === this.label) {
      this.$refs.radio.checked = true
    }
  },
  methods: {
    handleChange (e) {
      if (e.target.checked) {
        this.$emit('input', this.label)
        this.$emit('change', this.label)
        this.$parent.$emit('input', this.label)
        this.$parent.$emit('change', this.label)
      }
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
