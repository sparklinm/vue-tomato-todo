<template>
  <div class="setting-login">
    <img
      src="../../assets/login_back.jpg"
      alt=""
      class="background"
    >
    <SubNav />
    <div class="sub-main">
      <div class="login-options">
        <div
          class="login-option"
          @click="loginDefault"
        >
          <img
            src="../../assets/setting/product.png"
            alt=""
            class="login-icon"
          >
          <div>
            {{ $t("settings.use_default_account_login") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import SubNav from '@/components/nav/SubNav'

export default {
  components: {
    SubNav
  },
  methods: {
    ...mapMutations('user', {
      'storeSetUser': 'setUser',
      'storeSetLoginStatus': 'setLoginStatus'
    }),
    loginDefault () {
      this.$loading.show(2000).then(() => {
        const user = {
          headIcon: require('@/assets/user/head.jpg'),
          nickname: this.$t('user.defalut_nickname'),
          accound: '0000000000000000000',
          signature: this.$t('user.defalut_signature'),
          creat: new Date(),
          background: '/background/back5.jpg'
        }

        this.storeSetUser(user)
        this.storeSetLoginStatus(true)
        this.$tips(this.$t('tips.login_successfully'))
        history.back()
      })
    }
  }
}
</script>

<style lang="less">
.setting-login {
  position: fixed;
  width: 100%;
  height: 100%;

  .background {
    position: fixed;
    width: 100%;
    height: 100%;
  }

  .nav.sub-nav {
    background: transparent;
  }

  .login-options {
    position: relative;
    margin-top: 20px;
  }

  .login-option {
    font-size: 13px;
    color: white;
    text-align: center;
  }

  .login-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
  }
}
</style>
