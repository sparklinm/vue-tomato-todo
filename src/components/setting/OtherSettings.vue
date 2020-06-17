<template>
  <div class="my-settings">
    <SubNav />
    <div class="sub-main">
      <div class="other-settings-list">
        <ComCell
          :title="$t('settings.chart_settings')"
          @click.native="showBoxChartSettings=true"
        />
        <ComCell
          :title="$t('settings.clear_cache')"
          @click.native="clearCache"
        />
        <ComCell
          :title="$t('settings.set_language')"
          @click.native="showBoxSetLanguage=true"
        />
        <ComCell
          :title="$t('settings.not_show_completed_plan')"
        >
          <template #right-icon>
            <ComCheckbox
              v-model="curNoShowCompletedPlan"
              class="custom-enable"
              type="custom"
              @change="storeSetNoShowCompletedPlan"
            >
              <div class="custom-enable-btn">
                <div class="dot" />
              </div>
            </ComCheckbox>
          </template>
        </ComCell>
        <ComCell
          :title="$t('settings.exit_login')"
          :lable="$t('settings.exit_login_desc')"
          @click="exitLogin"
        />
      </div>
    </div>

    <ComPopup
      :title="$t('settings.chart_settings')"
      :show.sync="showBoxChartSettings"
      class="box-set-chart"
      top-btn
      :submit="handleChartSettingsChange"
      :close-on-click-mask="false"
      @open="setChartSettings"
    >
      <ComCell
        :title="$t('todo.get_up_clock_distribution')"
      >
        <template #right-icon>
          <ComCheckbox
            v-model="charSettins.showClockChart"
            class="custom-enable"
            type="custom"
          >
            <div class="custom-enable-btn">
              <div class="dot" />
            </div>
          </ComCheckbox>
        </template>
      </ComCell>

      <ComCell
        :title="$t('todo.stop_reason_distribution')"
      >
        <template #right-icon>
          <ComCheckbox
            v-model="charSettins.showStopChart"
            class="custom-enable"
            type="custom"
          >
            <div class="custom-enable-btn">
              <div class="dot" />
            </div>
          </ComCheckbox>
        </template>
      </ComCell>

      <ComToolTip :show.sync="showSelUnit">
        <ComCell
          :title="$t('settings.chart_duration_unit')"
          :lable="$t('settings.chart_duration_unit_desc')"
          :text="$t(`settings.${charSettins.chartDurationUnit}`)"
        />
        <template v-slot:content>
          <div class="drop-list_white drop-list_right">
            <ul>
              <li @click="setDurationUnit('hour')">
                {{ $t("settings.hour") }}
              </li>
              <li @click="setDurationUnit('minute')">
                {{ $t("settings.minute") }}
              </li>
            </ul>
          </div>
        </template>
      </ComToolTip>

      <ComToolTip :show.sync="showSelRange">
        <ComCell
          :title="$t('settings.monthly_statistics_display_range')"
          :text="$t(`settings.${charSettins.monthlyStatisticsDisplayRange}`)"
        >
          <template #lable>
            <div v-html="$t('settings.monthly_statistics_display_range_desc')" />
          </template>
        </ComCell>
        <template v-slot:content>
          <div class="drop-list_white drop-list_right">
            <ul>
              <li @click="setDisplayRange('seven_days')">
                {{ $t("settings.seven_days") }}
              </li>
              <li @click="setDisplayRange('whole_month')">
                {{ $t("settings.whole_month") }}
              </li>
            </ul>
          </div>
        </template>
      </ComToolTip>
    </ComPopup>

    <BoxRadioList
      v-model="curLanguage"
      class="box-set-language fade"
      :title="$t('settings.set_language')"
      :show.sync="showBoxSetLanguage"
      :data="selLanguage"
      name="language"
      :hide-on-select="false"
      @change="setLanguage"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import SubNav from '@/components/nav/SubNav'
import BoxRadioList from '@/components/BoxRadioList'

export default {
  components: {
    SubNav,
    BoxRadioList
  },
  data () {
    return {
      showBoxChartSettings: false,
      charSettins: {
        showClockChart: true,
        showStopChart: true,
        chartDurationUnit: 'minute',
        monthlyStatisticsDisplayRange: 'seven_days'
      },
      showSelUnit: false,
      showSelRange: false,
      showBoxSetLanguage: false,
      curLanguage: 'zh',
      selLanguage: [
        {
          value: 'zh',
          text: this.$t('word.chinese')
        },
        {
          value: 'en',
          text: this.$t('word.english')
        }
      ],
      curNoShowCompletedPlan: false
    }
  },
  computed: {
    ...mapState('settings', {
      chart: state => state.chart,
      language: state => state.language,
      noShowCompletedPlan: state => state.noShowCompletedPlan
    })
  },

  mounted () {
    this.curNoShowCompletedPlan = this.noShowCompletedPlan
  },
  methods: {
    ...mapMutations('settings', {
      storeModifyChart: 'modifyChart',
      storeSetLanguage: 'setLanguage',
      storeSetNoShowCompletedPlan: 'setNoShowCompletedPlan'
    }),
    handleChartSettingsChange (done) {
      this.storeModifyChart(this.charSettins)
      done()
    },
    setChartSettings () {
      this.charSettins = _cloneDeep(this.chart)
    },
    setDurationUnit (val) {
      this.charSettins.chartDurationUnit = val
      this.showSelUnit = false
    },
    setDisplayRange (val) {
      this.charSettins.monthlyStatisticsDisplayRange = val
      this.showSelRange = false
    },
    clearCache () {
      this.$message({
        title: this.$t('word.tip'),
        content: this.$t('message.clear_all_data'),
        options: {
          showCancel: true,
          confirmCountdown: 15
        }
      }).then(() => {
        // 清除数据
      })
    },
    setLanguage (val) {
      this.$message({
        title: this.$t('word.tip'),
        content: this.$t('message.whether_change_language'),
        options: {
          showCancel: true
        }
      }).then(() => {
        this.showBoxSetLanguage = false
        this.$loading.show(2000).then(() => {
          this.$i18n.locale = val
          this.storeSetLanguage(val)
          this.selLanguage = [
            {
              value: 'zh',
              text: this.$t('word.chinese')
            },
            {
              value: 'en',
              text: this.$t('word.english')
            }
          ]
          this.$tips(this.$t('tips.set_successfully'))
        })
      }).catch(() => {
        this.curLanguage = this.language
      })
    },
    exitLogin () {

    }
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

.box-set-chart {
  .com-cell__hd-title {
    font-weight: 600;
  }

  .com-cell__bd-text {
    font-weight: 600;
  }
}
</style>
