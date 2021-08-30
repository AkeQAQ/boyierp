import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// 引入element 组件
import Element from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
Vue.use(Element)

//  引入axios 拦截器
import request from "./axios"
    // 把vue的axios 实例改成我们的
Vue.prototype.$axios = request

// // 引入mock，对请求进行拦截
// require("./mock.js")

import global from './globalFun'

// 引入了有双击事件的tree ：
// 1. 前提：npm install dbltree -S
// 2. 引入，
// 3. 使用 dbltree
import dbltree from 'dbltree'
Vue.use(dbltree)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
