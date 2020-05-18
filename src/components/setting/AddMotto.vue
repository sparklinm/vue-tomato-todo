<template>
  <div class="setting-add-motto">
    <SubNav
      @addMotto="addMotto"
      @mottoSetting="showBoxSetMotto=true"
    />
    <div class="sub-main">
      <ul v-if="allMotto.length">
        <li
          v-for="(item, index) in allMotto"
          :key="item"
          class="list-motto-item"
        >
          <ComCell
            :title="item"
            @click-hd="showFullMotto(index)"
          >
            <template #right-icon>
              <ComIcon
                name="trash"
                @click="deleteMotto(index)"
              />
            </template>
          </ComCell>
        </li>
      </ul>
      <div
        v-else
        class="no-motto-tip-container"
      >
        <div class="no-motto-tip">
          <p class="no-motto-icon">
            <ComIcon name="frown-o" />
          </p>
          <p>{{ $t("tips.no_motto_and_add") }}</p>
          <p class="what-motto">
            {{ $t("tips.what_is_motto") }}
          </p>
        </div>
      </div>
    </div>
    <ComPopup
      :show.sync="showBoxAddMotto"
      :title="$t('word.motto')"
      bottom-confirm-btn
      class="box-add-motto"
      :submit="doAddMotto"
    >
      <ComInput
        v-model="curMotto"
        class="input-motto"
        type="textarea"
        :placeholder="$t('settings.input_motto')"
        maxlength="50"
      />
      <template #footer>
        <button
          class="com-popup__footer-btn random-a-motto"
          @click="getRandomSentence"
        >
          {{ $t('settings.random_a_motto') }}
        </button>
      </template>
    </ComPopup>

    <BoxRadioList
      v-model="randomMottoWay"
      class="box-set-motto-way"
      :show.sync="showBoxSetMotto"
      name="motto_way"
      :data="selMottoWay"
      :hide-on-select="false"
      @closed="modifySettings"
    />
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
      allMotto: [],
      curMotto: '',
      showBoxAddMotto: false,
      showBoxSetMotto: false,
      selMottoWay: [
        {
          value: 'system',
          text: this.$t('settings.random_system_motto')
        },
        {
          value: 'custom',
          text: this.$t('settings.random_custom_motto')
        },
        {
          value: 'mixin',
          text: this.$t('settings.random_system_custom_motto')
        }
      ],
      randomMottoWay: ''
    }
  },
  computed: {
    ...mapState('settings', {
      motto: state => state.motto,
      todo: 'todo'
    })
  },

  mounted () {
    this.allMotto = this.motto
    this.randomMottoWay = this.todo.randomMottoWay
  },
  methods: {
    ...mapMutations('settings', {
      storeAddMotto: 'addMotto',
      storeDeleteMotto: 'deleteMotto',
      storeSetTodo: 'setTodo'
    }),
    setAllMotto () {
      this.allMotto = this.motto
    },
    deleteMotto (index) {
      this.$message({
        content: this.$t('message.confirm_delete'),
        title: this.$t('action.delete'),
        options: {
          showCancel: true
        }
      }).then(() => {
        this.storeDeleteMotto(index)
        this.setAllMotto()
      })
    },
    addMotto () {
      this.showBoxAddMotto = true
    },
    doAddMotto (done) {
      if (this.allMotto.includes(this.curMotto)) {
        this.$tips(this.$t('tips.already_add_same_motto'))
        return
      }
      this.storeAddMotto(this.curMotto)
      this.setAllMotto()
      done()
    },
    getRandomSentence () {
      this.curMotto = this.$t(setting.getSentence())
    },
    showFullMotto (index) {
      this.$message({
        title: this.$t('word.tip'),
        content: this.allMotto[index]
      })
    },
    modifySettings () {
      this.storeSetTodo({
        randomMottoWay: this.randomMottoWay
      })
    }
  }
}
</script>

<style lang="less">
.setting-add-motto {
  .sub-main {
    padding: 20px 0;
  }

  .list-motto-item {
    .com-cell {
      padding: 25px 40px;
    }

    .com-icon {
      padding: 5px;
    }

    .com-cell__hd {
      font-size: 16px;
      white-space: nowrap;
      margin-right: 80px;
      overflow: hidden;
    }

    .com-cell__hd-inner {
      width: 100%;
      overflow: hidden;
    }

    .com-cell__bd {
      font-size: 16px;
      color: rgb(75, 75, 75);
    }
  }

  .no-motto-tip {
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;

    p {
      white-space: nowrap;
    }
  }

  .no-motto-tip-container {
    text-align: center;
  }

  .no-motto-icon {
    font-size: 22px;
    margin: 8px 0;
  }

  .what-motto {
    font-style: italic;
    font-size: 12px;
    color: rgb(158, 158, 158);
    letter-spacing: 1px;
  }
}

.box-add-motto {
  .com-popup__content {
    padding: 0;
  }

  .com-popup__footer-btn.random-a-motto {
    margin-top: 12px;
    color: black;
  }

  .input-motto {

    padding: 10px 0 20px;

    .com-input__area {
      padding: 20px 0 20px;
    }
  }
}
</style>
