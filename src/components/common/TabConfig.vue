<template>
  <ul class="tab-config" v-if="tabList.length >0">
    <li v-for="(tabItem, index) in tabList" :key="index" class="font18" 
      :class="{active: tabItem.isSelected, rzl_bc_white: tabItem.isSelected}"
      @click="tabChange(tabItem.type)">{{tabItem.value}}</li>
  </ul>
</template>
<script>
export default {
  name: 'i-tabconfig',
  props: {
    tabType: {type: String/Number, require: true}
  },
  data () {
    return {
      tabList: []
    }
  },
  methods: {
    // tab项切换
    tabChange (type) {
      
    }
  },
  created() {
    let tabList = [
      {value: '监测结果', isSelected: false, type: '1'},
      {value: '舆情分析', isSelected: false, type: '2'},
      {value: '预警列表', isSelected: false, type: '3'},
      {value: '方案配置', isSelected: false, type: '4' }
    ];
    tabList.forEach(item =>{
      if( item.type == this.tabType){
        item.isSelected = true;
      }
    });
    this.tabList = tabList;
  },
}
</script>
<style scoped>
.tab-config{
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: flex-start;
}
.tab-config li{
  min-width: 126px;
  height: 100%;
  line-height: 36px;
  text-align: center;
  font-weight: 700;
  cursor: pointer;
}
.tab-config li.active{
  border-radius: 10px 10px 0 0;
}
</style>