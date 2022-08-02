/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
// import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
// import { getMenuListNew } from '@/utils/baseData'
import { menuDataTranslate, clearLoginInfo } from '@/utils'
import { getInfo } from '@/api/login'
import store from '@/store'
// const Router = require('vue-router')
Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/503', component: _import('common/503'), name: '503', meta: { title: '附件未找到' } },
  { path: '/noPermission', component: _import('common/noPermission'), name: 'noPermission', meta: { title: 'No Permission' } },
  { path: '/signUp', component: _import('common/signUp'), name: 'signUp', meta: { title: '注册', titleEn: 'Sign Up' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    {path: '/dev-app', component: _import('modules/developer-app/list'), name: 'app', meta: {title: 'app', titleEn: 'app', isTab: true}},
    {path: '/dev-app-test', component: _import('modules/developer-app/test'), name: 'test', meta: {title: 'test', titleEn: 'test', isTab: true}},
    {path: '/dev-app-detail', component: _import('modules/developer-app/components/app-detail'), name: 'app-detail', meta: {title: 'app-detail', titleEn: 'app-detail', isTab: true}},
    {path: '/test-detail', component: _import('modules/developer-app/test-detail'), name: 'test-detail', meta: {title: 'test-detail', titleEn: 'test-detail', isTab: true}},
    {path: '/home', component: _import('common/home'), name: 'home', meta: {title: '首页', titleEn: 'Home', isTab: true}},
    {path: '/device-view', component: _import('modules/device/device-view'), name: 'device-view', meta: {title: 'device-view', titleEn: 'device-view', isTab: true}},
    {path: '/role/manage', component: _import('modules/role/manage'), name: 'role', meta: { title: 'role', titleEn: 'role', isTab: true }},
    // {path: '/user', component: _import('modules/user/manage'), name: 'user', meta: { title: 'user', titleEn: 'user', isTab: true }},
    // {path: '/role', component: _import('modules/role/manage'), name: 'role', meta: { title: 'role', titleEn: 'role', isTab: true }}
    // { path: '/userProfile', component: _import('common/userProfile'), name: 'userProfile', meta: { title: '用户信息', isTab: true } }
    // {path: '/order-detail', component: _import('modules/order/order-detail'), name: 'orderDetail', meta: {title: '订单详情', titleEn: 'OrderDetail'}},
    // {path: '/contract', component: _import('modules/customer/contract'), name: 'contract', meta: {title: '合约', titleEn: 'contract'}}
    {path: '/datacenter-operator', component: _import('modules/datacenter/datacenter-operator'), name: 'datacenter-operator', meta: {title: 'datacenter-operator', titleEn: 'datacenter-operator', isTab: true}},
    {path: '/datacenter-application', component: _import('modules/datacenter/datacenter-application'), name: 'datacenter-application', meta: {title: 'datacenter-application', titleEn: 'datacenter-application', isTab: true}},
    {path: '/datacenter-command', component: _import('modules/datacenter/datacenter-command'), name: 'datacenter-command', meta: {title: 'datacenter-command', titleEn: 'datacenter-command', isTab: true}},
    {path: '/datacenter-device', component: _import('modules/datacenter/datacenter-device'), name: 'datacenter-device', meta: {title: 'datacenter-device', titleEn: 'datacenter-device', isTab: true}}
  ]
}

const routes = globalRoutes.concat(mainRoutes)

const createRouter = () => {
  if (process.env.NODE_ENV !== 'production') {
    routes.push(
      { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } }
    )
  }

  return new Router({
    mode: 'hash',
    base: process.env.NODE_ENV === 'production' ? '/admin/' : '',
    scrollBehavior: () => ({ y: 0 }),
    isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
    routes: routes
  })
}

const router = createRouter()

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  const hasToken = Vue.cookie.get('TOMS_TOKEN')
  console.log('hasToken', hasToken)
  if (hasToken) {
    if (to.path === '/login' || to.path === '/signUp') {
      window.location.href = window.SITE_CONFIG['loginUrl']
    } else {
      if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to) === 'global') {
        next()
      } else {
        console.log('router/index.js  请求author 的info')
        getInfo().then(data => {
          const getMenuListNew = data.platformInfoList[0].menuList
          if (getMenuListNew.length === 0) {
            clearLoginInfo()
            window.location.href = window.SITE_CONFIG['loginUrl']
          }
          let menuList = menuDataTranslate(getMenuListNew, 'menuId', 'parentMenuId')
          fnAddDynamicMenuRoutes(menuList)
          router.options.isAddDynamicMenuRoutes = true
          sessionStorage.setItem('menuList', JSON.stringify(menuList || '[]'))
          sessionStorage.setItem('permissions', JSON.stringify(data.menuFunctionList || '[]'))
          localStorage.setItem('orgId', data.orgId)
          localStorage.setItem('userData', JSON.stringify(data || '[]'))
          store.commit('user/updateName', data.username)
          store.commit('common/updateMenuFunctionList', JSON.stringify(data.menuFunctionList || '[]'))
          store.commit('common/updateMenuList', menuList)
          next({ ...to, replace: true })
        }).catch(e => {
          sessionStorage.setItem('menuList', '[]')
          sessionStorage.setItem('permissions', '[]')
          next()
        })
      }
    }
  } else {
    console.log('to', to)
    if (to.path === '/login') {
      if (process.env.NODE_ENV === 'production') {
        window.location.href = window.SITE_CONFIG['loginUrl']
      } else {
        next()
      }
    } else {
      clearLoginInfo()
      if (process.env.NODE_ENV === 'production') {
        window.location.href = window.SITE_CONFIG['loginUrl']
      } else {
        next({name: 'login'})
      }
    }
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].href && /\S/.test(menuList[i].href)) {
      menuList[i].href = menuList[i].href.replace(/^\//, '')
      var route = {
        path: menuList[i].href.replace('/', '-'),
        component: null,
        name: menuList[i].href.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].menuTitle,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].href)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].href
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].href}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    store.commit('common/updateDynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
