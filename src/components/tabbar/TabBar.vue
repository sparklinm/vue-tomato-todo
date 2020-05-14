<template>
  <div class="tab-bar-wrap">
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabBars: [
        {
          icon: 'bars',
          text: this.$t('word.todo'),
          path: ''
        },
        {
          icon: 'tasks',
          text: this.$t('word.todo_set'),
          path: 'set'
        },
        {
          icon: 'pie-chart',
          text: this.$t('word.statistics'),
          path: 'statistics'
        },
        {
          icon: 'sliders',
          text: this.$t('word.time_axis'),
          path: 'time_axis'
        },
        {
          icon: 'space-shuttle',
          text: this.$t('word.future_plan'),
          path: 'future_plan'
        },
        {
          icon: 'user',
          text: this.$t('menu.my'),
          path: 'me'
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
  height: 56px;
  box-sizing: border-box;
  border-top: 1px solid @gray-l-m;
  color: @gray-d;
  background: white;

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
