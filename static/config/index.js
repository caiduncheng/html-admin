/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {}
  // api接口请求地址

  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.0:8001/nms'
  window.SITE_CONFIG['baseUrl'] = 'https://toms.opennl-dev.com/'         // 授权平台
  window.SITE_CONFIG['coreUrl'] = 'https://toms.opennl-dev.com/'    // tom-mars平台
  window.SITE_CONFIG['developerAdminUrl'] = 'toms.opennl-dev.com/' // 审核服务
  window.SITE_CONFIG['loginUrl'] = 'http://127.0.0.1:8001/#/login'  // 登录
  // window.SITE_CONFIG['coreUrl'] = 'http://127.0.0.1:9401/'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = '.' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain
})()
