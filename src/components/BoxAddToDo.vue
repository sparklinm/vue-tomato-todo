<template>
  <div class="box-add-todo">
    <div class="mask" />
    <div class="title">
      <div class="text">
        添加待办
      </div>
      <div class="btn-option">
        <span>确定</span>
        <span>取消</span>
      </div>
    </div>
    <div class="input-name">
      222
    </div>
    <div class="config-todo">
      33
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style lang="less">
.box-add-todo {
  width: 400px;
  height: 300px;
  position: fixed;
  z-index: 150;
  .title {
    .flex(@align-items: center);
    .btn-option {
      .flex(@align-items: center);
    }
  }
}
</style>
