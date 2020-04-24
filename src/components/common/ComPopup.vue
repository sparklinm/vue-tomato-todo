<template>
  <transition
    name="popup"
    @after-leave="afterLeave"
    @after-enter="afterEnter"
  >
    <div
      v-show="showBox"
      ref="box"
      class="box-wrap"
      :style="{ zIndex: zIndex }"
      @click.self="handleCloseOnClickMask"
    >
      <div class="com-popup">
        <div
          v-if="!noHeader"
          class="com-popup__header"
          :style="headerStyle"
        >
          <transition name="com-popup__header-shadow_fade">
            <div
              v-if="showHeadShadow"
              v-show="showShadowAfterOpen"
              class="com-popup__header-shadow"
            />
          </transition>

          <div class="com-popup__header-text">
            {{ title }}
          </div>
          <div class="com-popup__header-btn-area">
            <slot name="header-icon" />

            <span
              v-if="topBtn"
              class="com-popup__header-btn"
            >
              <i
                class="fa fa-check"
                aria-hidden="true"
                @click="handleSubmit"
              />
            </span>
            <span
              v-if="topBtn"
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
          v-if="showFooter"
          class="com-popup__footer"
        >
          <button
            v-if="bottomCancelBtn"
            class="com-popup__footer-btn"
            @click="handleCancel"
          >
            取消
          </button>
          <button
            v-if="bottomConfirmBtn"
            class="com-popup__footer-btn"
            @click="handleSubmit"
          >
            确定
          </button>
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    noHeader: {
      type: Boolean,
      default: false
    },
    headerStyle: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    },
    topBtn: {
      type: Boolean,
      default: false
    },
    bottomConfirmBtn: {
      type: Boolean,
      default: false
    },
    bottomCancelBtn: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: [Number, String],
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
    },
    closeOnClickMask: {
      type: Boolean,
      default: true
    },
    removeNode: {
      type: Boolean,
      default: false
    },
    showHeadShadow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showBox: false,
      showShadowAfterOpen: false
    }
  },
  computed: {
    showFooter () {
      return (
        this.bottomConfirmBtn ||
        (this.$slots.footer && this.$slots.footer.length)
      )
    }
  },
  watch: {
    showBox (val) {
      if (val) {
        this.$emit('open')
        this.$modals.add(this.$el)
      } else {
        this.$emit('update:show', false)
        this.$emit('close')
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
  destroyed () {
    if (this.appendToBody) {
      document.body.removeChild(this.$el)
    }
  },
  methods: {
    afterEnter () {
      this.$emit('opened')
      this.showShadowAfterOpen = true
    },
    afterLeave () {
      this.$modals.delete(this.$el)
      this.$emit('closed')
      this.showShadowAfterOpen = false
    },
    close () {
      this.showBox = false
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
    },
    handleCloseOnClickMask () {
      if (this.closeOnClickMask) {
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
}
</script>

<style lang="less">
.com-popup {
  display: inline-block;
  width: 7rem;
  vertical-align: middle;
  background-color: white;
  text-align: left;
  border-radius: 8px;
}

.com-popup > div:first-child {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.com-popup > div:last-child {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.com-popup__header {
  color: white;
  font-size: 16px;
  padding: 15px 15px;
  transform-origin: 50% 50%;
  position: relative;
  transition: background-image 0.4s ease;
  background-size: 100% 100%;

  .flex(@align-items: center; @justify-content: space-between);
}

.com-popup__header-text {
  position: relative;
}

.com-popup__header-btn-area {
  .flex(@align-items: center);
  position: relative;
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
  font-size: 12px;
  letter-spacing: 1px;
  padding: 8px 6px;
  border: none;
  border-radius: 2px;
  background: white;
  box-shadow: 0 2px 1px 1px rgb(238, 238, 238);
  cursor: pointer;
  outline: none;
}

.com-popup__header-shadow {
  position: absolute;
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  left: 0;
}

.com-popup__header-shadow_fade-enter {
  opacity: 0;
}

.com-popup__header-shadow_fade-enter-active {
  transition: opacity 0.6s linear 2s;
}

.com-popup__header-shadow_fade-leave-active {
  transition: none;
}
</style>
