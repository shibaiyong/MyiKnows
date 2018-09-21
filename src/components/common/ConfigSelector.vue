<!-- 抽取配置页面中公共的checkBox部分 -->
<template>
  <div class="configCondition">
    <!-- 时间范围 -->
    <div class="configCondition-content dateType-content">
      <div class="configCondition-left rzl_fc_darkgray font16">时间范围</div>
      <div class="configCondition-right dateType-right">
        <el-radio v-model="dateTypeRadio" label="year" @change="changeDateType()">持续(1年)</el-radio>
        <el-radio v-model="dateTypeRadio" label="day" @change="changeDateType()">1天</el-radio>
        <el-radio v-model="dateTypeRadio" label="week" @change="changeDateType()">7天</el-radio>
        <el-radio v-model="dateTypeRadio" label="month" @change="changeDateType()">30天</el-radio>
        <el-radio v-model="dateTypeRadio" label="customTime" @change="changeDateType()">自定义</el-radio>
        <div class="customTime-date">
          <el-date-picker v-model="customTime" type="daterange"
            :editable="false"
            v-bind:disabled="disabled"
            range-separator="-" 
            prefix-icon="" 
            format="yyyy-MM-dd"
            value-format="timestamp"
            :picker-options="dateScope" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="dateType-warn rzl_fc_errRed font16" v-show="dateTypeWarn">请选择时间范围</div>
      </div>
    </div>
    <!-- 监控范围 -->
    <div class="configCondition-content monitorType-content">
      <div class="configCondition-left rzl_fc_darkgray font16">监控范围</div>
      <div class="configCondition-right monitorType-right">
        <div class="monitorType-all" @click="chooseAllMonitor">
          <el-button circle class="circle-radio" :class="{active: allMonitorRadio}"></el-button>
          <span class="font14 rzl_fc_darkgray">全选</span>
        </div>
        <el-checkbox-group v-model="checkedMonitors" @change="handleCheckedMonitorChange">
          <el-checkbox v-for="(monitorOption, index) in monitorOptions" :label="monitorOption.value" :key="index">{{monitorOption.value}}</el-checkbox>
        </el-checkbox-group>
        <div class="monitorType-warn rzl_fc_errRed font16" v-show="monitorTypeWarn">请选择监控范围</div>
      </div>
    </div>
    <!-- 周期性简报 -->
    <div class="configCondition-content periodReport-content">
      <div class="configCondition-left rzl_fc_darkgray font16">周期性简报</div>
      <div class="configCondition-right periodReport-right">
        <div class="periodReport-all" @click="chooseNoneReport">
          <el-button circle class="circle-radio" :class="{active: noneReportRadio}"></el-button>
          <span class="font14 rzl_fc_darkgray">无</span>
        </div>
        <el-checkbox-group v-model="checkedReports" @change="handleCheckedReportChange" class="periodReport-checkboxGroup">
          <el-checkbox v-for="(reportOption, index) in reportOptions" :label="reportOption.value" :key="index">{{reportOption.value}}</el-checkbox>
        </el-checkbox-group>
        <div class="monitorType-warn rzl_fc_errRed font16" v-show="periodReportWarn">请选择简报方式</div>

      </div>
    </div>
    <!-- 简报推送方式 -->
    <div class="configCondition-content briefType-content">
      <div class="configCondition-left rzl_fc_darkgray font16">简报推送方式</div>
      <div class="configCondition-right briefType-right">
        <el-checkbox-group v-model="checkedBriefs" @change="handleCheckedBriefChange">
          <el-checkbox v-for="(briefOption, index) in briefOptions" :label="briefOption.value" :key="index">{{briefOption.value}}</el-checkbox>
        </el-checkbox-group>
        <div class="briefsType-warn rzl_fc_errRed font16" v-show="briefsTypeWarn">请选择简报推送方式</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'i-configSelector',
  data () {
    return {
      // 时间范围类型
      dateTypeRadio: 'year',
      // 时间控件是否
      disabled: true,
      // 自定义时间范围值
      customTime: [],
      // 限定时间范围
      dateScope: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; 
        } 
      }, 
      // 时间范围提示 
      dateTypeWarn: true, 
      allMonitorRadio: false, 
      // 监控范围
      monitorOptions: [], 
      // 已选监控范围 
      checkedMonitors: [], 
      // 监控范围提示 
      monitorTypeWarn: true, 
      // 无 
      noneReportRadio: false, 
      //周期性简报 
      reportOptions: [], 
      // 已选简报周期 
      checkedReports: [], 
      // 周期性简报提示 
      periodReportWarn: true, 
      // 简报方式列表 
      briefOptions: [],
      // 已选简报方式 
      checkedBriefs: [], 
      // 简报方式提示 
      briefsTypeWarn: true,
    }
  },
  methods: {
    // 修改时间范围
    changeDateType () {
      if(this.dateTypeRadio == 'customTime'){
        this.disabled = false;
      }else{
        this.disabled = true;
        this.customTime = [];
      }
    },
    // 选择全选
    chooseAllMonitor () {
      this.allMonitorRadio = !this.allMonitorRadio;
      if(this.allMonitorRadio){
        // 先处理数据
        let allMonitors = [];
        this.monitorOptions.forEach(element => {
          allMonitors.push(element.value);
        });
        this.checkedMonitors = allMonitors ;
      }else{
        this.checkedMonitors = [];
      }
      this._configParams();
    },
    // 勾选监控范围选项
    handleCheckedMonitorChange (value) {
      if(value.length == this.monitorOptions.length){
        this.allMonitorRadio = true;
      }else{
        this.allMonitorRadio = false;
      }
      this._configParams();
    },
    // 选择： 无
    chooseNoneReport () {
      this.noneReportRadio = !this.noneReportRadio;
      if(this.noneReportRadio){
        this.checkedReports = [];
      }
      this._configParams();
    },
    // 沟选简报周期
    handleCheckedReportChange (value){
      if(value.length > 0){
        this.checkedReports = value;
        this.noneReportRadio = false;
      }else{
        this.noneReportRadio = true;
      }
      this._configParams();
    },
    // 勾选简报推送方式
    handleCheckedBriefChange (value) {
      console.log(value);
      this._configParams();
    },
    _getTimeScope () {
      var date = new Date();
      var customTime = [];
      if(this.dateTypeRadio == 'year'){

      }else if(this.dateTypeRadio == 'day'){

      }else if(this.dateTypeRadio == 'week'){

      }else if(this.dateTypeRadio == 'month'){

      }
    },
    // 通过此方法向父组件传递所有参数
    _configParams () {
      var params = {};
      // 时间范围类型
      params.dateType = this.dateTypeRadio;
      params.customTime = [];

      // 为true表示采用自定义时间（lang类型）
      if(this.customTimeActive){
        params.customTime = this.customTime;
      }
      // 监控范围
      params.monitorScope = [];
      let monitorScope = [];
      if(this.allMonitorRadio){
        this.monitorOptions.forEach(item => {
          monitorScope.push(item.type);
        });
      }else{
        params.monitorScope = this.checkedMonitors;
        this.monitorOptions.forEach(item => {
          this.checkedMonitors.forEach(element => {
            if(item.value == element){
              monitorScope.push(item.type);
            }
          });
        });
      }
      params.monitorScope = monitorScope;

      // 周期性简报
      params.reports = [];
      if(!this.noneReportRadio){
        let reports = []
        this.reportOptions.forEach(item => {
          this.checkedReports.forEach( element => {
            if( item.value == element){
              reports.push(item.type);
            }
          });
        });
        params.reports = reports;
      }
      
      // 推送方式
      params.briefs = [];
      let briefs = [];
      this.briefOptions.forEach( item => {
        this.checkedBriefs.forEach(element => {
          if( item.value == element){
            briefs.push(item.type)
          }
        });
      });
      params.briefs = briefs;

      console.log('筛选条件:configSelector');
      console.log(params);
      this.$emit('selector-params', {
        params: params
      });
    },
  },
  created() {
    // 监控范围
    const monitorOptions = [
      {type:'webchat' ,value:'微信'},
      {type:'weibo',value:'微博'} ,
      {type:'app',value:'APP'},
      {type:'news',value:'新闻'}
    ];
    this.monitorOptions = monitorOptions;
    // 简报周期
    const reportOptions = [
      {type:'day' ,value:'日报'},
      {type:'week',value:'周报'},
      {type:'month',value:'月报'},
    ];
    this.reportOptions = reportOptions;
    // 简报推送方式
    const briefOptions = [
      {type:'mail' ,value:'邮件'},
      {type:'webchat',value:'微信'},
      {type:'app',value:'APP'},
    ];
    this.briefOptions = briefOptions;
  },

}
</script>
<style scoped>
.configCondition{
  width: 100%;
  height: auto;
}
.configCondition-content{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
}
.configCondition-left{
  width: 138px;
  height: 100%;
  line-height: 38px;
  text-align: right;
  font-weight: 600;
}
.configCondition-right{
  margin-left: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}
.dateType-warn,
.monitorType-warn,
.briefsType-warn{
  min-width: 450px;
  height: 100%;
  line-height: 38px;
}
.dateType-warn,
.monitorType-warn,
.briefsType-warn{
  margin-left: 10px;
}
.dateType-content{
  margin-top: 30px;
  width: 100%;
}
.customTime-date{
  margin-left: 18px;
  width: 250px;
  height: 38px;
}
.customTime-date >>> .el-input__inner{
  width: 100% !important;
}
.dateDisabled{
  cursor: none;
  background: #1D2088;
}
.monitorType-content{
  margin-top: 20px;
}
.configCondition .monitorType-all{
  width: 82px;
  height: 38px;
  line-height: 38px;
  cursor: pointer;
}
.configCondition .periodReport-all{
  width: 67px;
  height: 38px;
  line-height: 38px;
  cursor: pointer;
}
.configCondition .periodReport-right .periodReport-checkboxGroup{
  margin-left: 15px;
}
.configCondition .monitorType-all span,
.configCondition .periodReport-all span{
  display: inline-block;
  line-height: 38px;
}


/****点击input的边框样式****/
.configCondition >>> .el-range-editor.is-active, .el-range-editor.is-active:hover{
  border-color: #1D2088;
  outline: none;
}
/****模拟radio样式****/
.configCondition .monitorType-content >>>.el-button.is-circle,
.configCondition .periodReport-content >>>.el-button.is-circle{
  padding: 6px;
  width: 9px;
  height: 9px;
  margin-right: 6px;
}
.configCondition .monitorType-content >>>.el-button.is-circle:hover,
.configCondition .periodReport-content >>>.el-button.is-circle:hover{
  background: #fff;
  border-color: #1D2088;
  color: #606266;
}
.configCondition .monitorType-content >>>.el-button.active,
.configCondition .periodReport-content >>>.el-button.active{
  background-color: #1D2088;
  border-color: #1D2088;
}
.configCondition .monitorType-content >>>.el-button.active:hover,
.configCondition .periodReport-content >>>.el-button.active:hover{
  background-color: #1D2088;
}
.configCondition >>> .el-checkbox{
  height: 100%;
  line-height: 38px;
}
.configCondition .monitorType-all .circle-radio,
.configCondition .periodReport-all .circle-radio{
  position: relative;
  top: -5px;
}

*:focus{
  outline-color: #1D2088;
}
</style>