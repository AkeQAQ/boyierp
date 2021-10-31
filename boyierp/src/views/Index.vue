<template>
  <div>
    <test-echart></test-echart>

  </div>
</template>

<script>
import testEchart from "@/views/common/testEchart";

export default {
  name: "Index",
  created() {
    console.log("这是首页")
  },
  components:{
    testEchart
  }
}
</script>

<style scoped>

</style>