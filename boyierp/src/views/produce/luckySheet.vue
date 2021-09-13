<template>
  <div id="luckysheet" style="margin:0px;padding:0px;position:absolute;width:70%;height:70%;left:0px;top:30px;"></div>


</template>

<script>
export default {
  name: "ls",
  methods:{
    init(){
      var options = {
        container:'luckysheet',
        titile:'1',
        lang:'zh'
      }
      luckysheet.create(options);

      console.log("luckysheet",luckysheet )
    }

  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>

</style>