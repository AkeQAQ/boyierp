import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Home from "@/views/Home";
import User from "@/views/sys/User"
import Role from "@/views/sys/Role";
import UserCenter from "@/views/UserCenter";
import axios from "@/axios";
import store from "@/store"
import ro from "element-ui/src/locale/lang/ro";


Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            /*{
                path: '/index',
                name: 'Index',
                component: import('../views/Index')
            }*/
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

// 前置拦截


router.beforeEach((to, from, next) => {
    // 1. 判断是否已经加载过路由,有则返回，无则继续
    console.log("menuInitFlag :"+store.state.menu.menuInitFlag )
    if(store.state.menu.menuInitFlag === true){
        console.log("已经初始化过路由")
        next()
    }else if(to.path==='/login'){
        console.log("当前是login 路径，不需要")
        next()
    }else if (to.path == '/' || to.path == '')
    {    next({path: "/index"})  }
    else if(store.state.menu.menuInitFlag === false){
        const newRoutes = router.options.routes;
        console.log(newRoutes)
        // 2. 获取路由信息
        axios.post('/sys/menu/navList', 'post').then(res => {
            // 根路由对象
            var a = 1
            res.data.data.nav.forEach(menu => {
                if (menu.children) {
                    console.log(menu.children)

                    menu.children.forEach(e => {
                        let route = menuToRoute(e)
                        console.log(a)
                        a++
                        if (route) {
                            newRoutes[0].children.push(route)
                            console.log(newRoutes[0])
                        }
                    })
                }
            })
            // 3. 存储路由信息

            router.addRoutes(newRoutes)
            console.log(newRoutes)
            store.commit("SET_MENULIST", res.data.data.nav)
            store.commit("SET_MENUINITFLAG",true)
            next({path:to.path})

        })

    }else {
        next()
    }

})


const menuToRoute = (menu) => {
    if (!menu.component) {
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
