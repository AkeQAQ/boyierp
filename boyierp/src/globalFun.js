import Vue from 'vue'

// 全局方法
Vue.mixin({
    methods: {
        hasAuth(param) {

            var authority = this.$store.state.menu.authList
            return authority.indexOf(param) > -1
        }
    }
})