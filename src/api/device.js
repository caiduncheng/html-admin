import fetch from '@/utils/fetch'

export const getDeviceModel = (param) => fetch('online/management/admin/manufacturer/products/tree', param, 'GET')
export const getManufacturer = () => fetch('online/management/admin/manufacturer/select', null, 'GET')
export const addManufacturer = (param) => fetch('online/management/admin/manufacturer', param, 'POST')
export const getDeviceList = (param) => fetch('online/management/admin/device', param, 'GET')
export const getDeviceDetail = (devId, param) => fetch(`online/management/admin/device/${devId}`, param, 'GET')
export const getDeviceCmdHis = (devId, pageDto) => fetch(`online/management/admin/device/${devId}/cmd`, pageDto, 'GET')
export const verifyDeviceSn = (devSn) => fetch(`online/management/admin/device/${devSn}/verify`, null, 'GET')
