<template>
  <div>
    <test-echart></test-echart>

<!--    <material-dead-line-view></material-dead-line-view>-->

  </div>
</template>

<script>
import testEchart from "@/views/common/testEchart";
import materialDeadLineView from "@/views/dataAnalysis/MaterialDeadLineView"

export default {
  name: "Index",
  created() {
    console.log("这是首页")
  },
  components:{
    testEchart,
    materialDeadLineView
  }
}
</script>

<style scoped>

</style>