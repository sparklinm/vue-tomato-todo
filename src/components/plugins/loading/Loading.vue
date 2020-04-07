<template>
  <div
    v-show="showLoading"
    class="loading"
  >
    <div class="loading-mask" />
    <div class="spinner-container">
      <div class="spinner">
        <div class="dot1" />
        <div class="dot2" />
      </div>
    </div>
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
      this.showLoading = true
      if (duration >= 0) {
        setTimeout(() => {
          this.showLoading = false
        }, duration)
      }
    },
    hide () {
      this.showLoading = false
    }
  }
}
</script>

<style lang="less">
.loading {
  .fixed-full-screen();
  z-index: 12345;

  .loading-mask {
    .fixed-full-screen();
    background-color: rgb(0, 0, 0);
    opacity: 0.2;
  }

  .spinner-container {
    .center-position();
  }

  .spinner {
    width: 90px;
    height: 90px;
    text-align: center;
    -webkit-animation: rotate 2s infinite linear;
    animation: rotate 2s infinite linear;
  }

  .dot1,
  .dot2 {
    width: 60%;
    height: 60%;
    display: inline-block;
    position: absolute;
    top: 0;
    background-color: #cfbe22;
    border-radius: 100%;

    -webkit-animation: bounce 2s infinite ease-in-out;
    animation: bounce 2s infinite ease-in-out;
  }

  .dot2 {
    top: auto;
    bottom: 0px;
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }

  @-webkit-keyframes rotate {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }

  @-webkit-keyframes bounce {
    0%,
    100% {
      -webkit-transform: scale(0.5);
    }
    50% {
      -webkit-transform: scale(1);
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: scale(0);
      -webkit-transform: scale(0);
    }
    50% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
}
</style>
