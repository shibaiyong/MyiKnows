<template>
<!-- 内容区最外层容器均采用rzl-contarner样式 -->
<div class="rzl-contarner rzl_bc_undercoat">
  <div class="monitorConfig-content">
    <div class="monitorConfig-tabWraper rzl_bc_white">
      <ul class="monitor-type">
        <li v-for="(monitorType, index) in monitorTypeList" class="font18 rzl_fc_darkgray" @click="changeMonitorType(monitorType.type)"
          :class="{rzl_bc_navy: monitorType.isSelect, active: monitorType.isSelect, rzl_fc_white: monitorType.isSelect}">{{monitorType.value}}</li>
      </ul>
      <IGeneralConfig v-show="configType == 'general'"></IGeneralConfig>
      <IPersonConfig v-show="configType == 'person'"></IPersonConfig>
      <IArticleConfig v-show="configType == 'article'"></IArticleConfig>
    </div>
  </div>
</div>
</template>
<script>
import IGeneralConfig from '@/components/common/GeneralConfig';
import IPersonConfig from '@/components/common/PersonConfig';
import IArticleConfig from '@/components/common/ArticleConfig';

export default {
  name: 'i-config',
  components: {IGeneralConfig, IPersonConfig, IArticleConfig},
  data () {
    return {
      monitorTypeList: [],
      // 常规：general, 人物：person, 文章：article
      configType: 'general',
    }
  },
  methods: {
    // 切换监测模式 
    changeMonitorType (type){
      console.log(type);
      this.monitorTypeList.forEach(element => {
        element.isSelect = false;
        if(element.type == type){
          element.isSelect = true;
          this.configType = element.type;
        }
      });
    },

  },
  created() {
    const monitorTypeList = [
      { value: '常规监测', type: 'general', isSelect: true },
      { value: '人物监测', type: 'person', isSelect: false },
      { value: '文章监测', type: 'article', isSelect: false }
    ];
    this.monitorTypeList = monitorTypeList;
  },  
}
</script>
<style scoped>
.monitorConfig-content{
  width: 100%;
  height: 100%;
}
.monitorConfig-tabWraper{
  padding-top: 30px;
  width: 100%;
}
.monitor-type{
  padding-left: 30px;
  width: 100%;
  height: 38px;
  display: flex;
  justify-content: flex-start;
  box-sizing: content-box;
}
.monitor-type li{
  margin-right: 20px;
  width: 100px;
  height: 100%;
  line-height: 38px;
  text-align: center;
  cursor: pointer;
}
.monitor-type li.active{
  width: 100px;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
}
</style>