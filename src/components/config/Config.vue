<template>
<!-- 内容区最外层容器均采用rzl-contarner样式 -->
<div class="">
  <div class="monitorConfig-content">
    <div class="monitorConfig-tabWraper rzl_bc_white">
      <ul class="monitor-type">
        <li v-for="(monitorType, index) in monitorTypeList" class="font18 rzl_fc_darkgray" @click="changeMonitorType(monitorType.type)" v-show="monitorType.isShow"
          :class="{rzl_bc_navy: monitorType.isSelect, active: monitorType.isSelect, rzl_fc_white: monitorType.isSelect}">{{monitorType.value}}</li>
      </ul>
      <IGeneralConfig  :allObjInfo="allObj" v-if="configFlag && configType == 'general'"></IGeneralConfig>
      <IPersonConfig :allObjInfo="allObj" v-if="configFlag && configType == 'person'"></IPersonConfig>
      <IArticleConfig :allObjInfo="allObj" v-if="configFlag && configType == 'article'"></IArticleConfig>
      <IEventConfig :allObjInfo="allObj" v-if="configFlag && configType == 'event'"></IEventConfig>
    </div>
  </div>
</div>
</template>
<script>
import {planType, planShow} from '@/assets/js/api.js';
import IGeneralConfig from '@/components/common/GeneralConfig';
import IPersonConfig from '@/components/common/PersonConfig';
import IArticleConfig from '@/components/common/ArticleConfig';
import IEventConfig from '@/components/common/EventConfig';

export default {
  name: 'i-config',
  components: {IGeneralConfig, IPersonConfig, IArticleConfig, IEventConfig},
  data () {
    return {
      allObj: {},
      monitorTypeList: [],
      // 常规：general, 人物：person, 文章：article,事件：event
      configType: '',
      // 标识
      configFlag: false,
    }
  },
  methods: {
    // 切换监测模式
    changeMonitorType (type){
      // this.monitorTypeList.forEach(element => {
      //   element.isSelect = false;
      //   if(element.type == type){
      //     element.isSelect = true;
      //     this.configType = element.type;
      //   }
      // });
    },
  },
  mounted () {
    const monitorTypeList = [
      { value: '常规监测', type: 'general', isSelect: false ,isShow: false},
      { value: '人物监测', type: 'person', isSelect: false ,isShow: false},
      { value: '文稿监测', type: 'article', isSelect: false ,isShow: false},
      { value: '事件监测', type: 'event', isSelect: false ,isShow: false}
    ];
    let id = this.$route.params.id || '';
    let type = '';
    if( !!id && (id == 'general' || id == 'person' ||id == 'article' ||id == 'event' )){
      type = id;
      id = '';
    }
    monitorTypeList.forEach(item =>{
      if(item.type == type){
        item.isShow = true;
        item.isSelect = true;
        this.configType = item.type;
      }
    });
    if(id == '' || typeof (id) == 'undefined'){
      if(this.configType == 'general'){
        monitorTypeList[0].isSelect = true;
        monitorTypeList[0].isShow = true;
        this.monitorTypeList.push(monitorTypeList[0]);
      }else if(this.configType == 'person'){
        monitorTypeList[1].isSelect = true;
        monitorTypeList[1].isShow = true;
        this.monitorTypeList.push(monitorTypeList[1]);
      }else if(this.configType == 'article'){
        monitorTypeList[2].isSelect = true;
        monitorTypeList[2].isShow = true;
        this.monitorTypeList.push(monitorTypeList[2]);
      }else if(this.configType == 'event'){
        monitorTypeList[3].isSelect = true;
        monitorTypeList[3].isShow = true;
        this.monitorTypeList.push(monitorTypeList[3]);
      }

      // 封装所有初始数据
      this.allObj = {};
      this.allObj.kpName = '';
      this.allObj.kpType = 1;
      this.allObj.fuzzyWords = '';
      this. allObj.excludeWords = '';
      this.allObj.regionWords = [];
      this.allObj.selectObj = {
        // 时间范围类型
        kpTimeRange: '0',
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
      if(this.configType == 'event'){
        this.allObj.kpType = 5;
        this.allObj.selectObj.kpTimeRange = '6';
      }
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
        kpWarnSendType: [1],
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
      this.configFlag = true;
    }else{
      let _thiz = this;
      planShow(id).then(response => {
        if(response.code == 200){
          let obj = response.data;
          let kpType = obj.kpType;
          if( kpType == 1 || kpType == 2){
            monitorTypeList[0].isSelect = true;
            _thiz.configType = 'general';
            monitorTypeList[0].isSelect = true;
            monitorTypeList[0].isShow = true;
            _thiz.monitorTypeList.push(monitorTypeList[0]);
          }else if(kpType == 3){
            monitorTypeList[1].isSelect = true;
            _thiz.configType = 'person';
            monitorTypeList[1].isSelect = true;
            monitorTypeList[1].isShow = true;
            _thiz.monitorTypeList.push(monitorTypeList[1]);
          }else if(kpType == 4){
            monitorTypeList[2].isSelect = true;
            monitorTypeList[2].isShow = true;
            monitorTypeList[2].isSelect = true;
            _thiz.configType = 'article';
            _thiz.monitorTypeList.push(monitorTypeList[2]);
          }else if(kpType == 5 || kpType == 6){
            monitorTypeList[3].isSelect = true;
            monitorTypeList[3].isShow = true;
            monitorTypeList[3].isSelect = true;
            _thiz.configType = 'event';
            _thiz.monitorTypeList.push(monitorTypeList[3]);
          }

          // 封装所有返回数据
          _thiz.allObj.kpName = obj.kpName || '';
          _thiz.allObj.kpType = obj.kpType;
          _thiz.allObj.excludeWords = obj.excludeWords || '';
          _thiz.allObj.regionWords = obj.regionWords || [];
          // 地域范围
          _thiz.allObj.regionWords = obj.regionWords || [];

          // 模糊模式
          if(_thiz.allObj.kpType == 1 || _thiz.allObj.kpType == 5){
            _thiz.allObj.fuzzyWords = obj.fuzzyWords || '';
            _thiz.allObj.excludeWords = obj.excludeWords || '';
          }
          // 精准模式
          else if(_thiz.allObj.kpType == 2 || _thiz.allObj.kpType == 6){
            let groupList = obj.preciseWords || [];
            _thiz.allObj.preciseWords = [];
            if(groupList.length == 0){
              _thiz.allObj.preciseWords = [{groupName: '组合', contain: '包含', containValue: '', exclude: '排除', excludeValue: ''}];
            }else{
              groupList.forEach(item => {
                let containValueList = item.include || [];
                let excludeValueList = item.execlude || [];
                _thiz.allObj.preciseWords.push({
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
          else if(_thiz.allObj.kpType == 3){
            // 人物列表
            _thiz.allObj.personWords = [];
            let dept = '';
            obj.personWords.forEach( item =>{
              // 兼容旧数据
              if(item.dept){
                dept = item.dept.join(',');
              }
              _thiz.allObj.personWords.push({
                name: item.name.join(','),
                job: item.job.join(','),
                dept: dept
              })
            });
          }
          // 文章监测
          else if(_thiz.allObj.kpType == 4){
            _thiz.allObj.articles = obj.articles || [];
          }
          // 事件监测：添加主体词
          // 添加主体词
          if(_thiz.allObj.kpType == 5 || _thiz.allObj.kpType == 6){
            let subjectWordsList = [];
            if(obj.subjectWords && obj.subjectWords.length > 0){
              subjectWordsList = obj.subjectWords.split(',');
            }
            _thiz.allObj.subjectWords = subjectWordsList.join(',');
          }
          // 条件筛选部分
          _thiz.allObj.selectObj = {
            kpTimeRange: obj.kpTimeRange + "" || "0",
            timeSelf: obj.timeSelf || [],
            // 已选监控范围
            kpSiteRange: obj.kpSiteRange || [],
            // 已选简报周期
            kpRpType: obj.kpRpType || [],
            // 已选简报方式
            kpRpSendType: obj.kpRpSendType || [1],
          }
          if(_thiz.allObj.kpType > 4){
            if(parseInt(obj.kpTimeRange) < 5){
              _thiz.allObj.selectObj.kpTimeRange = '6';
            }else{
              _thiz.allObj.selectObj.kpTimeRange = obj.kpTimeRange;
            }

          }else{
            _thiz.allObj.selectObj.kpTimeRange = '0';
          }
          // 时间控件是否激活
          if(_thiz.allObj.selectObj.kpTimeRange == 5){
            _thiz.allObj.selectObj.disabled = false;
          }else{
            _thiz.allObj.selectObj.disabled = true;
          }
          // 是否全部监控
          if(_thiz.allObj.selectObj.kpSiteRange.length == 4){
            _thiz.allObj.selectObj.allMonitorRadio = true;
          }else{
            _thiz.allObj.selectObj.allMonitorRadio = false;
          }
          // 无(通过js条件判断此条件)
          if(_thiz.allObj.selectObj.kpRpType.length == 0){
            _thiz.allObj.selectObj.noneReportRadio = true;
          }else{
            _thiz.allObj.selectObj.noneReportRadio = false;
          }
          // 预警部分
          _thiz.allObj.warnObj = {};
          // 是否开启预警
          _thiz.allObj.warnObj.kpIsWarn= obj.kpIsWarn || false;
          // 符合以下专题类型（废弃）
          _thiz.allObj.warnObj.wranCheck= true;
          // 已选择专题类型（废弃）
          _thiz.allObj.warnObj.wranModels= [];
          // 命中关键词是否开启
          _thiz.allObj.warnObj.wranSelfcheck= obj.wranSelfcheck || false;
          // 命中关键词
          _thiz.allObj.warnObj.wranSelf= obj.wranSelf && obj.wranSelf.length>0? obj.wranSelf.join(',') : '';
          // 已选预警方式
          _thiz.allObj.warnObj.kpWarnSendType= obj.kpWarnSendType || [];
          // 预警时间开启（废弃）
          _thiz.allObj.warnObj.kpWranTimeCheck= true;
          //预警开始时间点
          _thiz.allObj.warnObj.kpWarnStartTime= obj.kpWarnStartTime || '';
          if(_thiz.allObj.warnObj.kpWranTimeCheck == false){
            _thiz.allObj.warnObj.kpWarnStartTime = '';
          }
          // 预警结束时间点
          _thiz.allObj.warnObj.kpWarnEndTime= obj.kpWarnEndTime || '';
          // 是否周末预警
          _thiz.allObj.warnObj.kpHolidayWarn= obj.kpHolidayWarn || false;
          _thiz.configFlag = true;
        }
      }).catch(err => {
        _thiz.$message.error('系统异常，请重新尝试！');
        _thiz.configFlag = false;
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
