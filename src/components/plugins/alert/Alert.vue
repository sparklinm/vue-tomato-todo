<template>
  <div
    v-show="show"
    class="plu-alert"
  >
    <div class="text">
      番茄todo：{{ message }}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: '',
      show: false
    }
  },
  methods: {

  }
}
</script>

<style lang='less'>
.plu-alert {
  display: inline-block;
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translateX(-50%);
  width: 300px;
  box-sizing: border-box;
  padding: 12px;
  border-radius: 5px;
  background-color: @background-alert;
  font-size: 12px;
  color: white;
}
</style>
