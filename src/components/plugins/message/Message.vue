<template>
  <Fade>
    <div
      v-show="show"
      class="box-wrap"
      style="z-index:2700"
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
          <span @click="confirm">确定</span>
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
      showCancel: false
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.$modals.add(this.$el)
      } else {
        this.$modals.delete()
      }
    }
  },
  methods: {
    hide () {
      this.show = false
      this.$emit('cancel')
      return Promise.reject()
    },
    confirm () {
      this.show = false
      this.$emit('confirm')
      return Promise.resolve()
    }
  }
}
</script>

<style lang='less'>
.plu-message {
  width: 7.3rem;
  box-sizing: border-box;
  padding: 20px 25px;
  background: white;
  border-radius: 3px;
  position: fixed;
  z-index: 200;
  .center-position();

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
      margin:10px 0;
    }
  }

  .footer {
    font-size: 10px;
    text-align: right;
    color: @theme-base-color-1-20;

    span {
      padding: 10px 0;
    }

    .cancel {
      margin-right: 15px;
    }
  }
}
</style>
