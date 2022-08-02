import Vue from 'vue'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth, getChEnName, strToDate } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ptLocale from 'element-ui/lib/locale/lang/pt-br'
import locale from 'element-ui/lib/locale'
// 引入echarts
import echarts from 'echarts'
import './icons/iconfont.css'
import './icons/iconfont-other.css'
import Base64 from '@/utils/base64'
import '@/components/ding-el-components'
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
// import particles from 'particles.js'
// Vue.use(particles)
// Vue.component('DingHeader', DingHeader)

// const echarts = require('echarts')
Vue.prototype.$echarts = echarts

Vue.use(VueI18n)
// Vue.use(mavonEditor)

const i18n = new VueI18n({
  // locale: 'en-US', // 语言标识
  locale: window.localStorage.getItem('locale') || 'en-US', // 语言标识
  // locale: window.localStorage.getItem('locale') || 'zh-CN', // 语言标识
  messages: {
    'zh-CN': Object.assign(zhLocale, require('./lang/zh')),
    'en-US': Object.assign(enLocale, require('./lang/en')),
    'pt-BR': Object.assign(ptLocale, require('./lang/pt'))
  }
})

locale.i18n((key, value) => i18n.t(key, value))

Vue.use(VueCookie)
Vue.config.productionTip = false

// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
// if (process.env.NODE_ENV !== 'production') {
//   require('@/mock/index')
// }

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法
Vue.prototype.getChEnName = getChEnName     // 中英文名
Vue.prototype.strToDate = strToDate // yyyyMMddHHmmss时间转yyyy/MM/dd HH:mm:ss
// Vue.prototype.$echarts = echarts
Vue.prototype.$Base64 = Base64
// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
