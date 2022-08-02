import fetch from '@/utils/fetch'
export const operatorList = (params) => fetch('online/management/admin/operator', params, 'GET')
export const getOperatorInfo = (operatorId) => fetch(`online/management/admin/operator/${operatorId}`)
export const deleteOperator = (param) => fetch('online/management/admin/operator/delete-user', param, 'POST')
export const getLicenseList = (param) => fetch('online/management/admin/operator/billing/business', param, 'GET')
export const addLicense = (param, bizCode) => fetch(`online/management/admin/operator/billing/business/${bizCode}`, param, 'POST')
export const downloadCert = (operatorId) => fetch(`online/management/admin/operator/${operatorId}/csr/download`, operatorId, 'GET')
export const examineOperator = (params) => fetch(`online/management/admin/operator/${params.operatorId}/examine`, params, 'POST')
export const examineDemoOperator = (params) => fetch(`online/management/admin/operator/${params.operatorId}/demoExamine`, params, 'POST')
export const operatorLevelList = (params) => fetch('online/authorization/level/list', params, 'GET')
export const operatorLevelUpdate = (params) => fetch('online/management/admin/operator/level/update', params, 'POST')
// export const resetPassword = (keyId) => fetch(`online/management/admin/operator/resetPassword/${keyId}`, null, 'POST')
export const resetPassword = (keyId) => fetch(`online/authorization/user/${keyId}/reset/password`, null, 'POST')
export const configureMap = (operatorId, param) => fetch(`online/management/admin/operator/resetMap/${operatorId}`, param, 'POST')
export const systemRegisterDemoOperator = (param) => fetch(`online/management/admin/operator/domeOperator`, param, 'POST')
export const getCountryList = () => fetch('online/authorization/country/list', {status: 1}, 'GET')
export const getBlackList = (params) => fetch('online/authorization/menu/blacklist/list', params, 'GET')
export const postBlackList = (operatorId, data) => fetch(`online/authorization/menu/blacklist/character/OPERATOR/target/${operatorId}`, data, 'POST')
export const getOperatorMenuList = (params) => fetch('online/authorization/menu/admin/all', params, 'GET')
export const configure = (operatorId, data) => fetch(`online/management/admin/operator/configure/${operatorId}`, data, 'POST')
export const getConfigure = (operatorId) => fetch(`online/management/admin/operator/configure/${operatorId}`, null, 'GET')
export const getaccountList = (params) => fetch(`online/authorization/operator/account-list`, params, 'GET')
export const getFlyDeskRemainTime = (operatorId) => fetch(`online/management/admin/operator/flydesk/${operatorId}`, null, 'GET')
export const getRemindEmail = () => fetch(`online/management/admin/operator/remind`, null, 'GET')
export const saveRemindEmail = (data) => fetch(`online/management/admin/operator/remind`, data, 'POST')
export const deleteRemindEmail = (id) => fetch(`online/management/admin/operator/remind/${id}`, null, 'POST')
export const updateRemindEmail = (id, data) => fetch(`online/management/admin/operator/remind/${id}`, data, 'POST')
