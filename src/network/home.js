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

// 请求权限列表数据
export function getPowerlist(type){
  return request({
    url:'rights/'+type
  })
}

// 角色列表
export function getRolesList(){
  return request({
    url:'roles'
  })
}

// 添加角色
export function addRole(data){
  // console.log(data.roleName)
  return request({
    url:'roles',
    method:'post',
    data:{
      roleName: data.roleName,
      roleDesc: data.roleDesc
    }
  })
}

// 修改角色
export function editRole(roleInfo){
  return request({
    method:'put',
    url:`roles/${roleInfo.id}`,
    data:{
      roleName: roleInfo.roleName,
      roleDesc: roleInfo.roleDesc
    }
  })
}

// 删除角色
export function deleteRole(id){
  return request({
    url:`roles/${id}`,
    method:'delete'
  })
}

// 删除权限
export function deleteRoleById(roleId,id){
  return request({
    url:`roles/${roleId}/rights/${id}`,
    method:'delete'
  })
}

// 角色授权
export function setRole(roleId,idStr){
  return request({
    url:`roles/${roleId}/rights`,
    method:'post',
    data:{
      rids:idStr
    }
  })
}

// 分配角色
export function roleAdd(userId,roleID){
  return request({
    url:`users/${userId}/role`,
    method:'put',
    data:{
      rid:roleID
    }
  }) 
}
