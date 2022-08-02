import fetch from '@/utils/fetch'

export const merchantList = (params) => fetch('online/developer-admin/mrch', params, 'GET')
export const getMerchantInfo = (mrchId) => fetch(`online/authorization/admin/merchant/${mrchId}`)
export const lockMerchant = (mrchId, params) => fetch(`online/authorization/admin/merchant/${mrchId}/lock`, params, 'POST')
export const unlockMerchant = (mrchId, params) => fetch(`online/authorization/admin/merchant/${mrchId}/unlock`, params, 'POST')
export const transferMerchant = (mrchId, operatorId) => fetch()

export const merchantDeviceList = (mrchId, params) => fetch(`online/developer-admin//mrch/${mrchId}/dev`, params)
export const merchantAppList = (mrchId, params) => fetch(`online/developer-admin/mrch/${mrchId}/app`, params)
export const merchantAppTrialList = (mrchId, params) => fetch(`online/developer-admin/mrch/${mrchId}/app/trial`, params)
