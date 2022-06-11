<template>
  <div>
    <el-container id="buyIn">
      <el-main class="elMain_my" style="padding-top: 0;padding-right: 0px">
        <el-form :inline="true" class="demo-form-inline elForm_my" >
          <el-form-item>
            <el-select size="mini" style="width: 150px" v-model="select"   >
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
            <el-select size="mini" style="width: 150px" v-model="select2"  >
              <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

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

          <el-form-item>
            <el-button size="mini" icon="el-icon-search" type="success"  @click="getData()" >搜索</el-button>
          </el-form-item>

        </el-form>
      </el-main>
    </el-container>

    <div  id="line" style="height: 600px; width: 1000px;">

    </div>

    <el-divider></el-divider>

    <div  id="line2" style="height: 600px; width: 1300px;">

    </div>

    <el-divider></el-divider>


  </div>


</template>

<script>

import {request} from "@/axios";

export default {
  name: "daMaterialEchart",
  data(){
    return{
      select: 'all', // 搜索默认值
      options: [
      ],

      select2: 'all', // 搜索默认值
      options2: [
      ],

      data:{
      },
      materialPercentDatas:{},

      searchStartDate: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 180).format("yyyy-MM-dd"),
      searchEndDate: new Date().format("yyyy-MM-dd"),
    }
  },
  methods: {
    getAllMaterialGroup(){
      request.post('/baseData/materialGroup/listValide').then(res => {
        if(res.data.data != null){
          let returnLists = res.data.data[0].children;
          this.options2 =[
            {value: 'all', label: '全部物料类别'}
          ]
          for (let i = 0; i < returnLists.length ; i++) {
            let returnList = returnLists[i];
            this.options2.push({value:returnList.code,label:returnList.label})

            if(returnList.children!=null){
              let subChild = returnList.children;
              for (let i = 0; i < subChild.length ; i++) {
                this.options2.push({value:subChild[i].code,label:subChild[i].label})
              }
            }

          }
        }
      })
    },
    getAllSupplierGroup(){
      request.post('/baseData/supplierGroup/listValide').then(res => {
        if(res.data.data != null){
          let returnLists = res.data.data[0].children;
          this.options =[
            {value: 'all', label: '全部供应商类别'}
          ]
          for (let i = 0; i < returnLists.length ; i++) {
            let returnList = returnLists[i];
            this.options.push({value:returnList.code,label:returnList.label})

            if(returnList.children!=null){
              let subChild = returnList.children;
              for (let i = 0; i < subChild.length ; i++) {
                this.options.push({value:subChild[i].code,label:subChild[i].label})
              }
            }

          }
        }
      })
    },
    async getData(){
      await  request.get('/analysis/materialSupplierAmountPercent?'+"searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+"&&searchField="+this.select).then(res => {
        if(res.data.data != null){
          this.data = res.data.data;
          this.drawLine();
        }
      })

      await  request.get('/analysis/materialAmountPercent?'+"searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+"&&searchField="+this.select2).then(res => {
        if(res.data.data != null){
          this.materialPercentDatas = res.data.data;
          this.drawLine2();
        }
      })

    },

    drawLine2() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("line2"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: '物料金额排行榜',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: this.materialPercentDatas.legendData
        },
        series: [
          {
            name: '物料',
            type: 'pie',
            radius: '75%',
            center: ['40%', '50%'],
            data: this.materialPercentDatas.seriesData,
            label: {
              normal: {
                show: true, // 隐藏引导线
              },
            },
            labelLine: {
              normal: {
                show: true// 隐藏引导线
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };;
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    drawLine() {
      console.log("开始绘制")
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("line"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: '供应商金额排行榜',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: this.data.legendData
        },
        series: [
          {
            name: '供应商',
            type: 'pie',
            radius: '75%',
            center: ['40%', '50%'],
            data: this.data.seriesData,
            label: {
              normal: {
                show: true, // 隐藏引导线
              },
            },
            labelLine: {
              normal: {
                show: true// 隐藏引导线
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };;
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

  },
  mounted() {
    this.drawLine();
    this.drawLine2();
  },created() {
    this.getData()
    this.getAllSupplierGroup();
    this.getAllMaterialGroup();

  }
}
</script>

<style scoped>

</style>