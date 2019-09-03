<template>
  <div class="list-item-todo">
    <div class="left">
      <div class="name">
        习惯
      </div>
      <div class="card">
        <span class="description">描述</span>
        <ul class="progress">
          <li>进度1</li>
          <li>进度2</li>
        </ul>
      </div>
    </div>
    <div class="right">
      <span class="deadline">距计划结束:3天</span>
      <span class="btn-start">开始</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '待办事件'
    },
    description: {
      type: String,
      default: '普通番茄时钟'
    },
    progress: {
      type: Number,
      default: 0
    },
    deadline: {
      type: String,
      default: '距离结束:365天'
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  mounted: {

  },
  methods: {


  }
}
</script>

<style>

</style>
