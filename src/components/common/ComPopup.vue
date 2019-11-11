<template>
  <transition
    name="popup"
    @after-leave="afterLeave"
  >
    <div
      v-show="showBox"
      ref="box"
      class="box-wrap"
      :style="{zIndex:zIndex}"
      @click.self="handleCancel"
    >
      <div class="com-popup">
        <div class="com-popup__header background-color-20">
          <div class="text">
            {{ title }}
          </div>
          <div
            class="com-popup__header-btn-area"
          >
            <slot name="header-icon" />

            <span
              v-if="topOptionBtn"
              class="com-popup__header-btn"
            >
              <i
                class="fa fa-check"
                aria-hidden="true"
                @click="handleSubmit"
              />
            </span>
            <span
              v-if="topOptionBtn"
              class="com-popup__header-btn"
            >
              <i
                class="fa fa-times"
                aria-hidden="true"
                @click="handleCancel"
              />
            </span>
          </div>
        </div>

        <div class="com-popup__content">
          <slot />
        </div>
        <div
          v-if="bottomConfirmBtn"
          class="com-popup__footer"
        >
          <button
            class="com-popup__footer-btn font-color-base-10"
            @click="handleSubmit"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </transition>
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
      default: false
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
    afterLeave () {
      this.$emit('closed')
    },
    close () {
      this.showBox = false
      this.$nextTick(() => {
        this.$emit('update:show', false)
        this.$emit('close')
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
.com-popup {
  display: inline-block;
  width: 6.5rem;
  vertical-align: middle;
  background-color: white;
}

.com-popup__header {
  color: white;
  font-size: 16px;
  padding: 15px 15px;
  .flex(@align-items: center; @justify-content: space-between);
}

.com-popup__header-btn-area {
  .flex(@align-items: center);
}

.com-popup__header-btn {
  margin-left: 25px;
}

.com-popup__content {
  padding: 10px 15px 8px;
}

.com-popup__footer {
  padding: 0 5px;
  margin: 5px 0 10px;
}

.com-popup__footer-btn {
  width: 100%;
  height: 34px;
  font-size: 14px;
  letter-spacing: 1px;
  border: none;
  background: white;
  box-shadow: 0 2px 1px 1px rgb(238, 238, 238);
  cursor: pointer;
  outline: none;
}
</style>
