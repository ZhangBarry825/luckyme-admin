import request from '@/utils/request'

export function mCreateType(data) {
  return request({
    url: '/api/admin/articletype/createtype',
    method: 'post',
    data
  })
}
export function mFetchTypeList(query) {
  return request({
    url: '/api/admin/article/listtype',
    method: 'get',
    params: query
  })
}
export function mDeleteType(data) {
  return request({
    url: '/api/admin/article/deletetype',
    method: 'post',
    data
  })
}
