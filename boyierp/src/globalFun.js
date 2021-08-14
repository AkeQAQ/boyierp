import Vue from 'vue'

// 全局方法
Vue.mixin({
    methods: {
        hasAuth(param) {

            var authority = this.$store.state.menu.authList
            console.log("权限判断，入参param:{},存储的auth:{}",param,authority)
            return authority.indexOf(param) > -1
        }
    }
})