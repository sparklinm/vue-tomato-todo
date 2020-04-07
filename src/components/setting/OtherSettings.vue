<template>
  <div class="my-settings">
    <SubNav />
    <div class="sub-main">
      <div class="other-settings-list">
        <ComCell :title="$t('settings.chart_settings')" />
        <ComCell :title="$t('settings.clear_cache')" />
        <ComCell :title="$t('settings.set_language')" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import SubNav from '@/components/nav/SubNav'
import BoxRadioList from '@/components/BoxRadioList'
import setting from '@/js/setting.js'

export default {
  components: {
    SubNav,
    BoxRadioList
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('settings', {
      todoSettings: state => state.todo,
      beeps: state => state.beeps,
      todoMusic: state => state.todoMusic
    })
  },

  mounted () {},
  methods: {
    ...mapMutations('settings', {
      storeSetTodoSettins: 'setTodo',
      storeAddBeep: 'addBeep',
      storeAddTodoMusic: 'addTodoMusic'
    })
  }
}
</script>

<style lang="less">
.other-settings-list {
  background: white;

  .com-cell__hd-title {
    font-weight: 600;
    font-size: 14px;
  }

  .com-cell {
    border-bottom: 1px solid rgb(228, 228, 228);
  }
}
</style>
