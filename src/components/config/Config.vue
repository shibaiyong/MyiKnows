<template>
<!-- 内容区最外层容器均采用rzl-contarner样式 -->
<div class="" v-title="'监测方案'">
  <div class="monitorConfig-content">
    <div class="monitorConfig-tabWraper rzl_bc_white">
      <ul class="monitor-type">
        <li v-for="(monitorType, index) in monitorTypeList" class="font18 rzl_fc_darkgray" @click="changeMonitorType(monitorType.type)"
          :class="{rzl_bc_navy: monitorType.isSelect, active: monitorType.isSelect, rzl_fc_white: monitorType.isSelect}">{{monitorType.value}}</li>
      </ul>
      <IGeneralConfig v-show="configType == 'general'" :allObjInfo="allObj" v-if="configFlag"></IGeneralConfig>
      <IPersonConfig v-show="configType == 'person'"  :allObjInfo="allObj" v-if="configFlag"></IPersonConfig>
      <IArticleConfig v-show="configType == 'article'"  :allObjInfo="allObj" v-if="configFlag"></IArticleConfig>
    </div>
  </div>
</div>
</template>
<script>
import {planType, planShow} from '../../assets/js/api.js';
import IGeneralConfig from '@/components/common/GeneralConfig';
import IPersonConfig from '@/components/common/PersonConfig';
import IArticleConfig from '@/components/common/ArticleConfig';

export default {
  name: 'i-config',
  components: {IGeneralConfig, IPersonConfig, IArticleConfig},
  data () {
    return {
      allObj: {},
      monitorTypeList: [],
      // 常规：general, 人物：person, 文章：article
      configType: '',
      // 标识
      configFlag: false,
    }
  },
  methods: {
    // 切换监测模式
    changeMonitorType (type){
      this.monitorTypeList.forEach(element => {
        element.isSelect = false;
        if(element.type == type){
          element.isSelect = true;
          this.configType = element.type;
        }
      });
    },
  },
  mounted () {
    const monitorTypeList = [
      { value: '常规监测', type: 'general', isSelect: false },
      { value: '人物监测', type: 'person', isSelect: false },
      { value: '文稿监测', type: 'article', isSelect: false }
    ];
    let id = this.$route.params.id || '';
    if(id == '' || typeof (id) == 'undefined'){
      this.configFlag = true;
      monitorTypeList[0].isSelect = true;
      this.monitorTypeList = monitorTypeList;
      this.configType = 'general';

      // 封装所有初始数据
      this.allObj = {};
      this.allObj.kpName = '';
      this.allObj.kpType = 1;
      this.allObj.fuzzyWords = '';
      this. allObj.excludeWords = '';
      this.allObj.regionWords = [];
      this.allObj.selectObj = {
        // 时间范围类型
        kpTimeRange: '3',
        // 时间控件是否
        disabled: true,
        // 自定义时间范围值
        timeSelf: [],
        // 是否全部监控
        allMonitorRadio: true,
        // 已选监控范围
        kpSiteRange: [1,2,4,8,16,32,64],
        // 无(通过js条件判断此条件)
        noneReportRadio: true,
        // 已选简报周期
        kpRpType: [],
        // 已选简报方式
        kpRpSendType: [1],
      };
      // 预警条件初始化
      this.allObj.warnObj = {
        // 是否开启预警
        kpIsWarn: false,
        // 符合以下专题类型
        wranCheck: false,
        // 已选择专题类型
        wranModels: [],
        // 命中关键词是否开启
        wranSelfcheck: false,
        // 命中关键词
        wranSelf: '',
        // 已选预警方式
        kpWarnSendType: [],
        // 预警时间开启
        kpWranTimeCheck: false,
        //预警开始时间点
        kpWarnStartTime: '',
        // 预警结束时间点
        kpWarnEndTime: '',
        // 是否周末预警
        kpHolidayWarn: false,
      };
      this.allObj.preciseWords = [{groupName: '组合', contain: '包含', containValue: '', exclude: '排除', excludeValue: ''}];
      this.allObj.personWords = [];
      // 已选择专题类型
      this.allObj.warnObj.wranModels = [];
      this.allObj.articles = [];
    }else{
      planShow(id).then(response => {
        if(response.code == 200){
          let obj = response.data;
          let kpType = obj.kpType;
          if( kpType == 1 || kpType == 2){
            monitorTypeList[0].isSelect = true;
            this.configType = 'general';
            this.monitorTypeList.push(monitorTypeList[0]);
          }else if(kpType == 3){
            monitorTypeList[1].isSelect = true;
            this.configType = 'person';
            this.monitorTypeList.push(monitorTypeList[1]);
          }else if(kpType == 4){
            monitorTypeList[2].isSelect = true;
            this.configType = 'article';
            this.monitorTypeList.push(monitorTypeList[2]);
          }
          this.configFlag = true;

          // 封装所有返回数据
          this.allObj.kpName = obj.kpName || '';
          this.allObj.kpType = obj.kpType;
          this.allObj.excludeWords = obj.excludeWords || '';
          this.allObj.regionWords = obj.regionWords || [];
          // 地域范围
          this.allObj.regionWords = obj.regionWords || [];

          // 模糊模式
          if(this.allObj.kpType == 1){
            this.allObj.fuzzyWords = obj.fuzzyWords || '';
            this.allObj.excludeWords = obj.excludeWords || '';
          }
          // 精准模式
          else if(this.allObj.kpType == 2){
            let groupList = obj.preciseWords || [];
            this.allObj.preciseWords = [];
            if(groupList.length == 0){
              this.allObj.preciseWords = [{groupName: '组合', contain: '包含', containValue: '', exclude: '排除', excludeValue: ''}];
            }else{
              groupList.forEach(item => {
                let containValueList = item.include || [];
                let excludeValueList = item.execlude || [];
                this.allObj.preciseWords.push({
                  groupName: '组合',
                  contain: '包含',
                  containValue: containValueList,
                  exclude: '排除',
                  excludeValue: excludeValueList
                });
              });
            }
          }
          // 人物监测
          else if(this.allObj.kpType == 3){
            // 人物列表
            this.allObj.personWords = [];
            obj.personWords.forEach( item =>{
              this.allObj.personWords.push({
                name: item.name.join(','),
                job: item.job.join(',')
              })
            });
          }
          // 文章监测
          else if(this.allObj.kpType == 4){
            this.allObj.articles = obj.articles || [];
          }
          // 条件筛选部分
          this.allObj.selectObj = {
            kpTimeRange: obj.kpTimeRange + "" || "0",
            timeSelf: obj.timeSelf || [],
            // 已选监控范围
            kpSiteRange: obj.kpSiteRange || [],
            // 已选简报周期
            kpRpType: obj.kpRpType || [],
            // 已选简报方式
            kpRpSendType: obj.kpRpSendType || [],
          }

          // 时间控件是否激活
          if(this.allObj.selectObj.kpTimeRange == 5){
            this.allObj.selectObj.disabled = false;
          }else{
            this.allObj.selectObj.disabled = true;
          }
          // 是否全部监控
          if(this.allObj.selectObj.kpSiteRange.length == 4){
            this.allObj.selectObj.allMonitorRadio = true;
          }else{
            this.allObj.selectObj.allMonitorRadio = false;
          }
          // 无(通过js条件判断此条件)
          if(this.allObj.selectObj.kpRpType.length == 0){
            this.allObj.selectObj.noneReportRadio = true;
          }else{
            this.allObj.selectObj.noneReportRadio = false;
          }
          // 预警部分
          this.allObj.warnObj = {};
          // 是否开启预警
          this.allObj.warnObj.kpIsWarn= obj.kpIsWarn || false;
          // 符合以下专题类型
          this.allObj.warnObj.wranCheck= obj.wranCheck || false;
          // 已选择专题类型
          this.allObj.warnObj.wranModels= obj.wranModels || [];
          // 命中关键词是否开启
          this.allObj.warnObj.wranSelfcheck= obj.wranSelfcheck || false;
          // 命中关键词
          this.allObj.warnObj.wranSelf= obj.wranSelf && obj.wranSelf.length>0? obj.wranSelf.join(',') : '';
          // 已选预警方式
          this.allObj.warnObj.kpWarnSendType= obj.kpWarnSendType || [];
          // 预警时间开启
          this.allObj.warnObj.kpWranTimeCheck= obj.kpWranTimeCheck || false;
          //预警开始时间点
          this.allObj.warnObj.kpWarnStartTime= obj.kpWarnStartTime || '0';
          // 预警结束时间点
          this.allObj.warnObj.kpWarnEndTime= obj.kpWarnEndTime || '';
          // 是否周末预警
          this.allObj.warnObj.kpHolidayWarn= obj.kpHolidayWarn || false;

        }
      }).catch(err => {
        this.$message.error('系统异常，请重新偿试！');
      })
    }
  }
}
</script>
<style scoped>
.monitorConfig-content{
  width: 100%;
  height: 100%;
  min-height: 781px;
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
