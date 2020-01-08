<template>
  <label class="custom-checkbox">
    <input
      ref="checkbox"
      type="checkbox"
      class="custom-checkbox__inline"
      :value="label"
      @change="handleChange"
    >
    <span class="custom-checkbox">
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
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  computed: {
    showContent () {
      return !(this.$slots.default && this.$slots.default.length)
    }
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
.custom-checkbox__text {
  display: inline-block;
  width: 1.1rem;
  padding: 0.08rem 0;
  text-align: center;
}

.custom-checkbox__inline {
  width: 0;
  &:checked + span {
    background: white;
    color: black;
  }
}
</style>
