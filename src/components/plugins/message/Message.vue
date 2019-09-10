<template>
  <div class="plu-message">
    <div class="title">
      {{ title }}
    </div>
    <div class="content">
      {{ content }}
    </div>
    <div class="footer">
      <span>确定</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      content: ''
    }
  },
  methods: {

  }
}
</script>

<style lang='less'>
.plu-message {
  width: 400px;
  box-sizing: border-box;
  padding: 15px;
  background: white;
  border-radius: 3px;
  position: fixed;
  .center-position

  .content {
    font-size: 14px;
  }

  .footer {
    font-size: 12px;
    text-align: right;
    color: @theme-base-color-1-10;
  }
}
</style>
