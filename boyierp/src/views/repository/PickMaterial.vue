<template>

  <el-container id="pick">
    <el-header style="height: 30px;padding: 0 0;margin-top: -10px;margin-bottom: 10px">
      <span style="font-size: 10px">快捷过滤   </span>
      <span style="font-size: 10px;font-weight: bold">方案:</span>
      <el-tag
          :key="tag.tagName"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="tagClose(tag)">
        <el-link type="primary" @click="chooseTag(tag)"> {{tag.tagName}}</el-link>
      </el-tag>
      <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput"> + 方案</el-button>



    </el-header>
    <el-main class="elMain_my" style="padding-top: 0">
      <!-- 入库单列表 -->
      <el-form :inline="true" class="demo-form-inline elForm_my" >
        <el-form-item>
          <el-select size="mini" style="width: 130px" v-model="select" filterable @change="searchFieldChange" placeholder="请选择搜索字段">
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
          <!-- 列表界面-部门搜索 -->
          <el-autocomplete size="mini" v-if="selectedName==='departmentName'"
                           style="width: 200px"
                           popper-class="my-autocomplete"

                           clearable
                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="querySearch"
                           placeholder="请输入搜索内容"

                           @select="searchSelect"
                           @focus="searchDepartmentFocus()"
                           @keyup.enter.native="search()"

          >
          </el-autocomplete>

          <!-- 列表界面-物料搜索 -->
          <el-autocomplete size="mini" v-if="selectedName === 'materialName'" clearable
                           style="width: 200px"
                           popper-class="my-autocomplete"

                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="querySearch2"
                           placeholder="请输入搜索内容"
                           :trigger-on-focus="false"

                           @select="searchSelect"
                           @focus="searchMmaterialFocus()"
                           @keyup.enter.native="search()"


          >
          </el-autocomplete>

          <!-- 列表界面-单据编号搜索 -->
          <el-input size="mini" v-model="searchStr" v-if="selectedName === 'id'" clearable
                    style="width: 200px"
                    @keyup.enter.native="search()"

                    placeholder="请输入搜索内容"></el-input>

        </el-form-item>

        <el-form-item>

          <!-- 列表界面-日期搜索 -->
          <el-date-picker style="width: 125px"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchStartDate"
                          type="date"
                          clearable
                          placeholder="开始日期">
          </el-date-picker>

        </el-form-item>

        <el-form-item>
          <el-date-picker style="width: 125px"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchEndDate"
                          type="date"
                          clearable
                          placeholder="结束日期">
          </el-date-picker>

        </el-form-item>

        <el-form-item >
          <el-select
              size ="mini"
              v-model="checkedBox"
              multiple
              collapse-tags
              style="margin-left: 0px;width: 150px"
              placeholder="请选择状态">
            <el-option
                v-for="item in statusArr"
                :key="item.val"
                :label="item.name"
                :value="item.val">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" icon="el-icon-search" type="success" @click="search()">搜索</el-button>
        </el-form-item>


        <el-form-item v-if="hasAuth('repository:pickMaterial:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('repository:pickMaterial:save')"
                     @click="addPickMaterial()"

          >新增
          </el-button>
        </el-form-item>
        <el-form-item v-if="hasAuth('repository:pickMaterial:valid')">
          <el-popconfirm @confirm="statusPassBatch()" title="确定审核吗？">
            <el-button size="mini" icon="el-icon-success" :disabled="this.multipleSelection.length === 0 " type="danger"
                       slot="reference">批量审核
            </el-button>
          </el-popconfirm>
        </el-form-item>

        <el-form-item  v-if="hasAuth('repository:pickMaterial:export')" style="margin-left: 0px">
          <el-dropdown   @command="expChange">
            <el-button  icon="el-icon-download" size="mini">
              导出<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="all">导出当前查询条件</el-dropdown-item>
<!--              <el-dropdown-item command="currentList">导出当前列表</el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>


        <el-form-item  v-if="hasAuth('repository:pickMaterial:save')">
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
<!--
        <el-form-item v-if="hasAuth('repository:pickMaterial:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('repository:pickMaterial:save')"
                     @click="dialogImportVisible = true;"

          >导入
          </el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('repository:pickMaterial:save')">
          <el-button size="mini" icon="el-icon-download" type="primary" v-if="hasAuth('repository:pickMaterial:save')"
                     @click="downImportDemo()"

          >导入模板下载
          </el-button>

        </el-form-item>-->

      </el-form>

      <el-table

          ref="multipleTable"
          :data="tableData"
          v-loading = "tableLoad"
          element-loading-background = "rgba(255, 255, 255, .5)"
          element-loading-text = "加载中，请稍后..."
          :span-method="objectSpanMethod"
          border
          fit
          height="520px"
          :summary-method="getSummaries"
          show-summary
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :cell-style="{padding:'0'}"
          :default-sort="{prop:'id',order:'descending'}"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="50">
        </el-table-column>
        <el-table-column
            label="单据编号"

            prop="id" width="90px"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click=" edit(scope.row.id)"
            >{{ scope.row.id }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            prop="pickDate"
            label="领料日期"
            width="90px"
        >
        </el-table-column>


        <el-table-column
            label="领料部门"
            prop="departmentName"
            width="110px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="status"
            width="110px"
            label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已审核</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="warning">暂存</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===2" type="danger">审核中</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===3" type="danger">重新审核</el-tag>
          </template>
        </el-table-column>

<!--        <el-table-column
            prop="produceDocNum"
            width="110px"
            label="生产单号">
        </el-table-column>-->

        <el-table-column
            prop="materialId"
            label="物料编码"
        >
        </el-table-column>


        <el-table-column
            prop="materialName"
            label="物料名称"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="specs"
            label="规格型号">
        </el-table-column>

        <el-table-column
            prop="unit"
            label="基本单位"
            width="80px"
        >
        </el-table-column>


        <el-table-column
            prop="num"
            label="数量"
            width="100px"

        >
        </el-table-column>

        <el-table-column
            prop="action"
            label="操作"
            width="120px"
            fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.id)"
              v-if="hasAuth('repository:pickMaterial:update') || (hasAuth('repository:pickMaterial:list') && scope.row.status != 1 )   ">{{ scope.row.status === 1 ? '编辑' : '查看' }}
            </el-button>

<!--            <el-divider direction="vertical"
                        v-if="hasAuth('repository:pickMaterial:save') && scope.row.status ===1   "></el-divider>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('repository:pickMaterial:save')  && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="statusSubmit(scope.row.id)"
                               title="确定提交吗？"
                >
                  <el-button type="text" size="small" slot="reference">提交</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('repository:pickMaterial:save') && (scope.row.status === 2 || scope.row.status === 3 )   "></el-divider>

            <el-button class="elInput_action_my" type="text" style="padding: 0px"
                       v-if="hasAuth('repository:pickMaterial:save')  && (scope.row.status === 2 || scope.row.status === 3)   ">
              <template>
                <el-popconfirm @confirm="statusSubReturn(scope.row.id)"
                               title="确定撤销吗？"
                >
                  <el-button type="text" size="small" slot="reference">撤销</el-button>
                </el-popconfirm>
              </template>
            </el-button>-->

            <el-button style="padding: 0px" type="text"
              v-if="hasAuth('repository:pickMaterial:valid')  && (scope.row.status === 2 || scope.row.status === 3)   ">

              <template>
                <el-popconfirm @confirm="statusPass(scope.row.id)"
                               title="确定设置审核通过吗？"
                >
                  <el-button type="text" size="small" slot="reference">审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('repository:pickMaterial:valid')  && scope.row.status ===0  ">
              <template>
                <el-popconfirm @confirm="statusReturn(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('repository:pickMaterial:del')  && scope.row.status ===1  "></el-divider>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('repository:pickMaterial:del') && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="del(scope.row.id)"
                               title="确定删除吗？"
                >
                  <el-button type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-button>


          </template>
        </el-table-column>

      </el-table>

      <!-- 打印弹窗 -->
      <el-dialog
          title=""
          :visible.sync="dialogVisiblePrint"
          width="55%"
          style="padding-top: 0px"
          :before-close="printClose"
      >
        <el-button v-if="dialogVisiblePrint"
                   @click="printDemo"
                   v-focus ref="printBtn"
                   size="mini" icon="el-icon-printer" type="primary">打印
        </el-button>
        <vue-easy-print tableShow ref="easyPrint">
          <template slot-scope="func">
            <print :tableData="editForm" :getChineseNumber="func.getChineseNumber"></print>
          </template>
        </vue-easy-print>

      </el-dialog>

      <!-- 领料弹窗 -->

      <el-dialog
          id="pickDialog"
          title="领料信息"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          fullscreen
          @opened="dialogOpend()"
      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"
                 :model="editForm" :rules="rules" ref="editForm"
                 class="demo-editForm">

          <el-form-item label="单据编号" prop="id" style="margin-bottom: 0px">
            <el-input class="elInput_my" :disabled=true placeholder="保存自动生成" v-model="editForm.id">
            </el-input>
          </el-form-item>


          <el-form-item v-if="false" prop="departmentId" style="margin-bottom: 0px">
            <el-input v-model="editForm.departmentId"></el-input>
          </el-form-item>
          <el-form-item label="领料部门" prop="departmentName" style="margin-bottom: 10px">
            <!-- 搜索框 -->
            <el-autocomplete
                :disabled="this.editForm.status!=1"
                style="width: 150px"
                popper-class="my-autocomplete"

                class="inline-input"
                v-model="editForm.departmentName"
                :fetch-suggestions="querySearch"
                placeholder="请输入部门"
                @select="handleSelect"
                @change="moveMouse"
                @focus="searchDepartmentFocus()"

                clearable
            >
            </el-autocomplete>
          </el-form-item>

          <el-form-item  label="领料人" prop="pickUser" style="padding: -20px 0 ;margin-bottom: -20px">
            <el-input :disabled="this.editForm.status!=1"  size="mini" clearable style="width: 100px" v-model="editForm.pickUser">
            </el-input>
          </el-form-item>

          <el-form-item label="领料日期" prop="pickDate">
            <el-date-picker :disabled="this.editForm.status!=1" style="width: 150px"
                            value-format="yyyy-MM-dd"
                            v-model="editForm.pickDate"
                            type="date"
                            clearable
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
<!--          <el-form-item  label="生产单号" prop="produceDocNum" style="padding: -20px 0 ;margin-bottom: -20px">
            <el-input :disabled="this.editForm.status===0"  size="mini" clearable style="width: 100px" v-model="editForm.produceDocNum">
            </el-input>
          </el-form-item>-->

          <el-form-item v-if="hasAuth('repository:buyIn:save')">
            <el-dropdown   @command="action">
              <el-button  icon="el-icon-edit-outline" size="mini" type="success">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="save" v-show="hasAuth('repository:pickMaterial:save') && this.editForm.status===1" >
                  提交单据</el-dropdown-item>
                <el-dropdown-item command="subReturn" v-show="hasAuth('repository:pickMaterial:save') && (this.editForm.status===2 || this.editForm.status===3)">
                  撤销</el-dropdown-item>
                <el-dropdown-item command="addNew" v-show="hasAuth('repository:pickMaterial:save') ">
                  新增</el-dropdown-item>
                <el-dropdown-item command="copy" v-show="hasAuth('repository:pickMaterial:save') ">
                  复制</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>

          <el-form-item >
            <el-button size="mini" @click="preViewPrint()" icon="el-icon-printer" type="primary"
            >打印预览
            </el-button>

          </el-form-item>

<!--          <el-form-item v-if="hasAuth('repository:buyIn:save')">
            <el-popconfirm @confirm="toBuyIn()" title="确定跳转？">
              <el-button size="mini" icon="el-icon-share"  type="danger"
                         slot="reference">跳转采购入库
              </el-button>
            </el-popconfirm>

          </el-form-item>-->

        </el-form>
        <el-divider content-position="left">明细信息</el-divider>

        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddDetails"
                   v-show="this.editForm.status===1">添加
        </el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteDetails"
                   v-show="this.editForm.status===1">删除
        </el-button>

        <el-table
            :data="editForm.rowList"
            :row-class-name="rowClassName"
            @selection-change="handleDetailSelectionChange"
            ref="tb"
            height="500"
            size="mini"
            :cell-style="cellStyle"
            fit
            show-summary
            :summary-method="getDetailSummaries"
        >
          <el-table-column type="selection" width="80" align="center"/>
          <el-table-column label="序号" align="center" prop="seqNum" width="50"></el-table-column>

          <el-table-column style="padding: 0 0;" label="物料编码" align="center" width="320" prop="materialId">
            <template slot-scope="scope">
              <el-autocomplete style="width: 300px"
                               popper-class="my-autocomplete"

                               size="mini" clearable
                               :disabled="editForm.status!=1"
                               class="inline-input"
                               v-model="editForm.rowList[scope.row.seqNum - 1].materialId"
                               :fetch-suggestions="tableSearch"
                               placeholder="请输入内容"
                               :trigger-on-focus="false"

                               @select="tableSelectSearch($event,editForm.rowList[scope.row.seqNum - 1])"
                               @change="tableMoveMouse($event,editForm.rowList[scope.row.seqNum - 1],scope.row.seqNum - 1)"
                               @focus="searchMaterialAllFocus();addNext(scope.row.seqNum)"


              >
              </el-autocomplete>
            </template>

          </el-table-column>

          <el-table-column label="物料名称" align="center" prop="materialName" width="250">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" style="width: 240px"
                        v-model="editForm.rowList[scope.row.seqNum-1].materialName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" align="center" prop="specs" width="100">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].specs"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="物料单位" align="center" prop="unit" width="100">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].unit"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="领料数量" align="center" width="100" prop="num">
            <template slot-scope="scope">
              <el-input  :ref='"input_num_"+scope.row.seqNum'
                         onkeyup="value=value.replace(/[^0-9.]/g,'')"
                         @keyup.up.native="numUp(scope.row.seqNum)"
                         @keyup.down.native="numDown(scope.row.seqNum)"
                         @focus="addNext(scope.row.seqNum)"

                         :disabled="editForm.status!=1" size="mini" v-model="editForm.rowList[scope.row.seqNum-1].num"/>
            </template>
          </el-table-column>

        </el-table>

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
                 :model="editImportForm" :rules="rules" ref="editImportForm"
                 class="demo-editForm myFormClass">

          <el-form-item label="单据编号" prop="id" style="margin-bottom: 20px;width: 300px">
            <el-input class="elInput_my" :disabled=true placeholder="保存自动生成" v-model="editImportForm.id">
            </el-input>
          </el-form-item>

          <el-form-item v-if="false" prop="departmentId">
            <el-input v-model="editImportForm.departmentId"></el-input>
          </el-form-item>

          <el-form-item  label="领料人" prop="pickUser" style="padding: 0px 0 ;margin-bottom: 20px;margin-left: -30px">
            <el-input   size="mini" clearable style="width: 100px" v-model="editImportForm.pickUser">
            </el-input>
          </el-form-item>

          <el-form-item label="领料部门" prop="departmentName" style="margin-bottom: 20px">
            <!-- 搜索框 -->
            <el-autocomplete
                style="width: 150px"
                class="inline-input"
                v-model="editImportForm.departmentName"
                :fetch-suggestions="querySearch"
                placeholder="请输入部门"
                @select="handleImportSelect"
                @change="moveImportMouse"
                @focus="searchDepartmentFocus()"

                clearable
            >
            </el-autocomplete>
          </el-form-item>

          <el-form-item label="领料日期" prop="pickDate">
            <el-date-picker  style="width: 150px"
                            value-format="yyyy-MM-dd"
                            v-model="editImportForm.pickDate"
                            type="date"
                            clearable
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

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

      <!--价目列表 分页组件 -->
      <el-pagination

          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="this.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
      </el-pagination>


      <!-- 导出功能 -->
      <export-excel-common ref="myChild" :exportExcelInfo="exportExcelInfo" :tableData="tableData" :exportExcelArry="exportExcelArry"></export-excel-common>

    </el-main>

  </el-container>

</template>

<script>

// POI，因为响应输出字节流，和ajax 的请求不一样。
import {request} from "@/axios";


// 引入打印基础组件，和打印模块print页面
import vueEasyPrint from "vue-easy-print";
import print from "@/views/printModule/printPick";
import exportExcelCommon from"../common/ExportExcelCommon"
import {request2} from "@/axios";

export default {
  name: 'PickMaterial',
  // 引入打印模块基础组件和该打印模块的模板页面
  components: {
    vueEasyPrint,
    print,
    exportExcelCommon
  },
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',

      tableLoad:false,
      statusArr : [{'name':'暂存','val':1},{'name':'审核中','val':2},{'name':'已审核','val':0},{'name':'重新审核','val':3}],
      checkedBox:[1,2,3,0],
      // 导入
      fileList: [],
      fileSizeIsSatisfy: false,

      // vue 前端的 导出table 数据功能
      //导出表格字段及formatter信息
      exportExcelArry: [{
        prop: 'id',
        label: '单据编号',
        formatterFlag: false
      },
        {
          prop: 'pickDate',
          label: '领料日期',
          formatterFlag: false
        },

        {
          prop: 'status',
          label: '状态',
          formatterFlag: true,
          formatterType: 'common-type',
          formatterInfo: [{value: 0,label: '审核完成'},{value: 1,label: '待审核'}]
        },
        {
          prop: 'departmentName',
          label: '领料部门',
          formatterFlag: false
        },
/*
        {
          prop: 'produceDocNum',
          label: '生产单号',
          formatterFlag: false
        },*/
        {
          prop: 'materialId',
          label: '物料编码',
          formatterFlag: false
        },
        {
          prop: 'materialName',
          label: '物料名称',
          formatterFlag: false
        },
        {
          prop: 'specs',
          label: '规格型号',
          formatterFlag: false
        },
        {
          prop: 'unit',
          label: '基本单位',
          formatterFlag: false
        },{
          prop: 'num',
          label: '数量',
          formatterFlag: false
        }

      ],
      //导出excel表格id及excel名称
      exportExcelInfo: {
        excelId: 'record-table',
        excelName: '生产领料列表.xlsx'
      },
      //需要导出的table数据
      tableAllData: [],

      dialogVisiblePrint: false,

      //选中的从表数据
      checkedDetail: [],

      // 搜索字段
      selectedName: 'departmentName',// 搜索默认值
      options: [
        {value: 'departmentName', label: '部门名称'},
        {value: 'materialName', label: '物料名称'},
        {value: 'id', label: '单据编号'}
      ],
      select: 'departmentName', // 搜索默认值
      searchStr: '',
      searchStartDate: '',
      searchEndDate: '',
      searchStrList: [],
      searchField: '',
      restaurants: [],// 搜索框列表数据存放
      restaurants2: [], //
      restaurants3: [], //用于增量表格的搜索框内容

      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 100 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      // 表单字段
      addOrUpdate: 'save',
      editForm: {
        status: 1, // 编辑表单初始默认值
        id: '',
        departmentId: '',
        departmentName: '',
        materialName: '',
        materialId: '',
        pickDate: new Date().format("yyyy-MM-dd"),
        pickUser:'',
        endDate: '',
        produceDocNum: '',
        totalAmount:'',

        rowList: [{
          materialName:'',
          unit:'',
          materialId:'',
          num:'',
          specs:''
        }]
      },
      editImportForm: {
        status: 1, // 编辑表单初始默认值
        id: '',
        departmentId: '',
        departmentName: '',
        pickDate: new Date().format("yyyy-MM-dd"),
        pickUser:'',
      },
      rules: {
        departmentName: [
          {required: true, message: '请输入领料部门', change: 'blur'}
        ],
        pickDate: [
          {required: true, message: '请输入领料日期', trigger: 'blur'}
        ]
      }
      ,
      dialogVisible: false,
      dialogImportVisible: false,
      tableData: [],
      tableData2: [],
      spanArr: [],
      pos: '',
      multipleSelection: [] // 多选框数组

    }
  },
  methods: {
    statusPassBatch(){
      let ids = this.multipleSelection;
      request.post('/repository/pickMaterial/statusPassBatch',ids).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getPickDocumentList()
      })
    },
    chooseTag(tag){
      console.log("选中tag:",tag)
      this.select = tag.searchField
      this.searchStr = tag.searchStr;
      this.searchStartDate = tag.searchStartDate;
      this.searchEndDate = tag.searchEndDate;
      let arr = tag.searchStatus.split(",");
      let tmpArr = [];
      for (let i = 0; i < arr.length; i++) {
        tmpArr.push(parseInt(arr[i]));
      }
      this.checkedBox=tmpArr
      this.getPickDocumentList()
    },
    async loadTags(){
      await request.get('/tag/list?type='+3).then(res => {
        this.dynamicTags = res.data.data;
      })
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm() {

      let inputValue = this.inputValue;
      // if (inputValue) {
      //   this.dynamicTags.push(inputValue);
      // }
      // 添加到数据库
      let checkStr = this.checkedBox.join(",");
      await request.get('/tag/save?tagName='+inputValue+'&&type='+3+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr+
          '&&searchStr='+this.searchStr).then(res => {
        this.$message({
          message: res.data.data,
          type: 'success'
        });
      })
      this.inputVisible = false;
      this.inputValue = '';
      await this.loadTags()
    },
    async tagClose(tag) {
      // 删除到数据库
      await request.get('/tag/del?tagName='+tag.tagName+'&&type='+3).then(res => {
        this.$message({
          message: res.data.data,
          type: 'success'
        });
      })
      await this.loadTags()
    },

    dialogOpend(){
      if(this.editForm.id != '' && this.editForm.id != undefined){
        console.log("打开编辑页面.锁住...",this.editForm.id);
        request.get('/repository/pickMaterial/lockById?id=' + this.editForm.id)
      }
    },
    // 导出列表数据- 服务端写出字节流到浏览器，进行保存
    downImportDemo() {

      request2.post('/repository/pickMaterial/down',null,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'领料模板.xlsx')
      }).catch()
    },

    importExcel(formName) {
      this.$refs[formName].validate((valid) => {
        console.log("valid",valid)
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
        if (valid) {
          this.$refs.upload.submit();
        }
      })
    }
    ,
    // 文件导入--------------------
    uploadRequest(fileobj) {
      let param = new FormData()
      param.append('files', fileobj.file)

      request({
        method: 'post',
        url: '/repository/pickMaterial/upload?pickUser=' + this.editImportForm.pickUser + "&&departmentId="
            + this.editImportForm.departmentId + "&&pickDate=" + this.editImportForm.pickDate,
        headers: {'Content-Type': 'multipart/form-data'},
        data: param
      }).then(res => {
        let theData = res.data.data;
        console.log("返回的内容:",theData)
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
          this.getPickDocumentList()
        }

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


    // 数量的上下光标事件
    numDown(seqNum){
      if(this.$refs['input_num_'+(seqNum + 1)] != undefined){
        this.$refs['input_num_'+(seqNum + 1)].focus()
      }
    },
    numUp(seqNum){
      if(this.$refs['input_num_'+(seqNum - 1)] != undefined){
        this.$refs['input_num_'+(seqNum - 1)].focus()
      }
    },
    // 导入
    expChangeImport(item) {
      if (item === 'import') {
        this.dialogImportVisible = true;
      } else if(item === 'importDemo'){
        this.downImportDemo();
      }
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
        console.log("详情页新增")
        this.closeBrowser();
        this.addPickMaterial();
      }
      else if(item === 'copy'){
        this.closeBrowser();
        this.editForm.id = '';
        this.editForm.status = 1;
        this.addOrUpdate = 'save';
      }
    },
    // 导出
    expChange(item) {
      console.log("导出:",item)
      if (item === 'currentList') {
        this.exportExcel()
      } else if(item === 'all'){
        this.exportList()
      }
    },
    // 导出按钮
    exportExcel () {
      this.$refs.myChild.exportExcel();
    },

    // 导出列表数据- 服务端写出字节流到浏览器，进行保存
    exportList() {

      request2.post('/repository/pickMaterial/export?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchStr="+this.searchStr+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select
          ,null,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'生产领料全部列表.xlsx')
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


    // 设置每一行的seqNum = 游标+1
    rowClassName({row, rowIndex}) {
      row.seqNum = rowIndex + 1;
    },
    //单选框选中数据
    handleDetailSelectionChange(val) {
      console.log("多选框 val ", val)
      this.checkedDetail = []

      val.forEach(theId => {
        this.checkedDetail.push(theId.seqNum)
      })
      console.log("多选框 选中的 ", this.checkedDetail)
    },
    // 领料详细信息-添加
    handleAddDetails() {
      if (this.editForm.rowList == undefined) {
        console.log("editForm 初始化")
        this.editForm.rowList = new Array();
      }
      let obj = {};
      obj.materialName = "";
      obj.unit = "";
      obj.materialId = '';
      obj.num = ''
      obj.specs = ''

      this.editForm.rowList.push(obj);
      console.log("现有的数据:", this.editForm.rowList)
    },
    // 领料详细信息-删除
    handleDeleteDetails() {
      if (this.checkedDetail.length == 0) {
        if(this.editForm.rowList.length === 0){
          this.$message({
            message: '没有记录可删除!',
            type: 'error'
          });
        }else{
          this.editForm.rowList.splice(this.editForm.rowList.length-1,1)
        }
      } else {
        let newArr = this.getNewArr(this.editForm.rowList,this.checkedDetail);
        this.editForm.rowList = newArr
      }
      this.checkedDetail=[]
    },
    handleDeleteAllDetails() {
      this.editForm.rowList = [];
    },
    // arr: 原数组，delIndexArr：删除下标数组
    getNewArr(arr,delIndexArr){
      let test = []
      test = arr.filter((item, index) =>{
        return !delIndexArr.includes(index+1)}
      )
      return test
    },

    loadDepartmentAll() {
      request.post('/baseData/department/getSearchAllData').then(res => {
        this.restaurants = res.data.data
        console.log("部门列表数据:",this.restaurants)
      })
    },

    loadTableSearchMaterialDetailAll() {
      request.post('/baseData/material/loadTableSearchMaterialDetailAll').then(res => {
        this.restaurants3 = res.data.data
      })
    },
    loadMaterialAll() {
      request.post('/baseData/material/getSearchAllData').then(res => {
        this.restaurants2 = res.data.data
      })
    },
    // 查询搜索框列表数据
    tableSearch(queryString, cb) {
      var restaurants = this.restaurants3;
      var results = queryString ? restaurants.filter(this.createFilter2(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 查询搜索框列表数据
    querySearch2(queryString, cb) {
      var restaurants = this.restaurants2;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;

      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        console.log("部门一个对象：",restaurant,queryString)
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || ((restaurant.id+"").toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    createFilter2(queryString) {
      return (restaurant) => {
        return (restaurant.obj.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleImportSelect(item) {
      this.editImportForm.departmentId = item.id
      this.editImportForm.departmentName = item.name
      console.log("选中：", item);
    },
    handleSelect(item) {
      this.editForm.departmentId = item.id
      this.editForm.departmentName = item.name
      console.log("选中：", item);
    },
    handleSelect2(item) {
      this.editForm.materialId = item.id
      this.editForm.materialName = item.name
      console.log("选中：", item);
    },
    searchSelect(item) {
      this.searchStr = item.name
      console.log("选中：", item);
    },
    moveMouse(text) {
      try {
        // foreach 只能抛出异常结束
        this.restaurants.forEach(item => {
          if (text === item.name) {
            console.log("匹配到:", text, item.name, this.editForm.departmentId, item.id)
            this.editForm.departmentId = item.id
            this.editForm.departmentName = item.name
            throw new Error();
          } else {
            this.editForm.departmentId = ''
            console.log("没有匹配到", text, item.name)
            this.editForm.departmentName = ''
          }
        })
      } catch (err) {
      }
    },
    moveImportMouse(text) {
      try {
        // foreach 只能抛出异常结束
        this.restaurants.forEach(item => {
          if (text === item.name) {
            this.editImportForm.departmentId = item.id
            this.editImportForm.departmentName = item.name
            throw new Error();
          } else {
            this.editImportForm.departmentId = ''
            console.log("没有匹配到", text, item.name)
            this.editImportForm.departmentName = ''
          }
        })
      } catch (err) {
      }
    },
    tableMoveMouse(selectItem, rowObj,index) {
      console.log("tableMoveMouse", selectItem, rowObj)
      try {
        // foreach 只能抛出异常结束
        this.restaurants3.forEach(item => {
          if (selectItem === item.id) {
            console.log("匹配到:", selectItem, item.id)
            rowObj.materialId = item.id;
            rowObj.materialName = item.obj.name
            rowObj.unit = item.obj.unit
            rowObj.specs = item.obj.specs
            throw new Error();
          } else {
            rowObj.materialName = "";
            rowObj.unit = "";
            rowObj.materialId = '';
            rowObj.specs = ''

            rowObj.num = ''
            console.log("没有匹配到", selectItem, item.id)
          }
          console.log("设置rowObj:{},",this.editForm.rowList)

        })
      } catch (err) {
      }
    },
    tableSelectSearch(selectItem, param) {
      console.log("每个表格项选中：", selectItem, param);
      param.materialId = selectItem.id;
      param.materialName = selectItem.obj.name
      param.unit = selectItem.obj.unit
      param.specs = selectItem.obj.specs
      console.log("rowList：", this.editForm.rowList);

    },
    // 关闭打印弹窗弹窗处理动作
    printClose(done) {
      console.log("打印弹窗关闭...")

      this.$refs.easyPrint.tableShow = false;
      done();
    },
    addNext(seq){
      if(this.editForm.rowList.length === seq){
        this.handleAddDetails();
      }
    },
    // 入库列表 点击添加按钮
    addPickMaterial() {
      this.addOrUpdate = 'save'
      this.editForm = {
        status: 1, // 编辑表单初始默认值
        id: '',
        departmentId: '',
        departmentName: '',
        materialName: '',
        materialId: '',
        pickDate: new Date().format("yyyy-MM-dd"),
        endDate: '',
        price: '',
        totalAmount:'',

        rowList: [{
          materialName:'',
          unit:'',
          materialId:'',
          num:'',
          specs:''
        }]
      }
      this.dialogVisible = true
    },

    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getPickDocumentList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getPickDocumentList()

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
    submitForm(formName, methodName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {
          if (this.editForm.rowList === undefined || this.editForm.rowList.length === 0) {
            this.$message({
              message: '请录入至少一个领料物料信息',
              type: 'error'
            });
            return
          }

          let validateFlag = true;
          let validateMaterial = true;
          let emptyArr = []; // 存放空内容 的 下标。
          for (let i = 0; i < this.editForm.rowList.length; i++) {
            let obj = this.editForm.rowList[i];

            if((obj.num === undefined || obj.num === '') && (obj.materialId === '')){
              emptyArr.push(i+1);
              continue;
            }
            if (obj.num === undefined || obj.num === '') {
              validateFlag = false
            }
            if (obj.materialId === '') {
              validateMaterial = false
            }
          }
          // 移除空的数组内容
          console.log("移除前的内容:",this.editForm.rowList)
          let newArr = this.getNewArr(this.editForm.rowList,emptyArr);
          this.editForm.rowList = newArr
          console.log("移除后的内容:",this.editForm.rowList)

          if (validateMaterial === false) {
            this.$message({
              message: '物料不能为空!',
              type: 'error'
            });
            return
          }

          if (validateFlag === false) {
            this.$message({
              message: '领料数量不能为空!',
              type: 'error'
            });
            return
          }

          if(this.editForm.rowList.length === 0){
            this.$message({
              message: '详情内容不能为空!',
              type: 'error'
            });
            return
          }

          request.post('/repository/pickMaterial/' + methodName, this.editForm).then(res => {
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

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    search(){
      this.currentPage = 1;
      this.getPickDocumentList()
    },
    // 查询价目表单列表数据
    getPickDocumentList() {
      this.tableLoad = true;
      let checkStr = this.checkedBox.join(",");
      console.log("搜索字段:", this.select)
      request.get('/repository/pickMaterial/list', {
        params: {
        currentPage: this.currentPage
            , pageSize: this.pageSize
            , total: this.total
            , searchStr: this.searchStr
            , searchStartDate: this.searchStartDate
            , searchEndDate: this.searchEndDate
            , searchField: this.select
          , searchStatus:checkStr
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
        this.getSpanArr(this.tableData)
        this.tableLoad = false;
        this.$nextTick(() => {
          this.$refs['multipleTable'].doLayout();
        })
      }).catch(error=>{
        this.tableLoad = false;
        console.log("error:",error)
      })
    },
    // 编辑页面
    edit(id) {
      this.addOrUpdate = "update"
      request.get('/repository/pickMaterial/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.dialogVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result

        })

      })
    },
    // 一键生产领料
    queryByBuyInId(id) {
      request.get('/repository/pickMaterial/queryByBuyInId?buyInId=' + id).then(res => {
        let result = res.data.data
        this.dialogVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
          this.editForm.pickDate = new Date().format("yyyy-MM-dd");
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
      request.post('/repository/pickMaterial/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getPickDocumentList()
        console.log("删除后重新加载页面")

      })
    },

    // 撤销提交
    statusSubReturn(id) {
      request.get('/repository/pickMaterial/statusSubReturn?id=' + id).then(res => {
        this.$message({
          message: '已撤销!',
          type: 'success'
        });
        this.editForm.status = 1;
        this.getPickDocumentList()
      })
    },
    // 状态提交
    statusSubmit(id) {
      request.get('/repository/pickMaterial/statusSubmit?id=' + id).then(res => {
        this.$message({
          message: '已提交!',
          type: 'success'
        });
        this.getPickDocumentList()
      })
    },
    // 状态待审核
    statusPass(id) {
      request.get('/repository/pickMaterial/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getPickDocumentList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/repository/pickMaterial/statusReturn?id=' + id).then(res => {
        this.$message({
          message: '反审核完成!',
          type: 'success'
        });
        this.getPickDocumentList()
      })
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
    closeMethod(){
      if(this.editForm.id != '' && this.editForm.id != undefined){
        console.log("关闭编辑页面.打开锁...",this.editForm.id);
        request.get('/repository/pickMaterial/lockOpenById?id=' + this.editForm.id)
      }
      this.$refs['editForm'].resetFields();
      this.handleDeleteAllDetails()
      this.getPickDocumentList()
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
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    searchFieldChange(item) {
      console.log("搜索字段改变:", item)
      this.selectedName = item
    },

    // 同ID的，单元格合并，数据库配合返回根据ID排序
    getSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0
        } else {
          // 判断这一条和上一条id是否相同
          if (data[i].id === data[i - 1].id) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    // 同ID的，单元格合并，数据库配合返回根据ID排序
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 2) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 3) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 4) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      else if (columnIndex === 10) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }

    },
    getDetailSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '求和';
          return;
        }
        if (index === 6 ) {
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
          if(index === 6){
            this.editForm.totalNum = sums[index];
          }
        }

      });

      return sums;
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '求和';
          return;
        }
        if (index === 9 ) {
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
    preViewPrint() {
      console.log("pick print：")

      if (this.editForm) {
        console.log("打印时的easyPrint：", this.$refs.easyPrint)
        console.log("打印时的editForm：", this.editForm)
        if (this.$refs.easyPrint) {
          console.log("设置前打印内容", this.$refs.easyPrint.tableData)

          this.$refs.easyPrint.tableData = this.editForm
          console.log("设置后打印内容", this.$refs.easyPrint.tableData)

        }
        this.dialogVisiblePrint = true
      } else {
        this.$message({
          message: '没有内容!',
          type: 'error'
        });
      }
    },
    // 打印按钮事件
    printDemo() {
      this.$refs.easyPrint.print()
    },

    toBuyIn(){
        this.closeMethod()
        this.dialogVisible = false;
        this.$router.push({name:'repository:pickMaterial:list'});
    },

    // el-table 单元格样式修改
    cellStyle() {
      return 'padding:0 0'
    },
    async closeBrowser(){
      if(this.editForm.id != '' && this.editForm.id != undefined){
        console.log("关闭编辑页面.打开锁...",this.editForm.id);
        await request.get('/repository/pickMaterial/lockOpenById?id=' + this.editForm.id)
      }
    },
    searchMmaterialFocus(){
      this.loadMaterialAll()
    },
    searchDepartmentFocus(){
      this.loadDepartmentAll()
    },
    searchMaterialAllFocus(){
      this.loadTableSearchMaterialDetailAll()
    },
    handleEvent(){
      if (event.keyCode === 80&& event.ctrlKey) {
        this.preViewPrint();
        this.$nextTick(() => {
          this.printDemo()
        })
        event.preventDefault();
        event.returnValue = false;
        return false;
      }
    }

  },
  created() {
    this.getPickDocumentList()
    this.loadDepartmentAll()
    this.loadMaterialAll()
    this.loadTableSearchMaterialDetailAll()
    this.loadTags()

  },mounted() {
    window.addEventListener( 'beforeunload', e => this.closeBrowser() );
  }
  ,
  // 每次页面切换进入则激活
  activated() {
    document.addEventListener('keydown',this.handleEvent)

    let id = this.$route.params.id
    console.log("1激活activated钩子函数id:",id);
    if(id != '' && id !=undefined && id != null){
      this.queryByBuyInId(id)
    }

  }
  , deactivated() {
    console.log("pick deactivated")
    document.removeEventListener('keydown',this.handleEvent)
  }
  // 自定义指令，，insert在DOM加入的时候才生效
  , directives: {
    // 声明自定义指令v-focus
    focus: {
      // v-foucs指令的钩子函数
      inserted: function (el, binding) {
        console.log("聚焦...")
        el.focus();
      },
    },
  }

}


</script>


<style>

.el-pagination {
  float: right;

}

.el-table--mini td {
  padding: 0 0;
}
.myFormClass .el-upload-dragger{
    width: 200px;
  height: 200px;
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

</style>