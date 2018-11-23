<template>
  <div class="rzl_fc_darkgray rzl_wrapper">
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
          @click="tabChange(tabItem.type)"><span>{{tabItem.value}}</span></li>
      </ul>
    </div>
    <router-view class="rzl-contarner rzl_bc_undercoat"></router-view>
    <div v-show="show" @click="returnToTopFn" class="f-db backTop">
      <img src="../../assets/up.png"/>
    </div>
    <IFooter></IFooter>
    <div id="configMask" class="config-mask"></div>
  </div>
</template>
<script>
  import {planType} from '../../assets/js/api.js';
  import ITop from '@/components/common/Top';
  import IHeader from '@/components/common/Header';
  import ITabConfig from '@/components/common/TabConfig';
  import IFooter from '@/components/common/Footer';
  import iKnowsUtil from '@/assets/js/iknowsUtil';

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
        topLabel: '',
        show: false,
        clean: () => {}
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
        let id = this.$route.params.id || '';
        if(id == '' || id == 'undefined'){
          if(type == 'monitorresults'){
            this.$router.push('/center/monitorresults');
          }else if(type == 'monitoranalysis'){
            this.$router.push('/center/monitoranalysis');
          }else if(type =='warninglist'){
            this.$router.push('/center/warninglist');
          }else if(type == 'config'){
            this.$router.push('/center/config');
          }
        }else{
          if(type == 'monitorresults'){
            this.$router.push('/center/monitorresults/'+id);
          }else if(type == 'monitoranalysis'){
            this.$router.push('/center/monitoranalysis/'+id);
          }else if(type =='warninglist'){
            this.$router.push('/center/warninglist/'+id);
          }else if(type == 'config'){
            this.$router.push('/center/config/'+id);
          }
        }

      },
      //返回顶部
      returnToTopFn() {
        let el = this.$el.parentNode
        let st = el.scrollTop >> 0
        iKnowsUtil.backTop({y: st}, {y: 0}, 500, function({y}, hand){
          el.scrollTop = y
          if (0 === y) cancelAnimationFrame(hand)
        })
      },
      //监听scrollTop
      listen() {
        let el = this.$el.parentNode
        el.scrollTop = 0;
        if (!(el instanceof HTMLElement)) return
        let scrollFn = () => {
          let top = el.scrollTop >> 0
          if (top > 500){
            this.show = true
          }else {
            this.show = false
          }
        }
        el.addEventListener('scroll', scrollFn)
        return () => {
          el.removeEventListener('scroll', scrollFn)
        }
      }
    },
    mounted() {
      let tabList = [
        {value: '监测结果', isSelected: false, type: 'monitorresults'},
        {value: '舆情分析', isSelected: false, type: 'monitoranalysis'},
        {value: '预警列表', isSelected: false, type: 'warninglist'},
        {value: '方案配置', isSelected: false, type: 'config' }
      ];
      var pathName = this.$route.name;
      let topLabel = this.$route.query.topLabel;
      tabList.forEach(item => {
        if(item.type == pathName){
          item.isSelected = true;
        }
      });
      let id = this.$route.params.id || '';
      if(id != '' && id != 'undefined'){
        planType(id).then(response => {
          let data = response.data;
          this.topLabel = data.kpName;
          let kpType = data.kpType;
          if(kpType == 4){
            tabList.splice(2,1);
          }
          this.tabList = tabList;
        }).catch(err => {
          console.log(err);
        });
      }else{
        this.tabList = [];
      }
      this.clean = this.listen();
    },
    beforeDestroy() {
      this.clean()
    }
  }
</script>
<style scoped>
.rzl_wrapper{
  position: relative;
}
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
  text-align: center; 
  cursor: pointer;
}
.tab-config li span{
  display: inline-block;
  line-height: 36px;
  color: #999;
  font-weight: 700;
}
.tab-config li.active{
  border-radius: 10px 10px 0 0;
}
.tab-config li.active span{
  color: #2D2B4C;
  border-bottom: 3px solid #2D2b4c;
}
.backTop{
  height: 40px;
  text-align: center;
  width: 40px;
  padding: 10px;
  box-sizing: border-box;
  position: fixed;
  bottom: 180px;
  right: 60px;
  border-radius: 50%;
  background: rgba(91, 91, 91, 0.5);
}
.backTop img{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>
