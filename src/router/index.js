import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login/Login'
import Home from '../views/home/Home'
import Welcome from "../views/home/welcome/Welcome"
import Users from "../views/home/users/Users"
import Rights from "../views/home/power/Rights"
import Roles from "../views/home/power/Roles"
import Cate from "../views/home/goods/Cate"
import Params from "../views/home/params/Params"
import Goods from "../views/home/goodslist/Goods"
import Add from "../views/home/goods/Add"

Vue.use(VueRouter)

const routes = [
  {
    path:'',
    redirect:"/login"
  },
  {
    path:'/login',
    name:'Login',
    component:Login
  },
  {
    path:'/home',
    name:'Home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        name:'Welcome',
        component:Welcome
      },
      {
        path:'/users',
        name:'Users',
        component:Users
      },
      {
        path:'/rights',
        name:'Rights',
        component:Rights
      },
      {
        path:'/roles',
        name:'Roles',
        component:Roles
      },
      {
        path:'/categories',
        name:'Cate',
        component:Cate
      },
      {
        path:'/params',
        name:'Params',
        component:Params
      },
      {
        path:'/goods',
        name:'Goods',
        component:Goods
      },{
        path:'/goods/add',
        name:'Add',
        component:Add
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next) => {
  // 如果访问的是login页面直接放行
  if(to.path === '/login') return next()
  // 访问的是其他页面，判断sessionStorage中的token是否存在
  const sessionStr = window.sessionStorage.getItem('token')
  // token 不存在，则强制跳转到登录页面
  if(!sessionStr) return next('/login')
  //token 存在，放行
  next()
})

export default router
