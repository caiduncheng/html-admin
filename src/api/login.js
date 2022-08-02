import fetch from '@/utils/fetch'
export const login = (params) => fetch('online/authorization/auth/login', params, 'POST')
export const logout = (params) => fetch('online/authorization/auth/logout', params, 'POST')
export const changePsw = (params) => fetch('online/authorization/auth/password/change', params, 'POST')
export const register = (params) => fetch('online/authorization/register/developer', params, 'POST')
export const timestamp = (params) => fetch('online/authorization/auth/timestamp', params)
export const balance = (params) => fetch('online/developer/balance', params)
export const appSummary = (appId) => fetch(`online/developer/app/info/summary${appId}`)
export const getInfo = () => fetch('online/authorization/auth/user/info')
