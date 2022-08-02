import fetch from '@/utils/fetch'

// 白名单分页
export const whiteListPage = (params) => fetch('online/management/admin/whitelist', params, 'GET')
// 添加应用
export const addApp = (params) => fetch(`online/management/admin/whitelist/app`, params, 'POST')
// 获取应用
export const getApp = (id, params) => fetch(`online/management/admin/whitelist/app/${id}`, params, 'GET')
// 删除应用
export const deleteApp = (id) => fetch(`online/management/admin/whitelist/app/${id}`, null, 'DELETE')
// 更新应用
export const updateApp = (id, params) => fetch(`online/management/admin/whitelist/app/${id}`, params, 'POST')
// 绑定运营商
export const appBindOperator = (id, params) => fetch(`online/management/admin/whitelist/bind/${id}`, params, 'POST')
// 未绑定运营商分页
export const unBindOperatorPage = (id, params) => fetch(`online/management/admin/whitelist/unbindOperator/${id}`, params, 'get')
// 解绑运营商
export const appUnBindOperator = (id) => fetch(`online/management/admin/whitelist/unbind/${id}`, null, 'DELETE')
// 绑定运营商记录
export const bindOperatorPage = (params) => fetch('online/management/admin/whitelist/list-app', params, 'GET')
