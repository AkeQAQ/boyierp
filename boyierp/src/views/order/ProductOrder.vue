<template>

  <el-container>
    <el-main class="elMain_my" style="padding-top: 0;padding-right: 0px">
      <!-- 入库单列表 -->
      <el-form :inline="true" class="demo-form-inline elForm_my" >
        <el-form-item>
          <el-select size="mini" style="width: 120px" v-model="select" filterable @change="searchFieldChange" placeholder="请选择搜索字段">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>

          <!-- 公司货号 -->
          <div v-if="selectedName === 'productNum'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
            <input  @keyup.enter="search()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                    v-model.lazy="searchStr">
            </input>
          </div>

          <!-- 品牌 -->
          <div v-if="selectedName === 'productBrand'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
            <input  @keyup.enter="search()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                    v-model.lazy="searchStr">
            </input>
          </div>

          <!-- 订单号 -->
          <div v-if="selectedName === 'orderNum'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
            <input  @keyup.enter="search()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                    v-model.lazy="searchStr">
            </input>
          </div>

        </el-form-item>

        <el-popover
            placement="left"
            width="410"
            trigger="click">
          <ul v-for="(item,index) in manySearchArr">
            <li>
              <el-select style="width: 130px" size="mini" v-model="item.selectField" filterable  placeholder="请选择搜索字段">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
              </el-select>
              <!-- 公司货号 -->
              <div v-if="item.selectField==='productNum'" :class=" 'el-input el-input--mini'" style="width: 200px" >
                <input   class="el-input__inner"  placeholder="请输入搜索内容"
                        v-model.lazy="item.searchStr">
                </input>
              </div>

              <!-- 品牌 -->
              <div v-if="item.selectField==='productBrand'" :class=" 'el-input el-input--mini'"style="width: 200px" >
                <input   class="el-input__inner"  placeholder="请输入搜索内容"
                        v-model.lazy="item.searchStr">
                </input>
              </div>

              <!-- 订单号 -->
              <div v-if="item.selectField==='orderNum'" :class=" 'el-input el-input--mini'" style="width: 200px" >
                <input   class="el-input__inner"   placeholder="请输入搜索内容"
                         v-model.lazy="item.searchStr">
                </input>
              </div>

              <el-button type="danger" size="mini" icon="el-icon-delete" circle
                         @click="delSearch(index)"
              ></el-button>

            </li>
          </ul>
          <el-button type="primary" style="margin-left: 40px" size="mini" @click="addSearchItem()">添加额外搜索条件</el-button>

          <el-button slot="reference" type="info" style="padding: 0 0 ;margin-top: 20px;margin-left: -10px" size="mini" icon="el-icon-arrow-down" circle></el-button>

        </el-popover>


        <el-form-item >
          <el-select
              size ="mini"
              v-model="checkedBox"
              multiple
              collapse-tags
              style="margin-left: 0;width: 150px"
              placeholder="请选择状态">
            <el-option
                v-for="item in statusArr"
                :key="item.val"
                :label="item.name"
                :value="item.val">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item >
          <el-select
              size ="mini"
              v-model="checkedBox2"
              multiple
              collapse-tags
              style="margin-left: 0;width: 170px"
              placeholder="请选择状态">
            <el-option
                v-for="item in status2Arr"
                :key="item.val"
                :label="item.name"
                :value="item.val">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="search()" type="success">搜索</el-button>
        </el-form-item>


        <el-form-item v-if="hasAuth('order:productOrder:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('order:productOrder:save')"
                     @click="addProductOrder()"

          >新增
          </el-button>
        </el-form-item>

        <el-form-item  v-if="hasAuth('order:productOrder:import')">
          <el-dropdown   @command="expChangeImport">
            <el-button  icon="el-icon-upload2" size="mini" >
              导入<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="import">导入</el-dropdown-item>
              <el-dropdown-item command="importDemo">导入模板下载</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>

        <el-form-item v-if="hasAuth('order:productOrder:valid')">
          <el-popconfirm @confirm="statusPassBatch()" title="确定审核吗？">
            <el-button size="mini" icon="el-icon-success" :disabled="this.multipleSelection.length === 0 " type="danger"
                       slot="reference">批量审核
            </el-button>
          </el-popconfirm>
        </el-form-item>

        <el-form-item v-if="hasAuth('order:productOrder:list')">
          <el-popconfirm @confirm="prepareBatch()" title="确定批量备料吗？">
            <el-button size="mini" icon="el-icon-shopping-cart-full" :disabled="this.multipleSelection.length === 0 " type="warning"
                       slot="reference">批量备料
            </el-button>
          </el-popconfirm>
        </el-form-item>

        <el-form-item v-if="hasAuth('order:productOrder:prepare')">
          <el-popconfirm @confirm="statusSureBatch()" title="确定确认吗？">
            <el-button size="mini" icon="el-icon-success" :disabled="this.multipleSelection.length === 0 " type="danger"
                       slot="reference">批量确认
            </el-button>
          </el-popconfirm>
        </el-form-item>

      </el-form>

      <el-table
          :row-style="rowClass"

          ref="multipleTable"
          :data="tableData"
          v-loading = "tableLoad"
          element-loading-background = "rgba(255, 255, 255, .5)"
          element-loading-text = "加载中，请稍后..."
          border
          fit
          height="520px"

          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :cell-style="{padding:'0',borderColor:'black'}"
          :header-cell-style="{borderColor:'black'}"
          :default-sort="{prop:'id',order:'descending'}"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="50">
        </el-table-column>

        <el-table-column
            label="订单号"
            prop="orderNum"
            width="80px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            label="客户货号"
            prop="customerNum"
            width="70px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            label="公司货号"
            prop="productNum"
            width="100"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="productBrand"
            label="品牌"
            width="80px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="productColor"
            label="颜色"
            width="80px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="orderNumber"
            label="订单合计数目"
            width="100px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="productRegion"
            label="品牌区域"
            width="70px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="orderType"
            label="订单类型"
            width="70px"
           >
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.orderType === 0" type="success">订单</el-tag>
            <el-tag size="small" v-else-if="scope.row.orderType===1" type="warning">回单</el-tag>
            <el-tag size="small" v-else-if="scope.row.orderType===2" type="danger">取消</el-tag>
          </template>
        </el-table-column>

        <el-table-column
            prop="status"
            width="80px"
            label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已审核</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="warning">暂存</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===2" type="danger">审核中</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===3" type="danger">重新审核</el-tag>
          </template>
        </el-table-column>

        <el-table-column
            prop="prepared"
            label="备料进度"
            width="100px"
            show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.prepared === 2" type="warning">备料确认</el-tag>
            <el-tag size="small" v-else-if="scope.row.prepared === 1" type="info">备料未确认</el-tag>
            <el-tag size="small" v-else-if="scope.row.prepared===0" type="success">备料已报(完成)</el-tag>
          </template>

        </el-table-column>


        <el-table-column
            prop="created"
            label="创建日期"
            width="150px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="comment"
            label="备注"
            width="150px"
            show-overflow-tooltip>
        </el-table-column>


        <el-table-column
            prop="action"
            label="操作"
            width="400px"
            fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('order:productOrder:update') || (hasAuth('order:productOrder:list') && scope.row.status != 1 )   ">{{ scope.row.status === 1 ? '编辑' : '查看' }}
            </el-button>


            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('order:productOrder:valid') && scope.row.orderType !=2 && (scope.row.status === 2 || scope.row.status === 3)   ">

              <template>
                <el-popconfirm @confirm="statusPass(scope.row.id)"
                               title="确定设置审核通过吗？"
                >
                  <el-button type="text" size="small" slot="reference">审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('order:productOrder:valid') && scope.row.orderType !=2 && scope.row.prepared ===1   && scope.row.status ===0  ">
              <template>
                <el-popconfirm @confirm="statusReturn(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('order:productOrder:del')  && scope.row.status ===1  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('order:productOrder:del') && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="del(scope.row.id)"
                               title="确定删除吗？"
                >
                  <el-button type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="(hasAuth('order:productOrder:prepare') || hasAuth('order:productOrder:prepareDone'))   && scope.row.status ===0   "></el-divider>

            <el-button style="padding: 0" type="text" size="small"
                       v-if="(hasAuth('order:productOrder:prepare') || hasAuth('order:productOrder:prepareDone'))   && scope.row.status ===0   " @click="prepare(scope.row)">

              查看备料
            </el-button>



            <el-divider direction="vertical"
                        v-if="hasAuth('order:productOrder:prepare') && scope.row.orderType !=2 && scope.row.status ===0  && scope.row.prepared ===1"></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('order:productOrder:prepare') && scope.row.orderType !=2 && scope.row.status ===0 && scope.row.prepared ===1   ">
              <template>
                <el-popconfirm @confirm="prepareSure(scope.row.id)"
                               title="确定确认吗？"
                >
                  <el-button type="text" size="small" slot="reference">备料确认</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('order:productOrder:prepare') && scope.row.orderType !=2 && scope.row.status ===0  && scope.row.prepared ===2"></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('order:productOrder:prepare')&& scope.row.orderType !=2 && scope.row.status ===0 && scope.row.prepared ===2   ">
              <template>
                <el-popconfirm @confirm="prepareNotSure(scope.row.id)"
                               title="确定取消确认吗？"
                >
                  <el-button type="text" size="small" slot="reference">取消确认</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('order:productOrder:prepareDone')&& scope.row.orderType !=2  && scope.row.status ===0 && scope.row.prepared ===2  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('order:productOrder:prepareDone')&& scope.row.orderType !=2 && scope.row.status === 0 && scope.row.prepared ===2  ">
              <template>
                <el-popconfirm @confirm="prepareSuccess(scope.row.id)"
                               title="确定备料完成吗？"
                >
                  <el-button type="text" size="small" slot="reference">备料完成</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('order:productOrder:prepareDone')&& scope.row.orderType !=2  && scope.row.status ===0 && scope.row.prepared ===0  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('order:productOrder:prepareDone')&& scope.row.orderType !=2 && scope.row.status ===0 && scope.row.prepared ===0  ">
              <template>
                <el-popconfirm @confirm="prepareNotSuccess(scope.row.id)"
                               title="确定解除备料完成吗？"
                >
                  <el-button type="text" size="small" slot="reference">解除备料完成</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="(hasAuth('order:productOrder:prepare') || hasAuth('order:productOrder:prepareDone'))   && scope.row.status ===0   "></el-divider>

            <el-button style="padding: 0" type="text" size="small"
                       v-if="(hasAuth('order:productOrder:prepare') || hasAuth('order:productOrder:prepareDone'))   && scope.row.status ===0   " @click="updateOrderNum(scope.row.id)">

              修改订单号
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('order:productOrder:del') && scope.row.orderType !=2  "></el-divider>



            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('order:productOrder:del') && scope.row.orderType !=2 ">
              <template>
                <el-popconfirm @confirm="cancelOrder(scope.row.id)"
                               title="确定订单取消吗？"
                >
                  <el-button type="text" size="small" slot="reference">订单取消</el-button>
                </el-popconfirm>
              </template>
            </el-button>


          </template>
        </el-table-column>

      </el-table>

      <el-dialog
          title="产品订单信息"
          :visible.sync="dialogUpdateOrderNumVisible"
          :before-close="handleOrderNumClose"
          width="35%"
      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"
                 :model="editOrderNumForm"  ref="editOrderNumForm"
                 class="demo-editForm">

          <el-form-item label="编号" prop="id" v-show="false" style="margin-bottom: 0">
            <el-input style="width: 150px" :disabled=true placeholder="保存自动生成" v-model="editOrderNumForm.id">
            </el-input>
          </el-form-item>

          <el-form-item label="订单号" prop="orderNum" >
            <div :class="'el-input el-input--mini'">
              <input  class="el-input__inner" style="width: 150px"
                      v-model.lazy="editOrderNumForm.orderNum" >
              </input>
            </div>
          </el-form-item>

          <el-form-item v-if="hasAuth('order:productOrder:save')">
            <el-button type="primary"  @click="updateOrderNumSubmit()">
              提交修改
            </el-button>
          </el-form-item>

        </el-form>

      </el-dialog>

      <!-- 产品订单弹窗 -->
      <el-dialog
          title="产品订单信息"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          width="35%"
      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"
                 :model="editForm"  ref="editForm"
                 class="demo-editForm">

          <el-form-item label="编号" prop="id" v-show="false" style="margin-bottom: 0">
            <el-input style="width: 150px" :disabled=true placeholder="保存自动生成" v-model="editForm.id">
            </el-input>
          </el-form-item>

          <el-form-item label="订单号" prop="orderNum" >
            <div   :class=" [(this.editForm.status!=1)? 'el-input el-input--mini is-disabled' :'el-input el-input--mini']">
              <input  class="el-input__inner" style="width: 150px"
                      v-model.lazy="editForm.orderNum" >
              </input>
            </div>
          </el-form-item>

          <el-form-item label="客户货号" prop="customerNum" style="margin-bottom: 10px">
            <div   :class=" [(this.editForm.status!=1)? 'el-input el-input--mini is-disabled' :'el-input el-input--mini']">
              <input  class="el-input__inner" style="width: 150px"
                      v-model.lazy="editForm.customerNum">
              </input>
            </div>
          </el-form-item>

          <el-form-item label="公司货号" prop="productNum" style="margin-bottom: 10px">
            <!-- 公司货号 -->
            <div   :class=" [(this.editForm.status!=1)? 'el-input el-input--mini is-disabled' :'el-input el-input--mini']">
              <input  class="el-input__inner" style="width: 150px"
                      v-model.lazy="editForm.productNum">
              </input>
            </div>
          </el-form-item>

          <el-form-item label="品牌" prop="productBrand" style="margin-bottom: 10px">
            <!-- 公司货号 -->
            <div   :class=" [(this.editForm.status!=1)? 'el-input el-input--mini is-disabled' :'el-input el-input--mini']">
              <input  class="el-input__inner" style="width: 150px"
                      v-model.lazy="editForm.productBrand">
              </input>
            </div>
          </el-form-item>

          <el-form-item label="颜色" prop="productColor" style="margin-bottom: 10px">
            <!-- 公司货号 -->
            <div   :class=" [(this.editForm.status!=1)? 'el-input el-input--mini is-disabled' :'el-input el-input--mini']">
              <input  class="el-input__inner" style="width: 150px"
                      v-model.lazy="editForm.productColor">
              </input>
            </div>
          </el-form-item>

          <el-form-item label="订单合计数目" prop="orderNumber" style="margin-bottom: 10px">
            <div   :class=" [(this.editForm.status!=1)? 'el-input el-input--mini is-disabled' :'el-input el-input--mini']">
              <input  class="el-input__inner" style="width: 150px"
                      v-model.lazy="editForm.orderNumber">
              </input>
            </div>
          </el-form-item>

          <el-form-item label="品牌区域" prop="productRegion" style="margin-bottom: 10px">
            <div   :class=" [(this.editForm.status!=1)? 'el-input el-input--mini is-disabled' :'el-input el-input--mini']">
              <input  class="el-input__inner" style="width: 150px"
                      v-model.lazy="editForm.productRegion">
              </input>
            </div>
          </el-form-item>

          <el-form-item label="订单类型" prop="orderType">
            <el-radio-group v-model="editForm.orderType" :disabled="this.editForm.status !=1">
              <el-radio :label=0>订单</el-radio>
              <el-radio :label=1>回单</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="备注" prop="comment" style="margin-bottom: 10px">
            <div   :class=" [(this.editForm.status!=1)? 'el-input el-input--mini is-disabled' :'el-input el-input--mini']">
              <input  class="el-input__inner" style="width: 200px"
                      v-model.lazy="editForm.comment">
              </input>
            </div>
          </el-form-item>


          <el-form-item v-if="hasAuth('order:productOrder:save')">
            <el-dropdown   @command="action">
              <el-button  icon="el-icon-edit-outline" size="mini" type="success">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="save" v-show="hasAuth('order:productOrder:save') && this.editForm.status===1" >
                  提交订单</el-dropdown-item>
                <el-dropdown-item command="subReturn" v-show="hasAuth('order:productOrder:save') && (this.editForm.status===2 || this.editForm.status===3)">
                  撤销</el-dropdown-item>
                <el-dropdown-item command="addNew" v-show="hasAuth('order:productOrder:save') ">
                  新增</el-dropdown-item>
                <el-dropdown-item command="copy" v-show="hasAuth('order:productOrder:save') ">
                  复制</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>

        </el-form>

      </el-dialog>

      <el-dialog
          title="导入信息"
          :visible.sync="dialogImportVisible"
          :before-close="handleImportClose"
          fullscreen
      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 :inline="true"
                 size="mini"
                 label-width="100px"
                  ref="editImportForm"
                 class="demo-editForm myFormClass">

          <el-form-item label="上传文件:">
            <el-upload
                class="upload-demo"
                ref="upload"
                :file-list="fileList"
                :http-request="uploadRequest"
                action=""
                :on-change="addFile"
                :on-remove="removeFile"
                :auto-upload="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div class="el-upload__tip" slot="tip">只能上传一个，且不超过5M</div>
            </el-upload>
          </el-form-item>

          <el-form-item style="margin-left: 100px">
            <el-button type="primary"  @click="importExcel('editImportForm')">
              保存
            </el-button>
          </el-form-item>

        </el-form>


        <el-table
            ref="multipleTable2"
            :data="tableData2"
            v-if="tableData2.length>0"
            border
            stripe
            size="mini"
            :cell-style="{padding:'0'}"
            height="500px"
            tooltip-effect="dark"
            style="width: 100%;color:black;font-size: 20px">
          <el-table-column
              label="提示信息"
              prop="content"
          >
          </el-table-column>

        </el-table>


      </el-dialog>

      <el-dialog
          :visible.sync="dialogCalNumVisible"
          fullscreen
          title="备料进度"
          :before-close="handleClosePrepare"
      >
        <el-descriptions class="margin-top" style="margin-top: 0px"  :column="3"  border>
          <template slot="extra">
            <el-button type="primary" v-show="theCurrentOrderMsg.prepared===1 && hasAuth('order:productOrder:prepare')  " size="small" @click="submitPrepare">提交备料</el-button>
          </template>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-home">
                公司货号
              </i>
            </template>
            {{ theCurrentOrderMsg.productNum }}

          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-open"></i>
              颜色
            </template>
            {{ theCurrentOrderMsg.productColor }}

          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-order"></i>
              公司订单号(生管的)
            </template>
            {{ theCurrentOrderMsg.orderNum }}

          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              品牌
            </template>
            {{ theCurrentOrderMsg.productBrand }}

          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets"></i>
              客户货号
            </template>
            {{ theCurrentOrderMsg.customerNum }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              品牌区域
            </template>
            {{ theCurrentOrderMsg.productRegion }}
          </el-descriptions-item>
        </el-descriptions>
        <el-divider content-position="left">明细信息</el-divider>


        <el-table
            :data="prepareList"
            :row-class-name="rowClassName"
            ref="tb"
            height="500"
            size="mini"
            :cell-style="cellStyle"
            fit
        >


          <el-table-column label="序号" align="center" prop="seqNum" width="50"></el-table-column>

          <el-table-column label="物料名称" align="center" prop="materialName" width="300px">
            <template slot-scope="scope">
              <span style="text-align: left">{{prepareList[scope.row.seqNum-1].materialName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单数量" align="center" prop="orderNumber" width="100">
            <template slot-scope="scope">
              <span style="text-align: left">{{prepareList[scope.row.seqNum-1].orderNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column label="物料用料" align="center" prop="dosage" width="100">
            <template slot-scope="scope">
              <span style="text-align: left">{{prepareList[scope.row.seqNum-1].dosage}}</span>

            </template>
          </el-table-column>


          <el-table-column label="库存单位" align="center" prop="materialUnit" width="100">
            <template slot-scope="scope">
              <span style="text-align: left">{{prepareList[scope.row.seqNum-1].materialUnit}}</span>
            </template>
          </el-table-column>



          <el-table-column label="应报备料数目" align="center" width="120" prop="calNum">
            <template slot-scope="scope">
              <span style="text-align: left">{{prepareList[scope.row.seqNum-1].calNum}}</span>
            </template>
          </el-table-column>

          <el-table-column label="已报备料数量" align="center" width="120" prop="preparedNum">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true"  v-model="prepareList[scope.row.seqNum-1].preparedNum"/>
            </template>
          </el-table-column>

          <el-table-column label="新增备料数量" align="center" width="120" prop="addNum">
            <template slot-scope="scope">
              <el-input size="mini"
                        oninput="value=value.replace(/[^0-9.-]/g,'')"
                        v-model="prepareList[scope.row.seqNum-1].addNum"/>
            </template>
          </el-table-column>

          <el-table-column label="备注" align="center" width="120" prop="comment">
            <template slot-scope="scope">
              <el-input size="mini"   v-model="prepareList[scope.row.seqNum-1].comment"/>
            </template>
          </el-table-column>

          <el-table-column label="进度" align="center" width="120" prop="progressPercent">
            <template slot-scope="scope">
              <el-progress :percentage="prepareList[scope.row.seqNum-1].progressPercent"></el-progress>
            </template>
          </el-table-column>


        </el-table>

      </el-dialog>

      <el-dialog
          :visible.sync="dialogPrepareBatchVisible"
          fullscreen
          title="批量备料"
          :before-close="handleCloseBatchPrepare"
      >
        <el-button type="primary" v-show="canPrepareBatchFlag===true" size="small" @click="submitPrepareBatch">提交批量备料</el-button>

        <el-divider content-position="left">明细信息</el-divider>


        <el-table
            :data="prepareBatchList"
            :row-class-name="rowClassName"
            ref="tb"
            height="500"
            size="mini"
            :cell-style="cellStyle"
            fit
        >

          <el-table-column label="序号" align="center" prop="seqNum" width="50"></el-table-column>

          <el-table-column label="物料编码" align="center" prop="materialId" width="100px">
            <template slot-scope="scope">
              <span style="text-align: left" @click="">{{prepareBatchList[scope.row.seqNum-1].materialId}}</span>
            </template>
          </el-table-column>
          <el-table-column label="物料名称" align="center" prop="materialName" width="300px">
            <template slot-scope="scope">
              <span style="text-align: left" @click="">{{prepareBatchList[scope.row.seqNum-1].materialName}}</span>
            </template>
          </el-table-column>


          <el-table-column label="库存单位" align="center" prop="materialUnit" width="80">
            <template slot-scope="scope">
              <span style="text-align: left">{{prepareBatchList[scope.row.seqNum-1].materialUnit}}</span>
            </template>
          </el-table-column>

          <el-table-column label="应报备料数目(合计)" align="center" width="130" prop="calNums">
            <template slot-scope="scope">
              <span style="text-align: left">{{prepareBatchList[scope.row.seqNum-1].calNums}}</span>
            </template>
          </el-table-column>

          <el-table-column label="已报备料数量(合计)" align="center" width="140" prop="preparedNums">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true"  v-model="prepareBatchList[scope.row.seqNum-1].preparedNums"/>
            </template>
          </el-table-column>

          <el-table-column label="新增备料数量" align="center" width="120" prop="addNums">
            <template slot-scope="scope">
              <el-input size="mini"   v-model="prepareBatchList[scope.row.seqNum-1].addNums"/>
            </template>
          </el-table-column>

          <el-table-column label="进度" align="center" width="120" prop="progressPercent">
            <template slot-scope="scope">
              <el-progress :percentage="isNaN(parseInt(scope.row.preparedNums * 100 /scope.row.calNums))? 0 : parseInt(scope.row.preparedNums * 100 /scope.row.calNums)"
              ></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="明细" align="center" width="140" >
            <template slot-scope="scope">
              <el-popover
                  placement="bottom"
                  width="900"
                  trigger="click">
                <el-table :data="prepareBatchList[scope.row.seqNum-1].details"
                          :summary-method="getSummaries"
                          show-summary>
                  <el-table-column width="80" property="orderId" label="订单ID"></el-table-column>
                  <el-table-column width="100" property="orderNum" label="订单号"></el-table-column>
                  <el-table-column width="100" property="productNum" label="公司货号"></el-table-column>
                  <el-table-column width="100" property="productBrand" label="品牌"></el-table-column>
                  <el-table-column width="100" property="productColor" label="颜色"></el-table-column>
                  <el-table-column width="100" property="orderNumber" label="订单数量"></el-table-column>
                  <el-table-column width="100" property="dosage" label="用料"></el-table-column>
                  <el-table-column width="100" property="calNum" label="应报备用量"></el-table-column>
                  <el-table-column width="100" property="preparedNum" label="已报备用量"></el-table-column>
                </el-table>
                <el-button slot="reference">查看明细</el-button>
              </el-popover>
            </template>

          </el-table-column>

        </el-table>

      </el-dialog>


      <!--价目列表 分页组件 -->
      <el-pagination

          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[50, 200, 500, 1000]"
          :page-size="this.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
      </el-pagination>

    </el-main>

  </el-container>

</template>

<script>

// POI，因为响应输出字节流，和ajax 的请求不一样。
import {request} from "@/axios";
import {sysbaseUrl} from "@/axios";

import {request2} from "@/axios";

export default {
  name: 'ProductOrder',
  data() {
    return {
      prepareCheckVal:[],

      dialogPrepareBatchVisible:false,


      dialogCalNumVisible:false,
      calNumResult:[],
      activeNames: ['0'],
      // 导入
      fileList: [],
      fileSizeIsSatisfy: false,
      dialogImportVisible:false,
      tableData2: [],
      tableData3: [],

      // 多个搜索输入框
      manySearchArr:[{
        selectField:'productNum',
        searchStr:'',
      }],

      tableLoad:true,
      statusArr : [{'name':'暂存','val':1},{'name':'审核中','val':2},{'name':'已审核','val':0},{'name':'重新审核','val':3}],
      checkedBox:[1,2,3,0],

      status2Arr : [{'name':'备料已确认','val':2},{'name':'备料未确认','val':1},{'name':'备料完成(已报)','val':0}],
      checkedBox2:[2,1,0],

      // 搜索字段
      selectedName: 'productNum',// 搜索默认值
      options: [
        {value: 'productNum', label: '公司货号'},
        {value: 'productBrand', label: '品牌'},
        {value: 'orderNum', label: '订单号'}

      ],
      select: 'productNum', // 搜索默认值
      searchStr: '',
      searchStrList: [],
      searchField: '',

      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 50 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      // 表单字段
      addOrUpdate: 'save',
      editForm: {
        status: 1, // 编辑表单初始默认值
        id: '',
        orderNum:'',
        customerNum:'',
        productNum: '',
        productBrand: '',
        productColor:'',
        orderNumber:'',
        productRegion:'',
        orderType:0
      },
      editOrderNumForm: {
        id: '',
        orderNum:'',
      },



      theCurrentPrepareOrderId:'',
      theCurrentOrderMsg:{id:'',orderNum:'',customerNum:'',productNum:'',productBrand:'',productColor:'',productRegion:''},
      prepareList:[{preparedNum:'',addNum:''}],
      prepareBatchList:
      [
          {'materialName':'物料','materialUnit':'单位1','calNums':'10','preparedNums':'1'
        ,'details':
            [
                {'orderId':1,'orderNum':1,'productNum':'10S57202','productBrand':'蔻度','productColor':'黄橙','orderNumber':10,'dosage':0.1,'calNum':1,'preparedNum':0},
                {'orderId':1,'orderNum':2,'productNum':'10S57202','productBrand':'蔻度','productColor':'黄橙','orderNumber':7,'dosage':0.2,'calNum':1.4,'preparedNum':0}

            ]}
      ],
      canPrepareBatchFlag:false,
      dialogVisible: false,
      dialogUpdateOrderNumVisible: false,
      tableData: [],
      spanArr: [],
      multipleSelection: [] // 多选框数组

    }
  },

  methods: {

    updateOrderNumSubmit(){

        if(this.editOrderNumForm.orderNum==='' ){
          this.$message({
            message: '订单序号不能为空',
            type: 'error'
          });
          return
        }
        const load = this.$loading({
          lock: true,
          text: '处理中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        request.post('/order/productOrder/updateOrderNum', this.editOrderNumForm).then(res => {
          load.close()
          this.$message({
            message:  '修改成功!',
            type: 'success'
          });

        }).catch(()=>{
          load.close()
        })
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '求和';
          return;
        }
        if (index === 8 || index === 7) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = sums[index].toFixed(2);
          } else {
            sums[index] = 'N/A';
          }
        }

      });

      return sums;
    },

    cancelOrder(id){
      request.post('/order/productOrder/cancelOrder?id='+id)
          .then(res => {
            this.$message({
              message: "订单取消完成",
              type: 'success'
            });
            this.getList()
          })

    },
    prepareNotSuccess(id){
      request.post('/order/productOrder/preparedNotSuccess?id='+id)
          .then(res => {
            this.$message({
              message: "备料解除完成",
              type: 'success'
            });
            this.getList()
          })

    },
    prepareSuccess(id){
      request.post('/order/productOrder/preparedSuccess?id='+id)
          .then(res => {
            this.$message({
              message: "备料完成！",
              type: 'success'
            });
            this.getList()
          })
    },
    prepareSure(id){
      request.post('/order/productOrder/prepareSure?id='+id)
          .then(res => {
            this.$message({
              message: "备料确认成功",
              type: 'success'
            });
            this.getList()
          })
    },
    prepareNotSure(id){
      request.post('/order/productOrder/prepareNotSure?id='+id)
          .then(res => {
            this.$message({
              message: "备料取消确认成功",
              type: 'success'
            });
            this.getList()
          })
    },

    //进度条方法
    format(percentage) {
      return percentage === 100 ? '满' : `${percentage}%`;
    },
    submitPrepareBatch(){
      let ids = this.multipleSelection;
      const load = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      request.post('/produce/orderMaterialProgress/saveBatch?orderIds='+ids,this.prepareBatchList).then(res => {
        this.prepareBatch()
        load.close()
      }).catch(()=>{
        load.close()
      })
    },
    submitPrepare(){
      for (let i = 0; i < this.prepareList.length; i++) {
        console.info("内容:",this.prepareList[i].addNum)
        if(this.prepareList[i].addNum===null || this.prepareList[i].addNum===undefined || this.prepareList[i].addNum===''){
          this.$message({
            message: "增加数量不能为空",
            type: 'error'
          });
          throw new Error();
        }
      }
      const load = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      request.post('/produce/orderMaterialProgress/save?orderId='+this.theCurrentOrderMsg.id, this.prepareList,null)
          .then(res => {

        this.$message({
          message: res.data.data,
          type: 'success'
        });
        this.prepare(this.theCurrentOrderMsg)
        load.close()
      }).catch(()=>{
        load.close()
      })
    },

    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },
    statusSureBatch(){
      let ids = this.multipleSelection;
      request.post('/order/productOrder/sureBatch',ids).then(res => {
        this.$message({
          message: '批量确认完成!',
          type: 'success'
        });
        this.getList()
      })
    },
    prepareBatch(){

      let ids = this.multipleSelection;
      request.post('/order/productOrder/listBatchOrderConstituentProgress',ids).then(res => {
        this.canPrepareBatchFlag = res.data.data.canBatchPrepareFlag;
        this.prepareBatchList = res.data.data.datas;
        this.dialogPrepareBatchVisible = true;
      })
    },
    prepare(scopeRow){
      console.info("prepare row:",scopeRow)
      this.theCurrentOrderMsg=scopeRow

      request.get('/order/productOrder/listOrderConstituentProgress?orderId='
          +scopeRow.id
      ).then(res => {

        let data = res.data.data;
        this.prepareList = data;
        this.dialogCalNumVisible = true;
      })
    },

    // 导出列表数据- 服务端写出字节流到浏览器，进行保存
    downImportDemo() {

      request2.post('/order/productOrder/down',null,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'产品订单模板.xlsx')
      }).catch()
    },
    // POI- 服务端写出字节流到浏览器，进行保存
    saveFile(data,name){
      try {
        const blobUrl = window.URL.createObjectURL(data)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.download = name
        a.href = blobUrl
        a.click()

      } catch (e) {
        alert('保存文件出错')
      }
    },
    importExcel() {
      console.log("this.fileList",this.fileList)
      console.log("this.fileSizeIsSatisfy",this.fileSizeIsSatisfy)

      if(this.fileList.length <= 0 || this.fileList.length > 1){
        this.$message.error("请上传一个文件！");
        return;
      }
      if (!this.fileSizeIsSatisfy) {
        this.$message.error("上传失败！存在文件大小超过5M！");
        return;
      }
      this.$refs.upload.submit();
    },
    // 文件导入--------------------
    uploadRequest(fileobj) {
      const load = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let param = new FormData()
      param.append('files', fileobj.file)

      request({
        method: 'post',
        url: '/order/productOrder/upload',
        headers: {'Content-Type': 'multipart/form-data'},
        data: param
      }).then(res => {
        let theData = res.data.data;
        console.log("返回的内容:",theData)
        load.close()

        if(theData instanceof Array && theData.length > 0){
          this.tableData2 = theData
        }else {
          // 成功
          this.$message({
            message: '导入成功!',
            type: 'success'
          });
          // 关闭弹窗并且重置内容
          this.$refs['editImportForm'].resetFields();
          this.tableData2 = []
          this.fileList=[]
          this.fileSizeIsSatisfy=false;
          this.$refs.upload.clearFiles();
          this.dialogImportVisible = false;
          this.getList()
        }

      }).catch(()=>{
        load.close()
      })
    },

    // 文件上传功能
    uploadUrl: function () {
      return "#";
    }
    ,
    // 判断文件大小
    addFile(file, fileList) {
      console.log("addFile")
      this.fileList = fileList;
      //限制上传文件为5M
      console.log("文件大小", file.size)
      this.fileSizeIsSatisfy = file.size < 5 * 1024 * 1024 ? true : false;
      return this.fileSizeIsSatisfy
    },
    // 判断文件大小
    removeFile(file, fileList) {
      console.log("removeFile")
      this.fileList = fileList;
    },

    // 关闭弹窗处理动作
    handleImportClose(done) {
      this.$refs['editImportForm'].resetFields();
      this.tableData2 = []
      this.fileList=[]
      this.fileSizeIsSatisfy=false;
      this.$refs.upload.clearFiles();
      console.log("关闭窗口")
      done();
    },

    // 导入
    expChangeImport(item) {
      if (item === 'import') {
        this.dialogImportVisible = true;
      } else if(item === 'importDemo'){
        this.downImportDemo();
      }
    },

    rowClass({ row, rowIndex }) {
      if (this.multipleSelection.includes(row.id)) {
        return { "background-color": "rgba(255,235,205, 0.75)" };
      }
    },
    statusPassBatch(){
      let ids = this.multipleSelection;
      request.post('/order/productOrder/statusPassBatch',ids).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getList()
      })
    },

    searchManySelect(item,index) {
      let theObj = this.manySearchArr[index];
      theObj.searchStr = item.name;
      console.log("manySearchArr:",this.manySearchArr)
    },
    delSearch(index){
      this.manySearchArr.splice(index,1)
    },
    addSearchItem(){
      let obj = {
        selectField:'productNum',
        searchStr:'',
      }
      this.manySearchArr.push(obj)
    },

    action(item) {
      if(this.editForm.id === null || this.editForm.id === ''){
        this.addOrUpdate = 'save';
      }else{
        this.addOrUpdate = 'update';
      }
      if (item === 'save') {
        this.submitForm('editForm',this.addOrUpdate)
      } else if(item === 'subReturn'){
        console.log("撤销id:",this.editForm.id);
        if(this.editForm.id != ''){
          this.statusSubReturn(this.editForm.id)
        }else{
          this.$message.error("id 为空")
        }
      }
      else if(item === 'addNew'){
        this.addProductOrder();
      }
      else if(item === 'copy'){
        this.editForm.id = '';
        this.editForm.status = 1;
        this.addOrUpdate = 'save';
      }
    },

    // 设置每一行的seqNum = 游标+1
    rowClassName({row, rowIndex}) {
      row.seqNum = rowIndex + 1;
    },
    addProductOrder() {
      this.addOrUpdate = 'save'
      this.editForm = {
        status: 1, // 编辑表单初始默认值
        id: '',
        orderNum:'',
        customerNum:'',
        productNum: '',
        productBrand: '',
        productColor:'',
        orderNumber:'',
        productRegion:'',
        orderType:0
      }
      this.dialogVisible = true
    },

    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getList()

    },
    handleSelectionChange(val) {
      console.log("多选框 val ", val)
      this.multipleSelection = []

      val.forEach(theId => {
        if(!this.multipleSelection.some(item=>item==theId.id)){
          this.multipleSelection.push(theId.id)
        }
      })
      console.log("多选框 选中的 ", this.multipleSelection)
    },
    // 表单提交
    submitForm(formName, methodName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {
          if(this.editForm.productColor==='' || this.editForm.productNum==='' || this.editForm.productBrand ===''){
            this.$message({
              message: '产品货号，颜色，品牌不能为空',
              type: 'error'
            });
            return
          }
          const load = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          request.post('/order/productOrder/' + methodName, this.editForm).then(res => {
            load.close()
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            if(!this.editForm.id){
              console.log("回显的ID：",res.data.data)
              this.editForm.id = res.data.data;
              this.addOrUpdate = "update"
            }
            this.editForm.status = 2;
          }).catch(()=>{
            load.close()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    search(){
      this.currentPage = 1
      this.getList()
    },
    // 查询价目表单列表数据
    getList() {
      this.tableLoad = true;
      let checkStr = this.checkedBox.join(",");
      let check2Str = this.checkedBox2.join(",");

      let url = '/order/productOrder/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr+
          "&&searchStatus2="+check2Str;
      request.post(url,
          {'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},
          null).then(res => {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
          this.tableLoad = false;
          this.$nextTick(() => {
          this.$refs['multipleTable'].doLayout();
        })
      }).catch(error=>{
        this.tableLoad = false;
        console.log("error:",error)
      })
    },
    updateOrderNum(id){
      request.get('/order/productOrder/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.dialogUpdateOrderNumVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editOrderNumForm = result
        })

      })
    },
    // 编辑页面
    edit(id) {
      this.addOrUpdate = "update"
      request.get('/order/productOrder/queryById?id=' + id).then(res => {
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
      request.post('/order/productOrder/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getList()
        console.log("删除后重新加载页面")

      })
    },

    // 撤销提交
    statusSubReturn(id) {
      request.get('/order/productOrder/statusSubReturn?id=' + id).then(res => {
        this.$message({
          message: '已撤销!',
          type: 'success'
        });
        this.editForm.status = 1;
        this.getList()
      })
    },
    // 状态提交
    statusSubmit(id) {
      request.get('/order/productOrder/statusSubmit?id=' + id).then(res => {
        this.$message({
          message: '已提交!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态待审核
    statusPass(id) {
      request.get('/order/productOrder/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/order/productOrder/statusReturn?id=' + id).then(res => {
        this.$message({
          message: '反审核完成!',
          type: 'success'
        });
        this.getList()
      })
    },
    handleClosePrepare(done) {
      this.prepareList = []
      this.dialogCalNumVisible=false;
      this.getList()
    },
    handleCloseBatchPrepare(done) {
      this.dialogPrepareBatchVisible=false;
      this.getList()
    },
    // 关闭弹窗处理动作
    handleClose(done) {
      if(this.editForm.status === 1){
        this.$confirm('确认关闭？')
            .then(_ => {
              this.closeMethod();
              done();
            })
            .catch(_ => {});
      }else{
        this.closeMethod();
        done();
      }
    },
    handleOrderNumClose(done) {
      this.$refs['editOrderNumForm'].resetFields();
      this.getList()
      done();
    },
    closeMethod(){
      this.$refs['editForm'].resetFields();
      this.getList()
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    searchFieldChange(item) {
      console.log("搜索字段改变:", item)
      this.selectedName = item
    },

    // el-table 单元格样式修改
    cellStyle() {
      return 'padding:0 0'
    },

  },
  created() {
    this.getList()

  }

}

</script>

<style scoped>

.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}

.el-table{
  border: 1px solid black;
}
::v-deep .el-table tbody tr:hover > td {
  background-color: transparent;
}

.el-pagination {
  float: right;

}

.el-table--mini td {
  padding: 0 0;
}


.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

/deep/ .el-transfer-panel{
  width: 450px !important;
}

</style>