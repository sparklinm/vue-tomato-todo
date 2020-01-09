<template>
  <label class="com-checkbox-button">
    <input
      ref="checkbox"
      v-model="curValue"
      type="checkbox"
      class="com-checkbox-button__inline"
      :value="label"
      @change="handleChange"
    >
    <span class="com-checkbox-button__text">
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
.com-checkbox-button {
  display: inline-block;
}

.com-checkbox-button__text {
  display: inline-block;
  padding: 0.08rem;
  text-align: center;
  border-radius: 4px 4px;
  font-size: 12px;
}

.com-checkbox-button__inline {
  width: 0;
  &:checked + span {
    background: rgb(253, 218, 218);
    color: rgb(206, 53, 53);
  }
}
</style>
