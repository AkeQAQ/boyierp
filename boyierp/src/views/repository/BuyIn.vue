<template>
  <el-container id="buyIn">
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
    <el-main class="elMain_my" style="padding-top: 0;padding-right: 0px">
      <!-- 入库单列表 -->
      <el-form :inline="true" class="demo-form-inline elForm_my" >
        <el-form-item>
          <el-select style="width: 120px" size="mini" v-model="select" filterable @change="searchFieldChange" placeholder="请选择搜索字段">
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
          <!-- 列表界面-供应商搜索 -->
          <el-autocomplete size="mini" v-if="selectedName==='supplierName'"
                           style="width: 200px"
                           popper-class="my-autocomplete"

                           clearable
                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="querySearch"
                           :trigger-on-focus="false"
                           placeholder="请输入搜索内容"
                           @select="searchSelect"
                           @focus="searchSupplierFocus()"
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
                           :trigger-on-focus="false"
                           placeholder="请输入搜索内容"
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
              <el-autocomplete size="mini" v-if="item.selectField==='supplierName'"
                               style="width: 200px"
                               popper-class="my-autocomplete"
                               clearable
                               class="inline-input"
                               v-model="item.searchStr"
                               :fetch-suggestions="querySearch"
                               :trigger-on-focus="false"
                               placeholder="请输入搜索内容"
                                @select="searchManySelect($event,index)"
                           @focus="searchSupplierFocus()"
              >
              </el-autocomplete>

              <el-autocomplete size="mini" v-if="item.selectField === 'materialName'" clearable
                               style="width: 200px"
                               popper-class="my-autocomplete"
                               class="inline-input"
                               v-model="item.searchStr"
                               :fetch-suggestions="querySearch2"
                               :trigger-on-focus="false"
                               @select="searchManySelect($event,index)"
                               @focus="searchMmaterialFocus()"

                               placeholder="请输入搜索内容"

              >
              </el-autocomplete>

              <el-input size="mini" v-model="item.searchStr" v-if="item.selectField === 'id'" clearable
                        style="width: 200px"
                        placeholder="请输入搜索内容"></el-input>
              <el-button type="danger" size="mini" icon="el-icon-delete" circle
                @click="delSearch(index)"
              ></el-button>

            </li>
          </ul>
          <el-button type="primary" style="margin-left: 40px" size="mini" @click="addSearchItem()">添加额外搜索条件</el-button>

          <el-button slot="reference" type="info" style="padding: 0 0 ;margin-top: 20px;margin-left: -10px" size="mini" icon="el-icon-arrow-down" circle></el-button>

        </el-popover>


        <el-form-item>

          <!-- 列表界面-日期搜索 -->
          <el-date-picker style="width: 125px;"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchStartDate"
                          type="date"
                          clearable
                          placeholder="开始日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker style="width: 125px;"
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

        <el-form-item>
          <el-button size="mini" icon="el-icon-search" type="success"  @click="search()" >搜索</el-button>

<!--          <el-dropdown  @command="searchDropDown" size="mini" icon="el-icon-search"  split-button type="success" @click="search">
            搜索
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加过滤方案</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
        </el-form-item>


        <el-form-item v-if="hasAuth('repository:buyIn:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('repository:buyIn:save')"
                     @click="addSupplierMaterial()"

          >新增
          </el-button>
        </el-form-item>
        <el-form-item v-if="hasAuth('repository:buyIn:valid')">
          <el-popconfirm @confirm="statusPassBatch()" title="确定审核吗？">
            <el-button size="mini" icon="el-icon-success" :disabled="this.multipleSelection.length === 0 " type="danger"
                       slot="reference">批量审核
            </el-button>
          </el-popconfirm>
        </el-form-item>

        <el-form-item v-if="hasAuth('repository:buyIn:export')" style="margin-left: 0">
          <el-dropdown   @command="expChange">
            <el-button  icon="el-icon-download" size="mini" >
              导出<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="all">导出当前条件全部</el-dropdown-item>
              <el-dropdown-item command="currentList">导出当前页</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>

        <!--        <el-form-item v-if="hasAuth('repository:buyIn:del')">
                  <el-popconfirm @confirm="del(null)" title="确定删除吗？">
                    <el-button size="mini" icon="el-icon-delete" :disabled="this.multipleSelection.length === 0 " type="danger"
                               slot="reference">批量删除
                    </el-button>
                  </el-popconfirm>
                </el-form-item>-->

      </el-form>

      <el-table
          :row-style="rowClass"
          highlight-current-row
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
          :cell-style="{padding:'0',borderColor:'black'}"
          :header-cell-style="{borderColor:'black'}"
          :default-sort="{prop:'id',order:'descending'}"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="50">
        </el-table-column>
        <el-table-column
            label="单据编号"
            sortable
            prop="id" width="100px"
        >
          <template slot-scope="scope"   >
            <el-button type="text" size="small"
                       @click="hasAuth('repository:buyIn:update') && edit(scope.row.id)"
            >{{ scope.row.id }}
            </el-button>
          </template>

        </el-table-column>

        <el-table-column
            prop="buyInDate"
            label="入库日期"
            width="90px"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="hasAuth('repository:buyIn:update') && edit(scope.row.id)"
            >{{ scope.row.buyInDate }}
            </el-button>
          </template>
        </el-table-column>


        <el-table-column
            label="供应商"
            prop="supplierName"
            width="110px"
            show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="hasAuth('repository:buyIn:update') && edit(scope.row.id)"
            >{{ scope.row.supplierName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
            label="供应商单号"
            prop="supplierDocumentNum"
            width="100px"
            show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="hasAuth('repository:buyIn:update') && edit(scope.row.id)"
            >{{ scope.row.supplierDocumentNum }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            prop="status"
            label="状态"
            width="87px"
            sortable
        >
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已审核</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="warning">暂存</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===2" type="danger">审核中</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===3" type="danger">重新审核</el-tag>

          </template>
        </el-table-column>

        <el-table-column
            label="物料编码"
            prop="materialId"
            width="90px"
            show-overflow-tooltip
        >
<!--          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="hasAuth('repository:buyIn:update') && edit(scope.row.id)"
            >{{ scope.row.materialId }}
            </el-button>
          </template>-->
        </el-table-column>

        <el-table-column
            prop="materialName"
            label="物料名称"
            width="120px"
            show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="hasAuth('repository:buyIn:update') && edit(scope.row.id)"
            >{{ scope.row.materialName }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            prop="unit"
            label="基本单位"
            width="80px"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="hasAuth('repository:buyIn:update') && edit(scope.row.id)"
            >{{ scope.row.unit }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            prop="num"
            label="数量"
            width="100px"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="hasAuth('repository:buyIn:update') && edit(scope.row.id)"
            >{{ scope.row.num }}
            </el-button>
          </template>
        </el-table-column>


<!--        <el-table-column
            prop="priceDate"
            label="价目日期"
            width="90px"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="hasAuth('repository:buyIn:update') && edit(scope.row.id)"
            >{{ scope.row.priceDate }}
            </el-button>
          </template>
        </el-table-column>-->

        <el-table-column
            prop="price"
            label="单价"
            width="60px"
            :filters=priceFileterArr
            :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="hasAuth('repository:buyIn:update') && edit(scope.row.id)"
            >{{ scope.row.price }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            prop="amount"
            label="金额"
            width="100px"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="hasAuth('repository:buyIn:update') && edit(scope.row.id)"
            >{{ scope.row.amount ==null? null :scope.row.amount.toFixed(2) }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            prop="orderSeq"
            label="单号">
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="hasAuth('repository:buyIn:update') && edit(scope.row.id)"
            >{{ scope.row.orderSeq }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            prop="orderId"
            label="订单编号">
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click="hasAuth('repository:buyIn:update') && edit(scope.row.id)"
            >{{ scope.row.orderId }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            prop="action"
            label="操作"
            width="120px"
            fixed="right"
        >
          <template slot-scope="scope">
            <el-button class="elInput_action_my" type="text" size="small" @click="edit(scope.row.id)"  style="padding: 0"
                       v-if="hasAuth('repository:buyIn:update') || (hasAuth('repository:buyIn:list') && scope.row.status != 1 )   ">{{ scope.row.status === 1 ? '编辑' : '查看' }}
            </el-button>

<!--            <el-divider direction="vertical"
                        v-if="hasAuth('repository:buyIn:save') && scope.row.status === 1   "></el-divider>

            <el-button class="elInput_action_my" type="text" style="padding: 0"
                       v-if="hasAuth('repository:buyIn:save')  && scope.row.status === 1   ">
              <template>
                <el-popconfirm @confirm="statusSubmit(scope.row.id)"
                               title="确定提交吗？"
                >
                  <el-button type="text" size="small" slot="reference">提交</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('repository:buyIn:save') && (scope.row.status === 2 || scope.row.status === 3 )   "></el-divider>

            <el-button class="elInput_action_my" type="text" style="padding: 0"
                       v-if="hasAuth('repository:buyIn:save')  && (scope.row.status === 2 || scope.row.status === 3)   ">
              <template>
                <el-popconfirm @confirm="statusSubReturn(scope.row.id)"
                               title="确定撤销吗？"
                >
                  <el-button type="text" size="small" slot="reference">撤销</el-button>
                </el-popconfirm>
              </template>
            </el-button>-->

<!--            <el-divider direction="vertical"
                        v-if="hasAuth('repository:buyIn:valid') && (scope.row.status === 2 || scope.row.status === 3)  "></el-divider>-->

            <el-button class="elInput_action_my" type="text" style="padding: 0"
                       v-if="hasAuth('repository:buyIn:valid')  && (scope.row.status === 2 || scope.row.status === 3)   ">
              <template>
                <el-popconfirm @confirm="statusPass(scope.row.id)"
                               title="确定设置审核通过吗？"
                >
                  <el-button type="text" size="small" slot="reference">审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('repository:buyIn:valid')  && scope.row.status === 0  "></el-divider>

            <el-button class="elInput_action_my" type="text"  style="padding: 0"
                       v-if="hasAuth('repository:buyIn:valid')  && scope.row.status === 0  ">
              <template>
                <el-popconfirm @confirm="statusReturn(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('repository:buyIn:del')  && scope.row.status ===1  "></el-divider>

            <el-button class="elInput_action_my" type="text"  style="padding: 0"
                       v-if="hasAuth('repository:buyIn:del') && scope.row.status ===1   ">
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
          class="elDialog_print_my"
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

      <!-- 采购入库弹窗 -->

      <el-dialog
          title="采购入库信息"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          fullscreen
          ref="buyIn_dialog"
          @opened="dialogOpend()"
      >
        <el-form
                 size="mini" :inline="true"
                 label-width="100px"
                 :model="editForm" :rules="rules" ref="editForm"
                 class="demo-editForm elDialogForm_my">

          <el-form-item label="单据编号" prop="id" >
            <el-input style="width: 150px" :disabled=true placeholder="保存自动生成" v-model="editForm.id">

            </el-input>
          </el-form-item>
          <!--
                    <el-form-item label="状态" prop="status" style="margin-bottom: 0">
                      <el-input style="width: 220px" :disabled=true v-model="editForm.status" >
                      </el-input>
                    </el-form-item>-->

          <el-form-item v-show="false" prop="supplierId" >
            <el-input v-model="editForm.supplierId"></el-input>
          </el-form-item>
          <el-form-item label="供应商" prop="supplierName" >
            <!-- 搜索框 -->
            <el-autocomplete
                style="width: 250px"
                :disabled="this.editForm.status!=1 ||  this.editForm.sourceType === 1"
                class="inline-input elAutocomplete_my"
                popper-class="my-autocomplete"

                v-model="editForm.supplierName"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                placeholder="请输入供应商"
                @select="handleSelect"
                @change="moveMouse"
                @focus="searchSupplierFocus()"

                clearable
            >
            </el-autocomplete>
          </el-form-item>

          <el-form-item  label="供应商单号" prop="supplierDocumentNum" >
            <el-input :disabled="this.editForm.status!=1 ||  this.editForm.sourceType === 1"  size="mini" clearable style="width: 120px;" v-model="editForm.supplierDocumentNum">
            </el-input>
          </el-form-item>

          <el-form-item label="入库日期" prop="buyInDate">
            <el-date-picker :disabled="this.editForm.status!=1 ||  this.editForm.sourceType === 1" style="width: 130px;"
                            value-format="yyyy-MM-dd"
                            v-model="editForm.buyInDate"
                            type="date"
                            clearable
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item v-if="hasAuth('repository:buyIn:save')">
            <el-dropdown   @command="action">
              <el-button  icon="el-icon-edit-outline" size="mini" type="success">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="save" v-show="hasAuth('repository:buyIn:save') && this.editForm.status===1" >
                  提交单据</el-dropdown-item>
                <el-dropdown-item command="subReturn" v-show="hasAuth('repository:buyIn:save') && (this.editForm.status===2 || this.editForm.status===3)">
                  撤销</el-dropdown-item>
                <el-dropdown-item command="addNew" v-show="hasAuth('repository:buyIn:save') ">
                  新增</el-dropdown-item>
                <el-dropdown-item command="copy" v-show="hasAuth('repository:buyIn:save') ">
                  复制</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>

          <el-form-item style="margin-left: 0">
<!--            <el-button type="primary" v-show="this.editForm.status===1" @click="submitForm('editForm',addOrUpdate)">
              提交单据
            </el-button>-->
            <el-button @click="preViewPrint()" icon="el-icon-printer" type="primary"
            >打印预览
            </el-button>

          </el-form-item>

          <el-form-item v-if="hasAuth('repository:pickMaterial:save')">
            <el-popconfirm @confirm="pickMaterial()" title="确定跳转？">
              <el-button size="mini" icon="el-icon-share" :disabled="this.editForm.rowList.length === 0 " type="danger"
                         slot="reference">跳转领料
              </el-button>
            </el-popconfirm>

          </el-form-item>

        </el-form>
        <el-divider content-position="left">明细信息</el-divider>

        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddDetails"
                   v-show="this.editForm.status===1  && this.editForm.sourceType === 0 ">添加
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

          <el-table-column label="单号" align="center" prop="orderSeq" width="100">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].orderSeq"></el-input>
            </template>
          </el-table-column>

          <el-table-column style="padding: 0 0;" label="物料编码" align="center" width="310" prop="materialId">
            <template slot-scope="scope">
              <el-autocomplete size="mini" clearable style="width: 300px"
                               popper-class="my-autocomplete"
                               :disabled="editForm.status!=1 ||  editForm.sourceType === 1"
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

          <el-table-column label="物料名称" align="center" prop="materialName" width="210">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" style="width: 200px"
                        v-model="editForm.rowList[scope.row.seqNum-1].materialName"
              ></el-input>
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

          <el-table-column label="入库单价" align="center" width="75" prop="price">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].price"/>
            </template>
          </el-table-column>

          <el-table-column label="入库数量" align="center" width="100" prop="num" >
            <template slot-scope="scope">
              <el-input @keyup.enter.native="handleAddDetails"
                        onkeyup="value=value.replace(/[^0-9.]/g,'')"
                        @input="changeNum(scope.row.seqNum,editForm.supplierId,scope.row.materialId,editForm.buyInDate)"
                        :ref='"input_num_"+scope.row.seqNum'
                        @keyup.up.native="numUp(scope.row.seqNum)"
                        @keyup.down.native="numDown(scope.row.seqNum)"
                        @focus="addNext(scope.row.seqNum)"
                        :disabled="editForm.status!=1 ||  editForm.sourceType === 1" size="mini" v-model="editForm.rowList[scope.row.seqNum-1].num"/>
            </template>
          </el-table-column>

          <el-table-column label="金额" align="center" width="115" prop="amount">
            <template slot-scope="scope">
              <el-input size="mini" :disabled=true v-model="editForm.rowList[scope.row.seqNum-1].amount"/>
            </template>
          </el-table-column>


          <el-table-column label="备注" align="center" width="150" prop="comment">
            <template slot-scope="scope">
              <el-input  :disabled="editForm.status!=1 || editForm.sourceType === 1" size="mini" v-model="editForm.rowList[scope.row.seqNum-1].comment"/>
            </template>
          </el-table-column>

        </el-table>

      </el-dialog>

      <!--价目列表 分页组件 -->
      <el-pagination

          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[100, 200, 300, 10000]"
          :page-size="this.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
      </el-pagination>
    </el-main>


    <!-- 导出功能 -->
    <export-excel-common ref="myChild" :exportExcelInfo="exportExcelInfo" :tableData="tableData" :exportExcelArry="exportExcelArry"></export-excel-common>

  </el-container>





</template>

<script>

// POI，因为响应输出字节流，和ajax 的请求不一样。
import {request} from "@/axios";


// 引入打印基础组件，和打印模块print页面
import vueEasyPrint from "vue-easy-print";
import print from "@/views/printModule/print";
import exportExcelCommon from"../common/ExportExcelCommon"
import {request2} from "@/axios";

export default {
  name: 'BuyIn',
  // 引入打印模块基础组件和该打印模块的模板页面
  components: {
    vueEasyPrint,
    print,
    exportExcelCommon
  },
  data() {
    return {
      priceFileterArr:[],
      // 多个搜索输入框
      manySearchArr:[{
        selectField:'supplierName',
        searchStr:'',
      }],

      dynamicTags: [],
      inputVisible: false,
      inputValue: '',

      numSum:'',
      amountSum:'',
      tableLoad:false,
      statusArr : [{'name':'暂存','val':1},{'name':'审核中','val':2},{'name':'已审核','val':0},{'name':'重新审核','val':3}],
      checkedBox:[1,2,3,0],
      // vue 前端的 导出table 数据功能
      //导出表格字段及formatter信息
      exportExcelArry: [{
        prop: 'id',
        label: '单据编号',
        formatterFlag: false
      },
      {
        prop: 'buyInDate',
        label: '入库日期',
        formatterFlag: false
      },
        {
          prop: 'supplierName',
          label: '供应商',
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
          prop: 'unit',
          label: '基本单位',
          formatterFlag: false
        },{
          prop: 'num',
          label: '数量',
          formatterFlag: false
        }
        ,{
          prop: 'priceDate',
          label: '价目日期',
          formatterFlag: false
        }
        ,{
          prop: 'price',
          label: '单价',
          formatterFlag: false
        }
         ,{
        prop: 'amount',
        label: '金额',
        formatterFlag: false
      }
        ,{
          prop: 'orderId',
          label: '订单编号',
          formatterFlag: false
        }
        ,{
          prop: 'orderSeq',
          label: '单号',
          formatterFlag: false
        }
      ],
      //导出excel表格id及excel名称
      exportExcelInfo: {
        excelId: 'record-table',
        excelName: '采购入库列表.xlsx'
      },
      //需要导出的table数据
      tableAllData: [],


      //选中的从表数据
      checkedDetail: [],

      // 搜索字段
      selectedName: 'supplierName',// 搜索默认值
      options: [
        {value: 'supplierName', label: '供应商名称'},
        {value: 'materialName', label: '物料名称'},
        {value: 'id', label: '单据编号'}
      ],
      select: 'supplierName', // 搜索默认值
      searchStr: '',
      searchStartDate: '',
      searchEndDate: '',
      searchStrList: [],
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
        supplierId: '',
        supplierName: '',
        materialName: '',
        materialId: '',
        buyInDate: new Date().format("yyyy-MM-dd") ,
        endDate: '',
        price: '',
        sourceType: 0,
        totalAmount:'',
        rowList: [{
          obj:'',
          materialName:'',
          unit:'',
          materialId:'',
          price:'',
          num:'',
          specs:'',
          comment:'',
          orderSeq:'',
          amount:''

        }]
      },
      rules: {
        supplierName: [
          {required: true, message: '请输入供应商', change: 'blur'}
        ],
        supplierDocumentNum: [
          {required: true, message: '请输入供应商单据编号', trigger: 'blur'}
        ],
        buyInDate: [
          {required: true, message: '请输入入库日期', trigger: 'blur'}
        ]
      }
      ,
      dialogVisible: false,
      dialogVisiblePrint: false,
      tableData: [],
      spanArr: [],
      pos: '',
      multipleSelection: [] // 多选框数组

    }
  },
  watch :{
    'editForm.status':{
      handler(newVal,oldVal){
        console.log("监听editForm.status.  old: , new :",oldVal,newVal)
      },
      deep:true
    }
  },
  methods: {
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    filterPrice(value, row) {
      return row.price === value;
    },
    rowClass({ row, rowIndex }) {
      if (this.multipleSelection.includes(row.id)) {
        return { "background-color": "rgba(255,235,205, 0.75)" };
      }
    },

    delSearch(index){
      this.manySearchArr.splice(index,1)
    },
    addSearchItem(){
      let obj = {
        selectField:'supplierName',
        searchStr:'',
      }
      this.manySearchArr.push(obj)
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

      //
      var obj = JSON.parse(tag.searchOther);
      console.log("解析json:",obj)
      if(obj === null){
        this.manySearchArr = [];
      }else{
        this.manySearchArr = obj;
      }
      this.getBuyInDocumentList();
    },
    async loadTags(){
      await request.get('/tag/list?type='+1).then(res => {
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
      await request.post('/tag/save?tagName='+inputValue+'&&type='+1+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr+
          '&&searchStr='+this.searchStr,
          this.manySearchArr,null).then(res => {
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
      await request.get('/tag/del?tagName='+tag.tagName+'&&type='+1).then(res => {
        this.$message({
          message: res.data.data,
          type: 'success'
        });
      })
      await this.loadTags()
    },
    addNext(seq){
      if(this.editForm.rowList.length === seq){
        this.handleAddDetails();
      }
    },
    changeNum(seq,supplierId,materialId,buyIndate){
      console.log("supplierId materialid:,buyIndate",supplierId,materialId,buyIndate)
      // 获取该物料，该日期的单价信息
      if(this.editForm.rowList[seq-1].price === ''){
        request.get('/baseData/supplierMaterial/queryByValidPrice?supplierId='+supplierId+'&&materialId='+materialId
            +'&&date='+buyIndate).then(res => {
          if(res.data.data != null){
            this.editForm.rowList[seq-1].price = res.data.data
            this.editForm.rowList[seq-1].amount = (this.editForm.rowList[seq-1].price * this.editForm.rowList[seq-1].num).toFixed(2)
          }
        })
      }else{
        this.editForm.rowList[seq-1].amount = (this.editForm.rowList[seq-1].price *  this.editForm.rowList[seq-1].num).toFixed(2)
      }

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
    // 导出按钮
    exportExcel () {
      this.$refs.myChild.exportExcel();
    },

    // 打印按钮事件
    printDemo() {
      this.$refs.easyPrint.print()
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
    // 采购入库详细信息-添加
    handleAddDetails() {
      if (this.editForm.rowList == undefined) {
        console.log("editForm 初始化")
        this.editForm.rowList = [];
      }
      let obj = {};
      obj.materialName = "";
      obj.unit = "";
      obj.materialId = '';
      obj.price = '';
      obj.num = ''
      obj.specs = ''
      obj.comment = ''
      obj.orderSeq=''
      obj.amount = ''

      this.editForm.rowList.push(obj);
      // 光标

    },

    // 采购入库详细信息-删除
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
    // 多选删除
    handleDeleteAllDetails() {
      this.editForm.rowList = [];
    },
    // arr: 原数组，delIndexArr：删除下标数组（下标要从1开始）
    getNewArr(arr,delIndexArr){
      let test = []
      test = arr.filter((item, index) =>{
        return !delIndexArr.includes(index+1)}
      )
      return test
    },

    loadSupplierAll() {
      request.post('/baseData/supplier/getSearchAllData').then(res => {
        this.restaurants = res.data.data
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
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    createFilter2(queryString) {
      return (restaurant) => {
        return (restaurant.obj.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      this.editForm.supplierId = item.id
      this.editForm.supplierName = item.name
      this.editForm.rowList.forEach(rows=>{
        rows.price = ''
        rows.amount = ''
      })
    },
    handleSelect2(item) {
      this.editForm.materialId = item.id
      this.editForm.materialName = item.name
      console.log("选中：", item);
    },
    searchManySelect(item,index) {
      let theObj = this.manySearchArr[index];
      theObj.searchStr = item.name;
      console.log("manySearchArr:",this.manySearchArr)
    },
    searchSelect(item) {
      this.searchStr = item.name

    },
    moveMouse(text) {
      try {
        // foreach 只能抛出异常结束
        this.restaurants.forEach(item => {
          if (text === item.name) {
            this.editForm.supplierId = item.id
            this.editForm.supplierName = item.name
            throw new Error();
          } else {
            this.editForm.supplierId = ''
            this.editForm.supplierName = ''
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

            rowObj.price = '';
            rowObj.num = ''
            rowObj.comment = ''
            rowObj.amount=''
          }

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
    exportCurrentList() {

      let checkStr = this.checkedBox.join(",");
      request2.post('/repository/buyIn/export?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr

          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr}
          ,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'采购入库当前页.xlsx')
      }).catch()
    },
    // 导出列表数据- 服务端写出字节流到浏览器，进行保存
    exportAll() {

      let checkStr = this.checkedBox.join(",");
      request2.post('/repository/buyIn/export?'+
          "searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr

          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr}
          ,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'采购入库全部列表.xlsx')
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


    // 入库列表 点击添加按钮
    addSupplierMaterial() {
      this.addOrUpdate = 'save'
      this.editForm = {
        status: 1, // 编辑表单初始默认值
        id: '',
        supplierId: '',
        supplierName: '',
        materialName: '',
        materialId: '',
        buyInDate: new Date().format("yyyy-MM-dd") ,
        endDate: '',
        price: '',
        sourceType: 0,
        totalAmount: 0,
        rowList: [{
          obj:'',
          materialName:'',
          unit:'',
          materialId:'',
          price:'',
          num:'',
          specs:'',
          comment:'',
          orderSeq:'',
          amount:''

        }]
      }
      this.dialogVisible = true
    },

    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getBuyInDocumentList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getBuyInDocumentList()

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

        console.log("当前供应商id:", this.editForm.supplierId)
        if (valid) {
          if (this.editForm.rowList === undefined || this.editForm.rowList.length === 0) {
            this.$message({
              message: '请录入至少一个采购物料信息',
              type: 'error'
            });
            return
          }

          let validateFlag = true;
          let validateMaterial = true;
          console.log(this.editForm.rowList)
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
              message: '入库数量不能为空!',
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

           request.post('/repository/buyIn/' + methodName, this.editForm).then(res => {
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });
            console.log("!this.editForm.id",this.editForm.id)
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
      this.getBuyInDocumentList();
    },

    // 查询价目表单列表数据
    async getBuyInDocumentList() {
      this.tableLoad = true;
      let checkStr = this.checkedBox.join(",");
      console.log("多选框：",checkStr )
      console.log("搜索字段:", this.select)
      await request.post('/repository/buyIn/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr,
          {'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},
          null).then(res => {
        this.tableData = res.data.data.records
        console.time("str")  //开始

        let set = new Set();
        res.data.data.records.forEach(row => {
          set.add(row.price);
        });
        console.log("price set集合:",set)
        let tmpSortArr = Array.from(set).sort(this.$globalFun.numSeq);
        this.priceFileterArr = [];
        tmpSortArr.forEach(row =>{
          this.priceFileterArr.push({'text':row,'value':row})
        })
        console.timeEnd("str") //结束

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
      request.get('/repository/buyIn/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.dialogVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
          this.editForm.rowList.forEach(obj => {
            obj.amount = (obj.price * obj.num).toFixed(2)
          })
        })

      })
    },
    statusPassBatch(){
      let ids = this.multipleSelection;
      request.post('/repository/buyIn/statusPassBatch',ids).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getBuyInDocumentList()
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
      request.post('/repository/buyIn/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getBuyInDocumentList()
        console.log("删除后重新加载页面")

      })
    },
    // 撤销
    statusSubReturn(id) {
      request.get('/repository/buyIn/statusSubReturn?id=' + id).then(res => {
        this.$message({
          message: '已撤销!',
          type: 'success'
        });
        this.editForm.status = 1;
        this.getBuyInDocumentList()
      })
    },
    // 状态提交
    statusSubmit(id) {
      request.get('/repository/buyIn/statusSubmit?id=' + id).then(res => {
        this.$message({
          message: '已提交!',
          type: 'success'
        });
        this.getBuyInDocumentList()
      })
    },
    // 状态待审核
    statusPass(id) {
      request.get('/repository/buyIn/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getBuyInDocumentList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/repository/buyIn/statusReturn?id=' + id).then(res => {
        this.$message({
          message: '反审核完成!',
          type: 'success'
        });
        this.getBuyInDocumentList()
      })
    },
    // 关闭弹窗处理动作
    handleClose(done) {
      console.log("dialogVisiable:",this.dialogVisible)
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
        console.log("dialogVisiable:",this.dialogVisible)

      }
    },
    closeMethod(){
      if(this.editForm.id != '' && this.editForm.id != undefined){
        console.log("关闭编辑页面.打开锁...",this.editForm.id);
        request.get('/repository/buyIn/lockOpenById?id=' + this.editForm.id)
      }
      this.$refs['editForm'].resetFields();
      this.handleDeleteAllDetails()
      this.getBuyInDocumentList()

      console.log("buyIn关闭窗口")
    },
    // 关闭打印弹窗弹窗处理动作
    printClose(done) {
      console.log("打印弹窗关闭...")

      this.$refs.easyPrint.tableShow = false;
      done();
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    searchFieldChange(item) {
      console.log("搜索字段改变:", item)
      if (item === 'supplierName') {
        this.selectedName = item
      } else {
        this.selectedName = item

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
        }
        else{
          this.$message.error("id 为空")
        }
      }
      else if(item === 'addNew'){
        console.log("详情页新增")
        this.closeBrowser();
        this.addSupplierMaterial();
      }
      else if(item === 'copy'){
        this.closeBrowser();

        this.editForm.id = '';
        this.editForm.status = 1;
        this.addOrUpdate = 'save';
      }
    },
    expChange(item) {
      console.log("导出:",item)
      if (item === 'currentList') {
        this.exportCurrentList()
      } else if(item === 'all'){
        this.exportAll()
      }
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
      else if (columnIndex === 14) {
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
        if (index === 8 || index === 9) {
          const values = data.map(item => Number(item[column.property]));
          console.log("index:values:",index,values)
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
          if(index === 8){
            this.editForm.totalNum = sums[index];
            console.log("this.editForm.totalNum:",this.editForm.totalNum)
          }else if(index === 9){
            this.editForm.totalAmount = sums[index];
            console.log("this.editForm.totalAmount:",this.editForm.totalAmount)
          }
        }

      });

      return sums;
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 ) {
          sums[index] = '求和';
          return;
        }
        if (index === 9 || index === 11) {
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
      if (this.editForm) {
        if (this.$refs.easyPrint) {
          console.log("totalAmount",this.editForm.totalAmount)

          this.$refs.easyPrint.tableData = this.editForm
        }
        this.dialogVisiblePrint = true

      } else {
        this.$message({
          message: '没有内容!',
          type: 'error'
        });
      }
    },
    dialogOpend(){
      if(this.editForm.id != '' && this.editForm.id != undefined){
        console.log("打开编辑页面.锁住...",this.editForm.id);
        request.get('/repository/buyIn/lockById?id=' + this.editForm.id)
      }
    },
    pickMaterial(){
      if(this.editForm.id != ''){
        let pickId = this.editForm.id;
        this.closeMethod()
        this.dialogVisible = false;
        this.$router.push({name:'repository:pickMaterial:list',params:{id:pickId}});
      }else {
        this.$message.error("无单据编号的不能领料")
      }
    },

    // el-table 单元格样式修改
    cellStyle() {
      return 'padding:0 0'
    },

    async closeBrowser(){
      if(this.editForm.id != '' && this.editForm.id != undefined){
        console.log("关闭编辑页面.打开锁...",this.editForm.id);
        await request.get('/repository/buyIn/lockOpenById?id=' + this.editForm.id)
      }
    },
    searchMmaterialFocus(){
      console.log("物料搜索框聚焦")
      this.loadMaterialAll()
    },
    searchSupplierFocus(){
      console.log("供应商搜索框聚焦")
      this.loadSupplierAll()
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
    },
    enterSearch(){
      console.log("回车搜索")
    }

  },
  created() {
    let a = "宏叶280g黑色水晶超柔复0.2海绵+里"
    console.log(a.length)
    console.log("1激活created钩子函数");
    this.getBuyInDocumentList()
    this.loadSupplierAll()
    this.loadMaterialAll()
    this.loadTableSearchMaterialDetailAll()
    this.loadTags();
  },
  mounted() {
    window.addEventListener( 'beforeunload', e => this.closeBrowser() );

  },

  // 每次页面切换进入则激活
  activated() {
    console.log("buyIn activated")
    document.addEventListener('keydown',this.handleEvent)

    let refreshStr = this.$route.params.refresh
    console.log("1激活activated钩子函数refreshStr:",refreshStr);
    // document.addEventListener('keydown',this.handleEvent)

    if(refreshStr==='true'){
      this.getBuyInDocumentList();
    }
  }
  ,
  deactivated() {
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

<style scoped>
.el-table{
  border: 1px solid black;
}

::v-deep .el-table tbody tr:hover > td {
  background-color: transparent;
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

.el-pagination {
  float: right;

}

.el-table--mini td {
  padding: 0 0;
}

</style>