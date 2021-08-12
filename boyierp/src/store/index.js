import Vue from 'vue'
import Vuex from 'vuex'

import menu from "@/store/module/menu";

import tab from "@/store/module/tab";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: ''

    },
    mutations: {
        SET_TOKEN: (state, token_p) => {
            state.token = token_p
            localStorage.setItem("token", token_p)
        },
        LOGOUT: (state) => {
            state.token = ''
            localStorage.clear()
            sessionStorage.clear()
        }


    },
    actions: {},
    modules: {
        menu    // 假如子模块 menu.js
        ,tab
    }
})
