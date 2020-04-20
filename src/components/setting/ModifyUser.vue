<template>
  <div class="setting-modify-me">
    <SubNav />
    <div
      class="user-card"
      :style="{ 'background-image': `url(${curUser.background})` }"
    >
      <div class="user-info-container">
        <img
          :src="user.headIcon"
          alt=""
          class="user-head-icon"
        >
        <div class="user-info">
          <div class="user-account">
            {{ $t('user.account') }}: {{ curUser.accound }}
          </div>
          <div class="user-name">
            {{ $t('user.nickname') }}: {{ curUser.nickname }}
          </div>
          <div class="user-signature">
            {{ $t('user.signature') }}: {{ curUser.signature }}
          </div>
        </div>
        <div class="account-tip">
          {{ $t('user.system_default_account') }}
        </div>
        <input
          ref="upload"
          type="file"
          class="upload-image"
          accept="image/*"
        >
      </div>
    </div>

    <div class="sub-main">
      <div class="modify-user-list">
        <ComCell
          :title="$t('user.modify_nickname')"
          @click.native="showBoxModify=true"
        />
        <ComCell
          :title="$t('user.modify_signature')"
          @click.native="showBoxChartSettings=true"
        />
        <!-- <ComCell
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
        </ComCell> -->
        <ComCell
          :title="$t('settings.exit_login')"
          @click="exitLogin"
        />
      </div>
    </div>

    <ComPopup
      :show.sync="showBoxModify"
      no-header
      class="box-modify-nickname fade"
      bottom-confirm-btn
      bottom-cancel-btn
      :submit="submitModifyNickname"
      :close-on-click-mask="false"
      @closed="nickname=''"
      @opened="$refs.inputNickname.focus()"
    >
      <ComInput
        ref="inputNickname"
        v-model="nickname"
        :placeholder="$t('user.input_new_nickname')"
      />
    </ComPopup>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import setting from '@/js/setting.js'
import SubNav from '@/components/nav/SubNav'
import BoxRadioList from '@/components/BoxRadioList'

export default {
  components: {
    SubNav
  },
  data () {
    return {
      showBoxModify: true,
      curUser: {
        headIcon: '',
        nickname: '',
        signature: ''
      },
      nickname: ''
    }
  },
  computed: {
    ...mapState('user', {
      user: state => state.user,
      isLogin: state => state.isLogin
    })
  },

  mounted () {
    this.setCurUser()
  },
  methods: {
    ...mapMutations('user', {
      storeSetUser: 'setUser',
      storeSetLoginStatus: 'setLoginStatus',
      storeModifyUser: 'modifyUser'
    }),
    setCurUser () {
      this.curUser = _.cloneDeep(this.user)
    },
    handleUserChange () {
      this.storeModifyUser(this.curUser)
    },
    submitModifyNickname (done) {
      this.storeModifyUser({
        nickname: this.nickname
      })
      done()
      this.$loading.show(1000).then(() => {
        this.$tips(this.$t('tips.modify_successfully'))
        this.setCurUser()
      })
    },
    exitLogin () {

    }
  }
}
</script>

<style lang="less">
.setting-modify-me {
  .user-card {
    padding: 50px 0;
    background-size: 100% 100%;
    color: white;
    position: relative;
  }

  .user-info-container {
    text-align: center;
  }

  .user-head-icon {
    width: 70px;
    height: 70px;
    border-radius: 50% 50%;
    vertical-align: middle;
    margin-right: 20px;
  }

  .user-info {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    font-size: 12px;

    div:not(:last-child) {
      margin-bottom: 12px;
    }
  }

  .account-tip {
    position: absolute;
    right: 20px;
    bottom: 10px;
    font-size: 10px;
  }

  .upload-image {
    width: 0;
    height: 0;
  }

  .modify-user-list {
    .com-cell {
      padding: 20px;
    }

    .com-cell__hd-title {
      font-weight: 600;
    }
  }
}

.box-modify-nickname {
  .com-input {
    font-size: 16px;
  }
}
</style>
