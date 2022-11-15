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
            <el-button size="mini" icon="el-icon-search" type="success"  @click="search()" >搜索</el-button>
          </el-form-item>

        </el-form>
      </el-main>
    </el-container>

    <div  id="line" style="height: 600px; width: 1000px;" v-if="hasAuth('dataAnalysis:material:onlyList')">

    </div>

    <el-divider  v-if="hasAuth('dataAnalysis:material:onlyList')"></el-divider>

    <div  id="line2" style="height: 600px; width: 1300px;"  v-if="hasAuth('dataAnalysis:material:onlyList')">

    </div>

    <el-divider  v-if="hasAuth('dataAnalysis:material:onlyList')"></el-divider>

    <div  id="line3" style="height: 600px; width: 1300px;"  v-if="hasAuth('dataAnalysis:material:onlyList')">

    </div>
    <el-divider  v-if="hasAuth('dataAnalysis:material:onlyList')"></el-divider>

    <div  id="line4" style="height: 600px; width: 1300px;"  v-if="hasAuth('dataAnalysis:material:onlyList')">

    </div>

    <el-divider></el-divider>

    <div  id="line5" style="height: 600px; width: 1300px;">

    </div>

  </div>


</template>

<script>

import {request} from "@/axios";

export default {
  name: "daMaterialEchart",
  data(){
    return{
      // 1. 车间进度表
      dataMap:{},

      materialNamesLists:['供应商1','供应商2'], // 动态获取(同下标对应同个供应商数据)
      orderNumbers:[1,100],// 动态获取(同下标对应同个供应商数据)
      netInNums:[2,200],
      complementNums:[3,300],// 动态获取(同下标对应同个供应商数据)

      select: 'all', // 搜索默认值
      options: [
      ],

      select2: 'all', // 搜索默认值
      options2: [
      ],

      data:{
      },
      materialPercentDatas:{},
      productNumBrandMaterialWinPercentDatas:{},
      productNumBrandMaterialLosePercentDatas:{},

      searchStartDate: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 180).format("yyyy-MM-dd"),
      searchEndDate: new Date().format("yyyy-MM-dd"),
    }
  },
  methods: {
    dataFormatter(obj){
      var pList = this.materialNamesLists;
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
    async getData5(){

      await  request.get('/analysis/getSTXMaterial?'+"searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate).then(res => {
        if(res.data.data != null){
          let dataTemp = res.data.data;
          this.materialNamesLists = dataTemp.materialNamesLists;
          this.orderNumbers = dataTemp.orderNumbers;
          this.netInNums = dataTemp.netInNums;
          this.complementNums = dataTemp.complementNums;

          console.log("dataTemp",dataTemp)

          this.dataMap.dataOrderNumbers = this.dataFormatter({
            all: this.orderNumbers,
          });
          this.dataMap.dataNetInNums = this.dataFormatter({
            all: this.netInNums,
          });
          this.dataMap.dataComplementNums = this.dataFormatter({
            //max : 25000,
            all: this.complementNums,
          });

          this.drawLine5();
        }
      })
    },
    drawLine5() {
      console.log("开始绘制")
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("line5"));
      // 指定图表的配置项和数据
      let option = {
        baseOption: {
          dataZoom: [
            {
              type: 'inside'
            },
            {
              type: 'slider'
            }
          ],
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
            subtext: '统计数据'
          },
          tooltip: {},
          legend: {
            left: 'right',
            data: ['应备数量', '净入库数量','补数数量'],
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
              data: this.materialNamesLists,
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
            { name: '应备数量', type: 'bar' },
            { name: '净入库数量', type: 'bar' },
            { name: '补数数量', type: 'bar' },
          ]
        },

        options: [
          {
            title: {text: '沙滩鞋饰扣'},
            series: [
              {data: this.dataMap.dataOrderNumbers['all']},
              {data: this.dataMap.dataNetInNums['all']},
              {data: this.dataMap.dataComplementNums['all']},
            ]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

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
    search(){
      this.getData();
      this.getData5();
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

      await  request.get('/analysis/productNumBrandMaterialWinPercent?'+"searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate).then(res => {
        if(res.data.data != null){
          this.productNumBrandMaterialWinPercentDatas = res.data.data;
          this.drawLine3();
        }
      })

      await  request.get('/analysis/productNumBrandMaterialLosePercent?'+"searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate).then(res => {
        if(res.data.data != null){
          this.productNumBrandMaterialLosePercentDatas = res.data.data;
          this.drawLine4();
        }
      })

    },
    drawLine4() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("line4"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: '品牌款式皮尺亏损排行榜',
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
          data: this.productNumBrandMaterialLosePercentDatas.legendData
        },
        series: [
          {
            name: '品牌-款式',
            type: 'pie',
            radius: '75%',
            center: ['40%', '50%'],
            data: this.productNumBrandMaterialLosePercentDatas.seriesData,
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
    drawLine3() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("line3"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: '品牌款式皮尺盈利排行榜',
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
          data: this.productNumBrandMaterialWinPercentDatas.legendData
        },
        series: [
          {
            name: '品牌-款式',
            type: 'pie',
            radius: '75%',
            center: ['40%', '50%'],
            data: this.productNumBrandMaterialWinPercentDatas.seriesData,
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
    this.drawLine3();
    this.drawLine4();
    this.drawLine5()
  },created() {
    this.getData()
    this.getData5()
    this.getAllSupplierGroup();
    this.getAllMaterialGroup();

  }
}
</script>

<style scoped>

</style>