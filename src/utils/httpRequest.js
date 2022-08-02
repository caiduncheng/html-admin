import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import merge from 'lodash/merge'
import {clearLoginInfo} from '@/utils'
import {Loading} from 'element-ui'

const http = axios.create({
  timeout: 1000 * 60,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
var loadinginstace
http.interceptors.request.use(config => {
  // console.log(config.url)
  // window.addEventListener('offline', () => {
  //   console.log(config.url)
  //   if (!navigator.onLine && config.url) {
  //     router.push('../views/common/404')
  //   }
  // })
  if (config.resTimeout) {
    config.timeout = config.resTimeout
  } else {
    config.timeout = 1000 * 60
  }
  // config.headers['X-Token'] = Vue.cookie.get('token') // 请求头带上token
  config.headers['WEB-TOKEN'] = Vue.cookie.get('TOMS_TOKEN') // 请求头带上token
  config.headers['LANG'] = window.localStorage.getItem('locale') || 'en-US'
  config.headers['platCode'] = 'TOMS'

  // debugger
  if (config.loading) {
    if (config.uploading) {
      loadinginstace = Loading.service({
        fullscreen: true,
        text: 'Uploading...',
        background: 'rgba(0, 0, 0, 0.8)',
        spinner: 'el-icon-loading'
      })
    } else {
      loadinginstace = Loading.service({
        fullscreen: true,
        text: 'Waiting for loading',
        background: 'rgba(0, 0, 0, 0.8)',
        spinner: 'el-icon-loading'
      })
    }
  }
  return config
}, error => {
  if (loadinginstace) {
    loadinginstace.close()
  }
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (loadinginstace) {
    loadinginstace.close()
  }
  if (response.data && response.data.code === 400) { // 刷新token失败，需要重新登录
    clearLoginInfo()
    window.location.href = window.SITE_CONFIG['loginUrl']
  }
  return response
}, error => {
  console.log(error.response)
  if (error.response.status === 401) {
    console.log('重新登入')
    clearLoginInfo()
    window.location.href = window.SITE_CONFIG['loginUrl']
    /* if (error.response.data.code === '1092') {
      clearLoginInfo()
      router.push({name: 'login'})
    } */
  }
  if (loadinginstace) {
    loadinginstace.close()
  }
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}
/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornCoreUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  console.log(process.env.NODE_ENV)
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/core/' : window.SITE_CONFIG.baseUrl) + actionName
}

http.adornDeveloperAdminUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/develop/' : window.SITE_CONFIG.baseUrl) + actionName
  // return (window.SITE_CONFIG.coreUrl) + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
