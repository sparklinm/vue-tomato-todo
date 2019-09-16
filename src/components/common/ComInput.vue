<template>
  <div class="com-input boreder-bottom-20">
    <label>
      <span
        ref="placeholder"
        class="placeholder"
      >{{ placeholder }}</span>
      <textarea
        v-if="type==='textarea'"
        ref="input"
        v-model="currentValue"
        class="input-box com-input-box"
        rows="1"
        :autofocus="autofocus"
        @blur="blurHandle"
      />
      <input
        v-else
        ref="input"
        v-model="currentValue"
        class="input-box com-input-box"
        :min="min"
        :max="max"
        :type="type"
        :autofocus="autofocus"
        @blur="blurHandle"
      >
    </label>
    <span
      v-if="icon==='question'"
      class="tips"
      @click="$message(tips.title,tips.content)"
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
      currentValue: this.value
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (newVal, oldVal ) {
      if (oldVal === '') {
        Velocity(this.$refs.placeholder, {
          scale: '0.5',
          top: '0px',
          translateY: '-100%'
        }, {
          duration: 200
        })
      } else if (newVal === '') {
        Velocity(this.$refs.placeholder, 'reverse')
      }
    }
  },
  mounted () {
  },
  methods: {
    blurHandle () {
      this.$emit('input', this.currentValue)
    },
    focus () {
      console.log('123')

      this.$refs.input.focus()
    }
  }
}
</script>

<style lang='less'>
.com-input {
  .flex(@justify-content: space-between; @align-items: center);
  position: relative;

  label {
    flex: 1;
    .flex(@align-items: center);
  }

  .placeholder{
    position: absolute;
    transform-origin: left top;
    letter-spacing: 1px;
  }

  .input-box {
    width: 100%;
    border: none;
    outline: none;
    padding: 5px 0;
    resize: none;
  }

  .tips {
    color: rgb(88, 88, 88);
    i {
      padding: 5px;
    }
  }
}
</style>
