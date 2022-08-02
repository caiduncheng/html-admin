import fetch from '@/utils/fetch'

export const getRoleList = (params) => fetch('online/authorization/role', params, 'GET')

export const roleInfo = (roleId) => fetch(`online/authorization/role/${roleId}`, null, 'GET')

export const newRole = (params) => fetch(`online/authorization/role`, params, 'POST')

export const updateRole = (params) => fetch(`online/authorization/role/${params.roleId}`, params, 'POST')

export const deleteRole = (roleId) => fetch(`online/authorization/role/${roleId}`, null, 'DELETE')

export const getRoleMenuFunctions = (roleId) => fetch(`online/authorization/role/${roleId}/menu-functions`, null, 'GET')

export const listRole = (roleId) => fetch(`online/authorization/role/list/all`, null, 'GET')
