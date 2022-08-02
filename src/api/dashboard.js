import fetch from '@/utils/fetch'

export const newOperatorCount = () => fetch('online/management/admin/dashboard/operator/trend/new', null, 'GET')

export const operatortopMerchant = () => fetch('online/management/admin/dashboard/operator/top/merchant', null, 'GET')
