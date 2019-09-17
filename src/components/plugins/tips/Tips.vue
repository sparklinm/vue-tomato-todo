<template>
  <PopUp>
    <div
      v-if="show"
      class="plu-alert-wrap"
    >
      <div class="box-background" />
      <div
        class="plu-alert"
      >
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
  mounted () {
  },
  methods: {

  }
}
</script>

<style lang='less'>
.plu-alert-wrap {
  display: inline-block;
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translate(-50%, 0);
  z-index: 2005;

  .box-background {
    background-color: rgb(37, 37, 37);
    opacity: 0.7;
    border-radius: 5px;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -1;
  }

  .plu-alert {
    box-sizing: border-box;
    padding: 15px;
    letter-spacing: 1px;
    font-size: 12px;
    color: rgb(230, 230, 230);
    white-space: nowrap;
  }
}
</style>
