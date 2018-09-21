<template>
  <div class="rzl_fc_darkgray">
    <div class="top-header">
      <ITop></ITop>
      <IHeader></IHeader>
    </div>
    <div class="rzl-contarner top-label " v-show="topLabel.length > 0">
      <span class="font14 rzl_fc_darkgray">{{topLabel}}</span>
    </div>
    <div class="tab-content rzl-contarner rzl_bc_undercoat">
      <ul class="tab-config" v-if="tabList.length >0">
        <li v-for="(tabItem, index) in tabList" :key="index" class="font18"
          :class="{active: tabItem.isSelected, rzl_bc_white: tabItem.isSelected}"
          @click="tabChange(tabItem.type)">{{tabItem.value}}</li>
      </ul>
    </div>
    <router-view></router-view>
    <IFooter></IFooter>
  </div>
</template>
<script>
  import ITop from '@/components/common/Top';
  import IHeader from '@/components/common/Header';
  import ITabConfig from '@/components/common/TabConfig';
  import IFooter from '@/components/common/Footer';

  export default {
    name: 'i-monitorView',
    components: {
      ITop,
      IHeader,
      ITabConfig,
      IFooter
    },
    data() {
      return {
        tabList: [],
        // top-label
        topLabel: '苏州民生网全网监测',
      }
    },
    methods: {
      // tab项切换
      tabChange (type) {
        let tabList = this.tabList;
        tabList.forEach(item =>{
          item.isSelected = false;
          if( item.type == type){
            item.isSelected = true;
          }
        });
        this.tabList = tabList;
        if(type == 'monitorresults'){
          this.$router.push('/center/monitorresults');
        }else if(type == 'monitoranalysis'){
          this.$router.push('/center/monitoranalysis');
        }else if(type =='warninglist'){
          this.$router.push('/center/warninglist');
        }else if(type == 'config'){
          this.$router.push('/center/config');
        }
      }
    },
    created () {
      let tabList = [
        {value: '监测结果', isSelected: false, type: 'monitorresults'},
        {value: '舆情分析', isSelected: false, type: 'monitoranalysis'},
        {value: '预警列表', isSelected: false, type: 'warninglist'},
        {value: '方案配置', isSelected: false, type: 'config' }
      ];

      console.log(this.$route);
      var pathName = this.$route.name;
      let topLabel = this.$route.query.topLabel;
      tabList.forEach(item => {
        if(item.type == pathName){
          item.isSelected = true;
        }
      })
      this.tabList = tabList;
    },
  }
</script>
<style scoped>
.top-label{
  width: 100%;
  height: 30px;
  background: #FFFFFF;
  box-shadow: 0 1px 4px 0 #CDCDCD;
  margin-bottom: 4px;
}
.top-label span{
  display: inline-block;
  line-height: 30px;
}
.tab-content{
  padding-top: 20px;
}
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
