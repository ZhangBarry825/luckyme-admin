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
    url: '/api/admin/articletype/listtype',
    method: 'get',
    params: query
  })
}
export function mDeleteType(data) {
  return request({
    url: '/api/admin/articletype/deletetype',
    method: 'post',
    data
  })
}
