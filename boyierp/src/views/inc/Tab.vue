<template>
  <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="selectTab">
    <el-tab-pane
        v-for="(item, index) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
    >
    </el-tab-pane>

  </el-tabs>
</template>

<script>
export default {
  name: "Tab",
  data() {
    return {

    }
  },
  computed:{
    editableTabs:{
        get(){
          return this.$store.state.tab.editableTabs
        },
        set(val){
          this.$store.state.tab.editableTabs =val
        }
    },
    editableTabsValue:{
      get(){
        return this.$store.state.tab.editableTabsValue
      },
      set(val){
        this.$store.state.tab.editableTabsValue =val
      }
    }
  }
  ,
  methods: {
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if(targetName === 'Index'){
        return
      }
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      this.$router.push({name:activeName})

    },
    // 选择tab 页，跳转页面
    selectTab(param){
      console.log("当前tab 被选中，激活跳转页面",param)
      this.$router.push({name:param.name})
    }

  }
}
</script>

<style scoped>

</style>