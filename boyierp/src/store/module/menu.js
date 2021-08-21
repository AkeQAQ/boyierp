import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex)

export default {
    state:{
        menuList: '',
        menuInitFlag: false,
        authList:''
    },
    mutations:{
        SET_MENULIST: (state, menuList_p) => {
            state.menuList = menuList_p
            localStorage.setItem("menuList", menuList_p)
        },
        SET_MENUINITFLAG: (state, flag_p) => {
            state.menuInitFlag = flag_p
        },
        SET_AUTHLIST: (state, authList_p) => {
            state.authList = authList_p
            localStorage.setItem("menuList", authList_p)
        },
        reset(state){
            console.log("menu 重置")

            state.menuList = ''
            state.menuInitFlag = false
        }
    },
    actions:{

    },
    modules:{

    }

}