import Vue from 'vue'
import Vuex from 'vuex'

import menu from "@/store/module/menu";

import tab from "@/store/module/tab";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '',
        user_info:{},
        producePriceData:{},
        craftData:{}
    },
    mutations: {
        SET_TOKEN: (state, token_p) => {
            state.token = token_p
            localStorage.setItem("token", token_p)
        },
        LOGOUT: (state) => {
            state.token = ''
            state.user_info = {}
            localStorage.clear()
            sessionStorage.clear()
        },
        SET_USERINFO:(state,user_info_p)=>{
            state.user_info = user_info_p;
            localStorage.setItem("user_info", user_info_p)
        },
        SET_PRODUCTPRICEDATA:(state,data)=>{
            state.producePriceData = data;
            localStorage.setItem("producePriceData", data)
        },
        SET_CRAFTDATA:(state,data)=>{
            state.craftData = data;
            localStorage.setItem("craftData", data)
        },

    },
    actions: {},
    modules: {
        menu    // 假如子模块 menu.js
        ,tab
    }
})
