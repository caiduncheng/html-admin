import fetch from '@/utils/fetch'

export const getCurrentOrgs = (params) => fetch(`online/authorization/organization`, params, 'GET')
