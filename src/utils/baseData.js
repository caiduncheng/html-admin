
export function getMenuList () {
  return [
    {
      menuId: 1,
      name: 'Table',
      nameEn: '金科报表',
      icon: 'job',
      open: null,
      orderNum: 1,
      parentId: 0,
      parentName: null,
      perms: null,
      type: 0,
      url: null,
      list: [
        {
          // icon: 'menu',
          list: null,
          menuId: 2,
          name: 'Basic Table',
          nameEn: '业务流水',
          open: null,
          orderNum: 1,
          parentId: 1,
          parentName: null,
          type: 1,
          url: 'report/report-trans'
        }
      ]
    },
    {
      menuId: 3,
      name: 'Forms',
      nameEn: '',
      icon: 'log',
      open: null,
      orderNum: 2,
      parentId: 0,
      parentName: null,
      perms: null,
      type: 1,
      url: null,
      list: [
        {
          // icon: 'menu',
          list: null,
          menuId: 31,
          name: 'Basic Form',
          nameEn: '',
          open: null,
          orderNum: 1,
          parentId: 1,
          parentName: null,
          type: 1,
          url: 'form/basic-form'
        }
      ]
    },
    {
      menuId: 4,
      name: '套餐管理',
      nameEn: '套餐管理',
      icon: 'log',
      open: null,
      orderNum: 3,
      parentId: 0,
      parentName: null,
      perms: null,
      type: 1,
      url: 'cost/manage',
      list: null
    },
    {
      menuId: 5,
      name: '订单管理',
      nameEn: '订单管理',
      icon: 'editor',
      open: null,
      orderNum: 4,
      parentId: 0,
      parentName: null,
      perms: null,
      type: 1,
      url: 'order/manage',
      list: null
    },
    {
      menuId: 6,
      name: '供应商管理',
      nameEn: '供应商管理',
      icon: 'config',
      open: null,
      orderNum: 5,
      parentId: 0,
      parentName: null,
      perms: null,
      type: 1,
      url: 'factory/manage',
      list: null
    }
  ]
}

// 套餐周期
export function getCostBillDate () {
  return [
    {
      value: 1,
      label: '年',
      children: [{
        value: 'year1',
        label: '1年'
      }, {
        value: 'year2',
        label: '2年'
      }]
    }, {
      value: 2,
      label: '月',
      children: [{
        value: 'month1',
        label: '1月'
      }, {
        value: 'month2',
        label: '2月'
      }]
    }, {
      value: 3,
      label: '天',
      children: [{
        value: 'day10',
        label: '10天'
      }, {
        value: 'day20',
        label: '20天'
      }]
    }
  ]
}

// export function getMenuListNew () {
//   return [
//     {
//       menuId: 1,
//       parentMenuId: 0,
//       menuTitle: '表单',
//       showFlag: '显示标志，由前端自己定义',
//       href: null,
//       sort: 10,
//       icon: 'job'
//     },
//     {
//       menuId: 10,
//       parentMenuId: 1,
//       menuTitle: '基础表单',
//       showFlag: '显示标志，由前端自己定义',
//       href: 'report/report-trans',
//       sort: 10,
//       icon: ''
//     },
//     {
//       menuId: 11,
//       parentMenuId: 1,
//       menuTitle: '不基础表单',
//       showFlag: '显示标志，由前端自己定义',
//       href: 'report/report-trans-no',
//       sort: 10,
//       icon: 'admin'
//     },
//     {
//       menuId: 2,
//       parentMenuId: 0,
//       menuTitle: 'Forms',
//       showFlag: '显示标志，由前端自己定义',
//       href: null,
//       sort: 10,
//       icon: ''
//     },
//     {
//       menuId: 20,
//       parentMenuId: 2,
//       menuTitle: 'Basic Form',
//       showFlag: '显示标志，由前端自己定义',
//       href: null,
//       sort: 10,
//       icon: 'log'
//     }
//   ]
// }
export function getMenuListNew () {
  return [
    {
      'menuId': 114066,
      'platCode': 'DEVELOPER',
      'characterCode': 'DEV',
      'parentMenuId': 0,
      'menuTitle': '应用',
      'showFlag': '1',
      'href': 'application/appManager',
      'sort': 114066,
      'actionId': null,
      'icon': 'fa fa-android',
      'status': null
    },
    {
      'menuId': 333,
      'platCode': 'DEVELOPER',
      'characterCode': 'DEV',
      'parentMenuId': 0,
      'menuTitle': 'demo',
      'showFlag': '1',
      'href': 'report/report-trans',
      'sort': 114065,
      'actionId': null,
      'icon': 'fa fa-android',
      'status': null
    },
    {
      'menuId': 444,
      'platCode': 'DEVELOPER',
      'characterCode': 'DEV',
      'parentMenuId': 0,
      'menuTitle': 'App Store',
      'showFlag': '1',
      'href': 'appstore/app-store',
      'sort': 114065,
      'actionId': null,
      'icon': 'fa fa-android',
      'status': null
    },
    {
      'menuId': 114078,
      'platCode': 'DEVELOPER',
      'characterCode': 'DEV',
      'parentMenuId': 0,
      'menuTitle': '订单',
      'showFlag': '1',
      'href': null,
      'sort': 114078,
      'actionId': null,
      'icon': 'fa fa-diamond',
      'status': null
    },
    {
      'menuId': 114080,
      'platCode': 'DEVELOPER',
      'characterCode': 'DEV',
      'parentMenuId': 0,
      'menuTitle': '开发联调',
      'showFlag': '1',
      'href': null,
      'sort': 114080,
      'actionId': null,
      'icon': 'fa fa-users',
      'status': null
    },
    {
      'menuId': 11408000,
      'platCode': 'DEVELOPER',
      'characterCode': 'DEV',
      'parentMenuId': 114080,
      'menuTitle': '账号管理',
      'showFlag': '1',
      'href': null,
      'sort': 11408000,
      'actionId': null,
      'icon': null,
      'status': null
    },
    {
      'menuId': 11408004,
      'platCode': 'DEVELOPER',
      'characterCode': 'DEV',
      'parentMenuId': 114080,
      'menuTitle': '角色管理',
      'showFlag': '1',
      'href': null,
      'sort': 11408004,
      'actionId': null,
      'icon': null,
      'status': null
    },
    {
      'menuId': 11408060,
      'platCode': 'DEVELOPER',
      'characterCode': 'DEV',
      'parentMenuId': 114080,
      'menuTitle': '开发机',
      'showFlag': '1',
      'href': null,
      'sort': 11408060,
      'actionId': null,
      'icon': null,
      'status': null
    }
  ]
}
