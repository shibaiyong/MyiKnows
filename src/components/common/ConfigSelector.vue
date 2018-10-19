<!-- 抽取配置页面中公共的checkBox部分 -->
<template>
  <div class="configCondition">
    <!-- 日期范围 -->
    <div class="configCondition-content kpTimeRange-content">
      <div class="configCondition-left rzl_fc_darkgray font16"><i class="rzl_fc_errRed require-color">*</i>日期范围</div>
      <div class="configCondition-right kpTimeRange-right">
        <el-radio v-model="configSelectorObj.kpTimeRange" label="1" @change="changekpTimeRange()">持续(1年)</el-radio>
        <el-radio v-model="configSelectorObj.kpTimeRange" label="2" @change="changekpTimeRange()">1天</el-radio>
        <el-radio v-model="configSelectorObj.kpTimeRange" label="3" @change="changekpTimeRange()">7天</el-radio>
        <el-radio v-model="configSelectorObj.kpTimeRange" label="4" @change="changekpTimeRange()">30天</el-radio>
        <el-radio v-model="configSelectorObj.kpTimeRange" label="5" @change="changekpTimeRange()">自定义</el-radio>
        <div class="timeSelf-date">
          <el-date-picker v-model="configSelectorObj.timeSelf" type="daterange"
            :editable="false"
            v-bind:disabled="configSelectorObj.disabled"
            range-separator="-"
            prefix-icon=""
            :unlink-panels="true"
            format="yyyy-MM-dd"
            value-format="timestamp"
            @blur="timeCallBack"
            :picker-options="dateScope" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
          <!-- <el-date-picker v-model="startTime" type="date" prefix-icon="" placeholder="开始日期"></el-date-picker>
          <el-date-picker v-model="endTime" type="date"  placeholder="结束日期"></el-date-picker> -->
        </div>
        <div class="kpTimeRange-warn rzl_fc_errRed font16" v-show="kpTimeRangeWarn">{{kpTimeRangeWarnText}}</div>
      </div>
    </div>
    <!-- 监控范围 -->
    <div class="configCondition-content monitorType-content">
      <div class="configCondition-left rzl_fc_darkgray font16"><i class="rzl_fc_errRed require-color">*</i>监控范围</div>
      <div class="configCondition-right monitorType-right">
        <div class="monitorType-all" @click="chooseAllMonitor">
          <el-button circle class="circle-radio" :class="{active: configSelectorObj.allMonitorRadio}"></el-button>
          <span class="font14 rzl_fc_darkgray">全选</span>
        </div>
        <el-checkbox-group v-model="configSelectorObj.kpSiteRange" @change="handleCheckedMonitorChange">
          <el-checkbox v-for="(monitorOption, index) in kpSiteRangeOptions" :label="monitorOption.type" :key="index">{{monitorOption.value}}</el-checkbox>
        </el-checkbox-group>
        <div class="monitorType-warn rzl_fc_errRed font16" v-show="monitorTypeWarn">{{monitorTypeWarnText}}</div>
      </div>
    </div>
    <!-- 周期性简报 -->
    <div class="configCondition-content periodReport-content">
      <div class="configCondition-left rzl_fc_darkgray font16"><i class="rzl_fc_errRed require-color">*</i>周期性简报</div>
      <div class="configCondition-right periodReport-right">
        <div class="periodReport-all" @click="chooseNoneReport">
          <el-button circle class="circle-radio" :class="{active: configSelectorObj.noneReportRadio}"></el-button>
          <span class="font14 rzl_fc_darkgray">无</span>
        </div>
        <el-checkbox-group v-model="configSelectorObj.kpRpType" @change="handleCheckedReportChange" class="periodReport-checkboxGroup">
          <el-checkbox v-for="(reportOption, index) in kpRpTypeOptions" :label="reportOption.type" :key="index">{{reportOption.value}}</el-checkbox>
        </el-checkbox-group>
        <div class="monitorType-warn rzl_fc_errRed font16" v-show="periodReportWarn">请选择简报方式</div>

      </div>
    </div>
    <!-- 简报推送方式 -->
    <div class="configCondition-content briefType-content" v-show="false">
      <div class="configCondition-left rzl_fc_darkgray font16">简报推送方式</div>
      <div class="configCondition-right briefType-right">
        <el-checkbox-group v-model="configSelectorObj.kpRpSendType" @change="handleCheckedBriefChange">
          <el-checkbox v-for="(briefOption, index) in kpRpSendTypeOptions" :label="briefOption.type" :key="index">{{briefOption.value}}</el-checkbox>
        </el-checkbox-group>
        <div class="briefsType-warn rzl_fc_errRed font16" v-show="briefsTypeWarn">{{briefsTypeWarnText}}</div>
      </div>
    </div>
  </div>
</template>
<script>
// const kpTimeRangeWarnText = '请选择日期范围！';
// const monitorTypeWarnText = "请选择监控范围！";
// const briefsTypeWarnText = '请选择简报推送方式！';
export default {
  name: 'i-configSelector',
  props: {
    selectObj: {
      type: Object,
      require: true,
      default () {
        return {
          // 时间范围类型
          kpTimeRange: '',
          // 时间控件是否
          disabled: true,
          // 自定义时间范围值
          timeSelf: [],
          // 是否全部监控
          allMonitorRadio: false,
          // 已选监控范围
          kpSiteRange: [],
          // 无
          noneReportRadio: false,
          // 已选简报周期
          kpRpType: [],
          // 已选简报方式
          kpRpSendType: [],
        }
      }
    }
  },
  data () {
    return {
      // 接收父组件的参数(用于中转)
      configSelectorObj: {},
      // 限定时间范围
      dateScope: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 * 60;
        }
      },
      startTime: '',
      endTime: '',
      // 时间范围提示
      kpTimeRangeWarn: false,
      // 时间范围提示信息。
      kpTimeRangeWarnText: '',
      // 监控范围
      kpSiteRangeOptions: [],
      // 监控范围提示
      monitorTypeWarn: false,
      // 监控范围提示信息。
      monitorTypeWarnText: '',
      //周期性简报
      kpRpTypeOptions: [],
      // 周期性简报提示
      periodReportWarn: false,
      // 简报方式列表
      kpRpSendTypeOptions: [],
      // 简报方式提示
      briefsTypeWarn: true,
      // 简报推送提示信息
      briefsTypeWarnText: '',
    }
  },
  watch: {
    selectObj(newVal, oldVal) {
      this.configSelectorObj = this.selectObj;
    },
    configSelectorObj(newVal, oldVal){
      console.log(newVal);
      this._configParams();
    },
  },
  methods: {
    // 修改时间范围
    changekpTimeRange () {
      if(this.configSelectorObj.kpTimeRange == '5'){
        this.configSelectorObj.disabled = false;
      }else{
        this.configSelectorObj.disabled = true;
        this.configSelectorObj.timeSelf = [];
      }
      this._configParams();
    },
    timeCallBack(){
      // console.log(this.configSelectorObj.timeSelf);
      this._configParams();
    },
    // 选择全选
    chooseAllMonitor () {
      this.configSelectorObj.allMonitorRadio = !this.configSelectorObj.allMonitorRadio;
      if(this.configSelectorObj.allMonitorRadio){
        // 先处理数据
        let allMonitors = [];
        this.kpSiteRangeOptions.forEach(element => {
          allMonitors.push(element.type);
        });
        this.configSelectorObj.kpSiteRange = allMonitors ;
      }else{
        this.configSelectorObj.kpSiteRange = [];
      }
      this._configParams();
    },
    // 勾选监控范围选项
    handleCheckedMonitorChange (value) {
      if(value.length == this.kpSiteRangeOptions.length){
        this.configSelectorObj.allMonitorRadio = true;
      }else{
        this.configSelectorObj.allMonitorRadio = false;
      }
      this._configParams();
    },
    // 选择： 无
    chooseNoneReport () {
      this.configSelectorObj.noneReportRadio = !this.configSelectorObj.noneReportRadio;
      if(this.configSelectorObj.noneReportRadio){
        this.configSelectorObj.kpRpType = [];
      }
      this._configParams();
    },
    // 沟选简报周期
    handleCheckedReportChange (value){
      if(value.length > 0){
        this.configSelectorObj.kpRpType = value;
        this.configSelectorObj.noneReportRadio = false;
      }else{
        this.configSelectorObj.noneReportRadio = true;
      }
      this._configParams();
    },
    // 勾选简报推送方式
    handleCheckedBriefChange (value) {
      this._configParams();
    },
    // 通过此方法向父组件传递所有参数
    _configParams () {
      let params = {};
      // 时间范围类型
      params.kpTimeRange = this.configSelectorObj.kpTimeRange;
      params.timeSelf = [];

      // 为true表示采用自定义时间（lang类型）
      if(this.configSelectorObj.kpTimeRange == 5){
        params.timeSelf = this.configSelectorObj.timeSelf;
      }
      // 监控范围
      params.kpSiteRange = this.configSelectorObj.kpSiteRange;

      // 周期性简报
      params.kpRpType = [];
      if(!this.configSelectorObj.noneReportRadio){
        let kpRpType = [];
        this.kpRpTypeOptions.forEach(item => {
          this.configSelectorObj.kpRpType.forEach( element => {
            if( item.type == element){
              kpRpType.push(item.type);
            }
          });
        });
        params.kpRpType = kpRpType;
      }else{ // 选择无时 [0]
        params.kpRpType = [0];
      }

      // 简报推送方式
      params.kpRpSendType = [];
      let kpRpSendType = [];
      this.kpRpSendTypeOptions.forEach( item => {
        this.configSelectorObj.kpRpSendType.forEach(element => {
          if( item.type == element){
            kpRpSendType.push(item.type)
          }
        });
      });
      params.kpRpSendType = kpRpSendType;

      this.$emit('selector-params', {
        params: params
      });
    },
  },
  mounted() {
    this.configSelectorObj = this.selectObj;
    // 监控范围转为字符串数组
    let kpSiteRange = [];
    this.configSelectorObj.kpSiteRange.forEach(item => {
      kpSiteRange.push(item+'');
    });
    this.configSelectorObj.kpSiteRange = kpSiteRange;
    // 周期性简报转为字符串数组
    let kpRpType = [];
    this.configSelectorObj.kpRpType.forEach(item => {
      kpRpType.push(item+'');
    });
    this.configSelectorObj.kpRpType = kpRpType;

    // 简报推送方式转为字符串数组
    let kpRpSendType = [];
    this.configSelectorObj.kpRpSendType.forEach(item => {
      kpRpSendType.push(item+'');
    });
    this.configSelectorObj.kpRpSendType = kpRpSendType;


    // console.log("configSelector接收参数")
    // console.log(this.configSelectorObj);
  },
  created() {
    // 监控范围
    const kpSiteRangeOptions = [
      {type:'1' ,value:'微信'},
      {type:'2',value:'微博'},
      {type:'4',value:'APP'},
      {type:'8',value:'网媒'},
    ];
    this.kpSiteRangeOptions = kpSiteRangeOptions;
    // 简报周期
    const kpRpTypeOptions = [
      {type:'1' ,value:'日报'},
      {type:'2',value:'周报'},
      {type:'4',value:'月报'},
      {type:'8',value:'季报'},
    ];
    this.kpRpTypeOptions = kpRpTypeOptions;
    // 简报推送方式
    const kpRpSendTypeOptions = [
      {type:'1' ,value:'邮件'},
      {type:'2',value:'微信'},
      {type:'4',value:'APP'},
    ];
    this.kpRpSendTypeOptions = kpRpSendTypeOptions;
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
.kpTimeRange-warn,
.monitorType-warn,
.briefsType-warn{
  min-width: 450px;
  height: 100%;
  line-height: 38px;
}
.kpTimeRange-warn,
.monitorType-warn,
.briefsType-warn{
  margin-left: 10px;
}
.kpTimeRange-content{
  margin-top: 30px;
  width: 100%;
}
.timeSelf-date{
  margin-left: 18px;
  width: 250px;
  height: 38px;
}
.timeSelf-date >>> .el-input__inner{
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
