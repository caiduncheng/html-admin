import fetch from '@/utils/fetch'

export const getMessageRecords = (params) => fetch('online/contact-us/message-record/records', params, 'GET')

export const addRemark = (params) => fetch(`online/contact-us/message-record/add-remark?messageRecordId=${params.messageRecordId}&remark=${params.remark}`, null, 'POST')
