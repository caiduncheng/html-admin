import { parseTime } from '@/utils'

export const dateTimeFilter = time => {
  let format = '{y}/{m}/{d} {h}:{i}:{s}'
  // let lang = localStorage.getItem(store.state.user.keys.storage.lang) || 'en-US'
  // if(lang === 'zh-CN'){
  //   format = '{y}-{m}-{d} {h}:{i}:{s}'
  // }
  return parseTime(time, format)
}

export const dateTimeShortFilter = time => {
  let format = '{y}/{m}/{d} {h}:{i}'
  // let lang = localStorage.getItem(store.state.user.keys.storage.lang) || 'en-US'
  // if(lang === 'zh-CN'){
  //   format = '{y}-{m}-{d} {h}:{i}'
  // }
  return parseTime(time, format)
}
export const timeFilter = time => parseTime(time, '{h}:{i}:{s}')
export const dateFilter = time => {
  let format = '{y}/{m}/{d}'
  // let lang = localStorage.getItem(store.state.user.keys.storage.lang) || 'en-US'
  // if(lang === 'zh-CN'){
  //   format = '{y}-{m}-{d}'
  // }
  return parseTime(time, format)
}
