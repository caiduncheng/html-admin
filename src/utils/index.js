import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import {formatDate} from '@/utils/validate'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  // eslint-disable-next-line camelcase
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
}

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  let permissionsJson = JSON.parse(sessionStorage.getItem('permissions') || '[]')
  var results = false
  permissionsJson.map(function (item) {
    if (item.menuFuncCode === key) {
      results = true
    }
  })
  return results
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

export function menuDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['list']) {
        temp[data[k][pid]]['list'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['list'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}
// 增加需要返回的展开节点数组expandId[]
export function treeDataTranslate2 (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  var expandId = []
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    // console.log(temp[data[k][pid]])
    // debugger
    if (data[k][pid] === 1) {
      expandId.push(data[k][id])
    }
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
      expandId.push(data[k][id])
    }
  }
  return {res, expandId}
}
/**
 * 获取树状数据的中的叶节点
 * @param {*} data 树状数据的data
 * @param {*} oldres 初始id数组
 * @param {*} id 节点id的key
 */
export function treeDataleafNodeId (data, oldres = [], id) { // (data,oldres=[])
  var res = oldres
  for (var i = 0; i < data.length; i++) {
    var children = data[i]
    if (children.children) {
      res.push(treeDataleafNodeId(children.children, res, id)) // (children.children,res)
    } else {
      res.push(children[id]) // res.push(children.menuId)
    }
  }
  return res
}
/**
 * 树形数据转换docConfig-role-add-or-update
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslateDocConfig (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  var filterNode = [] // 存放assets文件夹下的docIds
  for (var i = 0; i < data.length; i++) {
    if (data[i].docName === 'assets' || data[i].parentName === 'assets' || filterNode.includes(data[i].parentId)) filterNode.push(data[i].docId)
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (filterNode.includes(data[k].docId)) continue // 过滤assets文件夹
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}
/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('TOMS_TOKEN')
  Vue.cookie.delete('refreshToken')
  store.commit('resetStore')
  router.options.isAddDynamicMenuRoutes = false
}

// 传输给服务器的版本模式
export function HTMLEncode (html) {
  var temp = document.createElement('div');
  (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html)
  var output = temp.innerHTML
  temp = null
  return output
}
  // 解析出来的版本模式
export function HTMLDecode (text) {
  var temp = document.createElement('div')
  temp.innerHTML = text
  var output = temp.innerText || temp.textContent
  temp = null
  return output
}

  // 时区转化
export function TimeZoneInfo (timezone, DateTime) {
  if (DateTime) {
    DateTime = formatDate('yyyy/MM/dd hh:mm:ss', DateTime)
  //  timezone ,DateTime// timezone目标时区,DateTime目标转化时间
    var offsetGMT = new Date().getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
    var serverDate = new Date(DateTime).getTime()
    // var nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    var targetDate = new Date(serverDate - offsetGMT * 60 * 1000 - timezone * 60 * 60 * 1000)
  // console.log('当前时区服务器时间现在是：' + targetDate)
    var date = new Date(targetDate)
    var dateValue = date.getFullYear() + '/' + checkTime(date.getMonth() + 1) + '/' + checkTime(date.getDate()) + ' ' + checkTime(date.getHours()) + ':' + checkTime(date.getMinutes()) + ':' + checkTime(date.getSeconds())

    return dateValue
  } else return ''
}
function checkTime (i) {
  if (i < 10) {
    i = '0' + i
  }

  return i
}
// 加密密钥
export function getRsaPublicKey () {
  return 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkkApKkKERcT8C9pkcH7F2YxOyK8veLXqLm06iY+XlTuvSFCxC3Fe7AudJ01nj8BAXiI947/OTEHsbX8hQUIitJl1A/AFYiiqzd+ZzsQNPDrtXUMIGMFDa2KpYzSOCwLimZ4NHShXpynEjyer5jz55iL8LjwqBiPcHeg7IfA1Itfm4moONjaCBzMCtNw+5En6i4cS0f2Tilxh+8LLnryqThJiom64Yvu9NtLJLAYr5eGxQ6ng679AaD0nckXGOiy4HqgNA3LTGfq45L4wrCbLR2UcqPba9HJ90zamXz7elrgwFy1ShLCyLQ9+SjxGKKQpdxeqLvpttX+UY/+O4S8j2wIDAQAB'
}
// html标签 反转义
export function unescapeHTML (txt) {
  txt = '' + txt
  return txt.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
}

export function jsPost (URL, PARAMS, TARGET) {
  var temp = document.createElement('form')
  temp.action = URL
  temp.method = 'post'
  temp.style.display = 'none'
  if (!TARGET) {
    TARGET = '_self'
  }
  temp.target = TARGET
  for (var x in PARAMS) {
    var opt = document.createElement('textarea')
    opt.name = x
    opt.value = PARAMS[x]
    temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
}

export function findIndex (l, o) {
  var objStr = JSON.stringify(o)
  return l.reduce((index, ele, i) => {
    if (JSON.stringify(ele) === objStr) {
      return i
    } else {
      return index
    }
  }, -1)
}
// 显示中英文名
export function getChEnName (enName, chName) {
  return (enName && chName ? enName + ' / ' + chName : enName || chName)
}

//
export function showFileName (fileName, visiLen) {
  var nameIndex = fileName.lastIndexOf('.')
  var name = fileName.substring(0, nameIndex)
  var len = fileName.length - nameIndex
  var suffix = fileName.substring(nameIndex, nameIndex + len)
  if (nameIndex > visiLen) {
    name = name.substring(0, visiLen / 2) + '...' + name.substring(Number(nameIndex) - 3, nameIndex) + suffix
  } else {
    name = name + suffix
  }
  return name
}

// 问题状态的样式和文字描述 (问题Id, 是否needReply状态, 样式或描述)
export function getIssueStateVisible (taskState, needReply, style) {
  if (needReply === 1) {
    return style ? 'state-tag--red' : this.$t('issueTabContent.waitRes')
  } else if (taskState) {
    return style ? `state-tag--${this.$t(`common.issueStatus[${taskState - 1}].name`)}` : this.$t(`common.issueStatus[${taskState - 1}].label`)
  }
}

// 任务优先级的样式和文字描述 (任务优先级, 样式或描述)
export function getTaskPriorityVisible (taskPriority, style) {
  return style ? `priority-btn--${this.$t(`common.priorityLevel[${taskPriority - 1}].style`)}` : this.$t(`common.priorityLevel[${taskPriority - 1}].label`)
}

// 任务状态的样式和文字描述 (任务状态, 样式或描述)
export function getTaskStateVisible (taskState, style, num = '') {
  return style ? `state-tag--${this.$t(`common.taskStatus${num}[${taskState - 1}].style`)}` : this.$t(`common.taskStatus${num}[${taskState - 1}].label`)
}

// 防抖
export function _debounce (fn, delay) {
  var delay1 = delay || 200
  var timer
  return function () {
    var th = this
    var args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      timer = null
      fn.apply(th, args)
    }, delay1)
  }
}

/**
 * 对象拼接成url形式 &key1=value1&key2=value2
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 *
 * return URL参数字符串
 */
export function urlEncode (param, key, encode) {
  if (param == null) return ''
  var paramStr = ''
  var t = typeof (param)
  if (t === 'string' || t === 'number' || t === 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param)
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
      paramStr += urlEncode(param[i], k, encode)
    }
  }
  return paramStr
}

export function formatDateTime (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

export function shortDate (date) {
  const splitDate = date.split('-')
  let splitM = ''
  switch (Number(splitDate[1])) {
    case 1:
      splitM = 'Jan'
      break
    case 2:
      splitM = 'Feb'
      break
    case 3:
      splitM = 'Mar'
      break
    case 4:
      splitM = 'Apr'
      break
    case 5:
      splitM = 'May'
      break
    case 6:
      splitM = 'Jun'
      break
    case 7:
      splitM = 'Jul'
      break
    case 8:
      splitM = 'Aug'
      break
    case 9:
      splitM = 'Sept'
      break
    case 10:
      splitM = 'Oct'
      break
    case 11:
      splitM = 'Nov'
      break
    case 12:
      splitM = 'Dec'
      break
  }
  return splitM + '. ' + splitDate[2]
}

export function fmoney (s, n) {
  n = n > 0 && n <= 20 ? n : 2
  s = parseFloat((s + '').replace(/[^\d.-]/g, '')).toFixed(n) + ''
  var l = s.split('.')[0].split('').reverse()
  var r = s.split('.')[1]
  var t = ''
  for (var index = 0; index < l.length; index++) {
    t += l[index] + ((index + 1) % 3 === 0 && (index + 1) !== l.length ? ',' : '')
  }
  return t.split('').reverse().join('') + '.' + r
}

/* *判断对象数组中某一key值是否有重复
 * arr 对象数组
 * key 判断的字段名
 * return 重复返回true，不重复返回false
 * * 例arr=[{key1: 'a', key2: 'aa'},{key1: 'b', key2: 'bb'},{key1: 'a', key2: 'cc'}]
 * * key=key1
 * * arr中key1重复
* */
export function judgeRepeatElement (arr, key) {
  var obj = {}
  for (let i = 0; i < arr.length; i++) {
    if (obj[arr[i][key]]) { // 有重复
      return true
    } else {
      obj[arr[i][key]] = arr[i]
    }
  }
  return false
}

/** 将obj2与obj1同属性的值赋值给obj1
 * 例 obj1:{key1: '', key2: ''},obj2: {key1:'1', key2:'2',key3:'3'}
 * obj1 = copySameKey(obj1,obj2)
 * 结果obj1:{key1:'1', key2:'2'}
 **/
export function copySameKey (obj1, obj2) {
  Object.keys(obj1).forEach(key => {
    obj1[key] = obj2[key] || obj1[key]
  })
  return obj1
}

/**
 * yyyyMMddHHmmss时间转yyyy/MM/dd HH:mm:ss
 * @param {*} key
 */
export function strToDate (str) {
  let pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/
  return str ? str.replace(pattern, '$1/$2/$3 $4:$5:$6') : ''
}

/**
 * token续期登录
 */
export function refreshTokenLogin () {
  console.log('refreshTokenLogin')
  clearLoginInfo()
  router.push({ name: 'login' })
  /* let refreshToken = Vue.cookie.get('refreshToken')
  let params = {
    refreshToken: refreshToken
  }
  return loginUseRefreshToken(params).then(data => {
    Vue.cookie.set('token', data.obj.authToken)
    Vue.cookie.set('refreshToken', data.obj.refreshToken)
    Message.warning('请重试')
  }).catch(() => {
    clearLoginInfo()
    router.push({ name: 'login' })
  }) */
}

export function titleCase5 (str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

export function menuDataTransform (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['list']) {
        temp[data[k][pid]]['list'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['list'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function getMapList () {
  let mapList = [
    // this.$t('cmp.page_updateFields_option')
    {label: 'Mapbox', mapType: 'MAP_BOX', mapKey: 'pk.eyJ1IjoieGlhb2hhaXFpYW5nIiwiYSI6ImNsMXlmYWxyMTBjNTEza281aDY2OHc3eTMifQ.DixPNKsuzsEV740Mh-9NHA'},
    {label: 'GOOGLE MAP', mapType: 'GOOGLE', mapKey: 'AIzaSyB2tuwOcaf7U5dL7SdiqxL_x3Hx-FOq04g'},
    {label: 'BaiDu MAP', mapType: 'BAIDU', mapKey: 'K3ECtidEuUtIIKO7dYn5fLSFtt78MGQF'}
  ]
  return mapList
}
