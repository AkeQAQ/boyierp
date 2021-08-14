import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex)

export default {
    state: {
        editableTabsValue: '',
        editableTabs: [
            {
                name:"Index",
                title:"首页"
            }
        ]
    },
    mutations: {
        // 添加tab 数值，已存在则不加
        addTab(state, param) {
            console.log("添加tab ",param,state.editableTabs)
            let index = state.editableTabs.findIndex(item =>item.name === param.routerName)
            if(index === -1){
                state.editableTabs.push({name:param.routerName,title:param.title})
            }
            state.editableTabsValue = param.routerName;
            console.log(state.editableTabsValue)
            console.log(state.editableTabs)

        },
        reset(state){
            console.log("tab 重置")
            state.editableTabsValue= ''
            state.editableTabs =  [
                {
                    name:"Index",
                    title:"首页"
                }
            ]
        }
    },
    actions: {},
    modules: {}

}