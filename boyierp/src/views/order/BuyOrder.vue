<template>

  <el-container>
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
          <el-select size="mini" v-model="select" style="width: 120px" filterable @change="searchFieldChange" placeholder="请选择搜索字段">
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
                           placeholder="请输入搜索内容"
                           :trigger-on-focus="false"
                           @focus="searchSupplierFocus()"
                           @select="searchSelect"
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

          <div v-if="selectedName === 'id'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
            <input  @keyup.enter="search()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                    v-model.lazy="searchStr">
            </input>
          </div>

          <div v-if="selectedName === 'price'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
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

              <div :class=" 'el-input el-input--mini'" v-if="item.selectField === 'id'" style="width: 200px">
                <input  class="el-input__inner"   placeholder="请输入搜索内容"
                        v-model.lazy="item.searchStr">
                </input>
              </div>

              <div :class=" 'el-input el-input--mini'" v-if="item.selectField === 'price'" style="width: 200px">
                <input  class="el-input__inner"   placeholder="请输入搜索内容"
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

        <el-form-item>



          <div :class="'el-input el-input--mini'">
            <input  class="el-input__inner" style="width: 200px"  @keyup.enter.native="search()" placeholder="请输入搜索单号(,分割)"
                    v-model.lazy="searchDocNum">
            </input>
          </div>
        </el-form-item>

        <el-form-item>

          <!-- 列表界面-日期搜索 -->
          <el-date-picker style="width: 130px"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchStartDate"
                          type="date"
                          clearable
                          placeholder="开始日期">
          </el-date-picker>

        </el-form-item>

        <el-form-item>
          <el-date-picker style="width: 130px"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchEndDate"
                          type="date"
                          clearable
                          placeholder="结束日期">
          </el-date-picker>

        </el-form-item>


        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="search()" type="success">搜索</el-button>
        </el-form-item>


        <el-form-item v-if="hasAuth('order:buyOrder:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('order:buyOrder:save')"
                     @click="addSupplierMaterial()"

          >新增
          </el-button>
        </el-form-item>



        <el-form-item v-if="hasAuth('order:buyOrder:push')">
          <el-button size="mini" icon="el-icon-plus" type="primary"
                     @click="pushPage(-1)"
                     >下推入库
          </el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('order:buyOrder:export')" style="margin-left: 0">
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

      </el-form>

      <el-table
          @filter-change="filterChange"
          :row-style="rowClass"
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
          @selection-change="handleSelectionChange"
          @row-click="rowClick"
          @select="pinSelect"

      >
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
                       @click="hasAuth('order:buyOrder:update') && edit(scope.row.id)"
            >{{ scope.row.id }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            prop="orderDate"
            label="采购日期"
            width="90px"
        >
        </el-table-column>


        <el-table-column
            label="供应商"
            prop="supplierName"
            width="110px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="status"
            label="单据状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已完成</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="danger">未完成</el-tag>
          </template>
        </el-table-column>

        <el-table-column
            prop="detaiStatus"
            label="详情状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.detailStatus === 0" type="success">已下推</el-tag>
            <el-tag size="small" v-else-if="scope.row.detailStatus===1" type="danger">未下推</el-tag>
          </template>
        </el-table-column>


        <el-table-column
            prop="orderSeq"
            label="单号"
            width="90px"
        >
        </el-table-column>

        <el-table-column
            prop="num"
            label="数量"
            width="80px"

        >
        </el-table-column>
        <el-table-column
            label="物料编码"
            prop="materialId"
            width="90px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="materialName"
            label="物料名称"
            width="120px"
            column-key="materialNameKey"

            :filters=materialNameFileterArr
            :filter-method="filterHandler"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="unit"
            label="库存单位"
            width="80px"
        >
        </el-table-column>
        <el-table-column
            prop="bigUnit"
            label="入库单位"
            width="80px"
        >
        </el-table-column>

        <!--        <el-table-column
                    prop="specs"
                    label="规格型号">
                </el-table-column>-->


        <el-table-column
            prop="price"
            label="单价"
            width="60px"
            column-key="priceKey"
            :filters=priceFileterArr
            :filter-method="filterHandler"
        >
        </el-table-column>

        <el-table-column
            prop="amount"
            label="金额"
            width="100px"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
            >{{ scope.row.amount ==null? null :scope.row.amount.toFixed(2) }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            prop="doneDate"
            label="交货日期"
            width="90px"
        >
        </el-table-column>




        <el-table-column
            prop="action"
            label="操作"
            width="170px"
            fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.stop="edit(scope.row.id)"
                       v-if="hasAuth('order:buyOrder:update')   ">{{ scope.row.status === 0 ? '查看' : '编辑' }}
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('order:buyOrder:del')  && scope.row.status ===1  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('order:buyOrder:del') && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="del(scope.row.id)"
                               title="确定删除吗？"
                >
                  <el-button type="text" size="small" slot="reference" @click.stop="">删除</el-button>
                </el-popconfirm>
              </template>
            </el-button>


            <el-button style="padding: 0" type="text"  size="mini"
                       v-if="hasAuth('order:buyOrder:push') " @click.stop="pushPage(scope.row.id)"> 单据下推
            </el-button>

          </template>
        </el-table-column>

      </el-table>

      <el-dialog
          title="物料"
          :visible.sync="materialVisible"
          :before-close="materialClose"
          width="80%"
      >
        <material></material>

      </el-dialog>

      <el-dialog
          title="供应商"
          :visible.sync="supplierVisible"
          :before-close="supplierClose"
          width="80%"
      >
        <supplier></supplier>

      </el-dialog>

      <el-dialog
          title="下推入库补充信息"
          :visible.sync="pushDialogVisible"
          :before-close="pushClose"
      >
        <el-form style="width: 100%;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"
                 :model="pushForm" :rules="pushRules" ref="pushForm"
                 class="demo-editForm">

          <el-form-item v-show="false" prop="id" >
            <el-input v-model="pushForm.id"></el-input>
          </el-form-item>

          <el-form-item v-if="false" prop="orderDetailIds" >
            <el-input v-model="pushForm.orderDetailIds"></el-input>
          </el-form-item>

          <el-form-item label="供应商单号" prop="supplierDocumentNum" style="margin-bottom: 0">

            <div :class=" 'el-input el-input--mini'">
              <input  class="el-input__inner"
                      v-model.lazy="pushForm.supplierDocumentNum">
              </input>
            </div>
          </el-form-item>



          <el-form-item label="入库日期" prop="buyInDate">
            <el-date-picker style="width: 150px"
                            value-format="yyyy-MM-dd"
                            v-model="pushForm.buyInDate"
                            type="date"
                            clearable
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item style="margin-left: 100px">
            <el-button type="primary" @click="submitPushForm('pushForm')">
              保存单据
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>


      <!-- 打印弹窗 -->
<!--      <el-dialog
          title=""
          :visible.sync="dialogVisiblePrint"
          width="55%"
          style="padding-top: 0"
          :before-close="printClose"
      >
        <el-button v-if="dialogVisiblePrint"
                   @click="printDemo"
                   v-focus ref="printBtn"
                   size="mini" icon="el-icon-printer" type="primary">打印
        </el-button>
&lt;!&ndash;        <vue-easy-print tableShow ref="easyPrint">
          <template slot-scope="func">
            <print :tableData="editForm" :getChineseNumber="func.getChineseNumber"></print>
          </template>
        </vue-easy-print>&ndash;&gt;

      </el-dialog>-->

      <!-- 采购订单弹窗 -->

      <el-dialog
          title="采购订单信息"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          :append-to-body="true"
          fullscreen
          @opened="dialogOpend()"

      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"
                 :model="editForm" :rules="rules" ref="editForm"
                 class="demo-editForm">

          <el-form-item label="单据编号" prop="id" style="margin-bottom: 0">
            <el-input style="width: 150px" :disabled=true placeholder="保存自动生成" v-model="editForm.id">

            </el-input>
          </el-form-item>
          <!--
                    <el-form-item label="状态" prop="status" style="margin-bottom: 0">
                      <el-input style="width: 220px" :disabled=true v-model="editForm.status" >
                      </el-input>
                    </el-form-item>-->

          <el-form-item v-if="false" prop="supplierId" style="margin-bottom: 0">
            <el-input v-model="editForm.supplierId"></el-input>
          </el-form-item>

          <el-form-item label="供应商" prop="supplierName" style="margin-bottom: 10px">
            <!-- 搜索框 -->
            <el-autocomplete
                style="width: 250px"
                popper-class="my-autocomplete"

                :disabled="this.hasPushed"
                class="inline-input"
                v-model="editForm.supplierName"
                :fetch-suggestions="querySearch"
                placeholder="请输入供应商"
                :trigger-on-focus="false"
                @select="handleSelect"
                @change="moveMouse"

                @focus="searchSupplierFocus()"
                clearable
            >
            </el-autocomplete>
          </el-form-item>


          <el-form-item label="采购日期" prop="orderDate">
            <el-date-picker style="width: 150px"
                            :disabled="this.hasPushed"
                            value-format="yyyy-MM-dd"
                            v-model="editForm.orderDate"
                            type="date"
                            clearable
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>


          <el-form-item v-show="this.editForm.status===0"  label="供应商单号" prop="supplierDocumentNum" style="padding: -20px 0 ;margin-bottom: -20px">
            <el-input  :disabled="true" size="mini" clearable style="width: 150px" v-model="editForm.supplierDocumentNum">
            </el-input>
          </el-form-item>

          <el-form-item v-show="this.editForm.status===0" label="入库日期" prop="buyInDate">
            <el-date-picker
                             style="width: 150px"
                            value-format="yyyy-MM-dd"
                            v-model="editForm.buyInDate"
                             :disabled="true"
                            type="date"
                            clearable
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

<!--          <el-form-item style="margin-left: 100px">
            <el-button type="primary" v-show="this.editForm.status===1" @click="submitForm('editForm',addOrUpdate)">
              保存单据
            </el-button>

          </el-form-item>-->
          <el-form-item v-if="hasAuth('order:buyOrder:save')">
            <el-dropdown   @command="action">
              <el-button  icon="el-icon-edit-outline" size="mini" type="success">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="save" v-show="hasAuth('order:buyOrder:save') && this.editForm.status===1" >
                  保存单据</el-dropdown-item>
                <el-dropdown-item command="addNew" v-show="hasAuth('order:buyOrder:save') ">
                  新增</el-dropdown-item>
                <el-dropdown-item command="copy" v-show="hasAuth('order:buyOrder:save') ">
                  复制</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>

          <el-form-item v-if="hasAuth('baseData:material:save')">
            <el-button size="mini" icon="el-icon-plus" type="primary"
                       @click="addMeterial"
            >新建物料
            </el-button>
          </el-form-item>

          <el-form-item v-if="hasAuth('baseData:supplier:save')">
            <el-button size="mini" icon="el-icon-plus" type="primary"
                       @click="addSupplier"
            >新建供应商
            </el-button>
          </el-form-item>

        </el-form>
        <el-divider content-position="left">明细信息</el-divider>

        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddDetails"
                   v-show="this.editForm.status===1">添加
        </el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddDetailsAutoOrderSeq"
                   v-show="this.editForm.status===1">单号自增长添加
        </el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="insertOne"
                   v-show="this.editForm.status===1">插入一条
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

          <el-table-column label="单号" align="center" width="120" prop="orderSeq">
            <template slot-scope="scope">
              <el-input
                  :ref='"input_orderSeq_"+scope.row.seqNum'
                  @keyup.up.native="orderSeqUp(scope.row.seqNum)"
                  @keyup.down.native="orderSeqEnter(scope.row.seqNum)"
                  :disabled="editForm.rowList[scope.row.seqNum-1].status === 0"
                        size="mini" v-model="editForm.rowList[scope.row.seqNum-1].orderSeq"/>
            </template>
          </el-table-column>

          <el-table-column style="padding: 0 0;" label="物料编码" align="center" width="260" prop="materialId">
            <template slot-scope="scope">
              <el-autocomplete size="mini" clearable style="width: 250px"
                               popper-class="my-autocomplete"
                               class="inline-input"
                               :disabled="editForm.rowList[scope.row.seqNum-1].status === 0"
                               v-model="editForm.rowList[scope.row.seqNum - 1].materialId"
                               :fetch-suggestions="tableSearch"
                               placeholder="请输入内容"
                               :trigger-on-focus="false"
                               @focus="searchMaterialAllFocus();addNext(scope.row.seqNum)"

                               @select="tableSelectSearch($event,editForm.rowList[scope.row.seqNum - 1])"
                               @change="tableMoveMouse($event,editForm.rowList[scope.row.seqNum - 1])"

              >
              </el-autocomplete>
            </template>

          </el-table-column>

          <el-table-column label="物料名称" align="center" prop="materialName" width="210">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true"
                        v-model="editForm.rowList[scope.row.seqNum-1].materialName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" align="center" prop="specs" width="100">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].specs"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="库存单位" align="center" prop="unit" width="100">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].unit"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="入库单位" align="center" prop="bigUnit" width="100">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].bigUnit"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="入库单价" align="center" width="90" prop="price">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].price"/>
            </template>
          </el-table-column>

          <el-table-column label="采购数量"  align="center" width="85" prop="num">
            <template slot-scope="scope">
              <el-input
                        :ref='"input_num_"+scope.row.seqNum'
                        @input="changeNum(scope.row.seqNum,editForm.supplierId,scope.row.materialId,editForm.orderDate)"
                        @keyup.enter.native="numEnter(scope.row.seqNum)"
                        @keyup.up.native="numUp(scope.row.seqNum)"
                        @keyup.down.native="numEnter(scope.row.seqNum)"
                        :disabled="editForm.rowList[scope.row.seqNum-1].status === 0" size="mini" v-model="editForm.rowList[scope.row.seqNum-1].num"/>
            </template>
          </el-table-column>

          <el-table-column label="金额" align="center" width="115" prop="amount">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].amount === '' ? null :editForm.rowList[scope.row.seqNum-1].amount"/>
            </template>
          </el-table-column>


          <el-table-column label="交货日期" align="center" width="150" prop="doneDate">
            <template slot-scope="scope">
              <!-- 列表界面-日期搜索 -->
              <el-date-picker style="width: 130px"
                              size="mini"
                              value-format="yyyy-MM-dd"
                              :disabled="editForm.rowList[scope.row.seqNum-1].status === 0"
                              v-model="editForm.rowList[scope.row.seqNum-1].doneDate"
                              type="date"
                              clearable
                              placeholder="开始日期">
              </el-date-picker>
            </template>
          </el-table-column>

          <el-table-column label="备注" align="center" width="150" prop="comment">
            <template slot-scope="scope">
              <el-input :disabled="editForm.rowList[scope.row.seqNum-1].status === 0" size="mini" v-model="editForm.rowList[scope.row.seqNum-1].comment"/>
            </template>
          </el-table-column>


        </el-table>

      </el-dialog>

      <!--价目列表 分页组件 -->
      <el-pagination

          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[50,100, 200, 700, 1000]"
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


// 引入打印基础组件，和打印模块print页面
import vueEasyPrint from "vue-easy-print";
import print from "@/views/printModule/printOrder";
import exportExcelCommon from"../common/ExportExcelCommon"
import {request2} from "@/axios";
import material from "@/views/baseData/Material"
import supplier from "@/views/baseData/Supplier"


export default {
  name: 'BuyOrder',
  // 引入打印模块基础组件和该打印模块的模板页面
  components: {
    vueEasyPrint,
    print,
    exportExcelCommon,
    material,
    supplier
  },
  data() {
    return {
      materialNameFilterSet:new Set(),
      materialNameFileterArr:[],
      materialNameFileterArrReset:[],

      priceFilterSet:new Set(),
      priceFileterArrReset:[],

      priceFileterArr:[],
      // 多个搜索输入框
      manySearchArr:[{
        selectField:'supplierName',
        searchStr:'',
      }],

      dynamicTags: [],
      inputVisible: false,
      inputValue: '',

      tableLoad:false,

      // shift 多选
      origin:-1,  // 变量起点
      pin:false, // 默认不按住

      //选中的从表数据
      checkedDetail: [],

      // 搜索字段
      selectedName: 'supplierName',// 搜索默认值
      options: [
        {value: 'supplierName', label: '供应商名称'},
        {value: 'materialName', label: '物料名称'},
        {value: 'id', label: '单据编号'},
        {value: 'price', label: '单价'}
      ],
      select: 'supplierName', // 搜索默认值
      searchDocNum:'',
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
      , pageSize: 50 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      // 表单字段
      hasPushed:false,
      addOrUpdate: 'save',
      pushForm: {
        orderDetailIds:[],
        supplierDocumentNum: '',
        buyInDate: new Date().format("yyyy-MM-dd"),
        id:''
      },
      editForm: {
        status: 1, // 编辑表单初始默认值
        id: '',
        supplierId: '',
        supplierName: '',
        materialName: '',
        materialId: '',
        orderDate: new Date().format("yyyy-MM-dd"),
        endDate: '',
        price: '',
        rowList: [{
          materialName:'',
          unit:'',
          bigUnit:'',
          unitRadio:'',
          materialId:'',
          price:'',
          num:'',
          specs:'',
          comment:'',
          orderSeq:'',
          status:1,
          amount:''
        }]
      },
      rules: {
        supplierName: [
          {required: true, message: '请输入供应商', change: 'blur'}
        ],
        orderDate: [
          {required: true, message: '请输入采购日期', trigger: 'blur'}
        ]
      },
      pushRules: {
        buyInDate: [
          {required: true, message: '请输入入库日期', trigger: 'blur'}
        ],
        supplierDocumentNum: [
          {required: true, message: '请输入供应商单据号', trigger: 'blur'}
        ]
      },
      dialogVisible: false,
      dialogVisiblePrint: false,
      pushDialogVisible: false,
      materialVisible: false,
      supplierVisible: false,
      tableData: [],
      spanArr: [],
      pos: '',
      multipleSelection: [] // 多选框数组

    }
  },
  methods: {
    filterChange(filters){
      console.log("搜索条件变动",filters.priceKey)
      if(filters.priceKey != undefined){
        this.materialNameFileterArr =[]
        this.materialNameFilterSet.forEach(obj=>{
          console.log("变动后 的，物料名称set内容",obj)
          this.materialNameFileterArr.push({'text':obj,'value':obj})
        })
        if(filters.priceKey.length === 0){
          this.materialNameFileterArr = this.materialNameFileterArrReset
        }
      }

      if(filters.materialNameKey != undefined){
        this.priceFileterArr =[]
        this.priceFilterSet.forEach(obj=>{
          this.priceFileterArr.push({'text':obj,'value':obj})
        })
        if(filters.materialNameKey.length === 0){
          this.priceFileterArr = this.priceFileterArrReset
        }
      }

      console.log(filters)
      this.materialNameFilterSet.clear()
      this.priceFilterSet.clear()

    },
    filterHandler(value, row, column) {
      const property = column['property'];
      console.log("filter过滤",property)
      if(property==='price' && row[property] === value){
        this.materialNameFilterSet.add(row['materialName']);
      }
      if(property==='materialName' && row[property] === value){
        this.priceFilterSet.add(row['price']);
      }
      return row[property] === value;
    },
    rowClass({ row, rowIndex }) {
      if (this.multipleSelection.includes(row.detailId)) {
        return { "background-color": "rgba(255,235,205, 0.75)" };
      }
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

      //
      var obj = JSON.parse(tag.searchOther);
      console.log("解析json:",obj)
      if(obj === null){
        this.manySearchArr = [];
      }else{
        this.manySearchArr = obj;
      }
      this.getBuyOrderDocumentList();
    },
    async loadTags(){
      await request.get('/tag/list?type='+5).then(res => {
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
      await request.post('/tag/save?tagName='+inputValue+'&&type='+5+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select+
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
      await request.get('/tag/del?tagName='+tag.tagName+'&&type='+5).then(res => {
        this.$message({
          message: res.data.data,
          type: 'success'
        });
      })
      await this.loadTags()
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
    expChange(item) {
      if (item === 'currentList') {
        this.exportCurrent()
      } else if(item === 'all'){
        this.exportAll()
      }
    },
    exportAll() {

      request2.post('/order/buyOrder/export?'+
          "&&searchDocNum="+this.searchDocNum+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select

          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'采购订单全部列表.xlsx')
      }).catch()
    },
    exportCurrent() {

      request2.post('/order/buyOrder/export?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select

          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'采购订单当前页.xlsx')
      }).catch()
    },
    action(item) {
      if(this.editForm.id === null || this.editForm.id === ''){
        this.addOrUpdate = 'save';
      }else{
        this.addOrUpdate = 'update';
      }
      if (item === 'save') {
        this.submitForm('editForm',this.addOrUpdate)
      }
      else if(item === 'addNew'){
        if(this.editForm.id===''){
          this.$confirm('确认关闭？')
              .then(_ => {
                this.closeBrowser();
                this.addSupplierMaterial();
                console.log("关闭窗口")
                done();
              })
              .catch(_ => {});
        }else{
          this.closeBrowser();
          this.addSupplierMaterial();
          console.log("关闭窗口")
        }

      }
      else if(item === 'copy'){
        this.closeBrowser();

        this.editForm.id = '';
        this.editForm.status = 1;
        this.addOrUpdate = 'save';
      }
    },



    addNext(seq){
      if(this.editForm.rowList.length === seq){
        this.handleAddDetails();
      }
    },
    dialogOpend(){
      if(this.editForm.id != '' && this.editForm.id != undefined){
        console.log("打开编辑页面.锁住...",this.editForm.id);
        request.get('/order/buyOrder/lockById?id=' + this.editForm.id)
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
            console.log("amount",(this.editForm.rowList[seq-1].price * this.editForm.rowList[seq-1].num))
            this.editForm.rowList[seq-1].amount = (this.editForm.rowList[seq-1].price * this.editForm.rowList[seq-1].num).toFixed(2)
          }
        })
      }else{
        this.editForm.rowList[seq-1].amount = (this.editForm.rowList[seq-1].price *  this.editForm.rowList[seq-1].num).toFixed(2)
      }

    },
    pinSelect(item, index){
      console.log("pinselect")
      const data = this.$refs.multipleTable.tableData; // 获取所以数据
      console.log("data:",data)
      const origin = this.origin; // 起点数 从-1开始
      const endIdx = index.index; // 终点数
      if (this.pin && item.includes(data[origin])) { // 判断按住
        const sum = Math.abs(origin - endIdx) + 1;// 这里记录终点
        const min = Math.min(origin, endIdx);// 这里记录起点
        let i = 0;
        while (i < sum) {
          const index = min + i;
          this.$refs.multipleTable.toggleRowSelection(data[index], true); // 通过ref打点调用toggleRowSelection方法，第二个必须为true
          i++;
        }
      } else {
        this.origin = index.index; // 没按住记录起点
      }
    },

    // 数量的上下光标事件
    orderSeqEnter(seqNum){
      if(this.$refs['input_orderSeq_'+(seqNum + 1)] != undefined){
        this.$refs['input_orderSeq_'+(seqNum + 1)].focus()

      }
    },
    orderSeqUp(seqNum){
      if(this.$refs['input_orderSeq_'+(seqNum - 1)] != undefined){
        this.$refs['input_orderSeq_'+(seqNum - 1)].focus()
      }
    },

    // 数量的上下光标事件
    numEnter(seqNum){
      if(this.$refs['input_num_'+(seqNum + 1)] != undefined){
        this.$refs['input_num_'+(seqNum + 1)].focus()
        this.editForm.rowList[seqNum].num=''

      }
    },
    numUp(seqNum){
      if(this.$refs['input_num_'+(seqNum - 1)] != undefined){
        this.$refs['input_num_'+(seqNum - 1)].focus()
        this.editForm.rowList[seqNum-1-1].num=''
      }
    },
    // 行点击事件
    rowClick(row,column,event){
      console.log("某行单击,",row,column,event)
      this.$refs.multipleTable.toggleRowSelection(row);
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
    // 采购订单详细信息-添加
    handleAddDetails() {
      if (this.editForm.rowList == undefined) {
        console.log("editForm 初始化")
        this.editForm.rowList = [];
      }
      let obj = {};
      obj.materialName = "";
      obj.unit = "";
      obj.bigUnit = "";
      obj.unitRadio = "";
      obj.materialId = '';
      obj.price = '';
      obj.num = ''
      obj.specs = ''
      obj.comment = ''
      obj.orderSeq = ''
      obj.status = 1;

      this.editForm.rowList.push(obj);
      console.log("现有的数据:", this.editForm.rowList)
    },
    insertOne(){
      if (this.checkedDetail.length == 0) {
            this.$message({
              message: '请选择往下插入的位置',
              type: 'error'
            });
            return
      }
      else if(this.checkedDetail.length > 1){
        this.$message({
          message: '请选择一条！',
          type: 'error'
        });
        return
      }
      else{
        let obj = {};
        obj.materialName = "";
        obj.unit = "";
        obj.materialId = '';
        obj.price = '';
        obj.num = ''
        obj.specs = ''
        obj.comment = ''
        obj.orderSeq = ''
        obj.status = 1;
        this.editForm.rowList.splice(this.checkedDetail[0],0,obj)

      }
    },
    // 采购订单详细信息-添加自增长订单号
    handleAddDetailsAutoOrderSeq() {
      let emptyArr = []; // 存放空内容 的 下标。
      for (let i = 0; i < this.editForm.rowList.length; i++) {
        let obj = this.editForm.rowList[i];

        if((obj.orderSeq === undefined || obj.orderSeq === '')){
          emptyArr.push(i+1);
          continue;
        }
      }
      // 移除空的数组内容
      console.log("移除前的内容:",this.editForm.rowList)
      let newArr = this.getNewArr(this.editForm.rowList,emptyArr);
      this.editForm.rowList = newArr

      if (this.editForm.rowList === undefined || this.editForm.rowList.length === 0) {
        this.$message({
          message: '请录入至少一个单号信息!',
          type: 'error'
        });
      }else{

        let last = this.editForm.rowList[this.editForm.rowList.length - 1]
        console.log("自增之前的 orderSeq:",last.orderSeq)

        let obj = {};
        obj.materialName = last.materialName;
        obj.unit = last.unit;
        obj.bigUnit = last.bigUnit
        obj.materialId = last.materialId;
        obj.price = last.price;
        obj.num = last.num
        obj.specs = last.specs
        obj.comment = last.comment
        obj.doneDate = last.doneDate
        obj.amount = last.amount
        obj.unitRadio = last.unitRadio
        obj.status = 1;
        let nextStr = dealfun(last.orderSeq)
        console.log("自增:",obj)
        console.log("自增:",obj.amount == null)
        obj.orderSeq = nextStr

        this.editForm.rowList.push(obj);
        console.log("现有的数据:", this.editForm.rowList)
      }

    },
    // 采购订单详细信息-删除
    handleDeleteDetails() {
      if (this.checkedDetail.length == 0) {
        if(this.editForm.rowList.length === 0){
          this.$message({
            message: '没有记录可删除!',
            type: 'error'
          });
        }else{
          let theRow = this.editForm.rowList[this.editForm.rowList.length-1];
          if(theRow.status === 0){
            this.$message({
              message: '不可删除已下推的记录！',
              type: 'error'
            });
            throw new Error();
          }
          this.editForm.rowList.splice(this.editForm.rowList.length-1,1)
        }
      } else {

        try{
          this.checkedDetail.forEach(theSeq => {
            let theRow = this.editForm.rowList[theSeq-1];
            if(theRow.status === 0){
              this.$message({
                message: '不可删除已下推的记录！',
                type: 'error'
              });
              throw new Error();
            }
          })

          let newArr = this.getNewArr(this.editForm.rowList,this.checkedDetail);
          this.editForm.rowList = newArr
          this.checkedDetail=[]

        }catch (err) {
        }
      }
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
            console.log("匹配到:", text, item.name, this.editForm.supplierId, item.id)
            this.editForm.supplierId = item.id
            this.editForm.supplierName = item.name
            throw new Error();
          } else {
            this.editForm.supplierId = ''
            console.log("没有匹配到", text, item.name)
            this.editForm.supplierName = ''
          }
        })
      } catch (err) {
      }
    },
    tableMoveMouse(selectItem, rowObj) {
      console.log("tableMoveMouse", selectItem, rowObj)
      try {

        // foreach 只能抛出异常结束
        this.restaurants3.forEach(item => {
          if (selectItem === item.id) {
            console.log("匹配到:", selectItem, item.id)
            rowObj.materialId = item.id;
            rowObj.materialName = item.obj.name
            rowObj.unit = item.obj.unit
            rowObj.bigUnit =  item.obj.bigUnit
            rowObj.unitRadio =  item.obj.unitRadio
            rowObj.specs = item.obj.specs
            throw new Error();
          } else {
            console.log("没有匹配到", selectItem, item.id)
            rowObj.materialName = "";
            rowObj.unit = "";
            rowObj.unitRadio =  "";
            rowObj.bigUnit ="";
            rowObj.materialId = '';
            rowObj.specs = ''

            rowObj.price = '';
            rowObj.num = ''
            rowObj.comment = ''
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
      param.bigUnit =  selectItem.obj.bigUnit
      param.unitRadio =  selectItem.obj.unitRadio
      param.specs = selectItem.obj.specs
      console.log("rowList：", this.editForm.rowList);

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
        orderDate: new Date().format("yyyy-MM-dd"),
        endDate: '',
        price: '',
        rowList: [{
          materialName:'',
          unit:'',
          bigUnit:'',
          unitRadio:'',
          materialId:'',
          price:'',
          num:'',
          specs:'',
          comment:'',
          orderSeq:'',
          status:1,
          amount:''
        }]
      }
      this.dialogVisible = true
    },

    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getBuyOrderDocumentList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getBuyOrderDocumentList()

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
        this.multipleSelection.push(theId.detailId)
      })
      console.log("多选框 选中的 ", this.multipleSelection)
    },
    // 下推入库提交
    submitPushForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          request.post('/order/buyOrder/push?orderDetailIds='+this.pushForm.orderDetailIds
              +"&&id="+this.pushForm.id, this.pushForm).then(res => {
            this.$message({
              message: '下推成功!',
              type: 'success'
            });

            // 关闭弹窗并且重置内容
            this.pushDialogVisible = false;
            this.resetForm("pushForm")
            // this.multipleSelection = []
            // this.$refs.multipleTable.clearSelection();
            this.getBuyOrderDocumentList();

            this.$router.push({name:'repository:buyIn:list',params:{refresh:'true'}});
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 表单提交
    submitForm(formName, methodName) {
      this.$refs[formName].validate((valid) => {

        console.log("当前供应商id:", this.editForm.supplierId)
        if (valid) {

          let validateFlag = true;
          let validateMaterial = true;
          let validateOrderSeq = true;

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
            if (obj.orderSeq === '') {
              validateOrderSeq= false;
            }
          }

          // 移除空的数组内容
          console.log("移除前的内容:",this.editForm.rowList)
          let newArr = this.getNewArr(this.editForm.rowList,emptyArr);
          this.editForm.rowList = newArr
          console.log("移除后的内容:",this.editForm.rowList)
          if (this.editForm.rowList === undefined || this.editForm.rowList.length === 0) {
            this.$message({
              message: '请录入至少一个采购物料信息',
              type: 'error'
            });
            return
          }

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
          if (validateOrderSeq === false) {
            this.$message({
              message: '单号不能为空!',
              type: 'error'
            });
            return
          }
          request.post('/order/buyOrder/' + methodName, this.editForm).then(res => {
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

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    search(){
      this.currentPage = 1
      this.getBuyOrderDocumentList()
    },
    // 查询价目表单列表数据
    getBuyOrderDocumentList() {
      this.tableLoad = true;

      console.log("搜索字段:", this.select)
       request.post('/order/buyOrder/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
           "&&searchDocNum="+this.searchDocNum+
           "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select,
           {'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},
          null).then(res => {

         this.tableData = res.data.data.records
         console.time("str")  //开始

         let set = new Set();
         let materialSet = new Set();

         this.tableData.forEach((item, index) => {// 遍历索引,赋值给data数据
          item.index = index;
          set.add(item.price);
           materialSet.add(item.materialName);
         })
         console.log("price set集合:",set)
         let tmpSortArr = Array.from(set).sort(this.$globalFun.numSeq);
         this.priceFileterArr = [];
         tmpSortArr.forEach(row =>{
           this.priceFileterArr.push({'text':row,'value':row})
           this.priceFileterArrReset.push({'text':row,'value':row})

         })
         this.materialNameFileterArr = [];
         materialSet.forEach(row =>{
           this.materialNameFileterArr.push({'text':row,'value':row})
           this.materialNameFileterArrReset.push({'text':row,'value':row})
         })


         console.timeEnd("str") //结束

        this.total = res.data.data.total
        this.getSpanArr(this.tableData)
        this.tableLoad = false;

        console.log("获取用户表单数据", res.data.data.records)
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
      request.get('/order/buyOrder/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.dialogVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
          this.editForm.rowList.forEach(obj=>{
            if(obj.status == 0){
              this.hasPushed = true
            }
          })
        })

      })
    },

    /*pushPage(id){
      this.pushDialogVisible = true
      this.pushForm.orderId = id
    },*/
    pushPage(id){
      console.log(id)
      if((this.multipleSelection===[] || this.multipleSelection.length ===0)  && (id ===-1) ){
        this.$message({
          message: '请选择下推的选项!',
          type: 'error'
        });
        return
      }


      this.pushDialogVisible = true
      this.pushForm.orderDetailIds = this.multipleSelection // 部分下推有值
      this.pushForm.id = id // 单据下推有值
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
      request.post('/order/buyOrder/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getBuyOrderDocumentList()
        console.log("删除后重新加载页面")

      })
    },
    /*// 状态待审核
    statusPass(id) {
      request.get('/order/buyOrder/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getBuyOrderDocumentList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/order/buyOrder/statusReturn?id=' + id).then(res => {
        this.$message({
          message: '反审核完成!',
          type: 'success'
        });
        this.getBuyOrderDocumentList()
      })
    },*/
    supplierClose(done) {
      this.supplierVisible = false
      this.loadSupplierAll()
      done()
    },
    materialClose(done) {
      this.materialVisible = false
      this.loadMaterialAll()
      this.loadTableSearchMaterialDetailAll()
      done()

    },
    // 关闭下推弹窗处理动作
    pushClose(done) {
      this.$refs['pushForm'].resetFields();
      done();
    },
    // 关闭弹窗处理动作
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            if(this.editForm.id != '' && this.editForm.id != undefined){
              console.log("关闭编辑页面.打开锁...",this.editForm.id);
              request.get('/order/buyOrder/lockOpenById?id=' + this.editForm.id)
            }
            this.$refs['editForm'].resetFields();
            this.handleDeleteAllDetails()
            this.getBuyOrderDocumentList()
            this.hasPushed = false
            console.log("关闭窗口")
            done();
          })
          .catch(_ => {});
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
      if (columnIndex === 1) {
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
      } else if (columnIndex === 15) {
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
        if (index === 10 || index === 9) {
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
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '求和';
          return;
        }
        if (index === 7  || index === 13) {
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
    // el-table 单元格样式修改
    cellStyle() {
      return 'padding:0 0'
    },

    addMeterial(){
      this.materialVisible = true;
    },
    addSupplier(){
      this.supplierVisible = true;
    },
    async closeBrowser(){
      if(this.editForm.id != '' && this.editForm.id != undefined){
        console.log("关闭编辑页面.打开锁...",this.editForm.id);
        await request.get('/order/buyOrder/lockOpenById?id=' + this.editForm.id)
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
    }



  },
  created() {
    this.getBuyOrderDocumentList()
    this.loadSupplierAll()
    this.loadMaterialAll()
    this.loadTableSearchMaterialDetailAll()
    this.loadTags()
  },
  mounted() {
    window.addEventListener( 'beforeunload', e => this.closeBrowser() );
  // shift 按住
    window.addEventListener('keydown',code=>{
      if(code.keyCode === 16 && code.shiftKey){
        this.pin = true
      }
    })
    // shift 松开
    window.addEventListener('keyup',code=>{
      if(code.keyCode === 16 ){
        this.pin = false
      }
    })

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
// 字符串自增长 方法
function dealfun(str) {
  return str.replace(/\d+$/, function (a) {
    let l
    var o = "", i = l = a.length;
    while (i) {
      o += "0";
      i--;
    }
    return (o + (parseInt(a) + 1)).slice(l * -1);
  })
}

</script>
<!--
<style >
.my-autocomplete{
  width: auto !important;
}
.my-autocomplete li{
  line-height: normal;
  padding: 7px;
}
.my-autocomplete .name{
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete .unit{
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete .highlighted .unit {
  color: #ddd;
}
</style>-->


<style scoped>
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

</style>