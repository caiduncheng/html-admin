/**
 * 生产环境
 */
;(function () {
  window.SITE_CONFIG = {}
  // window.SITE_CONFIG['baseUrl'] = `https://toms.newlandnpt.com/`
  // window.SITE_CONFIG['loginUrl'] = 'https://toms.newlandnpt.com/login/'

  window.SITE_CONFIG['baseUrl'] = `https://toms.opennl.com/`
  window.SITE_CONFIG['loginUrl'] = 'https://toms.opennl.com/login/'
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = '.' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain
})()
