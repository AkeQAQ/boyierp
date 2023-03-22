<template>

  <el-container>
    <el-main class="elMain_my" style="padding-top: 0;padding-right: 0px">
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


          <!-- id -->
          <div v-if="selectedName === 'id'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
            <input  @keyup.enter="search()" class="el-input__inner" style="width: 150px"  placeholder="请输入搜索内容"
                    v-model.lazy="searchStr">
            </input>
          </div>

          <!-- 列表界面-供应商搜索 -->
          <el-autocomplete size="mini" v-if="selectedName==='supplierName'"
                           style="width: 150px"
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

        </el-form-item>

        <el-popover
            placement="left"
            width="410"
            trigger="click">
          <ul v-for="(item,index) in manySearchArr">
            <li>
              <el-select style="width: 100px" size="mini" v-model="item.selectField" filterable  placeholder="请选择搜索字段">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
              </el-select>

              <!-- id -->
              <div v-if="item.selectField === 'id'" :class=" 'el-input el-input--mini'" style="width: 150px">
                <input   class="el-input__inner"   placeholder="请输入搜索内容"
                         v-model.lazy="item.searchStr">
                </input>
              </div>

              <el-autocomplete size="mini" v-if="item.selectField==='supplierName'"
                               style="width: 150px"
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
                          value-format="yyyy-MM"
                          v-model="searchStartDate"
                          type="month"
                          clearable
                          placeholder="开始日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker style="width: 125px;"
                          size="mini"
                          value-format="yyyy-MM"
                          v-model="searchEndDate"
                          type="month"
                          clearable
                          placeholder="结束日期">
          </el-date-picker>

        </el-form-item>


        <el-form-item>

          <!-- 列表界面-日期搜索 -->
          <el-date-picker style="width: 135px;"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchStartSettleDate"
                          type="date"
                          clearable
                          placeholder="结账开始日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker style="width: 135px;"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchEndSettleDate"
                          type="date"
                          clearable
                          placeholder="结账结束日期">
          </el-date-picker>

        </el-form-item>

        <el-form-item >
          <el-select
              size ="mini"
              v-model="status"
              multiple
              collapse-tags
              style="margin-left: 0;width: 150px"
              placeholder="请选择结账状态">
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
              v-model="payStatus"
              multiple
              collapse-tags
              style="margin-left: 0;width: 150px"
              placeholder="请选择付款状态">
            <el-option
                v-for="item in payStatusArr"
                :key="item.val"
                :label="item.name"
                :value="item.val">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="search()" type="success">搜索</el-button>
        </el-form-item>



        <el-form-item v-if="hasAuth('finance:summary:list')" style="margin-left: 0">
          <el-dropdown   @command="expChange">
            <el-button  icon="el-icon-more" size="mini" >
              其他操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="hasAuth('finance:summary:update')" command="save">生成月份对账单</el-dropdown-item>
              <el-dropdown-item v-if="hasAuth('finance:summaryFilter:list')" command="addFilters">添加过滤名单</el-dropdown-item>
              <el-dropdown-item v-if="hasAuth('finance:summary:update')" command="refresh">月份刷新</el-dropdown-item>

              <el-dropdown-item command="all">导出当前条件全部</el-dropdown-item>
              <el-dropdown-item command="currentList">导出当前页</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
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

          show-summary
          :summary-method="getSummaries"
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :cell-style="{padding:'0',borderColor:'black'}"
          :header-cell-style="{borderColor:'black'}"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="50">
        </el-table-column>

        <el-table-column
            label="对账单号"
            prop="id"
            width="85px"
            show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click=" edit(scope.row.id)"
            >{{ scope.row.summaryDate + "-" +scope.row.id }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            label="对账日期"
            prop="summaryDate"
            width="70px"
            show-overflow-tooltip
        >
        </el-table-column>


        <el-table-column
            prop="supplierId"
            label="供应商编码"
            width="85px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="supplierName"
            label="供应商名称"
            width="110px"
            show-overflow-tooltip>
        </el-table-column>


        <el-table-column
            prop="buyInAmount"
            label="采购入库金额"
            width="95px"
            show-overflow-tooltip>
        </el-table-column>


        <el-table-column
            prop="buyOutAmount"
            label="采购退料金额"
            width="95px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="buyNetInAmount"
            label="本期净入库金额"
            width="110px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="payShoesAmount"
            label="赔鞋"
            width="70px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="fineAmount"
            label="罚款金额"
            width="90px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="testAmount"
            label="检测费"
            width="75px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="taxSupplement"
            label="补税点"
            width="78px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="taxDeduction"
            label="扣税点"
            width="75px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="changeAmount"
            label="调整"
            width="65px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="roundDown"
            label="抹零"
            width="80px">
          <template slot-scope="scope">
            <div  style="height: 40px;line-height: 40px;" @dblclick=" hasAuth('finance:summary:update') && dbClickMethod(scope.row)">
              <span  v-show="!scope.row.isOpenEdit">{{scope.row.roundDown}}</span>
              <el-input v-show="scope.row.isOpenEdit" size="mini" style="width: 65px"
                        :ref='"el_rd_"+scope.row.id'
                        onkeyup="value=value.replace(/[^0-9.-]/g,'')"
                        @keyup.native.enter="enterEdit(scope.row)"
                        @keyup.native.esc="escEdit(scope.row)"
                        v-model="scope.row.roundDown">
              </el-input>
            </div>
          </template>
        </el-table-column>

        <el-table-column
            prop="needPayAmount"
            label="应付本期货款"
            width="100px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="payedAmount"
            label="已付款金额"
            width="90px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="remainingAmount"
            label="剩余未付金额"
            width="100px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="status"
            width="70px"
            label="结账状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已结账</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="warning">未结账</el-tag>
          </template>
        </el-table-column>

        <el-table-column
            prop="settleDate"
            label="结账日期"
            width="90px"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            width="80px"
            label="有无照片">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.picUrl !=null && scope.row.picUrl !='' && scope.row.picUrl !=undefined" type="success">有照片</el-tag>
            <el-tag size="small" v-else type="danger">无照片</el-tag>

          </template>
        </el-table-column>

        <el-table-column
            prop="action"
            label="操作"
            fixed="right"
            width="120px"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('finance:summary:update') || (hasAuth('finance:summary:list') && scope.row.status != 1 )   ">{{ '编辑' }}
            </el-button>

            <el-button type="text" size="small" @click="preViewPrint(scope.row)"
                        >{{ '打印预览' }}
            </el-button>

          </template>
        </el-table-column>

      </el-table>

      <!-- 过滤名单 -->
      <el-dialog
          title="过滤名单列表"
          :visible.sync="dialogFilterVisible"
          width="50%"

      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"

                 class="demo-editForm">

          <el-form-item>
            <el-button size="medium"  plain v-show="hasAuth('finance:summaryFilter:list') "
                        type="primary"   @click="submitFilterForm"
            >保存
            </el-button>
          </el-form-item>


        </el-form>
        <el-divider content-position="left">过滤列表</el-divider>

        <el-button  type="primary" icon="el-icon-plus" size="mini" @click="handleAddFilter"
        >添加
        </el-button>
        <el-button   type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteFilter"
        >删除
        </el-button>

        <el-table
            :data="editFilterForm"
            :row-class-name="rowClassName"
            ref="tbFilter"
            height="300"
            size="mini"
            :cell-style="cellStyle"
            fit
            @selection-change="handleFilterSelectionChange"

        >
          <el-table-column type="selection" width="80" align="center"   >
          </el-table-column>
          <el-table-column label="序号" align="center" prop="seqNum" width="50"></el-table-column>

          <el-table-column label="供应商编码" align="center" prop="supplierId" width="210" >
            <template slot-scope="scope">
              <el-autocomplete
                  style="width: 180px"
                  class="inline-input elAutocomplete_my"
                  popper-class="my-autocomplete"

                  v-model="editFilterForm[scope.row.seqNum-1].supplierId"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  placeholder="请输入供应商"
                  @select="tableSupplierSelectSearch($event,editFilterForm[scope.row.seqNum - 1])"
                  @change="tableSupplierMoveMouse($event,editFilterForm[scope.row.seqNum - 1],scope.row.seqNum - 1)"
                  @focus="searchSupplierFocus()"
                  clearable
              >
              </el-autocomplete>
            </template>

          </el-table-column>

          <el-table-column label="供应商名称" align="center" prop="supplierName " width="200">
            <template slot-scope="scope">
              <el-input :disabled=true v-model="editFilterForm[scope.row.seqNum-1].supplierName"></el-input>
            </template>

          </el-table-column>

        </el-table>

      </el-dialog>

      <!-- 对账刷新 -->
      <el-dialog
          title="对账月份刷新"
          :visible.sync="dialogRefreshVisible"
          :before-close="handleRefreshClose"
          width="30%"
      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"
                 :model="editRefreshForm"  ref="editRefreshForm"
                 class="demo-editForm">

          <el-form-item label="对账月份" prop="addDate" label-width="70px">
            <el-date-picker  style="width: 130px;"
                             value-format="yyyy-MM"
                             v-model="editRefreshForm.addDate"
                             type="month"
                             clearable
                             placeholder="选择日期">
            </el-date-picker>

          </el-form-item>

          <el-popconfirm @confirm="refreshData()" title="确定该月份刷新对账单吗？">
            <el-button size="mini" icon="el-icon-success"  type="success"
                       slot="reference">刷新对账单
            </el-button>
          </el-popconfirm>
        </el-form>

      </el-dialog>

      <!-- 对账生成 -->
      <el-dialog
          title="对账月份选择生成"
          :visible.sync="dialogAddVisible"
          :before-close="handleAddClose"
          width="30%"
      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"
                 :model="editAddForm"  ref="editAddForm"
                 class="demo-editForm">

          <el-form-item label="对账月份" prop="addDate" label-width="70px">
              <el-date-picker  style="width: 130px;"
                               value-format="yyyy-MM"
                               v-model="editAddForm.addDate"
                               type="month"
                               clearable
                               placeholder="选择日期">
              </el-date-picker>

          </el-form-item>

          <el-popconfirm @confirm="addNewData()" title="确定该月份生成对账单吗？">
            <el-button size="mini" icon="el-icon-success"  type="success"
                       slot="reference">生成对账单
            </el-button>
          </el-popconfirm>
        </el-form>

      </el-dialog>

      <!-- 对账弹窗 -->
      <el-dialog
          title="对账信息"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          fullscreen

          @opened="dialogOpend()"

      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"
                 :model="editForm"  ref="editForm"
                 class="demo-editForm">

          <el-form-item label="对账单号" prop="id" >
            <el-input style="width: 150px" :disabled=true placeholder="保存自动生成" v-model="editForm.id">
            </el-input>
          </el-form-item>

          <el-form-item label="供应商" prop="supplierName" >
            <el-input style="width: 150px" :disabled=true placeholder="保存自动生成" v-model="editForm.supplierName">
            </el-input>
          </el-form-item>

          <el-form-item label="对账日期" prop="summaryDate" >
            <el-input style="width: 150px" :disabled=true placeholder="保存自动生成" v-model="editForm.summaryDate">
            </el-input>
          </el-form-item>


          <el-form-item prop="status">
              <el-radio-group v-model="editForm.status"  @change="statusChange">
                <el-radio  :disabled="!hasAuth('finance:summary:valid')" :label="0">已结账</el-radio>
                <el-radio   :disabled="!hasAuth('finance:summary:valid') || (editForm.rowList!=null && editForm.rowList.length>0 )" :label="1">未结账</el-radio>
              </el-radio-group>
          </el-form-item>

          <el-form-item v-if="hasAuth('finance:summary:update')">
            <el-dropdown   @command="action">
              <el-button  icon="el-icon-edit-outline" size="mini" type="success">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="save" v-show="hasAuth('finance:summary:update') && this.editForm.status===0 " >
                  提交单据</el-dropdown-item>

              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>

          <el-form-item label="照片" label-width="40px">
            <!-- 新的缩略图-->
            <el-upload
                :disabled="!hasAuth('finance:summary:update') || this.fileList.length >=1 "
                :class="{disabled:uploadDisabled}"
                action="#"
                ref="upload"
                :http-request="uploadRequest"
                :file-list="fileList"
                list-type="picture-card"
                :auto-upload="true">
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}">
                <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url" alt=""
                >
                <span class="el-upload-list__item-actions">
                  <span
                      class="el-upload-list__item-preview"
                      @click="showPic(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                      v-if="hasAuth('finance:summary:update')  "
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file,editForm.id)"
                  >
                      <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>

            <el-dialog :visible.sync="dialogOnePicVisible" :append-to-body=true top="0vh">
              <img width="100%" :src="dialogOneImageUrl" alt="">
            </el-dialog>
          </el-form-item>

        </el-form>
        <el-divider content-position="left">明细信息</el-divider>

        <el-button v-if="this.editForm.status===0" type="primary" icon="el-icon-plus" size="mini" @click="handleAddDetails"
                   >添加
        </el-button>
        <el-button  v-if="this.editForm.status===0" type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteDetails"
                   >删除
        </el-button>

        <el-table
            :data="editForm.rowList"
            :row-class-name="rowClassName"

            show-summary
            :summary-method="getDetailSummaries"
            ref="tb"
            height="500"
            size="mini"
            :cell-style="cellStyle"
            fit
            @selection-change="handleDetailSelectionChange"

        >
          <el-table-column type="selection" width="80" align="center"   >
          </el-table-column>
          <el-table-column label="序号" align="center" prop="seqNum" width="50"></el-table-column>

          <el-table-column label="对账单号" align="center" width="200" >
            <template slot-scope="scope">
              <el-input
                         :disabled="true "
                         size="mini" v-model="editForm.id"/>
            </template>
          </el-table-column>

          <el-table-column label="付款日期" prop="payDate"  width="200">
            <template slot-scope="scope">
              <el-date-picker  style="width: 180px;"
                               value-format="yyyy-MM-dd HH:mm:ss"
                               size="mini"
                              v-model="editForm.rowList[scope.row.seqNum-1].payDate"
                              type="datetime"
                              clearable
                              placeholder="选择日期">
              </el-date-picker>
            </template>
          </el-table-column>


          <el-table-column label="付款金额" align="center" width="120" prop="payAmount">
            <template slot-scope="scope">
              <el-input
                  size="mini" v-model="editForm.rowList[scope.row.seqNum-1].payAmount"
                  onkeyup="value=value.replace(/[^0-9.-]/g,'')"

              />
            </template>
          </el-table-column>

          <el-table-column label="类型" align="center" width="500" prop="payType">
            <template slot-scope="scope">
              <el-radio-group v-model="editForm.rowList[scope.row.seqNum-1].payType">
                <el-radio  :label="0">对公转账</el-radio>
                <el-radio :label="1">对公承兑</el-radio>
                <el-radio :disabled="editForm.rowList[scope.row.seqNum-1].documentNum!==''&& editForm.rowList[scope.row.seqNum-1].documentNum!==null" :label="2">对私转账</el-radio>
                <el-radio :disabled="editForm.rowList[scope.row.seqNum-1].documentNum!==''&&editForm.rowList[scope.row.seqNum-1].documentNum!==null" :label="3">对私承兑</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>

          <el-table-column label="发票号" align="center" prop="documentNum" width="200" >
            <template slot-scope="scope">
              <el-autocomplete size="mini" clearable style="width: 180px"
                               popper-class="my-autocomplete"
                               :disabled="editForm.rowList[scope.row.seqNum-1].payType ===2 || editForm.rowList[scope.row.seqNum-1].payType ===3"
                               class="inline-input"
                               v-model="editForm.rowList[scope.row.seqNum - 1].documentNum"
                               :fetch-suggestions="tableSearch"
                               placeholder="请输入内容"
                               :trigger-on-focus="false"
                               @select="tableSelectSearch($event,editForm.rowList[scope.row.seqNum - 1])"
                               @change="tableMoveMouse($event,editForm.rowList[scope.row.seqNum - 1],scope.row.seqNum - 1)"
                               @focus="loadDocumentAll(editForm.supplierId)"
              >
              </el-autocomplete>
            </template>

          </el-table-column>

        </el-table>

      </el-dialog>

      <el-dialog :visible.sync="dialogPicVisible" top="0vh" >
        <img width="100%" :src="dialogImageUrl" alt="">
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

      <!-- 打印弹窗 -->
      <el-dialog
          title=""
          :visible.sync="dialogVisiblePrint"
          width="50%"
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
            <print :tableData="printRow" :getChineseNumber="func.getChineseNumber"></print>
          </template>
        </vue-easy-print>

      </el-dialog>

    </el-main>

  </el-container>

</template>

<script>

// POI，因为响应输出字节流，和ajax 的请求不一样。
import {request, request2} from "@/axios";
import {sysbaseUrl} from "@/axios";
import vueEasyPrint from "vue-easy-print";
import print from "@/views/printModule/printSummary";
import printBatch from "@/views/printModule/printBatch";
import exportExcelCommon from "@/views/common/ExportExcelCommon";

export default {
  name: 'Summary',
  // 引入打印模块基础组件和该打印模块的模板页面
  components: {
    vueEasyPrint,
    print,
  },
  data() {
    return {

      printRow:{},
      fileList: [],
      dialogOnePicVisible:false,
      dialogOneImageUrl:'',

      oneMaterialPrices:[],
      specialAddOldSeq:99999,
      dialogImageUrl :'',
      dialogPicVisible:false,

      // 多个搜索输入框
      manySearchArr:[{
        selectField:'id',
        searchStr:'',
      }],

      tableLoad:false,

      statusArr : [{'name':'未结账','val':1},{'name':'已结账','val':0}],
      status:[1,0],

      payStatusArr : [{'name':'未结清','val':1},{'name':'已结清','val':0}],
      payStatus:[1,0],

      searchStartDate: '',
      searchEndDate: '',

      searchStartSettleDate: '',
      searchEndSettleDate: '',

      //选中的从表数据
      checkedDetail: [],
      checkedFilterDetail: [],

      // 搜索字段
      selectedName: 'supplierName',// 搜索默认值
      options: [
        {value: 'supplierName', label: '供应商名称'},
        {value: 'id', label: '对账单号'}

      ],
      select: 'supplierName', // 搜索默认值
      searchStr: '',
      searchStrList: [],
      searchField: '',
      restaurants: [],// 搜索框列表数据存放
      restaurants2: [], //
      restaurantsCustomer: [], //

      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 50 // 一页多少条
      , total: 0, // 总共多少数据
      // 表单字段
      editRefreshForm: {
        addDate: new Date().format("yyyy-MM") ,
      },
      // 表单字段
      editAddForm: {
        addDate: new Date().format("yyyy-MM") ,
      },
      editFilterForm :[{
        id:'',
        supplierId:'',
        supplierName:''
      }],
       editForm: {
        status: 1, // 结账状态
        id: '',
        summaryDate: new Date().format("yyyy-MM-dd") ,
        supplierId: '',
        buyNetInAmount:'',
        payShoesAmount:'',
        fineAmount:'',
        testAmount:'',
        taxSupplement:'',
        taxDeduction:'',
        roundDown:'',
        needPayAmount:'',
        picUrl:'',
        rowList: [{
          payDate:new Date().format("yyyy-MM-dd") ,
          payType:'',
          payAmount:'',

        }]
      },
      dialogVisible: false,
      dialogAddVisible: false,
      dialogFilterVisible: false,
      dialogRefreshVisible: false,

      tableData: [],
      tableRealDosageData: [],
      spanArr: [],
      pos: '',
      dialogVisiblePrint:false,
      multipleSelection: [] // 多选框数组

    }
  },
  methods: {
    addFilters(){
      request.post('/finance/summaryFilters/list').then(res => {
        this.editFilterForm = res.data.data;
        this.dialogFilterVisible=true

      })
    },
    loadDocumentAll(supplierId) {
      request.post('/finance/supplierTaxSupplement/loadDocumentAll?supplierId='+supplierId).then(res => {
        this.restaurants2 = res.data.data
        console.log("restaurants2:",this.restaurants2)
      })
    },
    tableMoveMouse(selectItem, rowObj,index) {
      console.log("tableMoveMouse", selectItem, rowObj)
      try {
        if(this.restaurants2===null || this.restaurants2.length ===0){
          rowObj.documentNum = "";
        }
        // foreach 只能抛出异常结束
        this.restaurants2.forEach(item => {
          if (selectItem === item.documentNum) {
            rowObj.documentNum = item.documentNum;
            throw new Error();
          } else {
            rowObj.documentNum = "";
          }

        })
      } catch (err) {
      }
    },
    tableSupplierMoveMouse(selectItem, rowObj,index) {
      console.log("tableMoveMouse", selectItem, rowObj)
      try {
        // foreach 只能抛出异常结束
        this.restaurants.forEach(item => {
          if (selectItem === item.id) {
            rowObj.supplierId = item.id;
            rowObj.supplierName = item.name;

            throw new Error();
          } else {
            rowObj.supplierId = "";
            rowObj.supplierName = "";
          }

        })
      } catch (err) {
      }
    },
    tableSelectSearch(selectItem, param) {
      param.documentNum = selectItem.obj.documentNum;
      console.log("selectItem:",selectItem)
      console.log("param:",param)

    },
    createFilter2(queryString) {
      return (restaurant) => {
        return (restaurant.obj.documentNum.toLowerCase().indexOf(queryString.toLowerCase()) != -1)
      };
    },
    tableSearch(queryString, cb) {
      var restaurants = this.restaurants2;
      var results = queryString ? restaurants.filter(this.createFilter2(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 查询搜索框列表数据

    statusChange(currentNum){
      console.log("radio 变化，当前值",currentNum)
      request.get('/finance/supplierSummary/updateStatus?id=' + this.editForm.id+"&&status="+currentNum).then(res => {
        this.$message.success(res.data.data)
      }).catch(error=>{
        this.$message.error("修改失败")
        console.log("error:",error)
      })
    },
    // 打印按钮事件
    printDemo() {
      this.$refs.easyPrint.print()
    },
    printClose(done) {
      this.$refs.easyPrint.tableShow = false;
      done();
    },
    preViewPrint(row) {

      this.printRow = row;
      if (this.$refs.easyPrint) {
        this.$refs.easyPrint.tableData =row
      }
      this.dialogVisiblePrint = true

    },

    reDolayout(row){
      row.isOpenEdit = false
      this.$refs.multipleTable.doLayout()
      this.$forceUpdate()

    },
    escEdit(row){
      row.roundDown = row.oldRoundDown;
      this.reDolayout(row)
    },
    enterEdit(item){
      if(item.roundDown ==='空值'){
        this.$message({
          message: '不能设置空值',
          type: 'error'
        });
        return;
      }
      request.get('/finance/supplierSummary/updateRoundDown?id='+item.id+'&&roundDown='+item.roundDown).then(res => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        });
        this.getList()
      })

    },
    dbClickMethod(row){
      console.log("dbClick:",row)
      row.oldRoundDown = row.roundDown

      console.log("双击row 之前：flag :",row.isOpenEdit)
      row.isOpenEdit=true;
      console.log("双击row 之后：flag :",row.isOpenEdit)
      this.$nextTick(() => {
        // 赋值到编辑表单
        this.$refs.multipleTable.doLayout()
        this.$forceUpdate()

      })
    },
    refreshData(){

      if(this.editRefreshForm.addDate==='' || this.editRefreshForm.addDate===undefined){
        this.$message.error("请选择一个月份");
        return;
      }
      const load = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      request.post('/finance/supplierSummary/refreshData?addDate='+this.editRefreshForm.addDate).then(res => {
        load.close()
        let d = res.data.data;
        this.$message({
          message: d,
          type: 'success'
        });
        this.getList()
        this.dialogRefreshVisible=false;
      }).catch(()=>{
        load.close()
      })
    },

    addNewData(){

      if(this.editAddForm.addDate==='' || this.editAddForm.addDate===undefined){
        this.$message.error("请选择一个月份");
        return;
      }
      const load = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });


      request.post('/finance/supplierSummary/addNewData?addDate='+this.editAddForm.addDate).then(res => {
        load.close()
        this.$message({
          message: '生成成功!',
          type: 'success'
        });
        this.getList()
        this.dialogAddVisible=false;
      }).catch(()=>{
        load.close()
      })
    },
    exportCurrentList() {
      let status = this.status.join(",");
      let payStatus = this.payStatus.join(",");

      let url = '/finance/supplierSummary/export?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&searchField="+this.select+
          "&&status="+status +
          "&&payStatus="+payStatus +
          "&&searchStartDate="+this.searchStartDate +
          "&&searchEndDate="+this.searchEndDate+
          "&&searchStartSettleDate="+this.searchStartSettleDate+
          "&&searchEndSettleDate="+this.searchEndSettleDate

      ;
      request2.post(url

          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr}
          ,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'供应商对账单当前页.xlsx')
      }).catch()
    },
    exportAll() {
      let status = this.status.join(",");
      let payStatus = this.payStatus.join(",");

      let url = '/finance/supplierSummary/export?'+
          "searchField="+this.select+
          "&&status="+status +
          "&&payStatus="+payStatus +
          "&&searchStartDate="+this.searchStartDate +
          "&&searchEndDate="+this.searchEndDate+
          "&&searchStartSettleDate="+this.searchStartSettleDate+
          "&&searchEndSettleDate="+this.searchEndSettleDate

      ;
      request2.post(url,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr}
          ,{responseType:'arraybuffer'}).then(res=>{
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'供应商对账单全部列表.xlsx')
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

    expChange(item) {
      console.log("导出:",item)
      if (item === 'currentList') {
        this.exportCurrentList()
      } else if(item === 'all'){
        this.exportAll()
      }else if(item === 'save'){
        this.dialogAddVisible=true
      }else if(item === 'addFilters'){
        this.addFilters()
      }else if(item === 'refresh'){
        this.dialogRefreshVisible=true
      }

    },

    dialogOpend(){
      if(this.editForm.id !== '' && this.editForm.id !== undefined){
        console.log("打开编辑页面.锁住...",this.editForm.id);
        request.get('/finance/supplierSummary/lockById?id=' + this.editForm.id)
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
      if (columnIndex===0|| columnIndex===1||columnIndex===2||columnIndex===3||columnIndex===4||columnIndex===5
          ||columnIndex===6||columnIndex===7||columnIndex===12) {

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
        if ( index === 4) {
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
        if (index >=5 && index <=17) {
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
    handleRemove(file, id) {
      console.log("删除图片:",file)
      const url = file.url
      const i = this.fileList.findIndex(x => x.url === url)
      this.fileList.splice(i, 1)

      request({
        method: 'get',
        url: '/finance/supplierSummary/delPic?fileName='+file.name+"&&id="+id,
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(res => {
        // 成功
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.editForm.status=1;

      })
    },

    uploadRequest(fileobj) {
      if(this.editForm.id ===null || this.editForm.id ===undefined || this.editForm.id ===''){
        this.$message.error("没有ID")
        this.fileList=[]
        return;
      }
      let param = new FormData()
      param.append('files', fileobj.file)
      console.log("上传的文件对象:",fileobj)
      request({
        method: 'post',
        url: '/finance/supplierSummary/uploadPic?id='+this.editForm.id,
        headers: {'Content-Type': 'multipart/form-data'},
        data: param
      }).then(res => {
        // 成功
        this.$message({
          message: '添加成功!',
          type: 'success'
        });
        this.editForm.status=0

        this.$nextTick(() => {
          request.get('/finance/supplierSummary/getPicturesById?id='+this.editForm.id).then(res => {
            let data = res.data.data;
            this.fileList.push({name:data[data.length-1],url: sysbaseUrl+"/"+data[data.length-1]})
          })
        })


      })
    },
    showPic(file){
      this.dialogOneImageUrl = file.url;
      this.dialogOnePicVisible=true;

    },

    searchSelect(item) {
      this.searchStr = item.name
    },

    rowClass({ row, rowIndex }) {
      if (this.multipleSelection.includes(row.id)) {
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
        selectField:'id',
        searchStr:'',
      }
      this.manySearchArr.push(obj)
    },

    addNext(seq){
      if(this.editForm.rowList.length === seq){
        this.handleAddDetails();
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
    action() {
      this.submitForm('editForm')
    },
    action2() {
      this.submitFilterForm()
    },

    // 设置每一行的seqNum = 游标+1
    rowClassName({row, rowIndex}) {
      row.seqNum = rowIndex + 1;
    },
    handleFilterSelectionChange(val) {
      console.log("多选框 val ", val)
      this.checkedFilterDetail = []

      val.forEach(theId => {
        this.checkedFilterDetail.push(theId.seqNum)
      })
      console.log("多选框 选中的 ", this.checkedFilterDetail)
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
    handleAddFilter() {
      if (this.editFilterForm == undefined) {
        console.log("editForm 初始化")
        this.editFilterForm = [];
      }
      let obj = {};
      obj.supplierId = '';
      this.editFilterForm.push(obj);
    },
    // 对账详细信息-添加
    handleAddDetails() {
      if (this.editForm.rowList == undefined) {
        console.log("editForm 初始化")
        this.editForm.rowList = [];
      }
      let obj = {};
      obj.payDate = '';
      obj.payAmount = '';
      obj.payType = 0
      obj.documentNum=''

      this.editForm.rowList.push(obj);
    },
    handleDeleteFilter() {
      if (this.checkedFilterDetail.length == 0) {
        if(this.editFilterForm.length === 0){
          this.$message({
            message: '没有记录可删除!',
            type: 'error'
          });
        }
      }else {
        this.editFilterForm = this.getNewArr(this.editFilterForm,this.checkedFilterDetail);
      }
      this.checkedFilterDetail=[]
    },
    // 对账详细信息-删除
    handleDeleteDetails() {
      if (this.checkedDetail.length == 0) {
        if(this.editForm.rowList.length === 0){
          this.$message({
            message: '没有记录可删除!',
            type: 'error'
          });
        }
      }else {
        this.editForm.rowList = this.getNewArr(this.editForm.rowList,this.checkedDetail);
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

    tableSupplierSelectSearch(selectItem, param) {
      console.log("每个表格项选中：", selectItem, param);
      param.supplierId = selectItem.id;
      param.supplierName = selectItem.name;


    },
    handleSelect(item) {
      this.editForm.supplierId = item.id
      this.editForm.supplierName = item.name
    },
    querySearch(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || ((restaurant.id).toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
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
    submitFilterForm() {
          const load = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          request.post('/finance/summaryFilters/save' , this.editFilterForm).then(res => {
            load.close()
            this.$message({
              message: '保存成功!',
              type: 'success'
            });

          }).catch(()=>{
            load.close()
          })
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {

          /*if (this.editForm.rowList === undefined || this.editForm.rowList.length === 0) {
            this.$message({
              message: '请录入至少一个付款信息',
              type: 'error'
            });
            return
          }*/

          let validateFlag = true;
          let validateMaterial = true;
          let validateDocumentNum = true;

          console.log(this.editForm.rowList)
          let emptyArr = []; // 存放空内容 的 下标。

          for (let i = 0; i < this.editForm.rowList.length; i++) {
            let obj = this.editForm.rowList[i];
            if((obj.payType===0 || obj.payType===1 ) && (obj.documentNum ==='' || obj.documentNum===null || obj.documentNum===undefined)){
              validateDocumentNum = false;
            }

            if((obj.payDate === undefined || obj.payDate === '') && (obj.payAmount === '' || obj.payAmount === undefined)){
              emptyArr.push(i+1);
              continue;
            }
            if (obj.payDate === undefined || obj.payDate === '') {
              validateFlag = false
            }
            if (obj.payAmount === '' || obj.payAmount === undefined ) {
              validateMaterial = false
            }

          }
          this.editForm.rowList = this.getNewArr(this.editForm.rowList,emptyArr);

          if (validateMaterial === false) {
            this.$message({
              message: '付款金额不能为空!',
              type: 'error'
            });
            return
          }

          if (validateFlag === false) {
            this.$message({
              message: '付款日期不能为空!',
              type: 'error'
            });
            return
          }
          if (validateDocumentNum === false) {
            this.$message({
              message: '选择了对公类型，发票号不能为空',
              type: 'error'
            });
            return
          }


         /* if(this.editForm.rowList.length === 0){
            this.$message({
              message: '请录入至少一个付款信息!',
              type: 'error'
            });
            return
          }*/

          // 假如有记录选择了对公，但是内容是空值，则提醒

          const load = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          request.post('/finance/supplierSummary/update' , this.editForm).then(res => {
            load.close()
            this.$message({
              message: '编辑成功!',
              type: 'success'
            });

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
      let status = this.status.join(",");
      let payStatus = this.payStatus.join(",");

      let url = '/finance/supplierSummary/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&searchField="+this.select+
          "&&status="+status +
          "&&payStatus="+payStatus +
          "&&searchStartDate="+this.searchStartDate +
          "&&searchEndDate="+this.searchEndDate+
          "&&searchStartSettleDate="+this.searchStartSettleDate+
          "&&searchEndSettleDate="+this.searchEndSettleDate

      ;
      request.post(url,
          {'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},
          null).then(res => {
        this.tableData = res.data.data.records
        this.tableData.forEach((item, index) => {// 遍历索引,赋值给data数据
          item.index = index;
          item.isOpenEdit = false
          console.log("row:",item)

        })

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
      request.get('/finance/supplierSummary/queryById?id=' + id).then(res => {
        let result = res.data.data
        // 查看图片
        request.get('/finance/supplierSummary/getPicturesById?id='+id).then(res => {
          let data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            let oneFileName = data[i];
            this.fileList.push({name:oneFileName,url: sysbaseUrl+"/"+oneFileName})
          }
        })
        this.dialogVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
        })

      })
    },
    handleRefreshClose(done) {
      this.dialogRefreshVisible=false;
      this.$refs['editRefreshForm'].resetFields();
      this.getList()
    },
    handleAddClose(done) {
      this.dialogAddVisible=false;
      this.$refs['editAddForm'].resetFields();
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
    closeMethod(){

      if(this.editForm.id !== '' && this.editForm.id !== undefined){
        console.log("关闭编辑页面.打开锁...",this.editForm.id);
        request.get('/finance/supplierSummary/lockOpenById?id=' + this.editForm.id)
      }
      this.$refs['editForm'].resetFields();
      this.fileList=[]
      this.handleDeleteAllDetails()
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

    searchSupplierFocus(){
      console.log("供应商搜索框聚焦")
      this.loadSupplierAll()
    },
    loadSupplierAll() {
      request.post('/baseData/supplier/getSearchAllData').then(res => {
        this.restaurants = res.data.data
      })
    },
    async closeBrowser(){
      if(this.editForm.id !== '' && this.editForm.id !== undefined){
        console.log("关闭编辑页面.打开锁...",this.editForm.id);
        await request.get('/finance/supplierSummary/lockOpenById?id=' + this.editForm.id)
      }
    },

  },
  computed:{
    uploadDisabled:function() {
      return this.fileList.length >0
    },
  },
  created() {
    this.getList()
    this.loadSupplierAll()
    this.loadDocumentAll();
  },mounted() {
    window.addEventListener( 'beforeunload', e => this.closeBrowser() );

  },

}

</script>

<style>
.el-form-item__label{
  text-align: left;
}
.disabled .el-upload--picture-card {
  display: none;
}
</style>

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