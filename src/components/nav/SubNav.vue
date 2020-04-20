<template>
  <nav class="nav-wrap">
    <div
      class="sub-nav nav"
    >
      <div class="left">
        <ComIcon
          name="arrow-left"
          class="sub-nav__return-icon"
          @click="returnLastPage"
        />
        {{ title }}
      </div>
      <div class="right">
        <ComIcon
          v-if="['custom_motto'].includes(path)"
          name="plus"
          @click="$emit('addMotto')"
        />

        <ComIcon
          v-if="['custom_motto'].includes(path)"
          name="cog"
          @click="$emit('mottoSetting')"
        />

        <ComIcon
          v-if="['appearance_setting'].includes(path)"
          name="question-circle"
          @click="$emit('tip')"
        />
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    path () {
      return this.$route.path.slice(1)
    },
    title () {
      const maps = {
        todo: this.$t('word.todo'),
        set: this.$t('word.todo_set'),
        statistics: this.$t('word.statistics'),
        time_axis: this.$t('todo.history_record_time_axis'),
        future_plan: this.$t('plan.future_plan'),
        me: this.$t('menu.my'),
        pomodoro_setting: this.$t('menu.pomodoro_setting'),
        custom_motto: this.$t('menu.custom_pomodoro_motto'),
        appearance_setting: this.$t('menu.poster_and_appearce_setting'),
        other_setting: this.$t('menu.other_settings'),
        login: this.$t('word.login'),
        modify_me: this.$t('menu.me')
      }

      return maps[this.path]
    }
  },
  methods: {
    returnLastPage () {
      history.back()
    }
  }
}
</script>

<style lang='less'>
.sub-nav__return-icon {
  font-size: 20px;
  margin-right: 10px;
}
</style>
