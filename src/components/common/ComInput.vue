<template>
  <div class="com-input">
    <label class="com-input__area boreder-bottom-20">
      <span
        ref="placeholder"
        class="com-input__placeholder"
      >{{ placeholder }}</span>
      <textarea
        v-if="type==='textarea'"
        ref="input"
        v-model="currentValue"
        class="com-input__box com-input-box"
        rows="1"
        :autofocus="autofocus"
        @input="inputHandle"
      />
      <input
        v-else
        ref="input"
        v-model="currentValue"
        class="com-input__box com-input-box"
        :min="min"
        :max="max"
        :type="type==='number'?type:'text'"
        :autofocus="autofocus"
        @input="inputHandle"
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
    }
  },
  data () {
    return {
      currentValue: this.value,
      checkedValue: ''
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
            top: '0px',
            translateY: '-100%'
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
    console.log(this.$listeners)
  },
  methods: {
    inputHandle () {
      this.$emit('input', this.currentValue)
    },
    focus () {
      this.$refs.input.focus()
    },
    toPositiveInteger (val) {
      return val.match(/^[0-9]*/)[0]
    }
  }
}
</script>

<style lang='less'>
.com-input {
  .flex(@justify-content: space-between; @align-items: center);
  position: relative;
}

.com-input__area {
  position: relative;
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
  padding: 5px 0;
  resize: none;
}

.com-input__icon {
  color: rgb(88, 88, 88);
  padding: 5px;
}
</style>
