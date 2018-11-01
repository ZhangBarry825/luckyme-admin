import request from '@/utils/request'
export function getUserInfo(){
  return request({
    url: '/api/admin/user/info',
    method: 'get'
  })
}

export function updateUserInfo(data){
  return request({
    url: '/api/admin/user/updateinfo',
    method: 'post',
    data
  })
}

export function uploadAvatar(data){
  return request({
    url: '/api/admin/upload/upload',
    method: 'post',
    data
  })
}

export function updatePassword(data){
  return request({
    url: '/api/admin/user/updatepwd',
    method: 'post',
    data
  })
}