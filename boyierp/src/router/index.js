import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Home from "@/views/Home";
import User from "@/views/sys/User"
import Role from "@/views/sys/Role";
import UserCenter from "@/views/UserCenter";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[    // 子页面列表
      {
        path:'/index',
        name:'Index',
        component:Index
      },
      {
        path:'/sys/user',
        name:'User',
        component:User
      },{
        path:'/sys/role',
        name:'Role',
        component:Role
      },
      {
        path:'/userCenter',
        name:'UserCenter',
        component:UserCenter
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
