import fetch from '@/utils/fetch'
export const getTransList = (params) => fetch('report/transFlow/list', params)
export const delTrans = (params) => fetch('report/transFlow/del', params, 'POST', {openDefultdata: false})
export const getTransInfo = (id) => fetch(`report/transFlow/info/${id}`, '', '')
export const saveOrUpdateTrans = (params, id) => fetch(`report/transFlow/info/${id ? 'update' : 'save'}`, params, 'POST')
export const getHomeInfo = () => fetch('home/info')
export const getUserList = (params) => fetch('report/user/list', params)
