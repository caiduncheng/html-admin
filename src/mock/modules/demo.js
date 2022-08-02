import Mock from 'mockjs'

// 生成数据列表
var dataList = []
// for (let i = 0; i < Math.floor(Math.random() * 20 + 1); i++) {
for (let i = 0; i < 10; i++) {
  dataList.push(Mock.mock({
    'id': '@increment',
    'title': '@title',
    'inventory': '@integer(10,1000)',
    'variants': '@integer(10,1000)',
    'price': '@float(10, 1000, 0, 2)',
    'sales': '@integer(10,1000)'
  }))
}

// 获取
export function list () {
  return {
    // isOpen: false,
    url: '/report/transFlow/list',
    type: 'get',
    data: {
      'isMock': true,
      'msg': 'success',
      'code': 0,
      'page': {
        'totalCount': dataList.length,
        'pageSize': 10,
        'totalPage': 1,
        'currPage': 1,
        'list': dataList
      }
    }
  }
}

// 获取
export function info () {
  return {
    // isOpen: false,
    url: '/report/transFlow/info',
    type: 'get',
    data: {
      'isMock': true,
      'msg': 'success',
      'code': 0,
      'info': {
        'title': 'xxxxxxx',
        'inventory': '35345',
        'variants': 1,
        'fileName': 'aaaa.html'
      }
    }
  }
}

// 删除用户
export function del () {
  return {
    // isOpen: false,
    url: '/report/transFlow/del',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0,
      'isMock': true
    }
  }
}

var userList = []
for (let i = 0; i < 10; i++) {
  userList.push(Mock.mock({
    'id': '@increment',
    'jobId': '@increment(1000)',
    'name': '@name',
    'sex|0-2': 0,
    'email': '@email',
    'level': '@natural(0,9)',
    'cretime': '@datetime'
  }))
}

// 获取
export function userlist () {
  return {
    // isOpen: false,
    url: '/report/user/list',
    type: 'get',
    data: {
      'isMock': true,
      'msg': 'success',
      'code': 0,
      'page': {
        'totalCount': userList.length,
        'pageSize': 10,
        'totalPage': 1,
        'currPage': 1,
        'list': userList
      }
    }
  }
}

export function homeInfo () {
  return {
    url: 'home/info',
    type: 'get',
    data: {
      code: 0,
      requirementList: Mock.mock([
        {'id': 1, 'desc': 'Show me the money', 'msg': '@title', 'name': '@name', 'createTime': '@datetime', 'type': 0, 'focus': 1},
        {'id': 2, 'desc': 'Power overwheling', 'msg': '@title', 'name': '@name', 'createTime': '@datetime', 'type': 1, 'focus': 0},
        {'id': 3, 'desc': 'Game over man', 'msg': '@title', 'name': '@name', 'createTime': '@datetime', 'type': 2, 'focus': 0},
        {'id': 4, 'desc': 'Whats mine is mine', 'msg': '@title', 'name': '@name', 'createTime': '@datetime', 'type': 2, 'focus': 1},
        {'id': 5, 'desc': 'Something for nothing', 'msg': '@title', 'name': '@name', 'createTime': '@datetime', 'type': 1, 'focus': 0},
        {'id': 6, 'desc': 'Comand', 'msg': '@title', 'name': '@name', 'createTime': '@datetime', 'type': 0, 'focus': 1}
      ]),
      appVerList: Mock.mock([
        {'id': 1, 'appName': '@title', 'applyDate': '@datetime', 'status': 1, 'percent': 56},
        {'id': 2, 'appName': '@title', 'applyDate': '@datetime', 'status': 0, 'percent': null},
        {'id': 3, 'appName': '@title', 'applyDate': '@datetime', 'status': 1, 'percent': 11}
      ]),
      chartData: Mock.mock({
        lineData: {
          date: ['8/4', '8/5', '8/6', '8/7', '8/8', '8/9', '8/10'],
          // downloadCount: [352, 216, 0, 0, 0, 0, 0],
          'downloadCount|10': ['@integer(0, 1000)'],
          'useCount|10': ['@integer(0, 1000)']
        },
        pieData: {}
      })
    }
  }
}

export function appCategory (opts) {
  return {
    url: 'app/category/count',
    type: 'get',
    // opts: opts,
    data: {
      code: 0,
      appCategoryCount: [
        {id: 0, cateName: '全部', count: 1000},
        {id: 1, cateName: '零售类', count: 100},
        {id: 2, cateName: '餐饮类', count: 100},
        {id: 3, cateName: '记账类', count: 100},
        {id: 4, cateName: '娱乐', count: 100},
        {id: 5, cateName: '工具', count: 100},
        {id: 6, cateName: '宠物', count: 100},
        {id: 7, cateName: '运动', count: 100},
        {id: 8, cateName: '服饰', count: 100},
        {id: 9, cateName: '捐款', count: 100},
        {id: 10, cateName: '其他', count: 100}
      ]
    }
  }
}

var appList = []
for (let i = 0; i < 19; i++) {
  appList.push(Mock.mock({
    'id': '@increment',
    'logo': Mock.Random.dataImage('200x100'),
    'appName': '@name',
    'version': 'v1.0.0',
    'category|1': ['零售类', '餐饮类', '记账类', '娱乐', '工具', '宠物', '运动', '服饰', '其他'],
    'amount': '@integer(0, 1000)'
  }))
}

export function applist () {
  return {
    url: 'app/category/list',
    type: 'get',
    data: {
      code: 0,
      appList: appList
    }
  }
}
