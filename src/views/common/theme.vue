<template>
  <el-form>
    <h2>{{$t('theme.layout')}}</h2>
    <el-form-item :label="$t('theme.navBarType')">
      <el-radio-group v-model="navbarLayoutType">
        <el-radio label="default" border>default</el-radio>
        <el-radio label="inverse" border>inverse</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('theme.sideBarSkin')">
      <el-radio-group v-model="sidebarLayoutSkin">
        <el-radio label="light" border>light</el-radio>
        <el-radio label="dark" border>dark</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('theme.language')">
      <el-select v-model="lang" :placeholder="$t('theme.pSelectLang')">
        <el-option :label="$t('theme.zh')" value="zh-CN"></el-option>
        <el-option :label="$t('theme.en')" value="en-US"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    computed: {
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType },
        set (val) { this.$store.commit('common/updateNavbarLayoutType', val) }
      },
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin },
        set (val) { this.$store.commit('common/updateSidebarLayoutSkin', val) }
      },
      lang: {
        get () {
          return this.$store.state.common.langPick || window.localStorage.getItem('locale')
        },
        set (val) {
          console.log(val)
          this.$i18n.locale = val
          this.$store.commit('common/updateLang', val)
          window.localStorage.setItem('locale', val)
          let langType = 0
          switch (val) {
            case 'zh-CN':
              langType = 0
              break
            case 'en-US':
              langType = 1
              break
          }
          this.saveLangType(langType)
        }
      }
    },
    methods: {
      saveLangType (langType) {
        this.$http({
          url: this.$http.adornUrl(`/sys/user/language/change/${langType}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            console.log(`save languageType success: ${langType}`)
          } else {
            console.error(`save languageType failed`)
          }
        }).catch((e) => {
          if (e.code === 'ECONNABORTED') {
            this.$message.error(e.message)
          }
        })
      }
    }
  }
</script>

