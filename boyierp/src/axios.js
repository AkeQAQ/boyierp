import axios from "axios";
import router from "@/router";
import Element from "element-ui"

// axios.defaults.baseURL = "http://192.168.8.204:8081" // 定义请求的前缀
 axios.defaults.baseURL = "http://localhost:8081" // 定义请求的前缀

const request2 =axios.create({
    timeout:10000,
    headers:{
        'Authorization' : localStorage.getItem("token")
    }
})

// 声明请求实例
const request =axios.create({
    timeout:10000,
    headers:{
        'Content-Type':"application/json;charset=utf-8"
    }
})

// 请求前置拦截器
request.interceptors.request.use(config=>{
    // 给请求头添加 Authorization 信息
    config.headers['Authorization'] = localStorage.getItem("token")
    return config
})

// 请求后置拦截器
request.interceptors.response.use(response=>{
    let result = response.data
    console.log("请求后置拦截器==============响应的data内容:",result)
    console.log("请求后置拦截器==============响应的data内容:"+result.code)

    if(result.code === 200){
        return response
    }
    else {
        Element.Message.error(result.msg?result.msg:'系统异常',{duration:3*1000}) // 弹出框
        return Promise.reject(response.data.msg) // 拒绝请求后续执行
    }
},error => {

    // 这里是响应状态码就是错误时，才进入

    console.log("服务器出错："+error)
    console.log(error)

    if (error.response.data) {
        error.massage = error.response.data.msg
    }

    if (error.response.status === 401) {
        router.push("/login")
    }

    Element.Message.error(error.massage, {duration: 3000})
    return Promise.reject(error)
})

// 暴露出去，给其他地方引用
export {
    request,request2
}
