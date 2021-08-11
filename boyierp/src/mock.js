// 引入mock
const Mock = require('mockjs') //引入mock数据，关闭则注释该行
const Random = Mock.Random

let Result = {
    code:200,
    msg:'操作成功',
    data:null
}

// 模拟登陆接口的返回
Mock.mock('/login','post',()=>{
    // Result.code = "400"
    // Result.msg="没有权限"
    Result.msg=""
    return Result
})

// 模拟获取用户信息
Mock.mock('/sys/getUserInfo','post',()=>{
     Result.data={
         id:"1",
         username:"孙克"
     }
    return Result
})

// 模拟获取用户信息
Mock.mock('/sys/user/updatePassword','post',()=>{
    Result.msg="修改成功"
    Result.code=200
    return Result
})

// 模拟登陆接口的返回
Mock.mock('/logout','post',()=>{
    return Result
})