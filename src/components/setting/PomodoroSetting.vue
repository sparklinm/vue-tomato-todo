<template>
  <div class="my-settings">
    <SubNav />
    <div class="sub-main">
      <div class="settings-list">
        <div class="settings-list-head">
          <span>{{ $t('settings.common_setting') }}</span>
        </div>
        <ComCell
          class="settings-list-item"
          icon="bell"
          icon-color="red"
          :title="$t('settings.ring_setting')"
          :lable="`${$t('settings.ring_setting_desc')}`"
          @click.native="showBoxRingSetting=true"
        />
        <ComCell
          class="settings-list-item"
          icon="music"
          icon-color="blue"
          :title="`${$t('settings.defalut_back_music')} | ${$t('settings.back_white_noise')}`"
          :lable="`${$t('settings.defalut_back_music_desc')}`"
          @click.native="showBoxMusic=true"
        />
        <ComCell
          class="settings-list-item"
          icon="hourglass-start"
          icon-color="cyan"
          :title="$t('settings.defalut_rest_duration')"
          :text="restDurationText"
          @click.native="setRestDuration"
        />
        <router-link
          to="custom_motto"
          tag="div"
        >
          <ComCell
            class="settings-list-item"
            icon="edit"
            icon-color="yellow"
            :title="$t('settings.custom_tomato_motto')"
            :lable="`${$t('settings.custom_tomato_motto_desc')}`"
          />
        </router-link>
      </div>
      <div class="settings-list">
        <div class="settings-list-head">
          <span>{{ $t('settings.advanced_settings') }}</span>
        </div>
        <ComCell
          class="settings-list-item"
          :title="$t('settings.custom_pause_upper_limit')"
          :text="pauseDurationText"
          @click.native="showBoxPauseDuration=true"
        />
        <ComCell
          class="settings-list-item"
          :title="`${$t('settings.fiexed_sort')}`"
          :lable="$t('settings.fiexed_sort_desc')"
        >
          <template #right-icon>
            <ComCheckbox
              v-model="settings.fixedSort"
              class="custom-enable"
              type="custom"
              @change="handleSettingsChange"
            >
              <div class="custom-enable-btn">
                <div class="dot" />
              </div>
            </ComCheckbox>
          </template>
        </ComCell>
        <ComCell
          class="settings-list-item"
          :title="$t('settings.defalut_check_not_display_when_complete')"
          :lable="$t('settings.defalut_check_not_display_when_complete_desc')"
        >
          <template #right-icon>
            <ComCheckbox
              v-model="settings.hideAfterComplete"
              class="custom-enable"
              type="custom"
              @change="handleSettingsChange"
            >
              <div class="custom-enable-btn">
                <div class="dot" />
              </div>
            </ComCheckbox>
          </template>
        </ComCell>
        <ComCell
          class="settings-list-item"
          :title="$t('settings.after_timer_to_main_page')"
        >
          <template #right-icon>
            <ComCheckbox
              v-model="settings.autoToMainPage"
              class="custom-enable"
              type="custom"
              @change="handleSettingsChange"
            >
              <div class="custom-enable-btn">
                <div class="dot" />
              </div>
            </ComCheckbox>
          </template>
        </ComCell>
      </div>
    </div>

    <ComPopup
      :title="$t('settings.pomodoro_ring_setting')"
      :show.sync="showBoxRingSetting"
      :close-on-click-mask="false"
      class="box-set-ring"
      top-btn
    >
      <ComCell
        :title="$t('settings.after_timer_ring')"
        icon="bell"
      >
        <template #right-icon>
          <ComCheckbox
            v-model="settings.beep"
            class="custom-enable"
            type="custom"
            @change="handleSettingsChange"
          >
            <div class="custom-enable-btn">
              <div class="dot" />
            </div>
          </ComCheckbox>
        </template>
      </ComCell>
      <ComCell
        :title="$t('settings.choose_ring')"
        :text="selectedRing"
        @click.native="showBoxRing=true"
      />
      <ComCell
        :title="$t('settings.ring_volume')"
        :text="$t(`settings.${settings.toneVolume}`)"
        @click.native="showBoxRingVolume=true"
      />
    </ComPopup>

    <BoxRadioList
      v-model="settings.tone"
      class="box-set-ring-type"
      :show.sync="showBoxRing"
      :title="$t('settings.choose_music')"
      :data="rings"
      name="ring_type"
      @change="handleRingTypeChange"
      @closed="uploadBeep"
    />

    <BoxRadioList
      v-model="settings.toneVolume"
      class="box-set-ring-volume-type"
      :show.sync="showBoxRingVolume"
      :title="$t('settings.choose_ring_type')"
      :data="ringVolumeTypes"
      name="ring_volume_type"
      @change="handleSettingsChange"
    />


    <BoxRadioList
      v-model="settings.backgroundMusic"
      class="box-set-music"
      :show.sync="showBoxMusic"
      name="todo_music"
      :data="music"
      :hide-on-select="false"
      @change="handleMusicChange"
    />

    <ComPopup
      :title="$t('settings.custom_rest_duration')"
      :show.sync="showRestDuration"
      class="box-custom-rest-duration"
      bottom-confirm-btn
      :submit="submitSetRestDuration"
      :cancel="cancelSetRestDuration"
      @opened="$refs.inputRestDuration.focus()"
    >
      <ComInput
        ref="inputRestDuration"
        v-model="settings.restDuration"
        :min="0"
        :max="100"
        class="com-input__purple"
      />
    </ComPopup>

    <ComPopup
      :show.sync="showBoxPauseDuration"
      class="box-custom-pause-duration"
      bottom-confirm-btn
      bottom-cancel-btn
      :submit="submitSetPauseDuration"
      :cancel="cancelSetPauseDuration"
      @opened="$refs.inputPauseDuration.focus()"
    >
      <ComInput
        ref="inputPauseDuration"
        v-model="settings.stopUpperLimit"
        :placeholder="$t('settings.custom_pause_upper_limit')"
        :min="1"
        :max="300"
      />
      <p class="tip-text">
        {{ $t('settings.custom_pause_duration_tip') }}
      </p>
    </ComPopup>

    <input
      ref="uploadBeep"
      type="file"
      class="upload-music"
      accept="audio/*"
      @change="doUploadBeep"
    >

    <input
      ref="uploadMusic"
      type="file"
      class="upload-music"
      accept="audio/*"
      @change="doUploadMusic"
    >

    <audio
      ref="audio"
      src=""
    />
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
    return {
      showBoxRingSetting: false,
      settings: {
        beep: true,
        tone: {},
        toneVolume: 'same_volume_media',
        backgroundMusic: {},
        restDuration: 5,
        motto: '',
        stopUpperLimit: 3,
        fixedSort: false,
        hideAfterComplete: false,
        autoToMainPage: true
      },
      showBoxRingVolume: false,
      ringVolumeTypes: [
        {
          value: 'same_volume_media',
          text: this.$t('settings.same_volume_media')
        },
        {
          value: 'same_volume_system',
          text: this.$t('settings.same_volume_system')
        }
      ],
      selectedVolumeType: '',
      showBoxRing: false,
      rings: [],
      selectedRing: '',
      showBoxMusic: false,
      music: [],
      showRestDuration: false,
      restDurationText: '',
      showBoxPauseDuration: false,
      pauseDurationText: ''
    }
  },
  computed: {
    ...mapState('settings', {
      todoSettings: state => state.todo,
      beeps: state => state.beeps,
      todoMusic: state => state.todoMusic
    })
  },

  mounted () {
    Object.assign(this.settings, this.todoSettings)
    this.setRings()
    this.setMusic()
    this.restDurationText = `${this.settings.restDuration} ${this.$t('word.minute')}`
    this.pauseDurationText = `${this.settings.stopUpperLimit} ${this.$t('word.minute')}`
  },
  methods: {
    ...mapMutations('settings', {
      'storeSetTodoSettins': 'setTodo',
      'storeAddBeep': 'addBeep',
      'storeAddTodoMusic': 'addTodoMusic'
    }),
    setMusic () {
      this.music = this.todoMusic.map(item => {
        const obj = {
          value: item,
          text: item.custom ? item.name : this.$t(`music.${item.name}`),
          src: item.src,
          backgroundImg: item.backgroundImg
        }

        if (item.name === this.settings.backgroundMusic.name) {

          obj.text += `(${this.$t('settings.already_selected')})`
          this.settings.backgroundMusic = item
        }
        return obj
      })
      this.music.push({
        value: 'custom',
        text: this.$t('word.customize'),
        src: '',
        backgroundImg: '/music/background/back0.jpg'
      })
    },
    setRings () {
      this.rings = this.beeps.map(item => {
        return {
          value: item,
          text: this.$t(`music.${item.name}`),
          src: item.src
        }
      })
      this.rings.push({
        value: 'custom',
        text: this.$t('word.customize'),
        src: ''
      })
      this.settings.tone = this.beeps.find(item => item.name === this.settings.tone.name) || this.beeps[0]
      this.selectedRing = this.settings.tone.custom ? this.settings.tone.name : this.$t(`music.${this.settings.tone.name}`)
    },
    doUploadBeep (e) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)

      this.$refs.audio.src = url
      const ring = {
        name: file.name,
        src: url,
        custom: true
      }

      this.storeAddBeep(ring)
      this.rings.splice(this.rings.length - 1, 0, {
        value: ring,
        text: file.name,
        src: url
      })
      this.settings.tone = ring
      this.selectedRing = file.name
      this.handleSettingsChange()
    },
    doUploadMusic (e) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)

      this.$refs.audio.src = url
      const music = {
        name: file.name,
        src: url,
        custom: true,
        backgroundImg: setting.getMusicBackground()
      }

      this.storeAddTodoMusic(music)
      this.settings.backgroundMusic = music
      this.handleSettingsChange()
      this.setMusic()
    },
    handleSettingsChange () {
      this.storeSetTodoSettins(this.settings)
      this.showRestDuration = false
    },
    handleRingTypeChange (val) {
      if (val !== 'custom') {
        this.handleSettingsChange()

        this.selectedRing = val.custom ? val.name : this.$t(`music.${val.name}`)
      }
    },
    handleMusicChange (val) {
      if (val !== 'custom') {
        this.handleSettingsChange()
        this.setMusic()
        return
      }

      setTimeout(() => {
        this.$refs.uploadMusic.click()
      }, 200)
    },
    uploadBeep (val) {
      if (val === 'custom') {
        setTimeout(() => {
          this.$refs.uploadBeep.click()
        }, 200)
      }
    },
    setRestDuration () {
      this.showRestDuration = true
    },
    submitSetRestDuration (done) {
      this.handleSettingsChange()
      this.restDurationText = `${this.settings.restDuration} ${this.$t('word.minute')}`
      done()
    },
    cancelSetRestDuration (done) {
      this.settings.restDuration = this.todoSettings.restDuration
      done()
    },
    submitSetPauseDuration (done) {
      this.handleSettingsChange()
      this.pauseDurationText = `${this.settings.stopUpperLimit} ${this.$t('word.minute')}`
      done()
    },
    cancelSetPauseDuration (done) {
      this.settings.stopUpperLimit = this.todoSettings.stopUpperLimit
      done()
    }

  }
}
</script>

<style lang='less'>
.settings-list {

}

.box-set-ring {
  .com-popup__header-btn:first-child {
    display:none;
  }

  .com-popup__content {
    padding: 0;
  }
}

.upload-music {
  width: 0;
}

.box-custom-rest-duration {
  .com-popup__footer .com-popup__footer-btn {
    color: black;
  }
}
</style>
