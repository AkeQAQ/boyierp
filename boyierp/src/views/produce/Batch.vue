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
          <div v-if="selectedName === 'batchId'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
            <input  @keyup.enter="search()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                    v-model.lazy="searchStr">
            </input>
          </div>

          <div v-if="selectedName === 'productNum'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
            <input  @keyup.enter="search()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                    v-model.lazy="searchStr">
            </input>
          </div>

          <div v-if="selectedName === 'productBrand'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
            <input  @keyup.enter="search()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                    v-model.lazy="searchStr">
            </input>
          </div>

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

              <div :class=" 'el-input el-input--mini'" v-if="item.selectField === 'batchId'" style="width: 200px">
                <input  class="el-input__inner"   placeholder="请输入搜索内容"
                        v-model.lazy="item.searchStr">
                </input>
              </div>

              <div :class=" 'el-input el-input--mini'" v-if="item.selectField === 'productNum'" style="width: 200px">
                <input  class="el-input__inner"   placeholder="请输入搜索内容"
                        v-model.lazy="item.searchStr">
                </input>
              </div>

              <div :class=" 'el-input el-input--mini'" v-if="item.selectField === 'productBrand'" style="width: 200px">
                <input  class="el-input__inner"   placeholder="请输入搜索内容"
                        v-model.lazy="item.searchStr">
                </input>
              </div>


              <div :class=" 'el-input el-input--mini'" v-if="item.selectField === 'orderNum'" style="width: 200px">
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
          <el-button size="mini" icon="el-icon-search" @click="search()" type="success">搜索</el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('produce:batch:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('produce:batch:save')"
                     @click="saveNew()"

          >新增
          </el-button>
        </el-form-item>

        <el-form-item  v-if="hasAuth('produce:batch:import')">
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

        <el-form-item >
          <el-dropdown   @command="otherBtn">
            <el-button  icon="el-icon-more" size="mini" >
              其他操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="this.multipleSelection.length === 0 " v-if="hasAuth('produce:batch:valid')" command="batchValid">批量审核</el-dropdown-item>
              <el-dropdown-item :disabled="this.multipleSelection.length === 0 " v-if="hasAuth('produce:batch:valid')" command="batchRevalid">批量反审核</el-dropdown-item>
              <el-dropdown-item :disabled="this.multipleSelection.length === 0 " v-if="hasAuth('produce:batch:del')" command="batchDel">批量删除</el-dropdown-item>
              <el-dropdown-item :disabled="this.multipleSelection.length === 0 " v-if="hasAuth('produce:batch:push')" command="pushOrder">下推采购订单</el-dropdown-item>
              <el-dropdown-item :disabled="this.multipleSelection.length === 0 " v-if="hasAuth('repository:pickMaterial:save')" command="batchZCPick">针车领料</el-dropdown-item>
              <el-dropdown-item :disabled="this.multipleSelection.length === 0 " v-if="hasAuth('produce:batch:list')" command="batchPrintCaiDuan">裁断批量打印</el-dropdown-item>
              <el-dropdown-item :disabled="this.multipleSelection.length === 0 " v-if="hasAuth('produce:batch:list')" command="batchPrintZhenChe">针车批量打印</el-dropdown-item>
              <el-dropdown-item v-if="hasAuth('produce:zcGroup:list')" command="addZcGroup">添加针车组别</el-dropdown-item>
              <el-dropdown-item  v-if="hasAuth('produce:batch:list')" command="queryProgress">裁断进度表</el-dropdown-item>
              <el-dropdown-item  v-if="hasAuth('produce:batch:list')" command="queryZCProgress">针车进度表</el-dropdown-item>


            </el-dropdown-menu>

          </el-dropdown>
        </el-form-item>

        <el-form-item>
          <el-switch
              style="display: block"
              v-model="showDetailNum"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="码数"
              inactive-text="">
          </el-switch>
        </el-form-item>

        <el-form-item>
          <el-switch
              style="display: block"
              v-model="showProgress"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="裁断进度表"
              inactive-text="">
          </el-switch>
        </el-form-item>

        <el-form-item>
          <el-switch
              style="display: block"
              v-model="zcShowProgress"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="针车进度表"
              inactive-text="">
          </el-switch>
        </el-form-item>

        <el-form-item>
          <el-switch
              style="display: block"
              v-model="showDelay"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="物料延期"
              inactive-text="">
          </el-switch>
        </el-form-item>

      </el-form>

      <el-table
          :row-style="rowClass"
          :cell-style="cellClass"
          ref="multipleTable"
          :data="tableData"
          v-loading = "tableLoad"
          element-loading-background = "rgba(255, 255, 255, .5)"
          element-loading-text = "加载中，请稍后..."
          border
          fit
          height="700px"
          :span-method="objectSpanMethod"
          :summary-method="getSummariesMain"
          show-summary
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :header-cell-style="{borderColor:'black'}"
          @selection-change="handleSelectionChange"
          @select="pinSelect"

      >

        <el-table-column
            type="selection"
            width="50">
        </el-table-column>

        <el-table-column
            v-if="false"
            prop="id"
            label="唯一编码"
            width="70px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="orderNum"
            label="订单号"
            width="80px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="productNum"
            label="公司货号"
            width="90px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="productBrand"
            label="品牌"
            width="90px"
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
            prop="mergeBatchNumber"
            label="数量"
            width="80px"
            show-overflow-tooltip>
        </el-table-column>


        <el-table-column
            prop="endDate"
            label="货期"
            width="100px"
            show-overflow-tooltip>
        </el-table-column>


        <el-table-column
            prop="push"
            label="是否下推"
            width="80px"
            show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.push === 0" type="success">已下推</el-tag>
            <el-tag size="small" v-else-if="scope.row.push===1" type="warning">未下推</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="核算信息" align="center" width="120" >
          <template slot-scope="scope">
            <el-popover
                placement="bottom"
                width="900"
                trigger="click">
              <el-table :data="oneMaterialPrices">
                <el-table-column width="80" property="companyNum" label="公司货号"></el-table-column>
                <el-table-column width="100" property="customer" label="品牌"></el-table-column>
                <el-table-column width="400" property="foreignMsg" label="核算外加工信息"></el-table-column>
              </el-table>
              <el-button slot="reference" @click="queryPrices(scope.row.productNum)">查询核算</el-button>
            </el-popover>
          </template>

        </el-table-column>


        <el-table-column
            prop="batchId"
            label="生产序号"
            width="90px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="zcPickId"
            label="针车领料编号"
            width="100px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column

            v-if="showDetailNum"
            prop="size34"
            label="34"
            width="37px"
            >
          <template slot-scope="scope">
            {{scope.row.size34==="0"? "":scope.row.size34}}
          </template>
        </el-table-column>
        <el-table-column
            v-if="showDetailNum"

            prop="size35"
            label="35"
            width="37px"
        >
          <template slot-scope="scope">
            {{scope.row.size35==="0"? "":scope.row.size35}}
          </template>
        </el-table-column>
        <el-table-column
            v-if="showDetailNum"

            prop="size36"
            label="36"
            width="37px"
        >
          <template slot-scope="scope">
            {{scope.row.size36==="0"? "":scope.row.size36}}
          </template>
        </el-table-column>
        <el-table-column
            v-if="showDetailNum"

            prop="size37"
            label="37码"
            width="50px"
        >
          <template slot-scope="scope">
            {{scope.row.size37==="0"? "":scope.row.size37}}
          </template>
        </el-table-column>
        <el-table-column
            v-if="showDetailNum"

            prop="size38"
            label="38码"
            width="50px"
        >
          <template slot-scope="scope">
            {{scope.row.size38==="0"? "":scope.row.size38}}
          </template>
        </el-table-column>
        <el-table-column
            v-if="showDetailNum"

            prop="size39"
            label="39码"
            width="50px"
        >
          <template slot-scope="scope">
            {{scope.row.size39==="0"? "":scope.row.size39}}
          </template>
        </el-table-column>
        <el-table-column
            v-if="showDetailNum"

            prop="size40"
            label="40码"
            width="50px"
        >
          <template slot-scope="scope">
            {{scope.row.size40==="0"? "":scope.row.size40}}
          </template>
        </el-table-column>
        <el-table-column
            v-if="showDetailNum"

            prop="size41"
            label="41码"
            width="50px"
        >
          <template slot-scope="scope">
            {{scope.row.size41==="0"? "":scope.row.size41}}
          </template>
        </el-table-column>
        <el-table-column
            v-if="showDetailNum"

            prop="size42"
            label="42码"
            width="50px"
        >
          <template slot-scope="scope">
            {{scope.row.size42==="0"? "":scope.row.size42}}
          </template>
        </el-table-column>
        <el-table-column
            v-if="showDetailNum"

            prop="size43"
            label="43码"
            width="50px"
        >
          <template slot-scope="scope">
            {{scope.row.size43==="0"? "":scope.row.size43}}
          </template>
        </el-table-column>
        <el-table-column
            v-if="showDetailNum"

            prop="size44"
            label="44码"
            width="50px"
        >
          <template slot-scope="scope">
            {{scope.row.size44==="0"? "":scope.row.size44}}
          </template>
        </el-table-column>
        <el-table-column
            v-if="showDetailNum"

            prop="size45"
            label="45码"
            width="50px"
        >
          <template slot-scope="scope">
            {{scope.row.size45==="0"? "":scope.row.size45}}
          </template>
        </el-table-column>
        <el-table-column
            v-if="showDetailNum"

            prop="size46"
            label="46"
            width="37px"
        >
          <template slot-scope="scope">
            {{scope.row.size46==="0"? "":scope.row.size46}}
          </template>
        </el-table-column>
        <el-table-column
            v-if="showDetailNum"

            prop="size47"
            label="47"
            width="37px"
        >
          <template slot-scope="scope">
            {{scope.row.size47==="0"? "":scope.row.size47}}
          </template>
        </el-table-column>

        <el-table-column label="裁断进度表信息" v-if="showProgress">

          <el-table-column
              label="操作"
              width="70px"
          >

            <template slot-scope="scope">
              <div v-if="scope.row.progresses.length===0  && scope.row.status ===0  && hasAuth('produce:progress:update')" style="height: 40px;line-height: 40px;" @dblclick="addProgress(scope.row)" >双击新增</div>
              <div  v-for="(item,index) in scope.row.progresses" style="height: 40px;line-height: 40px;">
                <el-button style="padding: 0" type="text"
                           v-if="hasAuth('produce:progress:update') &&item.id!=null && item.isAccept!=0   ">
                  <template>
                    <el-popconfirm @confirm="delProgress(item)"
                                   title="确定删除吗？"
                    >
                      <el-button type="text" size="small" slot="reference" @click.stop="">删除</el-button>
                    </el-popconfirm>
                  </template>
                </el-button>
              </div>

            </template>
          </el-table-column>

          <el-table-column
              prop="typeName"
              label="工序部门"
              width="100px"
          >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.progresses" style="height: 40px;line-height: 40px;" @dblclick="item.isAccept===1&& hasAuth('produce:progress:update') && dbClickMethod(item)">

                <span  v-if="!item.isOpenEdit">{{item.costOfLabourTypeName}}</span>
                <el-autocomplete v-if="item.isOpenEdit"  size="mini"

                                 style="width: 80px"
                                 popper-class="my-autocomplete"
                                 clearable
                                 class="inline-input"
                                 v-model="item.costOfLabourTypeName"
                                 :fetch-suggestions="querySearch3"
                                 placeholder="请输入搜索内容"
                                 :trigger-on-focus="false"
                                 :popper-append-to-body="true"
                                 :ref='"el_auto_type_"+item.produceBatchId'
                                 @focus="searchCostOfLabourTypeFocus()"
                                 @select="searchTypeNameSelect($event,item)"
                                 @keyup.native.enter="enterEdit(item,scope.row)"
                                 @keyup.native.esc="escEdit(item,scope.row,index)"
                                 @keyup.native.down="addProgress(scope.row)"
                >
                </el-autocomplete>
              </div>
            </template>
          </el-table-column>

          <el-table-column
              prop="foreignProduction"
              label="外加工"
              width="140px"
          >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.progresses" style="height: 40px;line-height: 40px;" @dblclick="item.isAccept===1&& hasAuth('produce:progress:update') &&  dbClickMethod(item)">
                <span  v-if="!item.isOpenEdit">{{item.supplierName}}</span>
                <el-autocomplete v-if="item.isOpenEdit"  size="mini"

                                 style="width: 130px"
                                 popper-class="my-autocomplete"
                                 clearable
                                 class="inline-input"
                                 v-model="item.supplierName"
                                 :fetch-suggestions="querySearch"
                                 placeholder="请输入搜索内容"
                                 :trigger-on-focus="false"
                                 :popper-append-to-body="true"
                                 :ref='"el_auto_"+item.produceBatchId'
                                 @focus="searchSupplierFocus()"
                                 @select="searchSupplierSelect($event,item,scope.row)"
                                 @keyup.native.enter="enterEdit(item,scope.row)"
                                 @keyup.native.esc="escEdit(item,scope.row,index)"
                                 @keyup.native.down="addProgress(scope.row)"
                >
                </el-autocomplete>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="materialId"
              label="外加工工序物料"
              width="200px"
              show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.progresses" style="height: 40px;line-height: 40px;" @dblclick=" item.isAccept===1&& hasAuth('produce:progress:update') &&  dbClickMethod(item)">
                <span  v-if="!item.isOpenEdit">{{item.materialName}}</span>
                <el-autocomplete v-if="item.isOpenEdit"  size="mini"

                                 style="width: 180px"
                                 popper-class="my-autocomplete"
                                 clearable
                                 class="inline-input"
                                 v-model="item.materialName"
                                 :fetch-suggestions="querySearch2"
                                 placeholder="请输入搜索内容"
                                 :trigger-on-focus="false"
                                 :popper-append-to-body="true"
                                 :ref='"el_auto_m_"+item.produceBatchId'
                                 @focus="searchMmaterialFocus()"
                                 @select="searchMaterialSelect($event,item,scope.row)"
                                 @keyup.native.enter="enterEdit(item,scope.row)"
                                 @keyup.native.esc="escEdit(item,scope.row,index)"
                                 @keyup.native.down="addProgress(scope.row)"
                >
                </el-autocomplete>
              </div>
            </template>
          </el-table-column>

          <el-table-column
              prop="sendForeignProductDate"
              label="外发(外加工)时间"
              width="200px"
          >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.progresses" style="height: 40px;line-height: 40px;" @dblclick="item.isAccept===1&& hasAuth('produce:progress:update') &&  dbClickMethod(item)">
                <span  v-if="!item.isOpenEdit">{{item.sendForeignProductDate}}</span>
                <el-date-picker  v-if="item.isOpenEdit" style="width: 180px"
                                 size="mini"
                                 value-format="yyyy-MM-dd HH:mm:ss"
                                 v-model="item.sendForeignProductDate"
                                 type="datetime"
                                 clearable
                                 placeholder="开始日期"
                                 @change="searchSendDate($event,item,scope.row)"
                                 @keyup.native.enter="enterEdit(item,scope.row)"
                                 @keyup.native.esc="escEdit(item,scope.row,index)"
                                 @keyup.native.down="addProgress(scope.row)"
                >
                </el-date-picker>
              </div>
            </template>
          </el-table-column>

          <el-table-column
              prop="backForeignProductDate"
              label="收回(外加工)时间"
              width="200px"
          >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.progresses" style="height: 40px;line-height: 40px;" @dblclick="item.isAccept===1&& hasAuth('produce:progress:update') && dbClickMethod(item)">
                <span  v-if="!item.isOpenEdit">{{item.backForeignProductDate}}</span>
                <el-date-picker  v-if="item.isOpenEdit" style="width: 180px"
                                 size="mini"
                                 value-format="yyyy-MM-dd HH:mm:ss"
                                 v-model="item.backForeignProductDate"
                                 type="datetime"
                                 clearable
                                 placeholder="开始日期"
                                 @change="searchBackDate($event,item,scope.row)"
                                 @keyup.native.enter="enterEdit(item,scope.row)"
                                 @keyup.native.esc="escEdit(item,scope.row,index)"
                                 @keyup.native.down="addProgress(scope.row)"
                >
                </el-date-picker>
              </div>
            </template>
          </el-table-column>

          <el-table-column
              prop="outDate"
              label="出库时间"
              width="200px"
          >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.progresses" style="height: 40px;line-height: 40px;" @dblclick="item.isAccept===1&& hasAuth('produce:progress:update') && dbClickMethod(item)">
                <span  v-if="!item.isOpenEdit">{{item.outDate}}</span>
                <el-date-picker  v-if="item.isOpenEdit" style="width: 180px"
                                 size="mini"
                                 value-format="yyyy-MM-dd HH:mm:ss"
                                 v-model="item.outDate"
                                 type="datetime"
                                 clearable
                                 placeholder="开始日期"
                                 @change="searchOutDate($event,item,scope.row)"
                                 @keyup.native.enter="enterEdit(item,scope.row)"
                                 @keyup.native.esc="escEdit(item,scope.row,index)"
                                 @keyup.native.down="addProgress(scope.row)"
                >
                </el-date-picker>
              </div>
            </template>
          </el-table-column>


          <el-table-column
              prop="isAccept"
              label="是否被接收"
              width="100px">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.progresses" style="height: 40px;line-height: 40px;" >
                <el-tag size="small" v-if=" (item.outDate !=null && item.outDate!='' && item.outDate!=undefined) && item.isAccept === 0" type="success">已接收</el-tag>
                <el-tag size="small" v-else-if="(item.outDate !=null && item.outDate!='' && item.outDate!=undefined) && item.isAccept===1" type="danger">未接收</el-tag>
              </div>
            </template>
          </el-table-column>


        </el-table-column>

        <el-table-column label="针车进度表信息" v-if="zcShowProgress">

          <el-table-column
              label="操作"
              width="70px"
          >

            <template slot-scope="scope">
              <div v-if="scope.row.zcProgresses.length===0  && scope.row.status ===0  && hasAuth('produce:zcProgress:update')" style="height: 40px;line-height: 40px;" @dblclick="addZCProgress(scope.row)" >双击新增</div>
              <div  v-for="(item,index) in scope.row.zcProgresses" style="height: 40px;line-height: 40px;">
                <el-button style="padding: 0" type="text"
                           v-if="hasAuth('produce:zcProgress:update') &&item.id!=null && item.isAccept!=0   ">
                  <template>
                    <el-popconfirm @confirm="delZCProgress(item)"
                                   title="确定删除吗？"
                    >
                      <el-button type="text" size="small" slot="reference" @click.stop="">删除</el-button>
                    </el-popconfirm>
                  </template>
                </el-button>
              </div>

            </template>
          </el-table-column>


          <el-table-column
              prop="zcGroupName"
              label="组别名称"
              width="110px"
          >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.zcProgresses" style="height: 40px;line-height: 40px;" @dblclick="item.isAccept===1&& hasAuth('produce:zcProgress:update') &&  dbClickZCMethod(item)">
                <span  v-if="!item.isOpenEdit">{{item.zcGroupName}}</span>
                <el-autocomplete v-if="item.isOpenEdit"  size="mini"

                                 style="width: 90px"
                                 popper-class="my-autocomplete"
                                 clearable
                                 class="inline-input"
                                 v-model="item.zcGroupName"
                                 :fetch-suggestions="querySearch4"
                                 placeholder="组别"
                                 :trigger-on-focus="false"
                                 :popper-append-to-body="true"
                                 @focus="searchZCGroupFocus()"
                                 @select="searchZCGroupSelect($event,item,scope.row)"
                                 @keyup.native.esc="escZCEdit(item,scope.row,index)"
                >
                </el-autocomplete>
              </div>
            </template>
          </el-table-column>

          <el-table-column
              prop="sendDate"
              label="发包时间"
              width="200px"
          >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.zcProgresses" style="height: 40px;line-height: 40px;" @dblclick="item.isAccept===1&& hasAuth('produce:zcProgress:update') &&  dbClickZCMethod(item)">
                <span  v-if="!item.isOpenEdit">{{item.sendDate}}</span>
                <el-date-picker  v-if="item.isOpenEdit" style="width: 180px"
                                 size="mini"
                                 value-format="yyyy-MM-dd HH:mm:ss"
                                 v-model="item.sendDate"
                                 type="datetime"
                                 clearable
                                 placeholder="开始日期"
                                 @change="searchZCSendDate($event,item,scope.row)"
                >
                </el-date-picker>
              </div>
            </template>
          </el-table-column>

          <el-table-column
              prop="outDate"
              label="出库时间"
              width="200px"
          >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.zcProgresses" style="height: 40px;line-height: 40px;" @dblclick="item.isAccept===1&& hasAuth('produce:zcProgress:update') && dbClickZCMethod(item)">
                <span  v-if="!item.isOpenEdit">{{item.outDate}}</span>
                <el-date-picker  v-if="item.isOpenEdit" style="width: 180px"
                                 size="mini"
                                 value-format="yyyy-MM-dd HH:mm:ss"
                                 v-model="item.outDate"
                                 type="datetime"
                                 clearable
                                 placeholder="开始日期"
                                 @change="searchZCOutDate($event,item,scope.row)"
                                 @keyup.native.esc="escZCEdit(item,scope.row,index)"
                >
                </el-date-picker>
              </div>
            </template>
          </el-table-column>


          <el-table-column
              prop="comment"
              label="备注"
              width="140px"
          >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.zcProgresses" style="height: 40px;line-height: 40px;" @dblclick="item.isAccept===1&& hasAuth('produce:zcProgress:update') &&  dbClickZCMethod(item)">
                <span  v-if="!item.isOpenEdit">{{item.comment}}</span>
                <el-input v-if="item.isOpenEdit"  size="mini" style="width: 125px"
                          @keyup.native.enter="enterZCEdit(item,scope.row)"
                          v-model="item.comment">
                </el-input>
              </div>
            </template>
          </el-table-column>


          <el-table-column
              prop="isAccept"
              label="是否被接收"
              width="100px">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.zcProgresses" style="height: 40px;line-height: 40px;" >
                <el-tag size="small" v-if=" (item.outDate !=null && item.outDate!='' && item.outDate!=undefined) && item.isAccept === 0" type="success">已接收</el-tag>
                <el-tag size="small" v-else-if="(item.outDate !=null && item.outDate!='' && item.outDate!=undefined) && item.isAccept===1" type="danger">未接收</el-tag>
              </div>
            </template>
          </el-table-column>


        </el-table-column>

        <el-table-column label="延期原因" v-if="showDelay" >

          <el-table-column
              label="操作"
              width="70px"
          >

            <template slot-scope="scope">
              <div v-if="scope.row.delays.length===0 && scope.row.status ===0 && hasAuth('produce:progress:update')" style="height: 40px;line-height: 40px;" @dblclick="addDelay(scope.row)" >双击新增</div>
              <div  v-for="(item,index) in scope.row.delays" style="height: 40px;line-height: 40px;">
                <el-button style="padding: 0" type="text"
                           v-if="hasAuth('produce:progress:update') &&item.id!=null  ">
                  <template>
                    <el-popconfirm @confirm="delDelay(item)"
                                   title="确定删除吗？"
                    >
                      <el-button type="text" size="small" slot="reference" @click.stop="">删除</el-button>
                    </el-popconfirm>
                  </template>
                </el-button>
              </div>

            </template>
          </el-table-column>

          <el-table-column
              prop="typeName"
              label="工序部门"
              width="120px"
          >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.delays" style="height: 40px;line-height: 40px;" @dblclick="hasAuth('produce:progress:update') && dbClickMethodDelay(item)">

                <span  v-if="!item.isOpenEdit">{{item.costOfLabourTypeName}}</span>
                <el-autocomplete v-if="item.isOpenEdit"  size="mini"

                                 style="width: 100px"
                                 popper-class="my-autocomplete"
                                 clearable
                                 class="inline-input"
                                 v-model="item.costOfLabourTypeName"
                                 :fetch-suggestions="querySearch3"
                                 placeholder="请输入搜索内容"
                                 :trigger-on-focus="false"
                                 :popper-append-to-body="true"
                                 :ref='"el_auto_type_delay_"+item.produceBatchId'
                                 @focus="searchCostOfLabourTypeFocus()"
                                 @select="searchTypeNameDelaySelect($event,item)"
                                 @keyup.native.enter="enterEditDelay(item,scope.row)"
                                 @keyup.native.esc="escEditDelay(item,scope.row,index)"
                                 @keyup.native.down="addDelay(scope.row)"
                >
                </el-autocomplete>
              </div>
            </template>
          </el-table-column>

          <el-table-column
              prop="materialId"
              label="欠料物料"
              width="200px"
              show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.delays" style="height: 40px;line-height: 40px;" @dblclick=" hasAuth('produce:progress:update') &&  dbClickMethodDelay(item)">
                <span  v-if="!item.isOpenEdit">{{item.materialName}}</span>
                <el-autocomplete v-if="item.isOpenEdit"  size="mini"

                                 style="width: 180px"
                                 popper-class="my-autocomplete"
                                 clearable
                                 class="inline-input"
                                 v-model="item.materialName"
                                 :fetch-suggestions="querySearch2"
                                 placeholder="请输入搜索内容"
                                 :trigger-on-focus="false"
                                 :popper-append-to-body="true"
                                 :ref='"el_auto_m_delay_"+item.produceBatchId'
                                 @focus="searchMmaterialFocus()"
                                 @select="searchMaterialSelectDelay($event,item)"
                                 @keyup.native.enter="enterEditDelay(item,scope.row)"
                                 @keyup.native.esc="escEditDelay(item,scope.row,index)"
                                 @keyup.native.down="addDelay(scope.row)"
                >
                </el-autocomplete>
              </div>
            </template>
          </el-table-column >

          <el-table-column
              prop="date"
              label="到达时间"
              width="200px"
          >
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.delays" style="height: 40px;line-height: 40px;" @dblclick="hasAuth('produce:progress:update') && dbClickMethodDelay(item)">
                <span  v-if="!item.isOpenEdit">{{item.date}}</span>
                <el-date-picker  v-if="item.isOpenEdit" style="width: 180px"
                                 size="mini"
                                 value-format="yyyy-MM-dd HH:mm:ss"
                                 v-model="item.date"
                                 type="datetime"
                                 clearable
                                 placeholder="开始日期"
                                 @change="searchDate($event,item)"
                                 @keyup.native.enter="enterEditDelay(item,scope.row)"
                                 @keyup.native.esc="escEditDelay(item,scope.row,index)"
                                 @keyup.native.down="addDelay(scope.row)"
                >
                </el-date-picker>
              </div>
            </template>
          </el-table-column>


        </el-table-column>

        <el-table-column
            prop="action"
            label="操作"
            width="280px"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.id) "
                       v-if="hasAuth('produce:batch:save') && scope.row.status ===1   ">编辑
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('produce:batch:del')  && scope.row.status ===1  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('produce:batch:del') && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="del(scope.row.id)"
                               title="确定删除吗？"
                >
                  <el-button type="text" size="small" slot="reference" @click.stop="">删除</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('produce:batch:valid')  && scope.row.status ===1  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('produce:batch:valid')  && scope.row.status === 1  ">

              <template>
                <el-popconfirm @confirm="statusPass(scope.row.id)"
                               title="确定设置审核通过吗？"
                >
                  <el-button type="text" size="small" slot="reference">审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>


            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('produce:batch:valid')  && scope.row.status === 0  ">

              <template>
                <el-popconfirm @confirm="statusReturn(scope.row.id)"
                               title="确定设置反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button type="text" size="small" @click="preViewPrint(scope.row.id) "
                       v-if="hasAuth('produce:batch:list') && scope.row.status ===0   ">裁断计划单预览
            </el-button>

            <el-button type="text" size="small" @click="preViewPrintZC(scope.row.id) "
                       v-if="hasAuth('produce:batch:list') && scope.row.status ===0   ">针车领料预览
            </el-button>


          </template>
        </el-table-column>

      </el-table>


      <el-dialog
          :visible.sync="dialogZCQueryVisible"
          width="75%"
          title="针车进度表"
          top="0vh"
          :before-close="handleZCCloseQuery"
      >
        <el-form :inline="true" class="demo-form-inline elForm_my" style="padding: 0 0" >
          <el-form-item>
            <!-- 列表界面-日期搜索 -->
            <el-date-picker style="width: 160px;"
                            size="mini"
                            value-format="yyyy-MM-dd"
                            v-model="searchQueryStartDateStr"
                            type="date"
                            clearable
                            placeholder="起始日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button size="mini" icon="el-icon-search" @click="getZCQueryList()" type="success">查询</el-button>
          </el-form-item>

        </el-form>

        <el-divider> 全部批次号: &nbsp;&nbsp;&nbsp;&nbsp; </el-divider>


        <div >
          <span v-for="item in totalBatchIdZCSet">{{item}} &nbsp;&nbsp;</span>
        </div>
        <el-divider> 进度表 </el-divider>
        <el-table
            @filter-change="filterChange"

            :row-style="rowClass"
            ref="multipleZCQueryTable"
            :data="tableZCQueryData"
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
            show-summary
            :summary-method="getZCSummaries"

        >
          <el-table-column
              prop="orderNum"
              label="订单号"
              width="80px"

              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="batchId"
              label="生产序号"
              width="100px"
              column-key="batchIdKey"
              :filters=batchIdFileterArr
              :filter-method="filterHandler"
              show-overflow-tooltip>
          </el-table-column>

          <el-table-column
              prop="productNum"
              label="公司货号"
              width="90px"
              column-key="productNumKey"
              :filters=productNumFileterArr
              :filter-method="filterHandler"
              show-overflow-tooltip>
          </el-table-column>

          <el-table-column
              prop="productBrand"
              label="品牌"
              width="90px"
              column-key="productBrandKey"
              :filters=productBrandFileterArr
              :filter-method="filterHandler"
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
              prop="endDate"
              label="货期"
              width="100px"
              column-key="endDateKey"
              :filters=endDateFileterArr
              :filter-method="filterHandler"
              show-overflow-tooltip>
          </el-table-column>

          <el-table-column
              prop="mergeBatchNumber"
              label="批次号数量"
              width="85px"
              show-overflow-tooltip>
          </el-table-column>


          <el-table-column
              prop="groupName"
              label="组名"
              width="100px"
              column-key="groupNameKey"
              :filters=groupNameFileterArr
              :filter-method="filterHandler"
              show-overflow-tooltip>
          </el-table-column>


          <el-table-column
              prop="sendDate"
              label="发包时间"
              width="145px"
              column-key="sendDateKey"
              :filters=sendDateFileterArr
              :filter-method="filterHandler"
              show-overflow-tooltip>
          </el-table-column>

          <el-table-column
              prop="outDate"
              label="出库日期"
              width="145px"
              column-key="outDateKey"
              :filters=outDateFileterArr
              :filter-method="filterHandler"
              show-overflow-tooltip>
          </el-table-column>


          <el-table-column
              prop="isAccept"
              label="是否被接收"
              width="100px">
            <template slot-scope="scope">
              <el-tag size="small" v-if=" (scope.row.outDate !=null && scope.row.outDate!='' && scope.row.outDate!=undefined) && scope.row.isAccept === 0" type="success">已接收</el-tag>
              <el-tag size="small" v-else-if="(scope.row.outDate !=null && scope.row.outDate!='' && scope.row.outDate!=undefined) && scope.row.isAccept===1" type="danger">未接收</el-tag>
            </template>
          </el-table-column>

        </el-table>
      </el-dialog>

      <el-dialog
          :visible.sync="dialogQueryVisible"
          width="75%"
          title="查询进度表"
          top="0vh"
          :before-close="handleCloseQuery"
      >
        <el-form :inline="true" class="demo-form-inline elForm_my" style="padding: 0 0" >

          <el-form-item>
            <!-- 列表界面-日期搜索 -->
            <el-date-picker style="width: 160px;"
                            size="mini"
                            value-format="yyyy-MM-dd"
                            v-model="searchQueryOutDateStr"
                            type="date"
                            clearable
                            placeholder="出库日期">
            </el-date-picker>

            <!-- 列表界面-日期搜索 -->
            <el-date-picker style="width: 160px;"
                            size="mini"
                            value-format="yyyy-MM-dd"
                            v-model="searchQueryStartDateStr"
                            type="date"
                            clearable
                            placeholder="起始日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-switch
                style="display: block;margin-top: 8px"
                v-model="showSendNoBack"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="筛选外发未回"
                inactive-text="不筛选">
            </el-switch>
          </el-form-item>


          <el-form-item>
            <el-switch
                style="display: block;margin-top: 8px"
                v-model="showHasEndDate"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="筛选有货期的"
                inactive-text="不筛选">
            </el-switch>
          </el-form-item>

          <el-form-item>
            <!-- 列表界面-供应商搜索 -->
            <el-autocomplete size="mini"
                             style="width: 200px"
                             popper-class="my-autocomplete"

                             clearable
                             class="inline-input"
                             v-model="searchProgressSupStr"
                             :fetch-suggestions="querySearch"
                             :trigger-on-focus="false"
                             placeholder="请输入供应商"
                             @select="searchProgressSelect"
                             @focus="searchSupplierFocus()"
            >
            </el-autocomplete>
          </el-form-item>

          <el-form-item>
            <el-button size="mini" icon="el-icon-search" @click="searchQuery()" type="success">查询</el-button>
          </el-form-item>

        </el-form>
        <el-divider> 全部批次号: &nbsp;&nbsp;&nbsp;&nbsp; </el-divider>

        <div>{{this.totalBatchId}}</div>

        <el-divider> 进度表 </el-divider>
        <el-table
            :row-style="rowClass"
            ref="multipleQueryTable"
            :data="tableQueryData"
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
            show-summary
            :summary-method="getSummaries"
            :span-method="objectSpanMethodProgress"


        >
          <el-table-column
              prop="orderNum"
              label="订单号"
              width="80px"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="batchId"
              label="生产序号"
              width="80px"
              show-overflow-tooltip>
          </el-table-column>

          <el-table-column
              prop="productNum"
              label="公司货号"
              width="90px"
              show-overflow-tooltip>
          </el-table-column>

          <el-table-column
              prop="productBrand"
              label="品牌"
              width="90px"
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
              prop="endDate"
              label="货期"
              width="100px"
              show-overflow-tooltip>
          </el-table-column>

          <el-table-column
              prop="mergeBatchNumber"
              label="批次号数量"
              width="85px"
              show-overflow-tooltip>
          </el-table-column>


          <el-table-column
              prop="costOfLabourTypeName"
              label="部门"
              width="60px"
              show-overflow-tooltip>
          </el-table-column>


          <el-table-column
              prop="supplierName"
              label="供应商名称"
              width="100px"
              show-overflow-tooltip>
          </el-table-column>

          <el-table-column
              prop="materialName"
              label="外加工工序物料"
              width="130px"
              show-overflow-tooltip>
          </el-table-column>


          <el-table-column
              prop="sendForeignProductDate"
              label="外发时间"
              width="145px"
              show-overflow-tooltip>
          </el-table-column>


          <el-table-column
              prop="backForeignProductDate"
              label="收回时间"
              width="145px"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="outDate"
              label="出库日期"
              width="145px"
              show-overflow-tooltip>
          </el-table-column>


          <el-table-column
              prop="isAccept"
              label="是否被接收"
              width="100px">
            <template slot-scope="scope">
                <el-tag size="small" v-if=" (scope.row.outDate !=null && scope.row.outDate!='' && scope.row.outDate!=undefined) && scope.row.isAccept === 0" type="success">已接收</el-tag>
                <el-tag size="small" v-else-if="(scope.row.outDate !=null && scope.row.outDate!='' && scope.row.outDate!=undefined) && scope.row.isAccept===1" type="danger">未接收</el-tag>
            </template>
          </el-table-column>

          <el-table-column
              prop="action"
              label="操作"
              width="120px"
          >
            <template slot-scope="scope">
              <el-button class="elInput_action_my" type="text" size="small" @click="accept(scope.row)"  style="padding: 0"
                         v-if="hasAuth('produce:progress:update') && $store.state.user_info.defaultTypeObj != null &&
                          $store.state.user_info.defaultTypeObj[0].seq===scope.row.seq+1
                          && (scope.row.outDate !=null && scope.row.outDate!='' && scope.row.outDate!=undefined)
                          && scope.row.isAccept===1">
                接收
              </el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-divider> 欠料明细 </el-divider>

        <el-table
            :row-style="rowClass"
            ref="multipleQueryTable2"
            :data="tableDelayData"
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
        >
          <el-table-column
              prop="orderNum"
              label="订单号"
              width="100px"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="batchId"
              label="生产序号"
              width="100px"
              show-overflow-tooltip>
          </el-table-column>

          <el-table-column
              prop="productNum"
              label="公司货号"
              width="200px"
              show-overflow-tooltip>
          </el-table-column>

          <el-table-column
              prop="productBrand"
              label="品牌"
              width="200px"
              show-overflow-tooltip>
          </el-table-column>

          <el-table-column
              prop="materialName"
              label="欠料物料"
              width="300px"
              show-overflow-tooltip>
          </el-table-column>


        </el-table>
      </el-dialog>

      <el-dialog
          :visible.sync="dialogCalNumVisible"
          width="30%"
          title="生产序号信息"
          top="0vh"
          :before-close="handleClosePrepare"
      >
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="120px" class="demo-editForm">

          <el-form-item  v-if="false" label="唯一编码" prop="id">
            <el-input   v-model="editForm.id" ></el-input>
          </el-form-item>

          <el-form-item label="生产序号" prop="batchId">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.batchId">
              </input>
            </div>
          </el-form-item>

          <el-form-item label="订单号" prop="orderNum">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.orderNum">
              </input>
            </div>
          </el-form-item>

          <el-form-item label="34码" prop="size34">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size34">
              </input>
            </div>
          </el-form-item>
          <el-form-item label="35码" prop="size35">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size35">
              </input>
            </div>
          </el-form-item>
          <el-form-item label="36码" prop="size36">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size36">
              </input>
            </div>
          </el-form-item>
          <el-form-item label="37码" prop="size37">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size37">
              </input>
            </div>
          </el-form-item>
          <el-form-item label="38码" prop="size38">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size38">
              </input>
            </div>
          </el-form-item>
          <el-form-item label="39码" prop="size39">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size39">
              </input>
            </div>
          </el-form-item>
          <el-form-item label="40码" prop="size40">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size40">
              </input>
            </div>
          </el-form-item>
          <el-form-item label="41码" prop="size41">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size41">
              </input>
            </div>
          </el-form-item>
          <el-form-item label="42码" prop="size42">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size42">
              </input>
            </div>
          </el-form-item>
          <el-form-item label="43码" prop="size43">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size43">
              </input>
            </div>
          </el-form-item>
          <el-form-item label="44码" prop="size44">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size44">
              </input>
            </div>
          </el-form-item>
          <el-form-item label="45码" prop="size45">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size45">
              </input>
            </div>
          </el-form-item>
          <el-form-item label="46码" prop="size46">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size46">
              </input>
            </div>
          </el-form-item>

          <el-form-item label="47码" prop="size47">
            <div  :class=" 'el-input '" >
              <input  class="el-input__inner"  v-model.lazy="editForm.size47">
              </input>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('editForm',addOrUpdate)">完成</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>

      <!-- 打印弹窗 -->
      <el-dialog
          title=""
          :visible.sync="dialogVisiblePrint"
          width="55%"
          style="padding-top: 0"
          :before-close="printClose"
      >
        <el-button v-if="dialogVisiblePrint"
                   @click="printDemo"
                   v-focus ref="printBtn1"
                   size="mini" icon="el-icon-printer" type="primary">打印
        </el-button>
        <vue-easy-print tableShow ref="easyPrint">
          <template slot-scope="func">
            <print :tableData="printCaiDuanDataList" :getChineseNumber="func.getChineseNumber"></print>
          </template>
        </vue-easy-print>

      </el-dialog>

      <!-- 针车打印弹窗 -->
      <el-dialog
          title=""
          :visible.sync="dialogVisiblePrintZhenChe"
          width="55%"
          style="padding-top: 0"
          :before-close="printZhenCheClose"
      >
        <el-button v-if="dialogVisiblePrintZhenChe"
                   @click="printZhenChe"
                   size="mini" icon="el-icon-printer" type="primary">打印
        </el-button>
        <vue-easy-print tableShow ref="zhenChePrint">
          <template slot-scope="func">
            <printZC :tableData="printZhenCheDataList" :getChineseNumber="func.getChineseNumber"></printZC>
          </template>
        </vue-easy-print>

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
          title="针车组别"
          :visible.sync="dialogGroupVisible"
          width="50%"

      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"

                 class="demo-editForm">

          <el-form-item>
            <el-button size="medium"  plain v-show="hasAuth('produce:zcGroup:list') "
                       type="primary"   @click="submitGroupForm"
            >保存
            </el-button>
          </el-form-item>


        </el-form>
        <el-divider content-position="left">列表</el-divider>

        <el-button  type="primary" icon="el-icon-plus" size="mini" @click="handleAddGroup"
        >添加
        </el-button>
<!--        <el-button   type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteGroup"
        >删除
        </el-button>-->

        <el-table
            :data="editGroupForm"
            :row-class-name="rowClassName"
            ref="tbGroup"
            height="300"
            size="mini"
            :cell-style="cellStyle"
            fit
            @selection-change="handleGroupSelectionChange"

        >
          <el-table-column type="selection" width="80" align="center"   >
          </el-table-column>
          <el-table-column label="序号" align="center" prop="seqNum" width="50"></el-table-column>


          <el-table-column label="组别名称" align="center" prop="groupName " width="200">
            <template slot-scope="scope">
              <el-input  v-model="editGroupForm[scope.row.seqNum-1].groupName"></el-input>
            </template>

          </el-table-column>

        </el-table>

      </el-dialog>

    </el-main>

  </el-container>

</template>

<script>

// POI，因为响应输出字节流，和ajax 的请求不一样。
import vueEasyPrint from "vue-easy-print";

import {request} from "@/axios";
import {sysbaseUrl} from "@/axios";
import print from "@/views/printModule/printCaiDuan";
import printZC from "@/views/printModule/printZhenChe";

import {request2} from "@/axios";
import exportExcelCommon from "@/views/common/ExportExcelCommon";

export default {
  name: 'Batch',
  // 引入打印模块基础组件和该打印模块的模板页面
  components: {
    vueEasyPrint,
    print,
    printZC
  },
  data() {
    return {

      flagIsFilterHanlder:false,
      flagIsChangeFieldSearch:false,
      batchIdFileterArr:[],

      productNumFileterArr:[],

      productBrandFileterArr:[],

      endDateFileterArr:[],

      groupNameFileterArr:[],

      sendDateFileterArr:[],

      outDateFileterArr:[],

      editGroupForm :[{
        id:'',
        groupName:''
      }],
      dialogGroupVisible: false,
      checkedGroupDetail: [],


      allTotalNum:'',
      oneMaterialPrices:[],

      showDelay:false,
      showDetailNum:false,
      showProgress:false,
      zcShowProgress:false,

      showSendNoBack:false,
      showHasEndDate:false,

      editSupplierName:'',

      dialogVisiblePrint: false,
      dialogVisiblePrintZhenChe: false,

      printCaiDuanDataList:
          {rowList:[
          {productNum:'10s57202',batchId:123,customerNum:'112233'
        ,size34:'0',size35:'0',size36:'0',size37:'0',size38:'0',size39:'0',size40:'0',size41:'0'
        ,size42:'0',size43:'0',size44:'0',size45:'0',size46:'0',size47:'0',
        subList:[
          {materialId:'01.01',materialName:'ceshi',dosage:'1.21',needNum:'189',comment:'ceshi'}
        ]}]
          },
      printZhenCheDataList:
          {rowList:[
              {productNum:'10s57202',batchId:123,customerNum:'112233'
                ,size34:'0',size35:'0',size36:'0',size37:'0',size38:'0',size39:'0',size40:'0',size41:'0'
                ,size42:'0',size43:'0',size44:'0',size45:'0',size46:'0',size47:'0',
                subList:[
                  {materialId:'01.01',materialName:'ceshi',dosage:'1.21',needNum:'189',comment:'ceshi'}
                ]}]
          },

      rules: {
        batchId: [
          {required: true, message: '请输入生产序号', trigger: 'blur'}
        ],
        orderNum: [
          {required: true, message: '请输入订单号', trigger: 'blur'}
        ]

      },

      materialSearchDatas: [], // 用于搜索的建议框

      prepareCheckVal:[],

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
        selectField:'batchId',
        searchStr:'',
      }],

      tableLoad:true,
      statusArr : [{'name':'暂存','val':1},{'name':'审核中','val':2},{'name':'已审核','val':0},{'name':'重新审核','val':3}],
      checkedBox:[1,2,3,0],

      status2Arr : [{'name':'备料未完成','val':1},{'name':'备料完成','val':0}],
      checkedBox2:[1,0],

      // 搜索字段
      selectedName: 'batchId',// 搜索默认值
      options: [
        {value: 'batchId', label: '生产序号'},
        {value: 'productNum', label: '工厂货号'},
        {value: 'productBrand', label: '品牌'},
        {value: 'orderNum', label: '订单号'}


      ],
      select: 'batchId', // 搜索默认值
      searchStr: '',
      searchStrList: [],
      searchField: '',

      searchProgressSupStr: '',

      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 50 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      // 表单字段
      addOrUpdate: 'save',
      editForm: {
        id: '',
        batchId:'',
        orderNum:'',
        size34:'',size35:'',size36:'',size37:'',size38:'',size39:'',size40:'',size41:'',
        size42:'',size43:'',size44:'',size45:'',size46:'',size47:'',
      },

      theCurrentPrepareOrderId:'',
      theCurrentOrderMsg:{id:'',orderNum:'',customerNum:'',productNum:'',productBrand:'',productColor:'',productRegion:''},
      prepareList:[{preparedNum:'',addNum:''}],
      dialogVisible: false,

      dialogQueryVisible: false,
      dialogZCQueryVisible: false,

      searchQueryOutDateStr:'',
      searchQueryMaterialName:'',
      searchQueryStartDateStr:new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60).format("yyyy-MM-dd"),


      tableData: [],
      tableQueryData: [],
      tableDelayData: [],
      totalBatchId: [],
      totalBatchIdZCSet:new Set(),
      tableZCQueryData: [],

      spanArr: [],
      pos: '',
      posProgress: '',


      spanZCArrProgress: [],

      spanArrProgress: [],
      multipleSelection: [] ,// 多选框数组

      // shift 多选
      origin:-1,  // 变量起点
      pin:false, // 默认不按住

      restaurants: [],// 搜索框列表数据存放
      restaurants2: [],// 搜索框列表数据存放
      restaurants3: [],// 搜索框列表数据存放
      restaurants4: [],// 搜索框列表数据存放

    }
  },

  methods: {
    queryPrices(productNum){
      // 获取该物料价目信息
      request.get('/order/productPricePre/queryPriceByForeignProduction?productNum='+productNum).then(res => {
        if(res.data.data != null){
          this.oneMaterialPrices = res.data.data
        }
      })
    },

    getSummariesMain(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 ) {
          sums[index] = '求和';
          return;
        }
        if (index === 5 ) {
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
    filterHandler(value, row, column) {

      this.flagIsFilterHanlder = true;
      // 假如是true，代表已经结束。重新赋值
      if(this.flagIsChangeFieldSearch){
        this.flagIsChangeFieldSearch = false;
        this.totalBatchIdZCSet=new Set()
      }
      const property = column['property'];

      console.log("filter过滤row{},column:{}",row,column)
      let flag = row[property] === value;
      if(flag){
        this.totalBatchIdZCSet.add(row['batchId'])
      }

      return flag;
    },
    filterChange(filters){
      // 说明过滤器全部重置了，
      /*if(!this.flagIsFilterHanlder){
        this.totalBatchIdZCSet = new Set();
      }*/
      console.log("搜索条件变动")
      this.flagIsChangeFieldSearch = true;
      this.flagIsFilterHanlder = false;
    },
    getZCSummaries(param) {
      console.log("param:",param)
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 ) {
          sums[index] = '求和';
          return;
        }
        if (index ===6) {
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
      console.log("param:",param)
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 ) {
          sums[index] = '求和';
          return;
        }
        if (index === 6 ) {
          sums[index] = this.allTotalNum;
        }

      });

      return sums;
    },
    accept(row){
      console.log("accept:row",row)
      request.post('/produce/batchProgress/accept?id='+row.produceBatchProgressId).then(res => {
        this.$message.info("接收成功");
        this.getQueryList()
      })
    },
    addDelay(row){
      row.delays.push({isOpenEdit:true,produceBatchId:row.id,
        costOfLabourTypeId:this.$store.state.user_info.defaultTypeObj != null ? this.$store.state.user_info.defaultTypeObj[0].id : '',
        costOfLabourTypeName:this.$store.state.user_info.defaultTypeObj != null ?  this.$store.state.user_info.defaultTypeObj[0].typeName :'空值',
       date:''})
    },
    addProgress(row){

      console.log("当前行:,当前用户：",row,this.$store.state.user_info)
      row.progresses.push({isOpenEdit:true,produceBatchId:row.id,
        costOfLabourTypeId:this.$store.state.user_info.defaultTypeObj != null ? this.$store.state.user_info.defaultTypeObj[0].id : '',
        costOfLabourTypeName:this.$store.state.user_info.defaultTypeObj != null ?  this.$store.state.user_info.defaultTypeObj[0].typeName :'空值'
      })

    },
    addZCProgress(row){

      console.log("当前行:,当前用户：",row,this.$store.state.user_info)
      row.zcProgresses.push({isOpenEdit:true,produceBatchId:row.id})

    },
    dbClickMethodDelay(row){
      row.oldMaterialName = row.materialName
      row.oldDate = row.date

      console.log("双击row 之前：flag :",row.isOpenEdit)
      row.isOpenEdit=true;
      console.log("双击row 之后：flag :",row.isOpenEdit)
      this.$refs.multipleTable.doLayout()
    },
    dbClickZCMethod(row){
      console.log("dbClick:",row)
      row.oldSendDate = row.sendDate
      row.oldOutDate = row.outDate
      row.oldZcGroupName = row.zcGroupName
      row.oldZcGroupId = row.zcGroupId

      console.log("双击row 之前：flag :",row.isOpenEdit)
      row.isOpenEdit=true;
      console.log("双击row 之后：flag :",row.isOpenEdit)
      this.$refs.multipleTable.doLayout()
    },
    dbClickMethod(row){
      console.log("dbClick:",row)
      row.oldCostOfLabourTypeName = row.costOfLabourTypeName
      row.oldCostOfLabourTypeId = row.costOfLabourTypeId
      row.oldSupplierName = row.supplierName
      row.oldSupplierId = row.supplierId
      row.oldMaterialId = row.materialId
      row.oldMaterialName = row.materialName
      row.oldSendForignProductDate = row.sendForeignProductDate
      row.oldBackForignProductDate = row.backForeignProductDate
      row.oldOutDate = row.outDate

      console.log("双击row 之前：flag :",row.isOpenEdit)
      row.isOpenEdit=true;
      console.log("双击row 之后：flag :",row.isOpenEdit)
      this.$refs.multipleTable.doLayout()
    },
    loadMaterialAll() {
      request.post('/baseData/material/getSearchAllData').then(res => {
        this.restaurants2 = res.data.data
      })
    },
    loadSupplierAll() {
      request.post('/baseData/supplier/getSearchAllData').then(res => {
        this.restaurants = res.data.data
      })
    },
    loadZCGroupAll() {
      request.post('/produce/zcGroup/getSearchAllData').then(res => {
        this.restaurants4 = res.data.data
      })
    },

    searchMmaterialFocus(){
      console.log("物料搜索框聚焦")
      this.loadMaterialAll()
    },
    searchZCGroupFocus(){
      console.log("供应商搜索框聚焦")
      this.loadZCGroupAll()
    },
    searchSupplierFocus(){
      console.log("供应商搜索框聚焦")
      this.loadSupplierAll()
    },
    searchCostOfLabourTypeFocus(){
      this.loadCostOfLabourTypeAll()
    },
    loadCostOfLabourTypeAll() {
      request.post('/costOfLabour/costOfLabourType/getSearchAllData').then(res => {
        this.restaurants3 = res.data.data
      })
    },
    querySearch3(queryString, cb) {
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
    querySearch4(queryString, cb) {
      var restaurants = this.restaurants4;
      var results = queryString ? restaurants.filter(this.createFilter2(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter2(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) ;
      };
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
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
          if (data[i].mergeBatchId === data[i - 1].mergeBatchId) {
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
    getSpanArrProgress(data) {
      this.spanArrProgress = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArrProgress.push(1);
          this.posProgress = 0
        } else {
          // 判断这一条和上一条id是否相同
          if (data[i].batchId === data[i - 1].batchId) {
            this.spanArrProgress[this.posProgress] += 1;
            this.spanArrProgress.push(0);
          } else {
            this.spanArrProgress.push(1);
            this.posProgress = i;
          }
        }
      }
    },
    // 同ID的，单元格合并，数据库配合返回根据ID排序
    getZCSpanArrProgress(data) {
      this.spanZCArrProgress = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanZCArrProgress.push(1);
          this.posProgress = 0
        } else {
          // 判断这一条和上一条id是否相同
          if (data[i].batchId === data[i - 1].batchId) {
            this.spanZCArrProgress[this.posProgress] += 1;
            this.spanZCArrProgress.push(0);
          } else {
            this.spanZCArrProgress.push(1);
            this.posProgress = i;
          }
        }
      }
    },
    objectZCSpanMethodProgress({row, column, rowIndex, columnIndex}) {
      if ( (columnIndex >=0 && columnIndex <=7 ) ||  (columnIndex >=12 && columnIndex <=14 )) {
        const _row = this.spanZCArrProgress[rowIndex];
        console.log("columnIndex:"+columnIndex +",row:"+_row)
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }

    },
    // 同ID的，单元格合并，数据库配合返回根据ID排序
    objectSpanMethodProgress({row, column, rowIndex, columnIndex}) {
      if ( (columnIndex >=0 && columnIndex <=7 ) ||  (columnIndex >=12 && columnIndex <=14 )) {
        const _row = this.spanArrProgress[rowIndex];
        console.log("columnIndex:"+columnIndex +",row:"+_row)
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }

    },

    // 同ID的，单元格合并，数据库配合返回根据ID排序
    objectSpanMethod({row, column, rowIndex, columnIndex}) {

      // 订单号-核算信息
      if (columnIndex >= 1 && columnIndex <= 8) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      // 9,10 是生产序号，针车领料编号。不合并

      /**
       * 码数11-24（不合并） 24-11+1=14
       裁断25-32（合并）8
       针车33-38（合并）6
       延期39-42（合并）4
       操作43（不合并）*/
      let start =11;
      let end =10;

      if(this.showDetailNum && this.showProgress && this.showDelay && this.zcShowProgress){
        start = start + 14
        end = start+ 8+6+4
      }else if(this.showDetailNum && this.showProgress && this.showDelay && !this.zcShowProgress){
        start = start + 14
        end = start+ 8+4
      }

      else if(this.showDetailNum && this.showProgress && !this.showDelay && this.zcShowProgress){
        start = start + 14
        end = start+ 8+6
      }else if(this.showDetailNum && this.showProgress && !this.showDelay && !this.zcShowProgress){
        start = start + 14
        end = start+ 8
      }

      else if(this.showDetailNum && !this.showProgress && this.showDelay && this.zcShowProgress){
        start = start + 14
        end = start + 4+6
      }else if(this.showDetailNum && !this.showProgress && this.showDelay && !this.zcShowProgress){
        start = start + 14
        end = start +4
      }

      else if(this.showDetailNum && !this.showProgress && !this.showDelay && this.zcShowProgress){
        start = start + 14
        end = start +6
      }else if(this.showDetailNum && !this.showProgress && !this.showDelay && !this.zcShowProgress){
        start = start + 14
        end = start
      }

      else if(!this.showDetailNum && this.showProgress && this.showDelay && this.zcShowProgress){
        end = start + 8 +4+6
      }else if(!this.showDetailNum && this.showProgress && this.showDelay && !this.zcShowProgress){
        end = start+8+4
      }

      else if(!this.showDetailNum && this.showProgress && !this.showDelay && this.zcShowProgress){
        end = start + 8 +6
      }else if(!this.showDetailNum && this.showProgress && !this.showDelay && !this.zcShowProgress){
        end = start+8
      }

      else if(!this.showDetailNum && !this.showProgress && this.showDelay && this.zcShowProgress){
        end = start  +4+6
      }else if(!this.showDetailNum && !this.showProgress && this.showDelay && !this.zcShowProgress){
        end = start +4
      }

      else if(!this.showDetailNum && !this.showProgress && !this.showDelay && this.zcShowProgress){
        end = start   +6
      }else if(!this.showDetailNum && !this.showProgress && !this.showDelay && !this.zcShowProgress){
        end = start
      }

      console.log("start :{},end:{}",start,end)
      if( columnIndex >= start && columnIndex < end ){
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }


    },

    pinSelect(item, index){
      console.log("index",index)
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

    queryProgress(){
      this.dialogQueryVisible = true;
    },
    pushOrder(){
      this.$confirm(
          '确定要批量下推吗?', // 第一个参数为弹窗消息内容
          '提示', // 第二个参数为弹窗左上角标题title
          // 第三个参数为弹窗项的options，应该为object对象
          {
            confirmButtonText: '确定',  // 确认按钮的文本，可省略，默认为确定
            cancelButtonText: '取消',  // 取消按钮的文本，可省略，默认为取消
            type: 'warning' // 弹窗的消息类型，比如为warning时弹窗左边图标为'!'感叹号，为success时图标为'√'的勾。
          }
      )
          // then中填写点击确认按钮后执行的事件，例如执行删除该条数据的delect请求
          .then(() => {
            let ids = this.multipleSelection;
            request.post('/produce/batch/push',ids).then(res => {
              this.$message({
                message: '批量下推成功!',
                type: 'success'
              });
              this.getList()
            })
          })
          // catch中填写点击取消按钮后执行的事件，例如消息提示“已取消删除”
          .catch(() => {
            this.$message.info(this.$t("lang.Deletecancelled")); // 使用i18n国际化表示的“已取消删除”
          });
    },
    batchDel(){
      // 引用确认消息弹窗api
      this.$confirm(
          '确定要批量删除吗?', // 第一个参数为弹窗消息内容
          '提示', // 第二个参数为弹窗左上角标题title
          // 第三个参数为弹窗项的options，应该为object对象
          {
            confirmButtonText: '确定',  // 确认按钮的文本，可省略，默认为确定
            cancelButtonText: '取消',  // 取消按钮的文本，可省略，默认为取消
            type: 'warning' // 弹窗的消息类型，比如为warning时弹窗左边图标为'!'感叹号，为success时图标为'√'的勾。
          }
      )
          // then中填写点击确认按钮后执行的事件，例如执行删除该条数据的delect请求
          .then(() => {
            this.del(null)
          })
          // catch中填写点击取消按钮后执行的事件，例如消息提示“已取消删除”
          .catch(() => {
            this.$message.info(this.$t("lang.Deletecancelled")); // 使用i18n国际化表示的“已取消删除”
          });
    },
    batchZCPick(){
      // 引用确认消息弹窗api
      this.$confirm(
          '确定要针车领料吗?', // 第一个参数为弹窗消息内容
          '提示', // 第二个参数为弹窗左上角标题title
          // 第三个参数为弹窗项的options，应该为object对象
          {
            confirmButtonText: '确定',  // 确认按钮的文本，可省略，默认为确定
            cancelButtonText: '取消',  // 取消按钮的文本，可省略，默认为取消
            type: 'warning' // 弹窗的消息类型，比如为warning时弹窗左边图标为'!'感叹号，为success时图标为'√'的勾。
          }
      )
          // then中填写点击确认按钮后执行的事件，例如执行删除该条数据的delect请求
          .then(() => {
            let ids = this.multipleSelection;
            this.$router.push({name:'repository:pickMaterial:list',params:{zcPickId:ids}});
          })
          // catch中填写点击取消按钮后执行的事件，例如消息提示“已取消删除”
          .catch(() => {
            this.$message.info(this.$t("lang.Deletecancelled")); // 使用i18n国际化表示的“已取消删除”
          });
    },
    batchValid(){
      // 引用确认消息弹窗api
      this.$confirm(
          '确定要批量审核吗?', // 第一个参数为弹窗消息内容
          '提示', // 第二个参数为弹窗左上角标题title
          // 第三个参数为弹窗项的options，应该为object对象
          {
            confirmButtonText: '确定',  // 确认按钮的文本，可省略，默认为确定
            cancelButtonText: '取消',  // 取消按钮的文本，可省略，默认为取消
            type: 'warning' // 弹窗的消息类型，比如为warning时弹窗左边图标为'!'感叹号，为success时图标为'√'的勾。
          }
      )
          // then中填写点击确认按钮后执行的事件，例如执行删除该条数据的delect请求
          .then(() => {
            let ids = this.multipleSelection;
            request.post('/produce/batch/statusPassBatch',ids).then(res => {
              this.$message({
                message: '批量审核通过!',
                type: 'success'
              });
              this.getList()
            })
          })
          // catch中填写点击取消按钮后执行的事件，例如消息提示“已取消删除”
          .catch(() => {
            this.$message.info(this.$t("lang.Deletecancelled")); // 使用i18n国际化表示的“已取消删除”
          });
    },
    batchRevalid(){
      // 引用确认消息弹窗api
      this.$confirm(
          '确定要批量反审核吗?', // 第一个参数为弹窗消息内容
          '提示', // 第二个参数为弹窗左上角标题title
          // 第三个参数为弹窗项的options，应该为object对象
          {
            confirmButtonText: '确定',  // 确认按钮的文本，可省略，默认为确定
            cancelButtonText: '取消',  // 取消按钮的文本，可省略，默认为取消
            type: 'warning' // 弹窗的消息类型，比如为warning时弹窗左边图标为'!'感叹号，为success时图标为'√'的勾。
          }
      )
          // then中填写点击确认按钮后执行的事件，例如执行删除该条数据的delect请求
          .then(() => {
            let ids = this.multipleSelection;
            request.post('/produce/batch/statusReturnPassBatch',ids).then(res => {
              this.$message({
                message: '批量反审核通过!',
                type: 'success'
              });
              this.getList()
            })
          })
          // catch中填写点击取消按钮后执行的事件，例如消息提示“已取消删除”
          .catch(() => {
            this.$message.info(this.$t("lang.Deletecancelled")); // 使用i18n国际化表示的“已取消删除”
          });
    },

    otherBtn(item) {
      if (item === 'batchRevalid') {
        this.batchRevalid();
      }else if(item === 'batchValid') {
        this.batchValid();
      }else if(item === 'batchDel') {
        this.batchDel();
      }else if(item === 'pushOrder') {
        this.pushOrder();
      }
      else if(item ==='queryProgress'){
        this.queryProgress();
      }else if(item ==='batchZCPick'){
        this.batchZCPick();
      }else if(item ==='batchPrintCaiDuan'){
        this.batchPrint()
      }
      else if(item ==='batchPrintZhenChe'){
        this.batchPrintZC()
      }else if(item === 'addZcGroup'){
        this.addZcGroup()
      }else if(item ==='queryZCProgress'){
        this.dialogZCQueryVisible = true;
      }

    },
    addZcGroup(){
      request.post('/produce/zcGroup/list').then(res => {
        this.editGroupForm = res.data.data;
        this.dialogGroupVisible=true

      })
    },
    handleGroupSelectionChange(val) {
      console.log("多选框 val ", val)
      this.checkedGroupDetail = []

      val.forEach(theId => {
        this.checkedGroupDetail.push(theId.seqNum)
      })
      console.log("多选框 选中的 ", this.checkedGroupDetail)
    },
    getNewArr(arr,delIndexArr){
      let test = []
      test = arr.filter((item, index) =>{
        return !delIndexArr.includes(index+1)}
      )
      return test
    },
    handleDeleteGroup() {
      if (this.checkedGroupDetail.length == 0) {
        if(this.editGroupForm.length === 0){
          this.$message({
            message: '没有记录可删除!',
            type: 'error'
          });
        }
      }else {
        this.editGroupForm = this.getNewArr(this.editGroupForm,this.checkedGroupDetail);
      }
      this.checkedGroupDetail=[]
    },
    handleAddGroup() {
      if (this.editGroupForm == undefined) {
        console.log("editForm 初始化")
        this.editGroupForm = [];
      }
      let obj = {};
      obj.groupName = '';
      this.editGroupForm.push(obj);
    },
    submitGroupForm() {
      const load = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      request.post('/produce/zcGroup/save' , this.editGroupForm).then(res => {
        load.close()
        this.$message({
          message: '保存成功!',
          type: 'success'
        });
        request.post('/produce/zcGroup/list').then(res => {
          this.editGroupForm = res.data.data;
        })

      }).catch(()=>{
        load.close()
      })
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
        url: '/produce/batch/upload',
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
    },
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
    printDemo() {
      this.$refs.easyPrint.print()
    },
    printZhenChe() {
      this.$refs.zhenChePrint.print()
    },
    // 关闭打印弹窗弹窗处理动作
    printClose(done) {
      console.log("打印弹窗关闭...")
      this.$refs.easyPrint.tableShow = false;
      done();
    },
    printZhenCheClose(done) {
      console.log("打印弹窗关闭...")
      this.$refs.zhenChePrint.tableShow = false;
      done();
    },
    batchPrintZC(){
      let ids = this.multipleSelection;
      // 查询裁断计划数据
      request.post('/produce/batch/queryZhenChePrintByIds' , ids).then(res => {
        let result = res.data.data
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.printZhenCheDataList = result
        })

      })

      console.log("打印时的zhenChePrint：", this.$refs.zhenChePrint)
      if (this.$refs.zhenChePrint) {
        console.log("zhenChePrint设置前打印内容", this.$refs.zhenChePrint.tableData)

        this.$refs.zhenChePrint.tableData = this.printZhenCheDataList
        console.log("zhenChePrint设置后打印内容", this.$refs.zhenChePrint.tableData)
      }
      this.dialogVisiblePrintZhenChe = true
    },
    batchPrint(){
      let ids = this.multipleSelection;
      // 查询裁断计划数据
      request.post('/produce/batch/queryCaiDuanPrintByIds' , ids).then(res => {
        let result = res.data.data
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.printCaiDuanDataList = result
        })

      })

      console.log("打印时的easyPrint：", this.$refs.easyPrint)
      if (this.$refs.easyPrint) {
        console.log("设置前打印内容", this.$refs.easyPrint.tableData)

        this.$refs.easyPrint.tableData = this.printCaiDuanDataList
        console.log("设置后打印内容", this.$refs.easyPrint.tableData)
      }
      this.dialogVisiblePrint = true
    },
    preViewPrintZC(id) {
      // 查询针车计划数据
      request.get('/produce/batch/queryZhenChePrintById?id=' + id).then(res => {
        let result = res.data.data
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.printZhenCheDataList = result
        })

      })

      console.log("打印时的zhenChePrint：", this.$refs.zhenChePrint)
      if (this.$refs.zhenChePrint) {
        console.log("zhenChePrint设置前打印内容", this.$refs.zhenChePrint.tableData)

        this.$refs.zhenChePrint.tableData = this.printZhenCheDataList
        console.log("zhenChePrint设置后打印内容", this.$refs.zhenChePrint.tableData)
      }
      this.dialogVisiblePrintZhenChe = true
    },
    preViewPrint(id) {
      // 查询裁断计划数据
     request.get('/produce/batch/queryCaiDuanPrintById?id=' + id).then(res => {
        let result = res.data.data
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.printCaiDuanDataList = result
        })

      })

      console.log("打印时的easyPrint：", this.$refs.easyPrint)
      if (this.$refs.easyPrint) {
        console.log("设置前打印内容", this.$refs.easyPrint.tableData)

        this.$refs.easyPrint.tableData = this.printCaiDuanDataList
        console.log("设置后打印内容", this.$refs.easyPrint.tableData)
      }
      this.dialogVisiblePrint = true
    },

    gridDateFormatter(row, column, cellValue, index) {
      const daterc = row[column.property];
      if (daterc) {
        const dateMat = new Date(daterc);
        const Y = dateMat.getFullYear() + "-";
        const M = (dateMat.getMonth() + 1) < 10 ? '0' + (dateMat.getMonth() + 1) + "-" : (dateMat.getMonth() + 1) + "-";
        const D = dateMat.getDate() < 10 ? '0' + dateMat.getDate() + " " : dateMat.getDate() + " ";
        return Y + M + D;
      }
    },
    reDolayout(row){
      row.isOpenEdit = false
      this.$refs.multipleTable.doLayout()
    },
    escEditDelay(progress,row,index){
      if(progress.id ===null || progress.id===undefined){
        row.delays.splice(index,1);
      }else{
        progress.materialId = progress.oldMaterialId
        progress.materialName = progress.oldMaterialName
        progress.date = progress.oldDate

        this.reDolayout(progress)
      }

    }
    ,
    escZCEdit(progress,row,index){
      console.log("esc tuichu")
      if(progress.id ===null || progress.id===undefined){
        row.zcProgresses.splice(index,1);
      }else{
        progress.sendDate = progress.oldSendDate
        progress.outDate = progress.oldOutDate
        progress.zcGroupName = progress.oldZcGroupName
        progress.zcGroupId = progress.oldZcGroupId


        this.reDolayout(progress)
      }

    },
    escEdit(progress,row,index){
      console.log("escEdit-progress:,progress.id ===undefined",progress,progress.id ===undefined)
      if(progress.id ===null || progress.id===undefined){
        row.progresses.splice(index,1);
      }else{
        progress.costOfLabourTypeName = progress.oldCostOfLabourTypeName
        progress.typeId = progress.oldCostOfLabourTypeId
        progress.supplierName = progress.oldSupplierName;
        progress.supplierId = progress.oldSupplierId;
        progress.materialId = progress.oldMaterialId
        progress.materialName = progress.oldMaterialName
        progress.sendForeignProductDate = progress.oldSendForignProductDate
        progress.backForeignProductDate = progress.oldBackForignProductDate
        progress.outDate = progress.oldOutDate

        this.reDolayout(progress)
      }

    },
    enterEditDelay(item,row){
      console.log("提交item:,row:",item,row)
      if(item.materialId==='空值'){
        this.$message({
          message: '请选择正确的数据!',
          type: 'error'
        });
        return;
      }
      // 选择就修改供应商名称
      request.post('/produce/batchDelay/updateDelay',row.delays).then(res => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        });
        this.getList()
      })

    },
    enterZCEdit(item,row){
      // 选择就修改供应商名称
      request.post('/produce/batchZCProgress/updateProgress',row.zcProgresses).then(res => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        });
        this.getList()
      })


    },
    enterEdit(item,row){
      console.log("提交item:,row:",item,row)
      if(item.costOfLabourTypeId ==='空值'){
        this.$message({
          message: '工序部门有误!',
          type: 'error'
        });
        return;
      }
      if(item.materialId ===null && (item.materialName!==null && item.materialName!=='' )){
        this.$message({
          message: '物料ID为空,请用下拉框选择!!',
          type: 'error'
        });
        return;
      }
        // 选择就修改供应商名称
        request.post('/produce/batchProgress/updateProgress',row.progresses).then(res => {
          this.$message({
            message: '修改成功!',
            type: 'success'
          });
          this.getList()
        })


    },
    searchTypeNameDelaySelect(item,row) {
      row.costOfLabourTypeName = item.name
      row.costOfLabourTypeId = item.id
      this.$refs['el_auto_type_delay_'+row.produceBatchId].focus()
    },
    searchTypeNameSelect(item,row) {
      console.log("下拉框选中：item,row:",item,row)
      row.costOfLabourTypeName = item.name
      row.costOfLabourTypeId = item.id
      this.$refs['el_auto_type_'+row.produceBatchId].focus()
    },
    searchSupplierSelect(item,row,all) {
      console.log("下拉框选中：",item)
      row.supplierName = item.name
      row.supplierId = item.id

      // 选择就修改供应商名称
      request.post('/produce/batchProgress/updateProgress',all.progresses).then(res => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        });
        this.getList()
      })
    },

    searchZCGroupSelect(item,row,all) {
      console.log("下拉框选中：",item)
      row.zcGroupName = item.name
      row.zcGroupId = item.id

      // 选择就修改供应商名称
      request.post('/produce/batchZCProgress/updateProgress',all.zcProgresses).then(res => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        });
        this.getList()
      })
    },
    searchQueryMaterialSelect(item) {
      console.log("下拉框选中：",item)
      this.searchQueryMaterialName = item.name
    },
    searchMaterialSelect(item,row,all) {
      console.log("下拉框选中：",item)
      row.materialName = item.name
      row.materialId = item.id

      request.post('/produce/batchProgress/updateProgress',all.progresses).then(res => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        });
        this.getList()
      })
    },
    searchMaterialSelectDelay(item,row) {
      console.log("下拉框选中：",item)
      row.materialName = item.name
      row.materialId = item.id
      this.$refs['el_auto_m_delay_'+row.produceBatchId].focus()
    },
    searchZCSendDate(item,row,all) {
      console.log("日期下拉框选中：",item)
      row.sendDate = item

      request.post('/produce/batchZCProgress/updateProgress',all.zcProgresses).then(res => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        });
        this.getList()
      })
    },
    searchSendDate(item,row,all) {
      console.log("日期下拉框选中：",item)
      row.sendForeignProductDate = item

      request.post('/produce/batchProgress/updateProgress',all.progresses).then(res => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        });
        this.getList()
      })
    },
    searchBackDate(item,row,all) {
      console.log("日期下拉框选中：",item)
      row.backForeignProductDate = item

      request.post('/produce/batchProgress/updateProgress',all.progresses).then(res => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        });
        this.getList()
      })
    },
    searchZCOutDate(item,row,all) {
      console.log("日期下拉框选中：",item)
      row.outDate = item


      request.post('/produce/batchZCProgress/updateProgress',all.zcProgresses).then(res => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        });
        this.getList()
      })
    },
    searchOutDate(item,row,all) {
      console.log("日期下拉框选中：",item)
      row.outDate = item


      request.post('/produce/batchProgress/updateProgress',all.progresses).then(res => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        });
        this.getList()
      })
    },
    searchDate(item,row) {
      console.log("日期下拉框选中：",item)
      row.date = item
    },
    searchSelect(item) {
      this.searchStr = item.name
    },
    searchProgressSelect(item) {
      this.searchProgressSupStr = item.name
    },

    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
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
    // 导出列表数据- 服务端写出字节流到浏览器，进行保存
    downImportDemo() {

      request2.post('/produce/batch/down',null,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'生产序号模板.xlsx')
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
    cellClass({ row, column,rowIndex,columnIndex }) {

      if( (this.showProgress && !this.showDetailNum && columnIndex === 16 )
      || (this.showProgress && this.showDetailNum  && columnIndex === 30 ) ){
        // 1. 收回时间是空，并且当天>外发时间+2
        let progresses = row.progresses;

        if(progresses!=null && progresses!=undefined && progresses.length > 0){

          for (let i = 0; i < progresses.length; i++) {
            let progress = progresses[i];
            if(progress.id ===undefined){
              continue;
            }
            let backDate = progress.backForeignProductDate;
            let sendDate = progress.sendForeignProductDate;

            // console.log("row ,backDate:{},flag",rowIndex,backDate,backDate===null);

            if((backDate===null || backDate ==='' || backDate === undefined) && (sendDate!=null && sendDate !='' && sendDate!=undefined) ){

              let sendDateStr = sendDate.split(" ")[0];
              let yyMMddArr = sendDateStr.split("-");
              let sendDateTimeStamp = new Date(yyMMddArr[0],yyMMddArr[1]-1,yyMMddArr[2]).getTime();

              let nowDateTimeStamp = new Date().getTime()
              // console.log("cell:sendDate,sendDateType,new Date(),nowDateTimeStamp,",sendDate,sendDateTimeStamp,new Date(),nowDateTimeStamp)

              if((nowDateTimeStamp - sendDateTimeStamp) >= (24*60*60*1000 * 2)){
                return {padding:'0',"background-color": "#e6a23c" }
              }
            }
          }
        }
      }
      if( (this.showProgress && !this.showDetailNum && columnIndex === 17 )
      || (this.showProgress && this.showDetailNum  && columnIndex === 31 )){

        // 1. 出库时间是空，并且当天>批次号+5
        let progresses = row.progresses;

        let created = row.created;
        let createdStr = created.split("T")[0];
        let yyMMddArr = createdStr.split("-");
        let createdDate = new Date(yyMMddArr[0],yyMMddArr[1]-1,yyMMddArr[2]).getTime();
        let nowDateTimeStamp = new Date().getTime()

        if(progresses==null || progresses.length==0){
          // console.log("row,cell,progresses is null..cell:created,createdDate,new Date(),nowDateTimeStamp,",rowIndex,columnIndex,created,createdDate,new Date(),nowDateTimeStamp)
          if((nowDateTimeStamp - createdDate) >= (24*60*60*1000 * 4)){
            return {padding:'0',"background-color": "red" }
          }
        }
        let batchIdWithOutDate = [];
        if(progresses!=null && progresses!=undefined && progresses.length > 0){

          for (let i = 0; i < progresses.length; i++) {
            let progress = progresses[i];
            if(progress.id ===undefined){
              continue;
            }
            let outDate = progress.outDate;
            let created = row.created;
            let batchIdStrTemp = progress.batchIdStr.split("-")[0];

            // console.log("row ,rowIndex,columnIndex,outDate:{},flag,created:{},progress",row,rowIndex,columnIndex,outDate,outDate===null,created,progress);

            if((outDate===null || outDate ==='' || outDate === undefined) ){

              console.log("rowIndex,column,cell:created,createdDate,new Date(),nowDateTimeStamp,",rowIndex,columnIndex,progress.batchIdStr,created,createdDate,new Date(),nowDateTimeStamp)

              if((nowDateTimeStamp - createdDate) >= (24*60*60*1000 * 5)){
                batchIdWithOutDate.push(batchIdStrTemp);
              }
            }
          }
          console.log("batchIdStr,batchIdWithOutDate size,progressSize",batchIdWithOutDate.length,progresses.length)
          // 预警有，但是个数要等于进度表长度（只有一个）才能生效
          if(batchIdWithOutDate.length > 0 && (batchIdWithOutDate.length===progresses.length)){
            return {padding:'0',"background-color": "red" }
          }

        }
      }

      return {padding:'0',borderColor:'black'}


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


    // 设置每一行的seqNum = 游标+1
    rowClassName({row, rowIndex}) {
      row.seqNum = rowIndex + 1;
    },
    saveNew() {
      this.addOrUpdate = 'save'
      this.editForm = {
        id: '',
        batchId:'',
        orderNum:'',
      }
      this.dialogCalNumVisible = true
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

      // 等于true的时候，shift 多选，则不清空老的数组，
      if(this.pin){
        val.forEach(theId => {
          if(!this.multipleSelection.some(item=>item==theId.id)){
            this.multipleSelection.push(theId.id)
          }
        })
        console.log("shift 多选框 选中的 ", this.multipleSelection)
        return;
      }else{
        console.log("多选框 val ", val)
        this.multipleSelection = []

        val.forEach(theId => {
          if(!this.multipleSelection.some(item=>item==theId.id)){
            this.multipleSelection.push(theId.id)
          }
        })
        console.log("多选框 选中的 ", this.multipleSelection)
      }

    },
    // 表单提交
    submitForm(formName, methodName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {
          const load = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          request.post('/produce/batch/'+methodName, this.editForm).then(res => {
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
            this.getList()
            this.dialogCalNumVisible=false;
          }).catch(()=>{
            load.close()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    searchQuery(){
      this.getQueryList()
    },

    search(){
      this.currentPage = 1
      this.getList()
    },
    getZCQueryList() {
      let url = '/produce/batch/zcProgressList'
      request.post(url,{searchQueryStartDateStr:this.searchQueryStartDateStr},null
      ).then(res => {
        this.tableZCQueryData = res.data.data['progressData']

        let batchIdSet = new Set();
        let productNumSet = new Set();
        let productBrandSet = new Set();
        let endDateSet = new Set();
        let groupNameSet = new Set();
        let sendDateSet = new Set();
        let outDateSet = new Set();

        this.tableZCQueryData.forEach((item, index) => {// 遍历索引,赋值给data数据
          item.index = index;
          batchIdSet.add(item.batchId);
          productNumSet.add(item.productNum);
          productBrandSet.add(item.productBrand);
          endDateSet.add(item.endDate);
          groupNameSet.add(item.groupName);
          sendDateSet.add(item.sendDate);
          outDateSet.add(item.outDate);

        })

        let tmpSortArr = Array.from(batchIdSet).sort(this.$globalFun.numSeq);
        this.batchIdFileterArr = [];
        tmpSortArr.forEach(row =>{
          this.batchIdFileterArr.push({'text':row,'value':row})

        })
        this.productNumFileterArr = [];
        productNumSet.forEach(row =>{
          this.productNumFileterArr.push({'text':row,'value':row})
        })

        this.productBrandFileterArr = [];
        productBrandSet.forEach(row =>{
          this.productBrandFileterArr.push({'text':row,'value':row})
        })


        let tmpSortArrEndDate = Array.from(endDateSet).sort(this.$globalFun.numSeq);
        this.endDateFileterArr = [];
        tmpSortArrEndDate.forEach(row =>{
          this.endDateFileterArr.push({'text':row,'value':row})
        })

        this.groupNameFileterArr = [];
        groupNameSet.forEach(row =>{
          this.groupNameFileterArr.push({'text':row,'value':row})
        })
        let tmpSortArrSendDate = Array.from(sendDateSet).sort(this.$globalFun.numSeq);

        this.sendDateFileterArr = [];
        tmpSortArrSendDate.forEach(row =>{
          this.sendDateFileterArr.push({'text':row,'value':row})
        })

        let tmpSortArrOutDate = Array.from(outDateSet).sort(this.$globalFun.numSeq);

        this.outDateFileterArr = [];
        tmpSortArrOutDate.forEach(row =>{
          this.outDateFileterArr.push({'text':row,'value':row})
        })
        this.$nextTick(() => {
          this.$refs['multipleZCQueryTable'].doLayout();
        })
      }).catch(error=>{
        console.log("error:",error)
      })
    },
    getQueryList() {
      let url = '/produce/batch/progressList?showSendNoBack='+this.showSendNoBack+'&&showHasEndDate='+this.showHasEndDate
      request.post(url,{searchQueryStartDateStr:this.searchQueryStartDateStr
      ,searchQueryOutDateStr:this.searchQueryOutDateStr,supplierName:this.searchProgressSupStr},null
      ).then(res => {
        this.tableQueryData = res.data.data['progressData']
        this.tableDelayData = res.data.data['delayData']
        this.totalBatchId = res.data.data['totalBatchId']
        this.allTotalNum = res.data.data['allTotalNum']
        this.getSpanArrProgress(this.tableQueryData)

        this.$nextTick(() => {
          this.$refs['multipleQueryTable'].doLayout();
        })
      }).catch(error=>{
        console.log("error:",error)
      })
    },
    // 查询价目表单列表数据
    getList() {
      this.tableLoad = true;

      let url = '/produce/batch/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&searchField="+this.select
      request.post(url,
          {'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},
          null).then(res => {
          this.tableData = res.data.data.records

        this.tableData.forEach((item, index) => {// 遍历索引,赋值给data数据
          item.index = index;
          if(item.progresses!=null && item.progresses!=undefined){
            item.progresses.forEach((progress,index)=>{
              progress.isOpenEdit = false
            })
          }

        })
        this.getSpanArr(this.tableData)

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
    // 编辑页面
    edit(id) {
      this.addOrUpdate = "update"
      request.get('/produce/batch/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.dialogCalNumVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
        })

      })
    },
    delDelay(item) {
      console.log("del obj:",item)
      request.post('/produce/batchDelay/del', item.id).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getList()

      })
    },
    delProgress(item) {
      console.log("del obj:",item)
      request.post('/produce/batchProgress/del', item.id).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getList()

      })
    },
    delZCProgress(item) {
      console.log("del obj:",item)
      request.post('/produce/batchZCProgress/del', item.id).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getList()

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
      request.post('/produce/batch/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getList()
        console.log("删除后重新加载页面")

      })
    },

    // 状态待审核
    statusPass(id) {
      request.post('/produce/batch/valid?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.post('/produce/batch/reValid?id=' + id).then(res => {
        this.$message({
          message: '反审核完成!',
          type: 'success'
        });
        this.getList()
      })
    },
    handleCloseQuery(done) {
      this.dialogQueryVisible=false;
      this.tableDelayData = ''
      this.tableQueryData = ''
      this.totalBatchId = ''
      this.allTotalNum = ''
      this.searchProgressSupStr=''
    },
    handleZCCloseQuery(done) {
      this.dialogZCQueryVisible=false;
      this.tableZCQueryData = []
      this.totalBatchId = ''
    },
    handleClosePrepare(done) {
      this.dialogCalNumVisible=false;
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
    this.loadCostOfLabourTypeAll()
    this.loadSupplierAll()
    this.loadMaterialAll()

  }// 自定义指令，，insert在DOM加入的时候才生效
  ,
  mounted() {
    // shift 按住
    window.addEventListener('keydown',code=>{
      console.log("shift按住：")
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

  },
  directives: {
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