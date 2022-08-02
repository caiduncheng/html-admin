import fetch from '@/utils/fetch'

// query group list
export const sysGroupSelect = (params) => fetch('online/management/admin/sysgroup/select', params, 'GET')

// query group details according to groupId
export const groupDetails = (groupId) => fetch(`online/management/admin/sysgroup/${groupId}`, null, 'GET')

// create group
export const addGroup = (data) => fetch(`online/management/admin/sysgroup/`, data, 'POST')

// modify group
export const updateGroup = (groupId, data) => fetch(`online/management/admin/sysgroup/${groupId}`, data, 'POST')

// delete Group
export const deleteGroup = (groupId) => fetch(`online/management/admin/sysgroup/${groupId}`, null, 'DELETE')

// 获取指定分组下的app（添加应用前，需要先返回该分组下的全部应用及未属于该分组的全部应用）
export const getSysGroupApps = (groupId) => fetch(`online/management/admin/sysgroup/${groupId}/sysapp/list`, null, 'GET')

// Switch the application version in the group
export const updGroupApkVersion = (groupId, appFileId, data) => fetch(`online/management/admin/sysgroup/${groupId}/appfile/${appFileId}`, data, 'POST')

// (管理员功能-分组中添加应用 2000-0011-0007)
export const addApk = (groupId, data) => fetch(`online/management/admin/sysgroup/${groupId}/applications`, data, 'POST')

// (管理员功能-分组中删除应用 2000-0011-0007)
export const delApk = (groupId, data) => fetch(`online/management/admin/sysgroup/${groupId}/applications`, data, 'DELETE')

// 分页查询分组的运营商列表
export const groupOperatorPage = (groupId, data) => fetch(`online/management/admin/sysgroup/operator/${groupId}`, data, 'GET')

// 添加分组的运营商
export const addgroupOperator = (groupId, data) => fetch(`online/management/admin/sysgroup/operator/${groupId}`, data, 'POST')

// 删除分组下的运营商
export const delgroupOperator = (groupId, operatorId) => fetch(`online/management/admin/sysgroup/operator/${groupId}/${operatorId}`, null, 'DELETE')

// 分页查询未绑定运营商列表
export const unBindOperatorPage = (params) => fetch(`online/management/admin/sysgroup/operator/select`, params, 'GET')
