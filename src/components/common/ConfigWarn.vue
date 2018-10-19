<!-- 是否预警配置项 -->
<template>
  <div class="configWarn">
    <!-- 是否开启预警模块 -->
    <div class="configWarn-content kpIsWarn-content">
      <div class="configWarn-left rzl_fc_darkgray font16">是否预警</div>
      <div class="configWarn-right warn-right">
        <el-checkbox v-model="warnObj.kpIsWarn" @change="openWarn">开启预警</el-checkbox>
      </div>
    </div>
    <!-- 预警部分的信息 -->
    <!-- 触发条件 -->
    <div class="configWarn-content warn-content" v-show="warnObj.kpIsWarn">
      <div class="configWarn-left rzl_fc_darkgray font16">触发条件</div>
      <div class="configWarn-right warn-right">
        <div class="warn-add">
          <el-checkbox v-model="warnObj.wranCheck">符合以下专题类型</el-checkbox>
            <div class="configWarn-add font14" :class="{disabled:!warnObj.wranCheck}" @click="addWarnMode">
            <i class="el-icon-circle-plus rzl_fc_navy font20"></i>添加模型
          </div>
        </div>
      </div>
    </div>
    <!-- 已选专题类型 -->
    <div class="configWarn-content" v-show="warnObj.kpIsWarn && warnObj.wranCheck">
      <div class="configWarn-right chooseWarnMode-right">
        <div class="warn-chooseWarn" v-show="warnObj.wranCheck">
          <el-tag size="medium" v-for="(chooseWarn, index) in warnObj.wranModels" :key="index" closable
            class="rzl_bc_undercoat font14 rzl_fc_darkgray rzl_bd_darkgray tag-chooseWarn"
            @close="deleteChooseWarn(chooseWarn)" :type="chooseWarn.id">
            {{chooseWarn.name}}
          </el-tag>
        </div>
      </div>
    </div>
    <!-- 命中关键词 -->
    <div class="configWarn-content warnKeysWord-content" v-show="warnObj.kpIsWarn && warnObj.wranCheck">
      <div class="warnKeysWord-checked">
        <el-checkbox v-model="warnObj.wranSelfcheck" @change="changeWarnSelfCheck">命中以下任意关键词</el-checkbox>
      </div>
      <div class="warnKeysWord-right">
        <el-autocomplete class="warnKeysWord-input" v-model="warnObj.wranSelf"
          :disabled="!keysWord"
          :fetch-suggestions="queryKeysWordSearch"
          :trigger-on-focus="false"
          placeholder=""></el-autocomplete>
        <el-popover placement="right-start" trigger="hover" content="最多3个关键词，空格隔开，or关系!">
          <el-button slot="reference" class="configWarn-hint">
            <i class="el-icon-question rzl_fc_lightGrey font20"></i>
          </el-button>
        </el-popover>
        <div class="warnKeysWord-warn rzl_fc_errRed font16" v-show="warnKeysWordWarn">{{warnKeysWordWarnText}}</div>
      </div>
    </div>

    <!-- 预警方式 -->
    <div class="configWarn-content warnType-content" v-show="false">
      <div class="configWarn-left rzl_fc_darkgray font16">预警推送方式</div>
      <div class="configWarn-right warnType-right">
        <el-checkbox-group v-model="warnObj.kpWarnSendType" @change="handleCheckedWarnChange">
          <el-checkbox v-for="(warnOption, index) in warnTypeOptions" :label="warnOption.type" :key="index">{{warnOption.value}}</el-checkbox>
        </el-checkbox-group>
        <div class="warnType-warn rzl_fc_errRed font16" v-show="warnTypeWarn">{{warnTypeWarnText}}</div>
      </div>
    </div>
    <!-- 预警时间 -->
    <div class="configWarn-content warnTime-content" v-show="warnObj.kpIsWarn">
      <div class="configWarn-left rzl_fc_darkgray font16 warnTime-left">预警时间</div>
      <div class="configWarn-right warnTime-right">
        <div class="warnTime-all" @click="chooseWarnTime()">
          <el-button circle class="circle-radio" :class="{active: warnObj.kpWranTimeCheck}" ></el-button>
          <span class="font14 rzl_fc_darkgray">预警时间</span>
        </div>
        <el-autocomplete class="warnTime-input"
          v-model="warnObj.kpWarnStartTime"
          :maxlength="2"
          :disabled="!warnObj.kpWranTimeCheck"
          :fetch-suggestions="querykpWarnStartTimeSearch"
          :trigger-on-focus="false" placeholder=""></el-autocomplete>
        <span class="warnTime-middle font14 rzl_fc_darkgray">点</span>
        <span class="warnTime-middle font14 rzl_fc_darkgray">至</span>
        <el-autocomplete class="warnTime-input  warnTime-input-last"
          v-model="warnObj.kpWarnEndTime"
          :maxlength="2"
          :disabled="!warnObj.kpWranTimeCheck"
          :fetch-suggestions="querykpWarnEndTimeSearch"
          :trigger-on-focus="false" placeholder=""></el-autocomplete>
        <span class="warnTime-middle font14 rzl_fc_darkgray">点</span>
        <div class="warnTime-warn rzl_fc_errRed font16" v-show="warnTimeWarn">{{warnTimeWarnText}}</div>
      </div>
    </div>
    <!-- 周末预警 -->
    <div class="configWarn-content weekDay-content" v-show="warnObj.kpIsWarn">
      <div class="configWarn-right chooseWarnMode-right">
        <div class="warn-chooseWarn">
          <span class="weekDay-warn  font14 rzl_fc_darkgray">周末预警</span>
          <el-switch v-model="warnObj.kpHolidayWarn" @change="changeWeekDay"></el-switch>
        </div>
      </div>
    </div>
    <IAddModel :isAddModel="isAddModel"
      :checkedWarnList="checkedWarnList"
      @save-model="handleSaveModel"
      @cancel-model="handleCancelModel"></IAddModel>
  </div>
</template>
<script>
// const wranSelfEmptyText = '请输入命中关键词！';
// const wranSelfEnoughText = '命中关键词最多支持3个！';
// const warnTimeWarnText = '预警时间不合法，请重新输入！';
// const warnTypeWarnText = '请选择预警方式！';
import IAddModel from '@/components/common/AddModel';
export default {
  name: 'i-configWarn',
  components: { IAddModel},
  props: {
    warnInfoObj: {
      type: Object,
      require: true,
      default () {
        return {
          // 是否开启预警
          kpIsWarn: false,
          // 符合以下专题类型
          wranCheck: false,
          // 已选择专题类型
          wranModels: [],
          // 命中关键词是否开启
          wranSelfcheck: false,
          // 命中关键词：[]
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
        }
      }
    }
  },
  data () {
    return {
      warnObj: {},
      checkedWarnList: [],
      // 借用查询功能
      wranSelfList: [],
      // 命中关键词可有
      keysWord: false,
      // 命中关键词提示
      warnKeysWordWarn: false,
      // 命中关键词提示信息
      warnKeysWordWarnText: '',
      // 是否添加模型
      isAddModel: false,
      // 预警方式列表
      warnTypeOptions: [],
      // 预警方式提示
      warnTypeWarn: false,
      // 预警方式提示信息
      warnTypeWarnText: '',
      // 预警时间提示信息
      warnTimeWarnText: '',
      kpWarnStartTimeList: [],
      kpWarnEndTimeList: [],
      // 预警时间提示
      warnTimeWarn: false,
    }
  },
//  watch: {
//    warnInfoObj(newVal, oldVal) {
//      this.warnObj = this.warnInfoObj;
//    },
//  },
  methods: {
    // 开启预警
    openWarn () {
      this._warnParams();
    },
    // 添加预警模型
    addWarnMode () {
      if(this.warnObj.wranCheck){
        this.checkedWarnList = this.warnObj.wranModels;
        this.isAddModel = true;
        document.getElementById('configMask').style.display= 'block';
        this._warnParams();
      }
    },
    // 新增模型数据
    handleSaveModel (modelObj) {
      this.isAddModel = false;
      this.warnObj.wranModels = modelObj.chooseModelList;
      this._warnParams();
    },
    // 取消新增模型
    handleCancelModel () {
      this.isAddModel = false;
      this._warnParams();
    },
    // 删除已选中专题
    deleteChooseWarn (item) {
      let warnId = item.id;
      let deleteWarnIndex = 0;
      let wranModels = this.warnObj.wranModels;
      wranModels.forEach( (element, index)=> {
        if( warnId == element.id){
          deleteWarnIndex = index;
          return;
        }
      });
      this.warnObj.wranModels.splice(deleteWarnIndex, 1);
      this.checkedWarnList = this.warnObj.wranModels;
      this._warnParams();
    },
    changeWarnSelfCheck (){
      this.keysWord = this.warnObj.wranSelfcheck;
      this._warnParams();
    },
    // 命中关键词
    queryKeysWordSearch(queryString, callBack) {
      this.warnObj.wranSelf = queryString;
      let mappingKeyWordsList = this.wranSelfList;
      let results = queryString ? mappingKeyWordsList.filter(this._areaFilter(queryString)) : mappingKeyWordsList;
      // 调用 callback 返回建议列表的数据
      callBack(results);
      // 生成参数
      this._warnParams();
    },
    _areaFilter(queryString) {
      return (mappingItem) => {
        return (mappingItem.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    // 勾选预警方式
    handleCheckedWarnChange (value) {
      let kpWarnSendType = [];
      this.warnTypeOptions.forEach(item => {
        value.forEach(element => {
          if( item.type == element){
            kpWarnSendType.push(item.type);
          }
        });
      });
      this.warnObj.kpWarnSendType = kpWarnSendType;
      this._warnParams();
    },
    // 开启预警时间
    chooseWarnTime () {
      this.warnObj.kpWranTimeCheck = !this.warnObj.kpWranTimeCheck;
      if(!this.warnObj.kpWranTimeCheck){
        this.warnObj.kpWarnStartTime = '';
        this.warnObj.kpWarnEndTime = '';
      }
      this._warnParams();
    },
    // 预警时间开始
    querykpWarnStartTimeSearch (queryString, callBack){
      this.warnObj.kpWarnStartTime = queryString;
      let mappingkpWarnStartTimeList = this.kpWarnStartTimeList;
      let results = queryString ? mappingkpWarnStartTimeList.filter(this._areaFilter(queryString)) : mappingkpWarnStartTimeList;
      // 调用 callback 返回建议列表的数据
      callBack(results);
      // 生成参数
      this._warnParams();
    },
    querykpWarnEndTimeSearch (queryString, callBack){
      this.warnObj.kpWarnEndTime = queryString;
      let mappingkpWarnEndTimeList = this.kpWarnEndTimeList;
      let results = queryString ? mappingkpWarnEndTimeList.filter(this._areaFilter(queryString)) : mappingkpWarnEndTimeList;
      // 调用 callback 返回建议列表的数据
      callBack(results);
      // 生成参数
      this._warnParams();
    },
    // 是否开启周末预警
    changeWeekDay () {
      this._warnParams();
    },
    // 预警配置参数
    _warnParams () {
      var params = {};
      // 开启预警的情况
      if(this.warnObj.kpIsWarn){
        // 开启预警
        params.kpIsWarn = this.warnObj.kpIsWarn;
        // 预警模型触发条件
        params.wranCheck = this.warnObj.wranCheck;
        // 已选择专题类型
        params.wranModels = [];
        if(this.warnObj.wranCheck){
          this.warnObj.wranModels.forEach(item => {
            params.wranModels.push(item);
          });
        }
        // 命中关键词 ['恐怖组织', '世界银行', '爆炸']
        params.wranSelfcheck = this.warnObj.wranSelfcheck;
        params.wranSelf = [];
        if(params.wranSelfcheck){
            params.wranSelf = this.warnObj.wranSelf.split(" ");
        }
        // 预警推送方式 ['1','2','3']
        params.kpWarnSendType = this.warnObj.kpWarnSendType;

        // 预警时间是否开启
        params.kpWranTimeCheck = this.warnObj.kpWranTimeCheck;
        // 预警时间
        if(this.warnObj.kpWranTimeCheck ){
          params.kpWarnStartTime = this.warnObj.kpWarnStartTime;
          params.kpWarnEndTime = this.warnObj.kpWarnEndTime;
        }
        // 同末预警
        params.kpHolidayWarn = this.warnObj.kpHolidayWarn;
      }else{
        // 关闭预警
        params.kpIsWarn = false;
      }
      this.$emit('warn-params', {
        params: params
      });
    },
  },
  mounted() {
    this.warnObj = this.warnInfoObj;
    this.checkedWarnList = this.warnObj.wranModels;
    this.keysWord = this.warnObj.wranSelfcheck || false;

    // 预警推送方式转为字符串数组
    let kpWarnSendType = [];
    if(this.warnObj.kpWarnSendType){
      this.warnObj.kpWarnSendType.forEach(item => {
        kpWarnSendType.push(item+'');
      });
      this.warnObj.kpWarnSendType = kpWarnSendType;
    }
    //时间转换为字符串
    this.warnObj.kpWarnStartTime = this.warnObj.kpWarnStartTime+'';
    this.warnObj.kpWarnEndTime = this.warnObj.kpWarnEndTime+'';

    // console.log("canfigWarn获取参数：");
    // console.log(this.warnObj);
  },
  created() {
    // 预警方式
    const warnTypeOptions = [
      {type:'1' ,value:'邮件'},
      {type:'2',value:'微信'},
      {type:'4',value:'APP'},
    ];
    this.warnTypeOptions = warnTypeOptions;
  },
}
</script>
<style scoped>
.configWarn{
  width: 100%;
  height: auto;
}
.configWarn-content{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
}
.configWarn-left{
  width: 138px;
  height: 100%;
  line-height: 38px;
  text-align: right;
  font-weight: 600;
}
.configWarn-right{
  margin-left: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}
.warnKeysWord-warn,
.warnType-warn{
  min-width: 450px;
  height: 100%;
  line-height: 38px;
}
.warnType-content{
  margin-top: 20px;
}
.warnTime-content{
  margin-top: 5px;
}
.warnType-warn{
  margin-left: 10px;
}
.warnKeysWord-input{
  width: 400px;
  height: 100%;
}
.warnKeysWord-input input{
  border-color: #CDCDCD;
}
.configWarn-hint{
  padding: 9px;
  width: 38px;
  height: 38px;
  background: none;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  box-sizing: border-box;
}
.configWarn-hint i:hover{
  color: #1D2088;
}
/*****预警部分的样式****/
.configWarn .warn-right{
  display: block;
}
.configWarn .warn-add{
  width: 100%;
  height: 38px;
  display: flex;
  justify-content: flex-start;
}
.configWarn .configWarn-add{
  margin-left: 60px;
  width: 100%;
  height: 100%;
  line-height: 38px;
  cursor: pointer;
}
.configWarn .configWarn-add.disabled,
.configWarn .configWarn-add.disabled i{
  color: #CDCDCD;
}
.configWarn .configWarn-add i{
  position: relative;
  top: 2px;
  margin-right: 10px;
}
.configWarn .chooseWarnMode-right{
  margin-left: 158px;
  height: 38px;
  box-sizing: border-box;
}
.configWarn .warnKeysWord-content{
  width: 100%;
  height: 38px;
  line-height: 38px;
}
.configWarn .warnKeysWord-right{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}
.configWarn .warnKeysWord-right .configWarn-hint{
  line-height: 20px;
}
.configWarn .warnKeysWord-checked{
  margin-left: 158px;
}
.configWarn .warnKeysWord-input{
  margin-left: 20px;
}
.configWarn .warnTime-content{
  height: 28px;
}
.configWarn .warnTime-left{
  height: 28px;
  line-height: 28px;
}
.configWarn .warnTime-all{
  width: 102px;
  height: 28px;
  line-height: 28px;
  cursor: pointer;
}
.configWarn .warnTime-all .circle-radio{
  position: relative;
  top: -5px;
}
.warnTime-input{
  width: 40px;
  height: 100%;
}
.configWarn .warnTime-input >>>.el-input__inner{
  width: 40px;
  height: 28px;
  line-height: 28px;
  padding: 0 10px;
  border-radius: 4px;
}
.configWarn .warnTime-input-last{
  margin-left: 10px;
}
.configWarn .warnTime-middle{
  display: inline-block;
  line-height: 28px;
  margin-left: 10px;
}
.configWarn .warnTime-middle:last{
  margin-right: 10px;
}
.configWarn .warnTime-warn{
  margin-left: 10px;
  min-width: 450px;
  height: 100%;
  line-height: 28px;
}
.configWarn .weekDay-warn{
  display: inline-block;
  line-height: 28px;
}
.configWarn >>> .el-switch.is-checked .el-switch__core{
  border-color: #1D2088;
  background-color: #1D2088;
}
.configWarn .weekDay-content{
  margin-top: 10px;
}
.tag-chooseWarn{
  margin-right: 15px;
}
/****模拟radio样式****/
.configWarn .warnTime-content >>>.el-button.is-circle{
  padding: 6px;
  width: 9px;
  height: 9px;
  margin-right: 6px;
}
.configWarn .warnTime-content >>>.el-button.is-circle:hover{
  background: #fff;
  border-color: #1D2088;
  color: #606266;
}
.configWarn .warnTime-content >>>.el-button.active{
  background-color: #1D2088;
  border-color: #1D2088;
}
.configWarn .warnTime-content >>>.el-button.active:hover{
  background-color: #1D2088;
}

/* 覆写element-ui的input框样式*/
.configWarn >>>.el-input__inner{
  width: 400px;
  height: 38px;
  line-height: 38px;
}
</style>
