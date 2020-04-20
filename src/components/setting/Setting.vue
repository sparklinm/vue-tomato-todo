<template>
  <div class="my-settings">
    <div
      class="settings-user-card"
      :style="{'background-image':`url(${userCardBackground})`}"
      @click.self="uploadImage"
    >
      <div
        class="user-info"
        @click="handleUserClick"
      >
        <img
          :src="user.headIcon"
          alt=""
          class="user-head-icon"
        >
        <div class="user-name">
          {{ user.nickname }}
        </div>
        <div class="user-signature">
          {{ user.signature }}
        </div>
      </div>
      <div class="focus-info">
        <span class="tag">{{
          $t("todo.total_focus_0_days", [focusDays.total])
        }}</span>
        <span class="tag">{{
          $t("todo.continue_focus_0_days", [focusDays.continuation])
        }}</span>
      </div>
      <input
        ref="upload"
        type="file"
        class="upload-image"
        accept="image/*"
        @change="doUploadImage"
      >
    </div>
    <div class="settings-list">
      <router-link
        to="pomodoro_setting"
        tag="div"
      >
        <ComCell
          class="settings-list-item core-settins"
          icon-color="purple"
          icon="clock-o"
          :title="$t('settings.pomodoro_core_settings')"
          :lable="`${$t('settings.ring')} | ${$t('settings.custom_language')} | ${$t('settings.rest_duration')}`"
        />
      </router-link>
      <router-link
        to="appearance_setting"
        tag="div"
      >
        <ComCell
          class="settings-list-item appearance-settings"
          icon="image"
          icon-color="red"
          :title="$t('settings.appearance_settings')"
          :lable="`${$t('settings.pomodoro_poster')} | ${$t('settings.todo_card_background')} | ${$t('settings.timer_appearance')}`"
        />
      </router-link>
      <ComCell
        class="settings-list-item configure-bottom-bar"
        icon="th-large"
        icon-color="yellow"
        :title="$t('settings.configure_bottom_bar')"
        :lable="`${$t('settings.choose_display_module')}`"
        @click.native="setDisplayModule"
      />
      <ComCell
        class="settings-list-item custom-theme-color"
        icon="tachometer"
        icon-color="red"
        :title="$t('settings.custom_theme_color')"
        @click.native="shoBoxTheme=true"
      >
        <template #right-icon>
          <div
            class="current-theme-color"
          />
        </template>
      </ComCell>
      <router-link
        to="other_setting"
        tag="div"
      >
        <ComCell
          class="settings-list-item other-settings"
          icon="gears"
          icon-color="green"
          :title="$t('settings.other_settings')"
          :lable="`${$t('settings.language_settings')}`"
        />
      </router-link>
    </div>

    <div class="settings-list">
      <ComCell
        class="settings-list-item help-feedback"
        icon="question-circle"
        icon-color="yellow"
        :title="`${$t('settings.help')} | ${$t('settings.feedback')}`"
        :lable="`${$t('settings.common_question_and_answer')}`"
      />
    </div>
    <ComPopup
      :show.sync="shoBoxDisplayModule"
      :title="$t('settings.custom_main_page_module')"
      class="box-set-display-module"
      :submit="submitSetDisplayModule"
      :close-on-click-mask="false"
      top-btn
    >
      <ComCell
        v-for="m in allModules"
        :key="m.name"
        :title="$t(`settings.${m.name}`)"
      >
        <template #right-icon>
          <ComCheckbox
            v-model="m.show"
            class="custom-enable"
            type="custom"
          >
            <div class="custom-enable-btn">
              <div class="dot" />
            </div>
          </ComCheckbox>
        </template>
      </ComCell>
    </compopup>

    <ComPopup
      :show.sync="shoBoxTheme"
      :title="$t('settings.choose_you_like_theme')"
      class="box-set-theme fade"
      :close-on-click-mask="false"
      top-btn
    >
      <div class="theme-colors">
        <div
          v-for="theme in themes"
          :key="theme.color"
          class="color-sample-container"
        >
          <div
            class="color-sample"
            :style="{background:theme.color}"
            @click="setTheme(theme)"
          />
        </div>
      </div>
    </compopup>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import todo from '@/js/todo'
import util from '@/js/util'

export default {
  data () {
    return {
      shoBoxDisplayModule: false,
      shoBoxTheme: false,
      allModules: []
    }
  },
  computed: {
    ...mapState('user', {
      user: state => state.user,
      isLogin: state => state.isLogin
    }),
    ...mapState('todo', {
      focus: state => state.focus
    }),
    ...mapState('settings', {
      modules: state => state.modules,
      themes: state => state.themes
    }),
    focusDays () {
      const data = todo.formatFocus(this.focus)
      const days = Object.keys(data)

      return {
        total: days.length,
        continuation: util.getContinueDays(days.map(day => parseInt(day)))
      }
    },
    userCardBackground () {
      return this.user.background
    }
  },
  mounted () {

  },
  methods: {
    ...mapMutations('user', {
      storeModifyUser: 'modifyUser'
    }),
    ...mapMutations('settings', {
      storeSetModules: 'setModules'
    }),
    setAllModule () {
      this.allModules = _.cloneDeep(this.modules)
    },
    uploadImage () {
      this.$message({
        title: this.$t('settings.change_cover'),
        content: this.$t('message.change_cover'),
        options: {
          showCancel: true
        }
      }).then(() => {
        this.$refs.upload.click()
      })
    },
    doUploadImage (e) {
      const files = e.target.files
      const url = URL.createObjectURL(files[0])

      this.storeModifyUser({
        background: url
      })
    },
    handleUserClick () {
      if (!this.isLogin) {
        this.$router.push({
          path: 'login'
        })
        return
      }
      this.$router.push({
        path: 'modify_me'
      })
    },
    setDisplayModule () {
      this.shoBoxDisplayModule = true
      this.setAllModule()
    },
    submitSetDisplayModule (done) {
      this.storeSetModules(this.allModules)
      done()
    },
    setTheme (theme) {
      // this.$loading.show()
      this.$message({
        title: this.$t('word.tip'),
        content: this.$t('message.whether_change_theme'),
        options: {
          showCancel: true
        }
      }).then(() => {
        this.shoBoxTheme = false
        this.$loading.show(2000).then(() => {
          document.body.className = theme.class
          this.$tips(this.$t('tips.set_successfully'))
        })
      })
    }
  }
}
</script>

<style lang='less'>
.my-settings {
  background: rgb(240, 246, 248);
  // min-height: 100%;
}

.settings-user-card {
  padding: 15px 0 10px 25px;
  background-size: 100% 100%;
  color: white;

  .user-info,.focus-info {
    display: inline-block;
    vertical-align: middle;
  }

  .focus-info {
   margin-left: -15px;
  }

  .user-head-icon {
    width: 60px;
    height: 60px;
    border-radius: 50% 50%;
  }

  .user-name {
    font-size: 16px;
    margin-top: 12px
  }

  .user-signature {
    font-size: 12px;
    margin-top: 12px;
  }

  .tag {
    display: inline-block;
    padding: 3px 5px;
    border-radius: 4px;
    background: rgb(238, 201, 201);
    color: rgb(173, 11, 11);
    margin-right: 6px;
  }

  .upload-image {
    width: 0;
  }
}

.box-set-display-module {
  .com-cell__hd-title {
    font-size: 14px;
    font-weight: 600;
  }
}

.box-set-theme {
  .com-popup__header-text {
    font-size: 14px;
  }

  .com-popup__content {
    padding: 15px 10px;
    margin-bottom: -20px;
  }

  .color-sample-container {
    display: inline-block;
    width: 20%;
    text-align: center;
    margin-bottom: 20px;
  }

  .color-sample {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50% 50%;
  }
}
</style>
