<template>
  <nav
    v-show="showTabBar"
    class="tab-bar"
  >
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
          text: this.$t('word.todo'),
          path: ''
        },
        {
          icon: 'clock-o',
          text: this.$t('word.todo_set'),
          path: 'set'
        },
        {
          icon: 'clock-o',
          text: this.$t('word.statistics'),
          path: 'statistics'
        }
      ]
    }
  },
  computed: {
    showTabBar () {
      const paths = ['/do']
      return !paths.includes(this.$route.path)
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
  border-top: 1px solid @gray-l-m;
  color: @gray-d;

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
