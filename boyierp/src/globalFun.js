import Vue from 'vue'

// 全局方法
Vue.mixin({
    methods: {
        hasAuth(param) {
            var authority = this.$store.state.menu.authList
            return authority.indexOf(param) > -1
        },

    }
})
function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
function numSeq(a,b){
    if (a>b) {
        return 1;
    }else if(a<b){
       return -1
   }else{
       return 0;
   }
}

export default {
    numSeq
}
