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
            <el-button size="mini" icon="el-icon-search" type="success"  @click="getData()" >搜索</el-button>
          </el-form-item>

        </el-form>
      </el-main>
    </el-container>

    <div  id="line" style="height: 600px; width: 1000px;">

    </div>

    <el-divider></el-divider>

    <div  id="line2" style="height: 600px; width: 1000px;">

    </div>

    <el-divider></el-divider>


    <div  id="line3" style="height: 600px; width: 1000px;">

    </div>


    <el-divider></el-divider>


    <div  id="line4" style="height: 600px; width: 1000px;">

    </div>


    <div  id="line5" style="height: 600px; width: 1000px;">

    </div>


  </div>


</template>

<script>

import {request} from "@/axios";

export default {
  name: "daProductOrderEchart",
  data(){
    return{
      dataMap:{},

      productBrandLists:['品牌1','品牌2'], // 动态获取(同下标对应同个供应商数据)
      productOrders:[1,100],// 动态获取(同下标对应同个供应商数据)
      productReturnOrders:[2,200],
      productOrderTypeRate:[3,300],// 动态获取(同下标对应同个供应商数据)
      
      data:{/*"legendData":['2','1']
        ,"seriesData":[{"name":"1","value":1},{"name":"2","value":2}]*/
      },
      productOrderDailyDatas:[],
      productBrandPercentDatas:{},
      productOrderMostProductNumDatas:[],

      searchStartDate: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 180).format("yyyy-MM-dd"),
      searchEndDate: new Date().format("yyyy-MM-dd"),
    }
  },
  methods: {
    dataFormatter(obj){
      var pList = this.productBrandLists;
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
      await  request.get('/analysis/productOrder?'+"searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate).then(res => {
        if(res.data.data != null){
          this.data = res.data.data;
          this.drawLine();
        }
      })

      await  request.get('/analysis/productOrderDailyNum?'+"searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate).then(res => {
        if(res.data.data != null){
          this.productOrderDailyDatas = res.data.data;
          this.drawLine2();
        }
      })

      await  request.get('/analysis/productOrderByProductBrandPercent?'+"searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate).then(res => {
        if(res.data.data != null){
          this.productBrandPercentDatas = res.data.data;
          this.drawLine3();
        }
      })

      await  request.get('/analysis/productOrderByMostProductNumPercent?'+"searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate).then(res => {
        if(res.data.data != null){
          this.productOrderMostProductNumDatas = res.data.data;
          this.drawLine4();
        }
      })

      await  request.get('/analysis/productOrderByOrderType?'+"searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate).then(res => {
        if(res.data.data != null){
          let dataTemp = res.data.data;
          this.productBrandLists = dataTemp.productBrandLists;
          this.productOrders = dataTemp.productOrders;
          this.productReturnOrders = dataTemp.productReturnOrders;
          this.productOrderTypeRate = dataTemp.productOrderTypeRate;

          console.log("dataTemp",dataTemp)

          this.dataMap.dataProductOrders = this.dataFormatter({
            all: this.productOrders,
          });
          this.dataMap.dataProductReturnOrders = this.dataFormatter({
            all: this.productReturnOrders,
          });
          this.dataMap.dataProductOrderTypeRate = this.dataFormatter({
            //max : 25000,
            all: this.productOrderTypeRate,
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
            data: ['订单数量', '回单数量','回单比例'],
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
              data: this.productBrandLists,
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
            { name: '订单数量', type: 'bar' },
            { name: '回单数量', type: 'bar' },
            { name: '回单比例', type: 'bar' },
          ]
        },

        options: [
          {
            title: {text: '订单、回单、回单比例'},
            series: [
              {data: this.dataMap.dataProductOrders['all']},
              {data: this.dataMap.dataProductReturnOrders['all']},
              {data: this.dataMap.dataProductOrderTypeRate['all']},
            ]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

    drawLine4() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("line4"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: '吸引品牌的款式排行榜',
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
          data: this.productOrderMostProductNumDatas.legendData
        },
        series: [
          {
            name: '品牌种类',
            type: 'pie',
            radius: '75%',
            center: ['40%', '50%'],
            data: this.productOrderMostProductNumDatas.seriesData,
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
          text: '品牌下单排行榜',
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
          data: this.productBrandPercentDatas.legendData
        },
        series: [
          {
            name: '品牌',
            type: 'pie',
            radius: '75%',
            center: ['40%', '50%'],
            data: this.productBrandPercentDatas.seriesData,
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
          text: '款式最火排行榜',
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
            name: '公司货号',
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

    drawLine2() {
      console.log("开始绘制")
      let myChart = this.$echarts.init(document.getElementById("line2"));
       // let data = [['2022-06-09',1],['2022-06-10',2]]
      // 指定图表的配置项和数据
      let option = {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        title: {
          left: 'center',
          text: '每日订单折线图'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          max:'dataMax',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 20
          },
          {
            start: 0,
            end: 20
          }
        ],
        series: [
          {
            name: '订单数量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {},
            data: this.productOrderDailyDatas
          }
        ]
      };

      option && myChart.setOption(option);
    },
  },
  mounted() {
    this.drawLine();
    this.drawLine2();
    this.drawLine3();
  },created() {
      this.getData()
  }
}
</script>

<style scoped>

</style>