<template>
<!-- 内容区最外层容器均采用rzl-contarner样式 -->
<div class="rzl-contarner rzl_bc_undercoat">
  <div class="monitorConfig-content">
    <ITabConfig></ITabConfig>
    <div class="monitorConfig-tabWraper rzl_bc_white">
      <ul class="monitor-type">
        <li v-for="(monitorType, index) in monitorTypeList" class="font18 rzl_fc_darkgray" @click="changeMonitorType(monitorType.type)"
          :class="{rzl_bc_navy: monitorType.isSelect, active: monitorType.isSelect, rzl_fc_white: monitorType.isSelect}">{{monitorType.value}}</li>
      </ul>
      <IGeneralConfig @config-allParams="gettAllParams" v-show="configType == 'general'"></IGeneralConfig>
      <IPersonConfig @config-allParams="gettAllParams" v-show="configType == 'person'"></IPersonConfig>
      <IArticleConfig @config-allParams="gettAllParams" v-show="configType == 'article'"></IArticleConfig>
    </div>
    <div class="monitorConfig-btn rzl_bc_white">
      <button type="button" class="config-btn font16 rzl_fc_white rzl_bc_navy rzl_bd_navy" @click="saveConfig">保存</button>
      <button type="button" class="config-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="resetConfig">重置</button>
    </div>
  </div>
</div>
</template>
<script>
import ITabConfig from '@/components/common/TabConfig';
import IGeneralConfig from '@/components/common/GeneralConfig';
import IPersonConfig from '@/components/common/PersonConfig';
import IArticleConfig from '@/components/common/ArticleConfig';

export default {
  name: 'i-monitorConfigContent',
  components: {ITabConfig, IGeneralConfig, IPersonConfig, IArticleConfig},
  data () {
    return {
      monitorTypeList: [],
      // 常规：general, 人物：person, 文章：article
      configType: 'general',
      allParams: {}
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
    gettAllParams (params) {
      this.allParams = params;
    },
    // 保存配置
    saveConfig () {
      console.log('save');
      console.log(this.allParams);
    },
    // 重置配置
    resetConfig () {
      console.log('reset');
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
  padding-top: 20px;
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
/******提交按钮*****/
.monitorConfig-btn{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
  padding: 110px 0 100px 240px;
  box-sizing: border-box;
}
.monitorConfig-btn .config-btn{
  width: 120px;
  height: 38px;
  line-height: 34px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
}
.monitorConfig-btn .config-btn:last-child{
  margin-left: 120px;
}

</style>