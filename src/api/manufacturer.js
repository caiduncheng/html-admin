import fetch from '@/utils/fetch'

export const page = (param) => fetch('online/management/admin/manufacturer', param, 'GET')

export const queryManufacturer = (manufacturerId) => fetch(`online/management/admin/manufacturer/${manufacturerId}`, null, 'GET')

export const updateManufacturer = (manufacturerId, data) => fetch(`online/management/admin/manufacturer/${manufacturerId}`, data, 'POST')
