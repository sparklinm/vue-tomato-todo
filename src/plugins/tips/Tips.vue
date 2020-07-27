
<template>
  <transition name="plu-tips">
    <div
      v-if="show"
      class="plu-tips-wrap"
      :style="style"
    >
      <div class="plu-tips">
        <div class="box-background" />
        <div class="text">
          番茄todo：{{ message }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      message: '',
      show: false,
      style: {}
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
  left: 0;
  right: 0;
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
      padding: 10px 15px;
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

.plu-tips-enter-active,
.plu-tips-leave-active {
  transition: all 0.15s ease-out;
  transform-origin: center bottom;
}

.plu-tips-enter,
.plu-tips-leave-to {
  opacity: 0;
  transform: scale(0.2);
}
</style>
