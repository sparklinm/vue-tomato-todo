<template>
  <div
    v-show="showLoading"
    class="loading"
  >
    <ComPopup
      :show.sync="showLoading"
      no-header
      class="box-loading fade"
      :close-on-click-mask="false"
      :z-index="11111"
    >
      <div class="loading-circle" />
    </ComPopup>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showLoading: false
    }
  },
  methods: {
    show (duration) {
      return new Promise((resolve) => {
        this.showLoading = true
        if (duration >= 0) {
          setTimeout(() => {
            this.showLoading = false
            resolve()
          }, duration)
        }
      })
    },
    hide () {
      this.showLoading = false
    }
  }
}
</script>

<style lang="less">
.loading {
  .com-popup__content {
    padding: 20px;
  }

  .loading-circle {
    border: 6px solid #f3f3f3;
    border-radius: 50%;
    border-top: 6px solid #2e8e9a;
    width: 46px;
    height: 46px;
    /* animation-name:load; */
    animation: load 1.5s linear infinite;
    box-sizing: border-box;
  }

  @keyframes load {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
