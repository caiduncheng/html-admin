export function legalAppName (s) {
  // return /^[\u4e00-\u9fa5]{1,6}|[a-zA-Z]{1,12}$/.test(s)
  return /^[a-zA-Z]{12}$/.test(s) || /^[\u4e00-\u9fa5]{6}$/.test(s)
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function includeChinese (s) {
  return /[\u4E00-\u9FA5]/g.test(s)
}

/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(s)
}

/**
 * 版本号
 * @param {*} s
 */
export function isVersion (s) {
  return /^([a-z_A-Z-.+0-9]+)$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^(\+?)[0-9]{0,5}([ ]{1})?[0-9]{5,20}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 判断是否为日期格式 (不保证非常正确)
 */
export function isDate (date) {
  if (isNaN(date) && !isNaN(new Date(date).getTime())) return true
  else return false
}

/**
 * 格式化日期yyyyMMddHHmmSS
 * @param date
 * @returns {String}
 */
export function generateTimeReqestNumber () {
  var date = new Date()
  return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds())
}

function pad2 (n) { return n < 10 ? '0' + n : n }

/**
 * 日期格式转换
 */
export function formatDate (pattern, date) {
  // 如果不设置，默认为当前时间
  if (!date) {
    date = new Date()
  }
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'))
  }
  /* 补00 */
  const toFixedWidth = (value) => {
    const result = 100 + value
    return result.toString().substring(1)
  }
  /* 配置 */
  const options = {
    regeExp: /(yyyy|M+|d+|h+|m+|s+|ee+|ws?|p)/g,
    months: ['January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September',
      'October', 'November', 'December'
    ],
    weeks: ['Sunday', 'Monday', 'Tuesday',
      'Wednesday', 'Thursday', 'Friday',
      'Saturday'
    ]
  }

  /* 时间切换 */
  const swithHours = hours => (hours < 12 ? 'AM' : 'PM')
  /* 配置值 */
  const pattrnValue = {
    yyyy: date.getFullYear(), // 年份
    MM: toFixedWidth(date.getMonth() + 1), // 月份
    dd: toFixedWidth(date.getDate()), // 日期
    hh: toFixedWidth(date.getHours()), // 小时
    mm: toFixedWidth(date.getMinutes()), // 分钟
    ss: toFixedWidth(date.getSeconds()), // 秒
    ee: options.months[date.getMonth()], // 月份名称
    ws: options.weeks[date.getDay()], // 星期名称
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    p: swithHours(date.getHours())
  }
  return pattern.replace(options.regeExp, (...args) => pattrnValue[args[0]])
}

export function validateIllegal (s) {
  return /[<>]/.test(s)
}

/**
 * 验证是否符合电话或者手机格式（只允许包含数字和-）
 * @param rule
 * @param value
 * @param callback
 */
export function checkPhoneNum (rule, value, callback) {
  const phoneRegex = /^([0-9-]+)$/
  if (value && !phoneRegex.test(value)) {
    callback(new Error('Phone format error, it can only contain numbers and "-"'))
  } else {
    callback()
  }
}

// const validateIllegal = (rule, value, callback) => {
//   let patter = /[>]/
//   debugger
//   if (patter.test(value)) {
//     return callback(new Error('非法字符'))
//   } else {
//     callback()
//   }
// }

// export default {
//   common: {// 公共验证方法
//     illegalChart: [{
//       required: false,
//       message: '111'
//     }, {
//       validator: validateIllegal,
//       trigger: 'change'
//     }]
//   }
// }
