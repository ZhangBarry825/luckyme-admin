import request from '@/utils/request'

export function mFetchList(query) {
  return request({
    url: '/api/admin/article/listarticle',
    method: 'get',
    params: query
  })
}
export function mFetchArticle(query) {
  return request({
    url: '/api/admin/article/detailarticle',
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
export function mSearchArticle(query) {
  return request({
    url: '/api/admin/article/searcharticle',
    method: 'get',
    params: query
  })
}
export function mCreateArticle(data) {
  return request({
    url: '/api/admin/article/createarticle',
    method: 'post',
    data
  })
}
export function mUpdateArticle(data) {
  return request({
    url: '/api/admin/article/updatearticle',
    method: 'post',
    data
  })
}
export function mCreateDraft(data) {
  return request({
    url: '/api/admin/draft/createdraft',
    method: 'post',
    data
  })
}
export function mFetchDraft(query) {
  return request({
    url: '/api/admin/draft/detaildraft',
    method: 'get',
    params: query
  })
}
export function mFetchDraftList(query) {
  return request({
    url: '/api/admin/draft/listdraft',
    method: 'get',
    params: query
  })
}
export function mSearchDraft(query) {
  return request({
    url: '/api/admin/draft/searchdraft',
    method: 'get',
    params: query
  })
}
export function mDeleteDraft(data) {
  return request({
    url: '/api/admin/draft/deletedraft',
    method: 'post',
    data
  })
}
export function mTypeList(query) {
  return request({
    url: '/api/home/article/listtype',
    method: 'get',
    params: query
  })
}
