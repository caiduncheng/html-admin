<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" >
        <span class="pointer zhedie" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </span>
        <a class="site-navbar__brand-lg" href="javascript:;">TOMS</a>
        <a class="site-navbar__brand-mini" href="javascript:;"></a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">

      <el-menu
        class="site-navbar__menu site-navbar__menu--right horiz"
        mode="horizontal"
        >

        <el-menu-item index="0">
          <el-dropdown class="site-navbar__avatar-dropdown" :show-timeout="0" placement="bottom" trigger="click">
            <div class="el-dropdown-link">
               <i class="el-icon-setting site-navbar__menu-icon"></i>
            </div>
            <el-dropdown-menu slot="dropdown" class="dropdown">
              <el-dropdown-item class="lang" v-for="item in langList" :key="item.val" @click.native="() => changeLanguage(item.val)">
                <div class="flex" style="align-items: center;" >
                  <icon-svg style="font-size:1rem;margin-right:10px;" name="language"></icon-svg>
                  <!-- <span class="lang" style="font-size:0.9rem;">language</span>  -->
                  <span>{{item.label}}</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-drawer
            :with-header="false"
            custom-class="lang-drawer ding-el-dialog"
            title="language"
            :visible.sync="langDrawer"
            direction="rtl"
            append-to-body
            destroy-on-close
            :before-close="cancelChangeLang">
            <div class="ding-drawer-header flex">
              <el-button @click="cancelChangeLang()" class="cancel">Cancel</el-button>
              <span class="title">Language</span>
              <el-button @click="confirmChangeLang()" class="confirm" :type="changeLang ? 'primary' : 'info'" :disabled="!changeLang">Done</el-button>
            </div>
            <div class="ding-drawer-body">
              <el-radio-group class="radio_style" @change="handleChangeLang" v-model="lang">
                <el-radio v-for="item in langList" :key="item.val" :label="item.val"><span>{{item.label}}</span>  <i :class="lang === item.val ? 'el-icon-check' : ''"></i></el-radio>
              </el-radio-group>
            </div>
          </el-drawer>

        </el-menu-item>
<!--        <el-menu-item index="1">
          <el-badge is-dot type="warning">
            <i class="el-icon-chat-dot-round site-navbar__menu-icon" ></i>
          </el-badge>
        </el-menu-item>
        <el-menu-item index="2" style="border-right: 1px #3263a1 solid;">
          <i class="el-icon-s-grid site-navbar__menu-icon"></i>
        </el-menu-item>-->

        <el-menu-item class="site-navbar__avatar" index="3">
          <!-- trigger="click" -->
          <el-dropdown class="site-navbar__avatar-dropdown" :show-timeout="0" placement="bottom" trigger="click">
            <div class="el-dropdown-link">
              <span class="user-avatar">
                <img src="~@/assets/img/profile.jpeg" :alt="userName">
              </span>
              <div style="display:flex;flex-direction: column;margin-top:20px">
                <p class="account-name">{{userName}}</p>
<!--                <p class="account-desc">Marketing Manager</p>-->
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
<!--              <el-dropdown-item @click.native="updatePersonalHandle()">
                <icon-svg style="color:#a6abbd;margin-right:5px;" name="admin"></icon-svg>
                Profile
              </el-dropdown-item>-->
              <el-dropdown-item @click.native="updatePasswordHandle()">{{ $t('bar.changePsw') }}</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()" >{{ $t('bar.logout') }}</el-dropdown-item>
<!--              <el-dropdown-item :divided="true">Help Center</el-dropdown-item>
              <el-dropdown-item >Ask Forum</el-dropdown-item>
              <el-dropdown-item >Keyboard Shortcuts</el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>

    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
import UpdatePassword from './main-navbar-update-password'
import { clearLoginInfo } from '@/utils'
import { logout } from '@/api'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      updatePassowrdVisible: false,
      changeLang: false,
      langDrawer: false,
      lang: 'en-US',
      langList: [
        {val: 'en-US', label: 'English'},
        {val: 'zh-CN', label: '中文'},
        {val: 'pt-BR', label: 'Português'}
        /* ,
        {val: 'jp', label: '日本語'},
        {val: 'ko', label: '한국어 공부 해 요.'} */
      ]
    }
  },
  components: {
    UpdatePassword
  },
  computed: {
    ...mapState('user', {
      userName: state => state.name
    }),
    navbarLayoutType: {
      get () { return this.$store.state.common.navbarLayoutType }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold },
      set (val) { this.$store.commit('common/updateSidebarFold', val) }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
    userName: {
      get () { return this.$store.state.user.name }
    },
    name: {
      get () { return this.$store.state.user.realUserName }
    }
  },
  methods: {
    cancelChangeLang (done) {
      this.changeLang = false
      this.langDrawer = false
    },
    changeLanguage (lang) {
      this.lang = lang
      this.$i18n.locale = lang
      window.localStorage.setItem('locale', this.lang)
      // this.$refs.
    },
    confirmChangeLang () {
      this.$i18n.locale = this.lang
      window.localStorage.setItem('locale', this.lang)
      this.cancelChangeLang()
    },
    handleChangeLang (val) {
      this.lang = val
      this.$i18n.locale = this.lang
      window.localStorage.setItem('locale', this.lang)
    },
    // 退出
    logoutHandle () {
      this.$confirm(this.$t('bar.conExit'), this.$t('bar.prompt'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        logout().then(data => {
          if (data) {
            clearLoginInfo()
            window.location.href = window.SITE_CONFIG['loginUrl']
            // this.$router.push({ name: 'login' })
          }
        })
      })
    },
    // 修改密码
    updatePasswordHandle () {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    }
  }
}
</script>

<style lang="scss">
 .lang-drawer {
   .ding-drawer-body {
    .el-radio__label {
      display: flex;
      align-items: center;
      span {width: 80%}
    }
   }
 }
</style>

<style lang="scss" scoped>
  .dropdown {
    .lang {
      font-size: 0.9rem;
    }
  }
</style>


