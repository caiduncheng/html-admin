import Vue from 'vue'
import { refreshTokenLogin } from '@/utils'

const vue = new Vue()
export default (url = '', data = {}, method = 'GET', outterConfigObj = {}) => {
  return new Promise((resolve, reject) => {
    let config = { header: {}, timeout: null, openDefultdata: true, uploading: false, loadding: false }
    var configObj = Object.assign({}, config, outterConfigObj)
    method = method ? method.toUpperCase() : 'GET'
    let adornParams = vue.$http.adornParams(data)
    let adornData = configObj.header['Content-Type'] ? data : vue.$http.adornData(data, configObj.openDefultdata)
    let adUrl = ''
    const urlArray = url.split(/\//ig)
    if (process.env.NODE_ENV !== 'production') {
      // console.log(urlArray)
      if (urlArray[0] === 'online' && (urlArray[1] === 'authorization' || urlArray[1] === 'billing')) {
        adUrl = vue.$http.adornUrl(url)
      } else if (urlArray[0] === 'online' && urlArray[1] === 'developer-admin') {
        adUrl = vue.$http.adornDeveloperAdminUrl(url)
      } else if (urlArray[0] === 'online' && urlArray[1] === 'management') {
        adUrl = vue.$http.adornCoreUrl(url)
      } else {
        adUrl = vue.$http.adornUrl(url)
      }
    } else {
      adUrl = vue.$http.adornUrl(url)
    }
    // debugger
    // console.log(adUrl)
    vue.$http({
      // url: vue.$http.adornUrl(url),
      url: adUrl,
      method,
      params: method === 'GET' ? adornParams : null,
      data: method === 'POST' || 'DELETE' ? adornData : null,
      headers: configObj.header,
      resTimeout: configObj.timeout,
      uploading: configObj.uploading,
      loadding: configObj.loadding
    }).then((data) => {
      // if (data && (data.code === 200 || data.code === 0)) {
      //   resolve(data)
      // } else if (data && data.code === 401) {
      //   refreshTokenLogin()
      // } else {
      //   reject(data)
      //   if (data.msg) vue.$message.error(data.msg)
      //   else vue.$message.error('Request Failure')
      // }
      if (data.status === 200) {
        resolve(data.data)
      } else {
        reject(data)
        if (data.message) vue.$message.error(data.message)
        else vue.$message.error('Request Failure')
      }
    }).catch(err => {
      if (err.response && err.response.status === 401) {
        refreshTokenLogin()
      }
      if (err.response && err.response.data) {
        reject(err.response.data.message)
        // vue.$message.error(`code:${err.response.data.code},msg:${err.response.data.message}`)
        vue.$message.error(`${err.response.data.message}`)
      } else {
        reject(err.message)
        vue.$message.error(err.message)
        console.log(err)
      }
    })
  })
}
