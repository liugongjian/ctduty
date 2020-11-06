import request from '@/utils/request'

// 算法列表
export function taskList(query) {
  return request({
    url: '/nvsapi/task/QueryActive',
    method: 'post',
    data: query
  })
}
