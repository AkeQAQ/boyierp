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
             /*   {
                    routerName: 'Index', // 首页的目前有地方是写死了，所以这个不能改
                    title: '首页',
                    icon: 'el-icon-user',
                    path: '/index',
                    component: 'Index'
                },*/
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

                }
                /*,
                {
                    routerName: 'UserCenter',
                    title: '修改密码',
                    icon: 'el-icon-user-solid',
                    path: '/userCenter',
                    component: 'UserCenter'

                }*/
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

    console.log("获取权限数据 nav 导航:", menuList)

    let authorities = ["sysManage","sysManage:user:list","sysManage:user:save","sysManage:user:update","sysManage:user:del"
        ,"sysManage:user:resetPass","sysManage:user:authority"
        ,"sysManage:role:list","sysManage:role:save","sysManage:role:update","sysManage:role:del","sysManage:role:authority"
        ,"sysManage:menu:list","sysManage:menu:save","sysManage:menu:update","sysManage:menu:del"

    ]
    Result.data = {
        nav: menuList,
        auth:authorities
    }

    return Result
})

// 菜单功能-获取菜单全部的列表数据
Mock.mock('/sys/menu/list', 'post', () => {

    Result.data =
        [{
            id: 1,
            menuName: '系统管理',
            authority: 'sysManage',
            icon: 'el-icon-s-operation',
            type: 0,
            URL: '',
            component: '',
            orderType: '',
            status: 0,
            children: [{
                id: 2,
                menuName: '用户管理',
                authority: 'sysManage:user:list',
                icon: 'el-icon-user',
                type: 1,
                URL: '/sys/user',
                component: 'sys/User',
                orderType: '',
                status: 1,
                children:[{
                    id: 21,
                    menuName: '添加用户',
                    authority: 'sysManage:user:save',
                    type: 2,
                    status: 0
                },
                    {
                        id: 22,
                        menuName: '编辑用户',
                        authority: 'sysManage:user:update',
                        type: 2,
                        status: 0
                    },
                    {
                        id: 23,
                        menuName: '删除用户',
                        authority: 'sysManage:user:del',
                        type: 2,
                        status: 0
                    },
                    {
                        id: 24,
                        menuName: '重置密码',
                        authority: 'sysManage:user:resetPass',
                        type: 2,
                        status: 0
                    },
                    {
                        id: 25,
                        menuName: '分配角色',
                        authority: 'sysManage:user:authority',
                        type: 2,
                        status: 0
                    }]
            },
                {
                    id: 3,
                    menuName: '角色管理',
                    authority: 'sysManage:role:list',
                    icon: 'el-icon-user',
                    type: 1,
                    URL: '/sys/role',
                    component: 'sys/Role',
                    orderType: '',
                    status: 1,
                    children:[{
                        id: 31,
                        menuName: '添加角色',
                        authority: 'sysManage:role:save',
                        type: 2,
                        status: 0
                    },
                        {
                            id: 32,
                            menuName: '编辑角色',
                            authority: 'sysManage:user:update',
                            type: 2,
                            status: 0
                        },
                        {
                            id: 33,
                            menuName: '删除角色',
                            authority: 'sysManage:role:del',
                            type: 2,
                            status: 0
                        },
                        {
                            id: 34,
                            menuName: '分配菜单',
                            authority: 'sysManage:role:authority',
                            type: 2,
                            status: 0
                        }]
                }]
        }, {
            id: 4,
            menuName: '系统工具',
            authority: 'sysTool',
            icon: 'el-icon-setting',
            type: 0,
            URL: '',
            component: '',
            orderType: '',
            status: 0,
            children: [{
                id: 5,
                menuName: '基础数据管理',
                authority: 'sysTool:baseData:list',
                icon: 'el-icon-user',
                type: 1,
                URL: '/sysTool/baseData',
                component: 'sysTool/BaseData',
                orderType: '',
                status: 1
            }
            ]
        }]
    return Result
})

// 菜单功能-新增接口
Mock.mock('/sys/menu/save', 'post', (param) => {
    console.log("新增 参数", param)
    return Result
})

// 菜单功能-修改接口
Mock.mock('/sys/menu/update', 'post', (param) => {
    console.log("修改 参数", param)

    return Result
})

// 菜单功能-根据id查询接口
Mock.mock(RegExp('/sys/menu/queryById*'), 'get', (param) => {
    console.log("queryById 方法入参 ", param)

    Result.data = {
        id: 2,
        parentId: 2,
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
    console.log("新增 参数", param)
    return Result
})

// 角色功能-修改接口
Mock.mock('/sys/role/update', 'post', (param) => {
    console.log("修改 参数", param)

    return Result
})


// 角色功能-根据id查询接口
Mock.mock(RegExp('/sys/role/queryById*'), 'get', (param) => {
    console.log("queryById 方法入参 ", param)

    Result.data = {
        id: 2,
        code: '123231',
        roleName: '超级管理员',
        content: '拥有全部权限',
        status: "1"
    }
    return Result
})


// 角色功能-获取列表数据
Mock.mock('/sys/role/list', 'post', (param) => {
    console.log("获取列表数据 ，请求入参:", param)
    Result.data =
        {
            tableData: [{

                id: 1,
                code: '1',
                roleName: "超级管理员",
                content: '拥有全部权限',
                status: 1
            }, {
                id: 2,
                code: '2',
                roleName: '普通用户',
                content: '部分权限',
                status: 0
            }],
            totalNum: 2
        }

    return Result
})


// 角色功能-获取全部角色数据
Mock.mock('/sys/role/listAll', 'post', (param) => {
    console.log("获取全部角色列表数据 ，请求入参:", param)
    Result.data =[{

                id: 1,
                roleName: "超级管理员"
            }, {
                id: 2,
                roleName: '普通用户'
            }]
    return Result
})


// 角色功能-删除接口
Mock.mock(RegExp('/sys/role/del'), 'post', (param) => {
    console.log("删除 入参:", param)
    return Result
})

// 菜单功能-获取该角色拥有的菜单 id数组
Mock.mock(RegExp('/sys/role/queryMenusByRoleId*'), 'get', (param) => {
    console.log("queryMenusByRoleId 方法入参 ", param)

    Result.data = [2,4]
    return Result
})

// 菜单功能- 修改该角色拥有的菜单 id数组
Mock.mock('/sys/role/updateOwnMenus', 'post', (param) => {
    console.log("updateOwnMenus 方法入参 ", param)
    return Result
})





// 用户功能-获取列表数据
Mock.mock('/sys/user/list', 'post', (param) => {
    console.log("获取用户列表数据 ，请求入参:", param)
    Result.data =
        {
            tableData: [{

                id: 1,
                userName: "admin",
                roleName: "超级管理员",
                email: "123321@qq.com",
                mobile: '112321312',
                status: 0
            }, {
                id: 2,
                userName: "test",
                roleName: "普通用户",
                email: "123321@qq.com",
                mobile: '112321312',
                status: 1
            }],
            totalNum: 2
        }

    return Result
})


// 用户功能-新增接口
Mock.mock('/sys/user/save', 'post', (param) => {
    console.log("新增 参数", param)
    return Result
})

// 用户功能-修改接口
Mock.mock('/sys/user/update', 'post', (param) => {
    console.log("修改 参数", param)

    return Result
})
// 角色功能-根据id查询接口
Mock.mock(RegExp('/sys/user/queryById*'), 'get', (param) => {
    console.log("queryById 方法入参 ", param)

    Result.data = {
        id: 1,
        userName: "admin",
        roleName: "超级管理员",
        email: "123321@qq.com",
        mobile: '112321312',
        status: "0"
    }
    return Result
})

// 用户功能-获取该角色拥有的菜单 id数组
Mock.mock(RegExp('/sys/user/queryRolesByUserId*'), 'get', (param) => {
    console.log("queryRolesByRoleId 方法入参 ", param)
    Result.data = [1]
    return Result
})


// 用户功能-修改该用户拥有的菜单 id数组
Mock.mock('/sys/user/updateOwnRoles', 'post', (param) => {
    console.log("updateOwnMenus 方法入参 ", param)
    return Result
})
// 用户功能- 重置密码
Mock.mock('/sys/user/resetPass', 'post', (param) => {
    console.log("resetPass 方法入参 ", param)
    return Result
})