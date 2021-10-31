<template>
  <div  id="line" style="height: 600px; width: 1300px;"></div>
</template>

<script>

import {request} from "@/axios";

export default {
  name: "testEchart",
  data(){
    return{
      data:{/*"legendData":['2','1']
        ,"seriesData":[{"name":"1","value":1},{"name":"2","value":2}]*/}
    }
  },
  methods: {
    async getData(){
      await  request.get('/analysis/requestCast').then(res => {
        if(res.data.data != null){
          this.data = res.data.data;
          this.drawLine();
        }
      })
      console.log("请求完毕data:",this.data)
    },
    drawLine() {
      // this.getData();
      console.log("开始绘制")
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("line"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: '请求方法耗时均值',
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
            name: '方法',
            type: 'pie',
            radius: '75%',
            center: ['30%', '50%'],
            data: this.data.seriesData,
            label: {
              normal: {
                show: false, // 隐藏引导线
              },
            },
            labelLine: {
              normal: {
                show: false// 隐藏引导线
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
  },created() {
      this.getData()
  }
}
</script>

<style scoped>

</style>