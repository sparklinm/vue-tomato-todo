<template>
  <div class="nav">
    <div class="left">
      待办
    </div>
    <div class="right">
      <span>
        <i
          class="fa fa-clock-o"
          aria-hidden="true"
        />
      </span>
      <span @click="addToDo">添加</span>
      <span>更多</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    addToDo () {
      this.$store.commit('toggleBoxAddToDo', true)
    }

  }
}
</script>

<style lang='less'>
.nav {
  padding: 18px 15px;
  font-size: 14px;
  color: white;
  .flex(@align-items: center;@justify-content: space-between;);

  .right {

    span {
      // margin-left: 5px;
      padding: 5px;
    }
  }
}
</style>
