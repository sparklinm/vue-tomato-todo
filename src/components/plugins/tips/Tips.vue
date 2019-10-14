<template>
  <PopUp>
    <div
      v-if="show"
      class="plu-tips-wrap"
    >
      <div class="plu-tips">
        <div class="box-background" />
        <div class="text">
          番茄todo：{{ message }}
        </div>
      </div>
    </div>
  </PopUp>
</template>

<script>
export default {
  data () {
    return {
      message: '',
      show: false
    }
  },
  mounted () {},
  methods: {}
}
</script>

<style lang='less'>
.plu-tips-wrap {
  position: fixed;
  bottom: 50px;
  z-index: 3000;
  width: 100%;
  text-align: center;

  .plu-tips {
    box-sizing: border-box;
    letter-spacing: 1px;
    font-size: 12px;
    color: rgb(230, 230, 230);
    white-space: nowrap;
    display: inline-block;
    position: relative;

    .text {
      padding: 15px;
    }

    .box-background {
      border-radius: 5px;
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: rgb(37, 37, 37);
      opacity: 0.7;
      z-index: -1;
    }
  }
}
</style>
