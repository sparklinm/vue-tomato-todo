<template>
  <div class="setting-modify-me">
    <SubNav />
    <div
      class="user-card"
      :style="{ 'background-image': `url(${curUser.background})` }"
    >
      <div class="user-info-container">
        <img
          :src="curUser.headIcon"
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
          @click.native="showBoxModifyNickname=true"
        />
        <ComCell
          :title="$t('user.modify_signature')"
          @click.native="showBoxModifySignature=true"
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
          @click.native="exitLogin"
        />
      </div>
    </div>

    <ComPopup
      :show.sync="showBoxModifyNickname"
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
        maxlength="10"
      />
    </ComPopup>

    <ComPopup
      :show.sync="showBoxModifySignature"
      no-header
      class="box-modify-signature fade"
      bottom-confirm-btn
      bottom-cancel-btn
      :submit="submitModifySignature"
      :close-on-click-mask="false"
      @closed="signature=''"
      @opened="$refs.inputSignature.focus()"
    >
      <ComInput
        ref="inputSignature"
        v-model="signature"
        :placeholder="$t('user.input_new_signature')"
        maxlength="30"
      />
    </ComPopup>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import SubNav from '@/components/nav/SubNav'
import settins from '@/js/setting.js'

export default {
  components: {
    SubNav
  },
  data () {
    return {
      showBoxModifyNickname: false,
      showBoxModifySignature: false,
      curUser: {
        headIcon: '',
        nickname: '',
        signature: ''
      },
      nickname: '',
      signature: ''
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
      this.curUser = _cloneDeep(this.user)
    },
    handleUserChange () {
      this.storeModifyUser(this.curUser)
    },
    showLengthTip (str, length, tag = 'more', i18n) {
      return settins.showLengthTip.call(this, str, length, tag, i18n)
    },
    submitModifyNickname (done) {
      if (this.showLengthTip(this.nickname, 16) || this.showLengthTip(this.nickname, 1, false)) {
        return
      }
      this.storeModifyUser({
        nickname: this.nickname
      })
      done()
      this.$loading.show(1000).then(() => {
        this.$tips(this.$t('tips.modify_successfully'))
        this.setCurUser()
      })
    },
    submitModifySignature (done) {
      if (this.showLengthTip(this.signature, 25) || this.showLengthTip(this.signature, 1, false)) {
        return
      }
      this.storeModifyUser({
        signature: this.signature
      })
      done()
      this.$loading.show(1000).then(() => {
        this.$tips(this.$t('tips.modify_successfully'))
        this.setCurUser()
      })
    },
    exitLogin () {
      this.$message({
        title: this.$t('word.tip'),
        content: this.$t('message.confirm_exit_account'),
        options: {
          showCancel: true
        }
      }).then(() => {
        const user = {
          headIcon: require('@/assets/setting/product.png'),
          nickname: this.$t('user.not_login'),
          accound: '0000000000',
          signature: this.$t('user.click_default_head_login'),
          creat: new Date(),
          background: require('@/assets/user/user_cover.jpg')
        }

        this.storeSetUser(user)
        this.storeSetLoginStatus(false)
        history.back()
      })
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
    font-size: 12px;
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
