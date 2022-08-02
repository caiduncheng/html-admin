import fetch from '@/utils/fetch'

export * from './login'
export * from './auth'
export * from './trans'
export * from './operator'
export * from './developer'
export * from './group'
export * from './manufacturer'
export * from './dashboard'
export * from './user'
export * from './role'
export * from './menu'
export * from './org'
export * from './developer-app'

// 通用api 暴露给common-radio-dialog
export const commonApi = (url, params, post, configObj) => fetch(url, params, post ? 'POST' : 'GET', configObj)
