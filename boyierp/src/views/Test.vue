<template>
  <div>
    <button @click="printDemo">测试打印</button>
    <vue-easy-print tableShow ref="easyPrint" >
      <template slot-scope="func">
        <demo :getChineseNumber="func.getChineseNumber"></demo>
      </template>
    </vue-easy-print>
  </div>
</template>

<script>
//1. 首先安装，npm install vue-easy-print --save
import vueEasyPrint from "vue-easy-print";
import demo from "./printModule/print"
export default {
  methods: {
    printDemo(){
      this.$refs.easyPrint.print()
    }
  },
  components: {
    vueEasyPrint,
    demo
  }
};
</script>

<style scoped>
</style>