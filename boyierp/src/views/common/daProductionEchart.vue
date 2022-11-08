<template>
  <div>
    <el-container id="buyIn">
      <el-main class="elMain_my" style="padding-top: 0;padding-right: 0px">
        <el-form :inline="true" class="demo-form-inline elForm_my" >
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
            <el-button size="mini" icon="el-icon-search" type="success"  @click="getData" >搜索</el-button>
          </el-form-item>

        </el-form>
      </el-main>
    </el-container>

    <div  id="line" style="height: 600px; width: 1000px;">

    </div>
  </div>


</template>

<script>

import {request} from "@/axios";

export default {
  name: "daProductionEchart",
  data(){
    return{
      dataMap:{},
      calType:['总产量','平均耗时(天)','超期次数','超期百分比'],

      supplierNames:['供应商1','供应商2'], // 动态获取(同下标对应同个供应商数据)
      supplierTotalNums:[1,100],// 动态获取(同下标对应同个供应商数据)
      supplierTotalCounts:[2,200],
      supplierOverCounts:[3,300],// 动态获取(同下标对应同个供应商数据)
      supplierOverPercents:[4,400],// 动态获取(同下标对应同个供应商数据)
      supplierAvgCost:[5,500],// 动态获取(同下标对应同个供应商数据),
      supplierAllSendPercents:[],

      searchStartDate: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 180).format("yyyy-MM-dd"),
      searchEndDate: new Date().format("yyyy-MM-dd"),
    }
  },
  methods: {
    dataFormatter(obj){
      var pList = this.supplierNames;
      var temp;
      temp = obj['all'];
      var max = 0;
      var sum = 0;
      for (var i = 0, l = temp.length; i < l; i++) {
        max = Math.max(max, temp[i]);
        sum += temp[i];
        obj['all'][i] = {
          name: pList[i],
          value: temp[i]
        };
      }
      obj['all' + 'max'] = Math.floor(max / 100) * 100;
      obj['all' + 'sum'] = sum;
      return obj;
    },
    async getData(){

      await  request.get('/analysis/getProductionProgressDataWithCaiduan?'+"searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate).then(res => {
        if(res.data.data != null){
          let dataTemp = res.data.data;
          this.supplierNames = dataTemp.supplierLists;
          this.supplierTotalNums = dataTemp.supplierTotalNums;
          this.supplierTotalCounts = dataTemp.supplierTotalCounts;
          this.supplierOverCounts = dataTemp.supplierOverCounts;
          this.supplierOverPercents = dataTemp.supplierOverPercents;
          this.supplierAvgCost = dataTemp.supplierAvgCost;
          this.supplierAllSendPercents = dataTemp.supplierAllSendPercents;

          console.log("dataTemp",dataTemp)

          // 平均耗时(天)数据
          this.dataMap.dataAvgCost = this.dataFormatter({
            all: this.supplierAvgCost,
          });
          // 总产量
          this.dataMap.dataTotalNum = this.dataFormatter({
            all: this.supplierTotalNums,
          });
          // 总次数
          this.dataMap.dataTotalCount = this.dataFormatter({
            all: this.supplierTotalCounts,
          });
          // 总次数百分比
          this.dataMap.dataAllSendPercent = this.dataFormatter({
            all: this.supplierAllSendPercents,
          });
          // 超期次数
          this.dataMap.dataOverCount = this.dataFormatter({
            //max : 25000,
            all: this.supplierOverCounts,
          });
          // 超期百分比
          this.dataMap.dataOverPercent = this.dataFormatter({
            //max : 3600,
            all: this.supplierOverPercents,
          });

          this.drawLine();
        }
      })
    },
    drawLine() {
      console.log("开始绘制")
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("line"));
      // 指定图表的配置项和数据
      let option = {
        baseOption: {
          timeline: {
            show:false,
            axisType: 'category',
            autoPlay: false,
            playInterval: 1000,
            data: [],
            label: {
              formatter: function (s) {
                return new Date(s).getFullYear();
              }
            }
          },
          title: {
            subtext: '裁断外加工信息'
          },
          tooltip: {},
          legend: {
            left: 'right',
            data: ['总产量', '总次数','总次数占比',  '超期次数','超期百分比', '平均耗时(天)'],
            selected: {
              // 超期次数: false,
            }
          },
          calculable: true,
          grid: {
            top: 80,
            bottom: 100,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                label: {
                  show: true,
                  formatter: function (params) {
                    return params.value.replace('\n', '');
                  }
                }
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              axisLabel: { interval: 0 },
              data: this.supplierNames,
              splitLine: { show: false }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '数值'
            }
          ],
          series: [
            { name: '总产量', type: 'bar' },
            { name: '总次数', type: 'bar' },
            { name: '总次数占比', type: 'bar' },
            { name: '超期次数', type: 'bar' },
            { name: '超期百分比', type: 'bar' },
            { name: '平均耗时(天)', type: 'bar' },
          ]
        },
        options: [
          {
            title: {text: '车间分析'},
            series: [
              {data: this.dataMap.dataTotalNum['all']},
              {data: this.dataMap.dataTotalCount['all']},
              {data: this.dataMap.dataAllSendPercent['all']},
              {data: this.dataMap.dataOverCount['all']},
              {data: this.dataMap.dataOverPercent['all']},
              {data: this.dataMap.dataAvgCost['all']},
            ]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

  },
  mounted() {
    this.drawLine();
  },created() {
    this.getData()

  }
}
</script>

<style scoped>

</style>