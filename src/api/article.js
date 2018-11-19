import request from '@/utils/request'

export function mFetchList(query) {
  return request({
    url: '/api/admin/article/listarticle',
    method: 'get',
    params: query
  })
}
export function mDeleteArticle(data) {
  return request({
    url: '/api/admin/article/deletearticle',
    method: 'post',
    data
  })
}









export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
