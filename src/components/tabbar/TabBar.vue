<template>
  <nav class="tab-bar">
    <ul class="tab-bar-inner">
      <li
        v-for="item in tabBars"
        :key="item.text"
        class="tab-bar-items"
      >
        <ComIcon
          :name="item.icon"
          :text="item.text"
          @click="toPage(item.path)"
        />
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data () {
    return {
      tabBars: [
        {
          icon: 'clock-o',
          text: '待办',
          path: ''
        },
        {
          icon: 'clock-o',
          text: '待办集',
          path: 'set'
        }
      ]
    }
  },
  mounted () {

  },
  methods: {
    toPage (path) {
      this.$router.push({
        path: `/${path}`
      })
    }
  }
}
</script>

<style lang='less' scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px 0;
  border-top: 1px solid rgb(196, 196, 196);
  color: #5a5a5a;

  .tab-bar-inner {
    .flex(@justify-content: space-between;);
  }

  .tab-bar-items {
    flex: 1;
    .flex(@justify-content: center;);
  }

  .com-icon {
    padding: 0 10px;
  }
}
</style>
