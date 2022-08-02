import fetch from '@/utils/fetch'
export const getSysAppList = () => fetch(`online/management/admin/sysapp`, null, 'GET')
export const getOptionalAppList = () => fetch(`online/management/admin/sysapp/optional`, null, 'GET')
export const getAppInfoPage = (params) => fetch('online/management/admin/sysapp/versionlist', params, 'GET')
export const downloadApp = (appFileId) => fetch(`online/management/admin/sysapp/${appFileId}/download`, appFileId, 'GET')
export const deleteApp = (appFileId) => fetch(`online/management/admin/sysapp/${appFileId}`, null, 'DELETE')
export const confirmAppVersion = (param) => fetch('online/management/admin/sysapp/confirm-appversion', param, 'GET')
export const releaseApk = (param) => fetch('online/management/admin/sysapp/release-apk', param, 'POST')
export const grayscalePage = (appFileId, param) => fetch(`online/management/admin/sysapp/${appFileId}/grayscale/devices`, param, 'GET')
export const sysProductionRelease = (appFileId) => fetch(`online/management/admin/sysapp/grayscale/${appFileId}/release`, null, 'POST')
