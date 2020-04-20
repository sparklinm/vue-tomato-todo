<template>
  <Fade @opend="startCountdown">
    <div
      v-show="show"
      class="box-wrap"
      style="z-index:23456"
      @click.self="hide"
    >
      <div class="plu-message">
        <div class="title">
          {{ title }}
        </div>
        <div
          class="content"
          v-html="content"
        />
        <div class="footer">
          <span
            v-if="showCancel"
            class="cancel"
            @click="hide"
          >取消</span>
          <button
            class="confirm"
            :disabled="showCountdown"
            :class="{ 'plu-message__confirm_disabled': showCountdown }"
            @click="confirm"
          >
            确定
            <span v-if="showCountdown"> ({{ confirmCountdown }}) </span>
          </button>
        </div>
      </div>
    </div>
  </Fade>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      content: '',
      show: false,
      showCancel: false,
      confirmCountdown: 0
    }
  },
  computed: {
    showCountdown () {
      return this.confirmCountdown > 0
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.$modals.add(this.$el)
      } else {
        Object.assign(this, {
          showCancel: false,
          confirmCountdown: 0
        })
        this.$modals.delete()
      }
    }
  },
  methods: {
    hide () {
      this.show = false
      this.$emit('cancel')
    },
    confirm () {
      this.show = false
      this.$emit('confirm')
    },
    startCountdown () {
      if (this.confirmCountdown <= 0) {
        return
      }
      setTimeout(() => {
        this.confirmCountdown--
        this.startCountdown()
      }, 1000)
    }
  }
}
</script>

<style lang="less">
.plu-message {
  .center-position();
  width: 7.3rem;
  box-sizing: border-box;
  padding: 20px 25px;
  background: white;
  border-radius: 3px;
  position: fixed;
  z-index: 200;

  > div {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    text-align: left;
  }

  .content {
    font-size: 14px;
    line-height: 1.4;
    text-align: justify;

    p {
      margin: 10px 0;
    }
  }

  .footer {
    font-size: 10px;
    text-align: right;
    color: @theme-base-color-1-20;

    span {
      padding: 10px 0;
    }

    .confirm {
      outline: none;
      border: none;
      padding: 0;
      background: transparent;
      color: @theme-base-color-1-20;
    }

    .plu-message__confirm_disabled {
      color: rgb(156, 156, 156);
    }

    .cancel {
      margin-right: 30px;
    }
  }
}
</style>
