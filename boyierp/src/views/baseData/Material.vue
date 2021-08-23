<template>

  <el-container>
    <el-aside width="200px">


      <!-- 物料分组按钮 -->
      <el-button type="text" size="small" v-if="hasAuth('baseData:material:save')" @click="addGroup()">新增分组</el-button>
      <el-button type="text" size="small" v-if="hasAuth('baseData:material:update')" @click="updateGroup()">修改分组
      </el-button>
      <el-button type="text" v-if="hasAuth('baseData:material:del') ">
        <!-- 气泡确认框 -->
        <template>
          <el-popconfirm @confirm="del2()"
                        :title="'确定删除分组: ['+this.lastClickTreeNode.label+'] 吗?'" >
            <el-button type="text" size="small" slot="reference">删除分组</el-button>
          </el-popconfirm>
        </template>
      </el-button>

      <!-- 物料分组Tree -->
      <dbltree  ref="groupTree"
               node-key="id"
               :default-expanded-keys="defaulExpandedKeys"
               style="font-weight: bold"
               :highlight-current=true
               :data="groupData" :props="groupDefaultProps" @node-click="handleNodeClick"
                @node-dblClick="nodeDbClick"
       >

      </dbltree>

      <!-- 物料分组弹框 -->
      <el-dialog
          title="物料分组信息"
          :visible.sync="groupDialogVisible"
          width="30%"
          :before-close="handleClose_group"
      >

        <el-form :model="groupEditForm" :rules="groupRules" ref="groupEditForm" label-width="100px"
                 class="demo-editForm">
          <el-form-item v-show="false" label="id" prop="id">
            <el-input v-model="groupEditForm.id"></el-input>
          </el-form-item>
          <el-form-item v-show="false" label="parentId" prop="parentId">
            <el-input v-model="groupEditForm.parentId"></el-input>
          </el-form-item>

          <el-form-item label="上级分组" prop="parentCode">
            <el-input v-model="groupEditForm.parentCode"
                      :disabled="true">
            </el-input>
          </el-form-item>

          <el-form-item label="编码" prop="code">
            <el-input v-model="groupEditForm.code"></el-input>
          </el-form-item>

          <el-form-item label="名称" prop="name">
            <el-input v-model="groupEditForm.name"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="groupSubmitForm('groupEditForm',)">完成</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>


    </el-aside>
        <!-- 右侧物料列表 -->
        <el-main>
            <el-form :inline="true" class="demo-form-inline">

              <el-form-item>
                <div style="margin-top: 0px;">
                  <el-input placeholder="请输入搜索关键字" v-model="searchStr" clearable class="input-with-select">
                    <el-select v-model="select" style="width: 120px"  slot="prepend" placeholder="搜索字段">
                      <el-option label="唯一编码" value="id"></el-option>
                      <el-option label="分组编码" value="groupId"></el-option>
                      <el-option label="子编码" value="subId"></el-option>
                      <el-option label="名称" value="name"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search"  @click="getMaterialList"></el-button>

                  </el-input>

                </div>
              </el-form-item>

              <el-form-item v-if="hasAuth('baseData:material:save')">
                <el-button type="primary" v-if="hasAuth('baseData:material:save')"  @click="addMaterial()">新增</el-button>
              </el-form-item>

              <el-form-item v-if="hasAuth('baseData:material:del')">
                <el-popconfirm @confirm="del(null)" title="确定删除吗？" >
                  <el-button :disabled="this.multipleSelection.length === 0 " type="danger" slot="reference">批量删除</el-button>
                </el-popconfirm>
              </el-form-item>

            </el-form>

            <el-table

                ref="multipleTable"
                :data="tableData"
                border
                stripe
                fit
                size="mini"
                tooltip-effect="dark"
                style="width: 100%"
                :cell-style="{padding:'0'}"
                @selection-change="handleSelectionChange">
              <el-table-column
                  type="selection"
                  width="40">
              </el-table-column>
              <el-table-column
                  label="唯一编码"
                  prop="id"
                  sortable
                  >
              </el-table-column>
              <el-table-column
                  label="分组编码"
                  prop="groupId">
              </el-table-column>
              <el-table-column
                  label="子编码"
                  prop="subId"

              >
              </el-table-column>

              <el-table-column
                  prop="name"
                  label="名称"
                  show-overflow-tooltip>
              </el-table-column>

              <el-table-column
                  prop="specs"
                  label="规格型号"
                  show-overflow-tooltip>
              </el-table-column>

              <el-table-column
                  prop="unit"
                  label="基本单位"
                  show-overflow-tooltip>
              </el-table-column>


              <el-table-column
                  prop="status"
                  label="状态">
                <template slot-scope="scope">
                  <el-tag size="small" v-if="scope.row.status === 0" type="success">正常</el-tag>
                  <el-tag size="small" v-else-if="scope.row.status===1" type="danger">禁止</el-tag>

                </template>
              </el-table-column>

              <el-table-column
                  prop="action"
                  label="操作"
                  width="100px"
                  fixed="right"
              >
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="edit(scope.row.id)" v-if="hasAuth('baseData:material:update')   ">编辑</el-button>
                  <el-divider direction="vertical" v-if="hasAuth('baseData:material:del')   "></el-divider>

                  <el-button style="padding: 0px" type="text"v-if="hasAuth('baseData:material:del')   ">
                    <template>
                      <el-popconfirm  @confirm="del(scope.row.id)"
                                     title="确定删除吗？"
                      >
                        <el-button type="text" size="small" slot="reference">删除</el-button>
                      </el-popconfirm>
                    </template>
                  </el-button>

                </template>
              </el-table-column>

            </el-table>

            <!-- 物料列表 弹窗 -->
            <el-dialog
                title="物料信息"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
            >

              <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-form-item  v-if="false" label="唯一编码" prop="id">
                  <el-input   v-model="editForm.id" ></el-input>
                </el-form-item>

                <el-form-item label="子编码" prop="subId">
                  <el-input style="width: 80px"  v-model="editForm.groupId" :disabled="true" ></el-input>

                  <el-input style="width: 40%"  v-model="editForm.subId" :disabled="this.addOrUpdate==='update'" ></el-input>
                </el-form-item>

                <el-form-item label="名称" prop="name">
                  <el-input v-model="editForm.name"></el-input>
                </el-form-item>

                <el-form-item label="规格型号" prop="specs">
                  <el-input v-model="editForm.specs"></el-input>
                </el-form-item>

                <el-form-item label="基本单位" prop="unit">

                  <!-- 搜索框 -->
                  <el-autocomplete
                      class="inline-input"
                      v-model="editForm.unit"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入内容"
                      @select="handleSelect"
                  >

                  </el-autocomplete>

                </el-form-item>

                <el-form-item label="状态" prop="status">
                  <el-radio-group v-model="editForm.status">
                    <el-radio :label=0>正常</el-radio>
                    <el-radio :label=1>禁止</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="submitForm('editForm',addOrUpdate)">完成</el-button>

                </el-form-item>
              </el-form>

            </el-dialog>

            <!--物料列表 分页组件 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="this.currentPage"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="this.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="this.total">
            </el-pagination>
        </el-main>
  </el-container>


</template>

<script>
export default {
  name: "Material",

  data() {
    return {
      select:'',
      defaulExpandedKeys: [0],
      currentPage: 1 // 当前页
      , pageSize: 100 // 一页多少条
      , total: 0 // 总共多少数据
      , searchStr: '',
      searchMaterialField:'',
      addOrUpdate: 'save',
      editForm: {
        status: 0, // 编辑表单初始默认值
        id:'',
        groupId:'',
        subId:'',
        name:'',
        unit:'',
        specs:''
      },
      rules: {
        subId: [
          {required: true, message: '请输入子编码', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        unit: [
          {required: true, message: '请输入单位', change: 'blur'}
        ],
        status: [
          {required: true, message: '请输入状态', trigger: 'blur'}
        ]
      }
      ,
      // 物料分组 编辑表单
      groupEditForm: {
        parentId: 0 // 初始默认值
      },
      // 物料分组 校验规则
      groupRules: {
        name: [
          {required: true, message: '请输入分组名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入编码', trigger: 'blur'}
        ]
      },
      dialogVisible: false,
      groupDialogVisible: false, // 物料分组的弹窗标识
      tableData: [],
      multipleSelection: [] // 多选框数组
      ,
      authorityTreeData: [],
      defaultProps: {
        label: 'name'
      },
      authorityDialogVisible: false,
      authorityForm: {},
      // 物料分组 Tree数据
      groupData: [
        {
          parentId: '',
          code: ''
        }
      ],
      // 物料分组 Tree 配置
      groupDefaultProps: {
        children: 'children',
        label: 'label'
      },
      // 物料分组 上次点击的TreeNode
      lastClickTreeNode: {},

      // 搜索框列表数据存放
      restaurants: [
      ]/*,
      // 搜索字段 数据存放
      restaurants2: [
        {value:'唯一编码'},{value:'分组编码'},{value:'子编码'},{value:'名称'}
      ]*/
    }
  },
  methods: {

    nodeDbClick(event,data){
      console.log("双击获取分组的ID：",data.id)
      this.$axios.get('/baseData/material/listByGroupId', {
        params: {
          currentPage: this.currentPage
          , pageSize: this.pageSize
          , total: this.total
          , searchStr:  data.code
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total

        this.select = "groupId"
        if(data.code ==='全部'){
          this.searchStr=''
        }else {
          this.searchStr=data.code
        }

      })
    },

    // 获取基本单位的所有数据
    loadUnitAll() {
      this.$axios.post('/baseData/unit/getSearchAllData', this.editForm).then(res => {
          this.restaurants = res.data.data
      })
    },
/*
    // 查询搜索字段类型
    querySearch2(queryString, cb) {
      var restaurants2 = this.restaurants2;
      var results = queryString ? restaurants2.filter(this.createFilter(queryString)) : restaurants2;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },*/

    // 查询搜索框列表数据
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },

    // 物料列表 点击添加按钮
    addMaterial(){

      if(this.lastClickTreeNode.id===undefined ){
        this.$message({
          message: '请选择一层分组!',
          type: 'error'
        });
      }else if(this.lastClickTreeNode.id===0){
        this.$message({
          message: '请选择全部的子分组!',
          type: 'error'
        });
      }
      else {
        this.editForm.groupId = this.lastClickTreeNode.code;
        this.dialogVisible = true
        this.addOrUpdate='save'

      }
    },

    // 物料分组 点击添加按钮
    addGroup() {

      if(this.lastClickTreeNode.id === undefined){
        this.$message({
          message: '请选择一层菜单!',
          type: 'error'
        });
      }
      else if (this.lastClickTreeNode.parentId === 0 || this.lastClickTreeNode.id === 0) {

        if (this.lastClickTreeNode) {
          this.groupEditForm = {
            parentId: this.lastClickTreeNode.id,
            parentCode: this.lastClickTreeNode.code
          }
        }
        this.groupDialogVisible = true
        console.log("添加页面的parentId,parentCode:", this.groupEditForm.parentId, this.groupEditForm.parentCode)
      } else {
        this.$message({
          message: '只允许2层菜单!请重新选择',
          type: 'error'
        });
      }
    },
    // 物料分组 点击修改按钮
    updateGroup() {
      console.log("上一次选中的TreeNode:", this.lastClickTreeNode)
      if (this.lastClickTreeNode.id != undefined) {
        this.groupEditForm =
            {
              id: this.lastClickTreeNode.id,
              code: this.lastClickTreeNode.code,
              label: this.lastClickTreeNode.label,
              name: this.lastClickTreeNode.name,
              parentId: this.lastClickTreeNode.parentId,
              parentCode: this.lastClickTreeNode.parentCode,
            }
        ;
        this.groupDialogVisible = true
      } else {
        this.$message({
          message: '请选择一个分组!',
          type: 'error'
        });
      }
    },
    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getMaterialList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getMaterialList()

    },
    // 多选框方法
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      console.log("多选框 val ", val)
      this.multipleSelection = []

      val.forEach(theId => {
          this.multipleSelection.push(theId.id)
      })
      console.log("多选框 选中的 ", this.multipleSelection)
    },
    // 表单提交
    submitForm(formName,methodName) {
      this.$refs[formName].validate((valid) => {
        console.log("当前物料id:",this.editForm.id)
        if (valid) {
          this.$axios.post('/baseData/material/'+methodName, this.editForm).then(res => {
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            // 关闭弹窗并且重置内容
            this.dialogVisible = false;
            this.resetForm("editForm")
            this.getMaterialList();

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 物料分组 表单提交
    groupSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {

        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          if (valid) {
            console.log("提交前的参数:parentId:", this.groupEditForm.parentId)

            this.$axios.post('/baseData/materialGroup/' + (this.groupEditForm.id ? 'update' : 'save'), this.groupEditForm).then(res => {
              this.$message({
                message: (this.groupEditForm.id ? '编辑' : '新增') + '成功!',
                type: 'success'
              });

              // 关闭弹窗并且重置内容
              this.groupDialogVisible = false;
              let parentId = this.groupEditForm.parentId;

              this.resetForm("groupEditForm")

              this.getMaterialGroupList();
              this.defaulExpandedKeys = [parentId]; // 设置展开上级

              console.info("设置的默认展开ID:", parentId)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })

      });
    },
    submitAuthorityForm(formName) {
      console.log("提交后的，被选中的 角色 ID数组：", this.$refs.tree.getCheckedKeys())
      this.$axios.post('/sys/user/authority?userId=' + this.authorityForm.id, this.$refs.tree.getCheckedKeys()).then(res => {
        let result = res.data
        this.$message({
          message: '修改成功!',
          type: 'success'
        });

        // 关闭弹窗并且重置内容
        this.authorityDialogVisible = false;
      });
    },

    // 查询物料表单列表数据
    getMaterialList() {
      console.log("搜索字段:",this.select)
      this.$axios.get('/baseData/material/list', {
        params: {
          currentPage: this.currentPage
          , pageSize: this.pageSize
          , total: this.total
          , searchStr: this.searchStr
          , searchField:this.select
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
        console.log("获取用户表单数据", res.data.data.records)
      })
    },
    // 物料分组 查询分组列表数据
    getMaterialGroupList() {
      this.$axios.post('/baseData/materialGroup/listValide').then(res => {
        this.$nextTick(() => {
          this.groupData = res.data.data
          console.log("查询物料分组", res.data.data)
        })
      })
    },
    // 编辑页面
    edit(id) {
      this.addOrUpdate = "update"
      this.$axios.get('/baseData/material/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.dialogVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
        })

      })
    },

    // 删除
    del(id) {
      let ids = []
      if (id) {
        // 单个删除
        console.log("删除:id", id)

        ids.push(id)
      } else {
        // 批量删除
        ids = this.multipleSelection
        console.log("批量删除:id", ids)
      }
      this.$axios.post('/baseData/material/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getMaterialList()
        console.log("删除后重新加载页面")

      })
    },
    // 物料分组-删除事件
    del2() {
      let delId = this.lastClickTreeNode.id

      if(!delId){
        this.$message({
          message: '请选择一个分组!',
          type: 'error'
        });
        return
      }
      let parentId = this.lastClickTreeNode.parentId

      console.log("选中删除分组id:", delId)
      this.$axios.get('/baseData/materialGroup/delById?id=' + delId).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });

        this.getMaterialGroupList()
        this.defaulExpandedKeys = [parentId]; // 编辑要展开自己或者上级

        console.log("删除后重新加载页面")

      })
    },
    // 关闭弹窗处理动作
    handleClose(done) {
      this.$refs['editForm'].resetFields();
      console.log("关闭窗口")
      done();
    },
    // 物料分组 关闭弹窗处理动作
    handleClose_group(done) {
      this.$refs['groupEditForm'].resetFields();
      console.log("关闭分组窗口")
      done();
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 分类分组 树形菜单的点击事件
    handleNodeClick(data, node, item) {
      console.log(data)
      console.log(node)
      console.log(item)
      this.lastClickTreeNode = {
        id: data.id,
        code: data.code,
        label: data.label,
        name: data.name,
        parentId: data.parentId,
        parentCode: data.parentCode
      };
      console.log("最后选中的Treedata: ", this.lastClickTreeNode)
    }
  },
  // 页面初始化时调用的方法
  created() {
    this.getMaterialList()
    this.getMaterialGroupList()
    this.loadUnitAll()
  }

}
</script>

<style scoped>
.el-pagination {
  float: right;

}
</style>