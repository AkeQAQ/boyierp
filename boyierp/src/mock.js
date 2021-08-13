// 引入mock
const Mock = require('mockjs') //引入mock数据，关闭则注释该行
const Random = Mock.Random

let Result = {
    code: 200,
    msg: '操作成功',
    data: null
}

// 模拟登陆接口的返回
Mock.mock('/login', 'post', () => {
    // Result.code = "400"
    // Result.msg="没有权限"
    Result.msg = ""
    return Result
})

// 模拟获取用户信息
Mock.mock('/sys/getUserInfo', 'post', () => {
    Result.data = {
        id: "1",
        username: "孙克"
    }
    return Result
})

// 模拟更改密码
Mock.mock('/sys/user/updatePassword', 'post', () => {
    Result.msg = "修改成功"
    Result.code = 200
    return Result
})

// 模拟登出接口的返回
Mock.mock('/logout', 'post', () => {
    return Result
})

// 获取导航列表数据
Mock.mock('/sys/menu/navList', 'post', () => {
    let menuList = [
        {
            title: '系统管理',
            icon: 'el-icon-s-operation',
            children: [
                {
                    routerName: 'Index', // 首页的目前有地方是写死了，所以这个不能改
                    title: '首页',
                    icon: 'el-icon-user',
                    path: '/index',
                    component: 'Index'
                },
                {
                    routerName: 'User',
                    title: '用户管理',
                    icon: 'el-icon-user',
                    path: '/sys/user',
                    component: 'sys/User'
                },
                {
                    routerName: 'Role', // 该路由名称
                    title: '角色管理',
                    icon: 'el-icon-user-solid',
                    path: '/sys/role',// url
                    component: 'sys/Role'// view的路径

                }, {
                    routerName: 'Menu', // 该路由名称
                    title: '菜单管理',
                    icon: 'el-icon-user-solid',
                    path: '/sys/menu',// url
                    component: 'sys/Menu'// view的路径

                },
                {
                    routerName: 'UserCenter',
                    title: '修改密码',
                    icon: 'el-icon-user-solid',
                    path: '/userCenter',
                    component: 'UserCenter'

                }
            ]
        }, {
            title: '系统工具',
            icon: 'el-icon-setting',
            children: [
                {
                    routerName: 'BaseData',
                    title: '基础数据管理',
                    icon: 'el-icon-s-order',
                    path: '/sysTool/baseData',
                    component: 'sysTool/BaseData'
                }
            ]
        }
    ]
    Result.data = {
        nav: menuList
    }
    console.log("data:" + menuList)

    return Result
})

// 菜单功能-获取菜单全部的列表数据
Mock.mock('/sys/menu/list', 'post', () => {

    Result.data =
        [{
            id: 1,
            menuName: '系统管理',
            authority: '',
            icon: 'el-icon-s-operation',
            type: 0,
            URL: '',
            component: '',
            orderType: '',
            status: 0,
            children: [{
                id: 2,
                menuName: '用户管理',
                authority: '系统管理-用户管理',
                icon: 'el-icon-user',
                type: 1,
                URL: '/sys/user',
                component: 'sys/User',
                orderType: '',
                status: 1
            }]
        }, {
            id: 3,
            menuName: '系统工具',
            authority: '',
            icon: 'el-icon-setting',
            type: 0,
            URL: '',
            component: '',
            orderType: '',
            status: 0
        }]
    return Result
})

// 菜单功能-新增接口
Mock.mock('/sys/menu/save', 'post', (param) => {
    console.log("新增 参数",param)
    return Result
})

// 菜单功能-修改接口
Mock.mock('/sys/menu/update', 'post', () => {
    return Result
})

// 菜单功能-根据id查询接口
Mock.mock(RegExp('/sys/menu/queryById*'), 'get', (param) => {
    console.log("queryById 方法入参 ",param)

    Result.data = {
        id: 2,
        parentId:2,
        menuName: '用户管理',
        authority: '系统管理-用户管理',
        icon: 'el-icon-user',
        type: "1",
        URL: '/sys/user',
        component: 'sys/User',
        orderType: '',
        status: "1"
    }
    return Result
})

// 菜单功能-删除接口
Mock.mock(RegExp('/sys/menu/del*'), 'get', () => {
    return Result
})



// 角色功能-新增接口
Mock.mock('/sys/role/save', 'post', (param) => {
    console.log("新增 参数",param)
    return Result
})

// 角色功能-修改接口
Mock.mock('/sys/role/update', 'post', () => {
    return Result
})


// 角色功能-根据id查询接口
Mock.mock(RegExp('/sys/role/queryById*'), 'get', (param) => {
    console.log("queryById 方法入参 ",param)

    Result.data = {
        id: 2,
        code:'123231',
        roleName: '超级管理员',
        content: '拥有全部权限',
        status: "1"
    }
    return Result
})


// 角色功能-获取列表数据
Mock.mock('/sys/role/list', 'post', (param) => {
    console.log("获取列表数据 ，请求入参:",param)
    Result.data =
        {
            tableData: [{

                id: 1,
                code:'1',
                roleName: "超级管理员",
                content: '拥有全部权限',
                status: 1
            },{
                id: 2,
                code:'2',
                roleName: '普通用户',
                content: '部分权限',
                status: 0
            }],
            totalNum:2
        }

    return Result
})

// 角色功能-删除接口
Mock.mock(RegExp('/sys/role/del'), 'post', (param) => {
    console.log("删除 入参:",param)
    return Result
})
