import fetch from '@/utils/fetch'
export const authLogin = (params) => fetch('spms/auth/login', params, 'POST')
export const loginUseRefreshToken = (params) => fetch('spms/auth/refresh', params, 'POST')
