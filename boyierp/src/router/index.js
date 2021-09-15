import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Home from "@/views/Home";
import UserCenter from "@/views/UserCenter";

import {request} from "@/axios";
import store from "@/store"


Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/index',
                name: 'Index',
                component: Index,
                meta:{
                    title:'首页'
                }
            }, {
                path: '/userCenter',
                name: 'UserCenter',
                component: UserCenter,
                meta:{
                    title:'个人中心'
                }
            }

        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login')
    },
    {
        path: '/luckysheet/craft',
        name: 'LKCraft',
        component: () => import('../views/luckysheet/craft')
    },
    {
        path: '/luckysheet/craft',
        name: 'LKCraft_demo',
        component: () => import('../views/luckysheet/craftDemo')
    },
    {
        path: '/luckysheet/craft',
        name: 'LKCraft_real',
        component: () => import('../views/luckysheet/craftReal')
    },
    {
        path: '/luckysheet/productPrice',
        name: 'LKProductPrice',
        component: () => import('../views/luckysheet/productPrice')
    },
    {
        path: '/luckysheet/productPriceDemo',
        name: 'LKProductPrice_demo',
        component: () => import('../views/luckysheet/productPriceDemo')
    },
    {
        path: '/luckysheet/productPriceReal',
        name: 'LKProductPrice_real',
        component: () => import('../views/luckysheet/productPriceReal')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 前置拦截
router.beforeEach((to, from, next) => {
    // 1. 判断是否已经加载过路由,有则返回，无则继续
    console.log("menuInitFlag :"+store.state.menu.menuInitFlag )
    if(store.state.menu.menuInitFlag === true){
        console.log("已经初始化过路由")
        next()
    }else if(to.path==='/login' || to.path==='/Login'){
        console.log("当前是login 路径，不需要")
        next()
    }else if (to.path == '/' || to.path == '')
    {    next({path: "/index"})  }
    else if(store.state.menu.menuInitFlag === false){
        const newRoutes = router.options.routes;
        console.log("刚刚开始的路由信息:",router.options.routes)
        // 2. 获取路由信息
        request.get('/sys/menu/navList').then(res => {
            // 根路由对象
            res.data.data.nav.forEach(menu => {
                if (menu.children && menu.status === 0) {
                    console.log(menu.children)

                    menu.children.forEach(e => {
                        let route = menuToRoute(e)
                        if (route) {
                            newRoutes[0].children.push(route)
                            console.log(newRoutes[0])
                        }
                    })
                }
            })
            // 3. 存储路由信息

            router.addRoutes(newRoutes)
            console.log("设置后的路由信息:",router.options.routes)
            store.commit("SET_MENULIST", res.data.data.nav)
            store.commit("SET_MENUINITFLAG",true)
            console.log("store存储菜单信息",res.data.data.nav)

            // 4. 存储权限信息
            console.log("store存储权限信息",res.data.data.auth)
            store.commit("SET_AUTHLIST",res.data.data.auth)


            next({path:to.path})

        })

    }else {
        next()
    }

})


const menuToRoute = (menu) => {
    if (!menu.component ) {
        return null
    }

    let route = {
        name: menu.routerName,
        path: menu.path,

        // $route(to,from) 路由设置其他 额外信息，比如 title中文
        meta:{
            title:menu.title
        }

    }
    // route.component =() => import('../views/Home')
    route.component = () => import ('@/views/' + menu.component +'.vue')
    return route
}


export default router
