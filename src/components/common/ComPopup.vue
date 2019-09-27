<template>
  <PopUp :animationed="animationed">
    <div
      v-show="showBox"
      ref="box"
      class="box-wrap"
      :style="{zIndex:zIndex}"
      @click.self="handleCancel"
    >
      <div
        class="com-popup-box"
      >
        <div class="title background-color-20">
          <div class="text">
            {{ title }}
          </div>
          <div
            v-if="topOptionBtn"
            class="btn-option-top"
          >
            <span>
              <i
                class="fa fa-check"
                aria-hidden="true"
                @click="handleSubmit"
              />
            </span>
            <span>
              <i
                class="fa fa-times"
                aria-hidden="true"
                @click="handleCancel"
              />
            </span>
          </div>
        </div>

        <div class="content">
          <slot name="content" />
        </div>
        <div
          v-if="bottomConfirmBtn"
          class="footer"
        >
          <button
            class="btn-confirm font-color-base-10"
            @click="handleSubmit"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </PopUp>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    topOptionBtn: {
      type: Boolean,
      default: false
    },
    bottomConfirmBtn: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: true
    },
    animationed: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 2001
    },
    destoryOnClose: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    removeOnClose: {
      type: Boolean,
      default: false
    },
    beforeOpen: {
      type: Function,
      default: null
    },
    beforeClose: {
      type: Function,
      default: null
    },
    submit: {
      type: Function,
      default: null
    },
    cancel: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      showBox: false
    }
  },
  watch: {
    showBox (val) {
      if (val) {
        this.$modals.add(this.$el)
      } else {
        this.$modals.delete(this.$el)
      }
    },
    show (val) {
      if (val) {
        if (this.beforeOpen) {
          this.beforeOpen(() => {
            this.showBox = true
          })
        } else {
          this.showBox = true
        }
      } else {
        this.showBox = false
      }
    }
  },
  mounted () {
    if (this.show) {
      if (this.beforeOpen) {
        this.beforeOpen(() => {
          this.showBox = true
        })
      } else {
        this.showBox = true
      }
    }
    if (this.appendToBody) {
      document.body.appendChild(this.$el)
    }
  },
  methods: {
    close () {
      this.showBox = false
      this.$nextTick(() => {
        this.$emit('update:show', false)
        this.$emit('close')
      })
      this.$refs.box.addEventListener('transitionend', () => {
        this.$emit('update:show', false)
        this.$emit('closed')
      })
    },
    handleSubmit () {
      if (this.submit) {
        this.submit(() => {
          this.close()
        })
      } else {
        this.close()
      }
    },
    handleCancel () {
      if (this.cancel) {
        this.cancel(() => {
          this.close()
        })
      } else {
        this.close()
      }
    }
  }
}
</script>

<style lang='less'>
.com-popup-box {
  width: 6.5rem;
  position: fixed;
  z-index: 150;
  background-color: white;
  .center-position();

  .title {
    color: white;
    .flex(@align-items: center; @justify-content: space-between);
    font-size: 16px;
    padding: 15px 15px;

    .btn-option-top {
      .flex(@align-items: center);

      span {
        &:first-child {
          margin-right: 15px;
        }
      }
    }
  }

  .content {
    padding: 10px 15px 8px;
  }
  .footer {
    padding: 0 5px;
    margin: 5px 0 10px;

    .btn-confirm {
      width: 100%;
      height: 30px;
      font-size: 14px;
      letter-spacing: 1px;
      border: none;
      background: white;
      box-shadow: 0 2px 1px 1px rgb(238, 238, 238);
      cursor: pointer;
      outline: none;
    }
  }
}
</style>
