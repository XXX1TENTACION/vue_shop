import request from './request'

export function getLoginData(formData){
  return request({
    url:'login',
    params:{
      username:formData.username,
      password:formData.password
    }
  })
}