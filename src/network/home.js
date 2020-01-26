import request from './request'

// 获取菜单栏数据
export function getMenuList(){
  return request({
    url:'menus'
  })
}

// 获取用户列表数据
export function getUserList(params){
  return request({
    url:'users',
    params
  })
}

// 修改用户状态
export function changeStatus(userInfo){
  return request({
    method:'put',
    url:`users/${userInfo.id}/state/${userInfo.mg_state}`
  })
}

// 添加用户
export function addUser(data){
  return request({
    method:'post',
    url:'users',
    data
  })
}

// 修改用户
export function editUser(userInfo){
  return request({
    method:'put',
    url:`users/${userInfo.id}`,
    data:{
      email: userInfo.email,
      mobile: userInfo.mobile
    }
  })
}

// 删除用户
export function deleteUser(id){
  return request({
    method:'delete',
    url:`users/${id}`
  })
}