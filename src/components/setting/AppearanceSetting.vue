<template>
  <div class="setting-appearance">
    <div class="back" />
    <SubNav @tip="showBoxHelp=true" />
    <div
      ref="main"
      class="sub-main"
    >
      <div
        ref="selSettings"
        class="sel-settins"
      >
        <ComGroup v-model="curSetting">
          <ComRadio
            :content="$t('settings.pomodoro_poster')"
            label="pomodoro_poster"
            name="sel_setting"
          />
          <ComRadio
            :content="$t('settings.main_page_background')"
            label="main_page_background"
            name="sel_setting"
          />
          <ComRadio
            :content="$t('settings.todo_card_background')"
            label="todo_card_background"
            name="sel_setting"
          />
          <ComRadio
            :content="$t('settings.timer_appearance')"
            label="timer_appearance"
            name="sel_setting"
            @click.native="showBoxTimerAppearance = true"
          />
        </ComGroup>
      </div>
      <div
        class="tab-setting"
        :style="{ paddingTop: selSettingsHeight + 'px' }"
      >
        <!-- pomodoro_poster -->

        <div
          v-show="curSetting === 'pomodoro_poster'"
          class="pomodoro-poster-setting settings-list"
        >
          <ComCell
            class="settings-list-item poster-random-mode"
            :title="$t('settings.pomodoro_poster_random_mode')"
            :lable="`${$t('settings.pomodoro_poster_random_mode_desc')}`"
            :text="map[settings.posterRandomMode]"
            :desc="posterRandomModeDesc"
            @click.native="showBoxSetPosterRandomMode = true"
          />
          <ComCell
            class="settings-list-item"
            :title="$t('settings.more_online_poster')"
            :lable="`${$t('settings.more_online_poster_desc')}`"
          >
            <template #right-icon>
              <ComCheckbox
                v-model="settings.morePoster"
                class="custom-enable"
                type="custom"
                @change="handleSettingChange"
              >
                <div class="custom-enable-btn">
                  <div class="dot" />
                </div>
              </ComCheckbox>
            </template>
          </ComCell>

          <div class="btn-add-local-img-container">
            <button
              class="btn-add-local-img"
              @click="uploadTodoPoster"
            >
              {{ $t("settings.click_add_local_img_as_poster") }}
            </button>
          </div>

          <div class="custom-posters">
            <div
              v-show="posters.length"
              class="img-panel"
            >
              <div class="bd">
                <div
                  v-for="(item, index) in posters"
                  :key="item"
                  class="poster-sample-container"
                >
                  <img
                    :src="item"
                    alt=""
                    class="poster-sample"
                  >
                  <ComIcon
                    name="trash-o"
                    class="btn-delete"
                    @click="deletePoster(index)"
                  />
                </div>
              </div>
            </div>

            <div
              v-show="!posters.length"
              class="no-poster-tip tip-text_dark"
            >
              {{ $t("tips.no_local_poster_and_add") }}
            </div>
          </div>
          <BoxRadioList
            v-model="settings.posterRandomMode"
            class="box-radio-poster-mode"
            :show.sync="showBoxSetPosterRandomMode"
            :data="selPosterRandomMode"
            name="random_mode"
            @change="handlePosterRandomModeChange"
          />
        </div>

        <!-- main_page_background -->

        <div
          v-show="curSetting === 'main_page_background'"
          class="main_page_background-setting"
        >
          <div class="img-panel">
            <div class="hd">
              <span class="title lightblue">
                {{ $t("settings.simple") }}
              </span>
              <span class="label-tag label-tag_purple">
                {{ $t("settings.featured") }}
              </span>
            </div>
            <div class="bd">
              <div
                v-for="(item, index) in pageBack.simple"
                :key="item"
                class="background-sample-container"
                @click="setPageBackground(item)"
              >
                <img
                  :src="item"
                  alt=""
                  class="background-sample"
                >
              </div>
            </div>
          </div>
          <div class="img-panel">
            <div class="hd">
              <span class="title pink">
                {{ $t("settings.cute") }}
              </span>
              <span class="label-tag label-tag_purple">
                {{ $t("settings.cooperative_illustrator_works") }}
              </span>
            </div>
            <div class="bd">
              <div
                v-for="(item, index) in pageBack.cute"
                :key="item"
                class="background-sample-container"
                @click="setPageBackground(item)"
              >
                <img
                  :src="item"
                  alt=""
                  class="background-sample"
                >
              </div>
            </div>
          </div>

          <div class="img-panel">
            <div class="hd">
              <span class="title pink">
                {{ $t("word.customize") }}
              </span>
              <span class="label-tag label-tag_purple">
                {{ $t("word.free") }}
              </span>
            </div>
            <div class="bd">
              <div
                class="background-sample-container"
                @click="uploadPageBackground"
              >
                <div class="background-sample blank-img">
                  {{ $t("word.customize") }}
                </div>
              </div>
              <div
                class="background-sample-container"
                @click="setDefaultPageBackground"
              >
                <div class="background-sample blank-img">
                  {{ $t("settings.reset") }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- todo_card_background -->

        <div
          v-show="curSetting === 'todo_card_background'"
          class="settings-list"
        >
          <ComCell
            class="settings-list-item"
            :title="$t('settings.todo_card_background')"
            :text="map[settings.todoCardBackground]"
            @click.native="showBoxTodoCardBackground = true"
          />
          <ComCell
            class="settings-list-item"
            :title="$t('settings.todo_opacity')"
            :text="map[settings.todoOpacity]"
            @click.native="showBoxTodoOpacity = true"
          />
          <ComCell
            class="settings-list-item"
            :title="$t('settings.todo_set_card_background')"
            :text="map[settings.todoSetCardBackground]"
            @click.native="showBoxTodoSetCardBackground = true"
          />
          <ComCell
            class="settings-list-item"
            :title="$t('settings.todo_set_opacity')"
            :text="map[settings.todoSetOpacity]"
            @click.native="showBoxTodoSetOpacity = true"
          />

          <BoxRadioList
            v-model="settings.todoCardBackground"
            :show.sync="showBoxTodoCardBackground"
            :data="selTodoCardBackground"
            name="todo_back"
            @change="handleSettingChange"
          />

          <BoxRadioList
            v-model="settings.todoOpacity"
            :show.sync="showBoxTodoOpacity"
            :data="selTodoOpacity"
            name="todo_opac"
            @change="handleSettingChange"
          />

          <BoxRadioList
            v-model="settings.todoSetCardBackground"
            :show.sync="showBoxTodoSetCardBackground"
            :data="selTodoSetCardBackground"
            name="set_back"
            @change="handleSettingChange"
          />

          <BoxRadioList
            v-model="settings.todoSetOpacity"
            :show.sync="showBoxTodoSetOpacity"
            :data="selTodoSetOpacity"
            name="set_opac"
            @change="handleSettingChange"
          />
        </div>

        <!-- timer_appearance -->
        <div>
          <ComPopup
            :show.sync="showBoxTimerAppearance"
            :title="$t('settings.timer_appearance')"
            class="box-set-timer-appearance"
            :close-on-click-mask="false"
            top-btn
            @closed="curSetting = 'pomodoro_poster'"
          >
            <div class="settings-list">
              <ComCell
                class="settings-list-item help-feedback"
                :title="`${$t('settings.timer_text_size')}`"
                :text="map[settings.timeTextSize]"
                @click.native="showBoxTimeTextSize = true"
              />
              <ComCell
                class="settings-list-item help-feedback"
                :title="`${$t('settings.timer_text_display_style')}`"
                :text="map[settings.timeTextStyle]"
                @click.native="showBoxTimeTextStyle = true"
              >
                <template #lable>
                  <div class="style-examples">
                    <div class="left">
                      <div>
                        <span>
                          {{ $t("settings.common_style_example") }}
                        </span>
                      </div>
                      <div>
                        <span>
                          {{ $t("settings.electronic_clock_example") }}
                        </span>
                      </div>
                      <div>
                        <span>
                          {{ $t("settings.flip_clock_style_example") }}
                        </span>
                      </div>
                    </div>

                    <div class="right">
                      <div class="">
                        <span>
                          22.18
                        </span>
                      </div>
                      <div class="electronic-clock">
                        <span>
                          22.18
                        </span>
                      </div>
                      <div>
                        <span>
                          22.18
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </ComCell>
            </div>
          </ComPopup>
          <BoxRadioList
            v-model="settings.timeTextSize"
            :show.sync="showBoxTimeTextSize"
            :data="selTimeTextSize"
            name="time_text_size"
          />
          <BoxRadioList
            v-model="settings.timeTextStyle"
            :show.sync="showBoxTimeTextStyle"
            :data="selTimeTextStyle"
            name="time_text_style"
          />
        </div>
      </div>
    </div>
    <ComPopup
      :show.sync="showBoxHelp"
      :title="$t('settings.poster_and_background_set_help')"
      class="box-appearance-set-help"
    >
      <ul class="help-list">
        <li @click="showHelp($t('message.what_is_pomodoro_poster'))">
          {{ $t('tips.what_is_pomodoro_poster') }}
        </li>
        <li @click="showHelp($t('message.save_online_poster'))">
          {{ $t('tips.save_online_poster') }}
        </li>
        <li @click="showHelp($t('message.custome_todo_card_background'))">
          {{ $t('tips.custome_todo_card_background') }}
        </li>
      </ul>
    </ComPopup>
    <input
      ref="uploadPageBackground"
      type="file"
      class="upload-image"
      accept="image/*"
      @change="doUploadPageBackground"
    >
    <input
      ref="uploadTodoPoster"
      type="file"
      class="upload-image"
      multiple
      accept="image/*"
      @change="doUploadTodoPoster"
    >
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import setting from '@/js/setting.js'
import SubNav from '@/components/nav/SubNav'
import BoxRadioList from '@/components/BoxRadioList'

export default {
  components: {
    SubNav,
    BoxRadioList
  },
  data () {
    return {
      map: {
        online: this.$t('settings.random_online_poster'),
        local: this.$t('settings.random_local_poster'),
        mixin: this.$t('settings.random_online_and_local'),
        no: this.$t('settings.no'),
        colorful: this.$t('settings.colorful_background'),
        solid: this.$t('settings.solid_color'),
        opaque: this.$t('settings.not_opacity'),
        translucent: this.$t('settings.half_opacity'),
        normal: this.$t('settings.common'),
        larger: this.$t('settings.larger'),
        electronic: this.$t('settings.electronic_clock'),
        flip: this.$t('settings.flip_clock')
      },
      selSettingsHeight: 30,
      curSetting: 'pomodoro_poster',
      showBoxSetPosterRandomMode: false,
      selPosterRandomMode: [
        {
          value: 'online',
          text: this.$t('settings.random_online_poster')
        },
        {
          value: 'local',
          text: this.$t('settings.random_local_poster')
        },
        {
          value: 'mixin',
          text: this.$t('settings.random_online_and_local')
        }
      ],
      settings: {
        posterRandomMode: 'online',
        morePoster: false,
        mainPageBackground: '',
        todoCardBackground: 'colorful',
        todoOpacity: 'opaque',
        todoSetCardBackground: 'solid ',
        todoSetOpacity: 'opaque',
        timeTextSize: 'normal',
        timeTextStyle: 'normal'
      },
      pageBack: setting.getMainImages(),
      showBoxTodoCardBackground: false,
      selTodoCardBackground: [
        {
          value: 'no',
          text: this.$t('settings.no')
        },
        {
          value: 'colorful',
          text: this.$t('settings.colorful_background')
        },
        {
          value: 'solid',
          text: this.$t('settings.solid_color')
        }
      ],
      showBoxTodoOpacity: false,
      selTodoOpacity: [
        {
          value: 'opaque',
          text: this.$t('settings.not_opacity')
        },
        {
          value: 'translucent',
          text: this.$t('settings.half_opacity')
        }
      ],
      showBoxTodoSetCardBackground: false,
      selTodoSetCardBackground: [
        {
          value: 'colorful',
          text: this.$t('settings.colorful_background')
        },
        {
          value: 'solid',
          text: this.$t('settings.solid_color')
        }
      ],
      showBoxTodoSetOpacity: false,
      selTodoSetOpacity: [
        {
          value: 'opaque',
          text: this.$t('settings.not_opacity')
        },
        {
          value: 'translucent',
          text: this.$t('settings.half_opacity')
        }
      ],
      showBoxTimerAppearance: false,
      showBoxTimeTextSize: false,
      selTimeTextSize: [
        {
          value: 'normal',
          text: this.$t('settings.common')
        },
        {
          value: 'larger',
          text: this.$t('settings.larger')
        }
      ],
      showBoxTimeTextStyle: false,
      selTimeTextStyle: [
        {
          value: 'normal',
          text: this.$t('settings.common')
        },
        {
          value: 'electronic',
          text: this.$t('settings.electronic_clock')
        },
        {
          value: 'flip',
          text: this.$t('settings.flip_clock')
        }
      ],
      showBoxHelp: false
    }
  },
  computed: {
    ...mapState('settings', {
      appearanceSettings: state => state.appearance,
      posters: state => state.todoPosters
    }),
    posterRandomModeDesc () {
      if (
        (this.settings.posterRandomMode === 'local' ||
          this.settings.posterRandomMode === 'mixin') &&
        !this.posters.length
      ) {
        return this.$t('tips.no_local_poster_waring')
      }
      return ''
    }
  },

  mounted () {
    this.setSettins()
    this.selSettingsHeight = this.$refs.selSettings.offsetHeight
  },
  methods: {
    ...mapMutations('settings', {
      storeModifyAppearance: 'modifyAppearance',
      storeAddTodoPoster: 'addTodoPoster',
      storeDeleteTodoPoster: 'deleteTodoPoster'
    }),
    setSettins () {
      this.settings = _cloneDeep(this.appearanceSettings)
    },
    handleSettingChange () {
      this.storeModifyAppearance(this.settings)
    },
    handlePosterRandomModeChange () {
      this.handleSettingChange()
    },
    uploadTodoPoster () {
      this.$refs.uploadTodoPoster.click()
    },
    doUploadTodoPoster (e) {
      const files = e.target.files
      const urls = []

      for (let i = 0; i < files.length; i++) {
        urls.push(URL.createObjectURL(files[i]))
      }
      this.storeAddTodoPoster(urls)
      if (this.settings.posterRandomMode === 'online') {
        this.$message({
          title: this.$t('word.tip'),
          content: this.$t('message.add_local_posters')
        })
      }
    },
    deletePoster (index) {
      this.$message({
        title: this.$t('word.tip'),
        content: this.$t('message.confirm_delete'),
        options: {
          showCancel: true
        }
      }).then(() => {
        this.storeDeleteTodoPoster(index)
      })
    },
    setPageBackground (src) {
      this.$message({
        title: this.$t('word.tip'),
        content: this.$t('message.set_page_background'),
        options: {
          showCancel: true
        }
      }).then(() => {
        this.settings.mainPageBackground = src
        this.handleSettingChange()
        this.$loading.show(2000).then(() => {
          this.$router.push({
            path: '/'
          })
        })
      })
    },
    setDefaultPageBackground () {
      this.setPageBackground('')
    },
    uploadPageBackground () {
      this.$refs.uploadPageBackground.click()
    },
    doUploadPageBackground (e) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)

      this.setPageBackground(url)
    },
    showHelp (help) {
      this.$message({
        title: this.$t('word.tip'),
        content: help
      })
    }
  }
}
</script>

<style lang="less">
.setting-appearance {
  height: 100%;

  .back {
    .fixed-full-screen();
    background: rgb(247, 247, 247);
  }

  .sub-main {
    position: relative;
  }

  .sel-settins {
    padding: 10px 10px 0;
    position: fixed;
    background: #f7f7f7;
    z-index: 1;
    width: 100%;
    max-width: 700px;
    box-sizing: border-box;
  }

  .custom-radio {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .custom-radio__text {
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 12px;
    background: white;
  }

  .pomodoro-poster-setting {
    background: transparent;
  }

  .poster-random-mode {
    .com-cell__bd-desc {
      color: red;
    }
  }

  .btn-add-local-img-container {
    text-align: center;
    margin-top: 15px;
    font-size: 12px;
  }

  .btn-add-local-img {
    outline: none;
    padding: 15px 60px;
    border-radius: 15px;
    border: none;
    background-image: linear-gradient(
      to right,
      rgb(56, 192, 255),
      rgb(3, 95, 201)
    );
    box-shadow: 0px 0px 8px 1px rgb(184, 184, 184);
    color: white;
  }

  .custom-posters {
    padding: 15px 5px;
    color: black;

    .img-panel {
      margin: 0 0px;
    }

    .poster-sample-container {
      text-align: center;
      width: 33.3%;
      height: 2rem;
      padding: 0 30px;
      margin-bottom: 15px;
      box-sizing: border-box;
      display: inline-block;
    }

    .poster-sample {
      width: 100%;
      height: 100%;
    }

    .btn-delete {
      font-size: 14px;
      padding: 5px;
      display: inline-block;
    }

    .no-poster-tip {
      text-align: center;
      margin-top: 50px;
    }
  }

  .main_page_background-setting {
    padding: 10px;
  }

  .img-panel {
    padding: 0px 0 15px;

    .hd {
      margin-bottom: 10px;
    }

    .title {
      font-size: 16px;
      font-weight: 600;
    }

    .bd {
      margin: 0 -5px;
      font-size: 0;
    }

    .background-sample-container {
      display: inline-block;
      // padding: 0 5px;
      // margin-bottom: 4px;
      width: 30%;
      text-align: center;
      box-sizing: border-box;

      margin: 0 0.12rem 0.12rem;
      padding-bottom: 48%;
      height: 0;
      position: relative;
    }

    .background-sample {
      // width: 125px;
      // height: 180px;
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      border-radius: 10px;
    }

    .tag {
      display: inline-block;
      padding: 3px 5px;
      border-radius: 4px;
      background: rgb(206, 185, 223);
      color: rgb(72, 0, 131);
      margin-right: 6px;
    }

    .blank-img {
      background: white;
      vertical-align: middle;
    }

    .blank-img::after {
      content: "";
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  }
}

.box-set-timer-appearance {
  .com-popup__header-btn:first-child {
    display: none;
  }

  .style-examples {
    .flex(@justify-content: space-between);
    font-size: 11px;
    letter-spacing: 0;

    span {
      display: inline-block;
      margin-bottom: 10px;
    }

    .electronic-clock {
      font-family: "electronic-clock";
    }
  }

  .settings-list {
    .settings-list-item {
      border: none;
    }

    .com-cell__bd .com-cell__bd-inner {
      color: black;
    }
  }
}

.box-appearance-set-help {
  .com-popup__content {
    padding: 0;
  }

  .help-list {
    font-size: 12px;
    padding: 0 0 10px;

    li {
      padding: 20px 20px 10px;
    }
  }
}
</style>
