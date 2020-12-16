import request from '@/utils/request'
import qs from 'qs'

export function fetchNoticeList(query) {
    return request({
        url: '/nvsapi/Notice/QueryFilter',
        method: 'post',
        data: query
    })
}
export function postAddNotices(query) {
    return request({
        url: '/nvsapi/Notice/Add',
        method: 'post',
        data: query
    })
}

export function getNoticeInfo(id) {
    return request({
        url: `/nvsapi/Notice/Get/${id}`,
        method: 'get'
    })
}

export function updateANotice(query) {
    return request({
        url: '/nvsapi/Notice/Update',
        method: 'post',
        data: query
    })
}

export function deleteNotices(ids) {
    return request({
        url: '/nvsapi/Notice/Delete',
        method: 'post',
        data: ids
    })
}

export function notReadNotices(query) {
    return request({
        url: '/nvsapi/Notice/QueryNotRead',
        method: 'post',
        data: query
    })
}

//  更新公告为已读状态
export function upReadNotices(id) {
    return request({
        url: `/nvsapi/Notice/UpdateReadState?id=${id}`,
        method: 'post'
    })
}