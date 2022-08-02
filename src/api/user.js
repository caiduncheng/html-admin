import fetch from '@/utils/fetch'

export const getUserPage = (params) => fetch('online/authorization/user', params, 'GET')
export const lockUser = (userId) => fetch(`online/authorization/user/${userId}/lock`, null, 'POST')
export const unlockUser = (userId) => fetch(`online/authorization/user/${userId}/unlock`, null, 'POST')
export const editUserEmail = (data) => fetch(`online/authorization/user/email/update`, data, 'POST')
export const sendVerifyCode = (data) => fetch(`online/authorization/user/auth-code/email`, data, 'POST')

export const addUser = (data) => fetch(`online/authorization/user`, data, 'POST')
export const editUser = (data) => fetch(`online/authorization/user/${data.userId}`, data, 'POST')
export const getUser = (userId) => fetch(`online/authorization/user/${userId}`, null, 'GET')
export const getselfInfoFull = () => fetch(`online/authorization/user-self/user/info`, null, 'GET')
export const updateUserInfoFull = (data) => fetch(`online/authorization/user-self/user/info/update`, data, 'POST')
