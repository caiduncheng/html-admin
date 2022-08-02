import fetch from '@/utils/fetch'

export const listAllMenu = () => fetch('online/authorization/menu/all', null, 'GET')

export const listAllFunctions = () => fetch('online/authorization/menu/functions/all', null, 'GET')
