<template>
  <div class="com-input boreder-bottom-20">
    <textarea
      v-if="type==='textarea'"
      v-model="currentValue"
      class="input-box com-input-box"
      rows="1"
      :placeholder="placeholder"
      @blur="blurHandle"
    />
    <input
      v-else
      v-model="currentValue"
      class="input-box com-input-box"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :type="type"
      @blur="blurHandle"
    >

    <span
      v-if="icon==='question'"
      class="tip"
    >
      <i
        class="fa fa-question-circle"
        aria-hidden="true"
      />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    min: {
      type: Number,
      default: undefined
    },
    max: {
      type: Number,
      default: undefined
    },
    value: {
      type: [String, Number],
      default: ''
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
  mounted: {

  },
  methods: {
    blurHandle () {
      this.$emit('input', this.currentValue)
    }
  }
}
</script>

<style lang='less'>
.com-input {
  .flex(@justify-content: space-between; @align-items: center);
  .input-box {
    width: 100%;
    border: none;
    outline: none;
    padding: 5px 0;
    flex: 1;
  }
  .tip {
    color: rgb(88, 88, 88);
  }
}
</style>
