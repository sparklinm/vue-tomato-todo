<template>
  <div class="com-input">
    <label
      class="com-input__area"
      :class="{'com-input__box_focus':isFocus}"
    >
      <span
        ref="placeholder"
        class="com-input__placeholder"
      >{{ placeholder }}</span>
      <textarea
        v-if="type==='textarea'"
        ref="input"
        v-model="currentValue"
        class="com-input__box"
        :rows="rows"
        :autofocus="autofocus"
        v-bind="inputAttrs"
        @focus="isFocus=true"
        @blur="isFocus=false"
        @input="handleInput"
      />
      <input
        v-else
        ref="input"
        v-model="currentValue"
        class="com-input__box"
        :min="min"
        :max="max"
        :type="type==='number'?type:'text'"
        :autofocus="autofocus"
        v-bind="inputAttrs"
        @focus="isFocus=true"
        @blur="isFocus=false"
        @input="handleInput"
      >
    </label>
    <span
      v-if="icon==='question'"
      class="com-input__icon"
      @click="$message(tips)"
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
    },
    tips: {
      type: Object,
      default: null
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    rows: {
      type: String,
      default: '1'
    }
  },
  data () {
    return {
      currentValue: this.value,
      checkedValue: '',
      isFocus: false
    }
  },
  computed: {
    // inputListeners () {
    //   const vm = this
    //   return Object.assign({
    //   },
    //   this.$listeners,
    //   {
    //     // 这里确保组件配合 `v-model` 的工作
    //     input: function (event) {
    //       vm.$emit('input', event.target.value)
    //     }
    //   })
    // }

    inputAttrs () {
      return this.$attrs
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (value) {
      if (this.type === 'positiveInteger') {
        this.checkedValue = this.currentValue = this.toPositiveInteger(value)
      } else {
        this.checkedValue = value
      }
    },
    checkedValue (newVal, oldVal) {
      if (oldVal === '') {
        Velocity(
          this.$refs.placeholder,
          {
            scale: '0.5',
            translateY: '-110%'
          },
          {
            duration: 200
          }
        )
      } else if (newVal === '') {
        Velocity(this.$refs.placeholder, 'reverse')
      }
    }
  },
  mounted () {
    const value = this.currentValue

    if (this.type === 'positiveInteger') {
      this.checkedValue = this.currentValue = this.toPositiveInteger(value)
    } else {
      this.checkedValue = value
    }
  },
  methods: {
    handleInput () {
      this.check()
      this.$emit('input', this.currentValue)
    },
    check () {
      if (typeof this.min !== 'undefined') {
        this.currentValue = this.currentValue < this.min ? this.min : this.currentValue
      }
      if (typeof this.max !== 'undefined') {
        this.currentValue = this.currentValue > this.max ? this.max : this.currentValue
      }
      if (this.type === 'number') {
        this.currentValue = Number(this.currentValue)
      }
    },
    focus () {
      this.$refs.input.focus()
    },
    toPositiveInteger (val) {
      return parseInt(String(val).match(/^[0-9]*/)[0]) || ''
    }
  }
}
</script>

<style lang='less'>
.com-input {
  .flex(@justify-content: space-between; @align-items: center);
  position: relative;
  font-size: 14px;
  padding: 5px 0;
}

.com-input__area {
  position: relative;
  padding: 4px 0;
  flex: 1;
  .flex(@align-items: center);
}

.com-input__placeholder {
  position: absolute;
  transform-origin: left top;
}

.com-input__box {
  width: 100%;
  border: none;
  outline: none;
  padding: 0;
  resize: none;
}

.com-input__box_focus {

}

.com-input__icon {
  color: rgb(88, 88, 88);
  padding: 5px;
}
</style>
