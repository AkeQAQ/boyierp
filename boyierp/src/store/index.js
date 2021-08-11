import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:''
  },
  mutations: {
    SET_TOKEN:(state,token_p) =>{
      state.token = token_p
      localStorage.setItem("token",token_p)
    },
    LOGOUT:(state)=>{
      state.token=''
      localStorage.clear()
      sessionStorage.clear()
    }
  },
  actions: {
  },
  modules: {
  }
})
