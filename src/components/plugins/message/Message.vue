<template>
  <Fade>
    <div
      v-show="show"
      class="box-wrap"
    >
      <div
        class="mask"
        @click.prevent="hide"
      />
      <div class="plu-message">
        <div class="title">
          {{ title }}
        </div>
        <div
          class="content"
          v-html="content"
        />
        <div class="footer">
          <span @click="hide">确定</span>
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
      show: false
    }
  },
  methods: {
    hide () {
      this.show = false
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
  }

  .content {
    font-size: 14px;
    line-height: 1.4;
    text-align: justify;
    letter-spacing: 1px;
    p {
      margin:0;
    }
  }

  .footer {
    font-size: 10px;
    text-align: right;
    color: @theme-base-color-1-20;
    span {
      padding: 10px 0;
    }
  }
}
</style>
