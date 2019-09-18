<template>
  <div class="list-item">
    <div class="left">
      <div class="name">
        习惯
      </div>
      <div class="card">
        <span class="description">描述</span>
        <ul class="progress">
          <li>
            <slot name="progressBar" />
          </li>
          <li>进度1</li>
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
  mounted () {

  },
  methods: {

  }
}
</script>

<style lang="less">

.list-item {
  padding: 15px 15px 5px;
  background-color: rgb(49, 159, 202);
  color: white;
  border-radius: 3px;
  .flex(@justify-content: space-between);

  .left {
    .flex(@flex-direction: column);

    .name {
      // font-weight: 600;
    }

    .card {
      margin-top: 15px;
      font-size: 12px;
      .flex(@align-items: center);

      .progress {
        list-style: none;
        margin: 0;
        padding-left: 25px;
        .flex(@align-items: center);

        li {
          margin-right: 10px;
        }
      }
    }
  }

  .right {
    position: relative;
    .flex(@align-items: center; @flex-direction: column;);

    .deadline {
      font-size: 10px;
      margin-top: -5px;
    }

    .btn-start {
      font-size: 16px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
