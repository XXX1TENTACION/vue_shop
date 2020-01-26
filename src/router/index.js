import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login/Login'
import Home from '../views/home/Home'
import Welcome from "../views/home/welcome/Welcome"
import Users from "../views/home/users/Users"

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
