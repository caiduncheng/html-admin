import json from '@/assets/static/country.json'
export function formatCountry (code) {
  let language = window.localStorage.getItem('locale')
  if (language === null) {
    language = 'en-US'
  }
  for (let i = 0; i < json.length; i++) {
    if (json[i]['countryCode3'] === code) {
      if (language === 'en-US') {
        return json[i]['countryNameEn']
      } else if (language === 'zh-CN') {
        return json[i]['countryNameZh']
      } else {
        return json[i]['countryNameEn']
      }
    }
  }
  return code
}
