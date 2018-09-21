<!-- 是否预警配置项 -->
<template>
  <div class="configWarn">
    <!-- 是否开启预警模块 -->
    <div class="configWarn-content isWarn-content">
      <div class="configWarn-left rzl_fc_darkgray font16">是否预警</div>
      <div class="configWarn-right warn-right">
        <el-checkbox v-model="isWarn">开启预警</el-checkbox>
      </div>
    </div>
    <!-- 预警部分的信息 -->
    <!-- 触发条件 -->
    <div class="configWarn-content warn-content" v-show="isWarn">
      <div class="configWarn-left rzl_fc_darkgray font16">触发条件</div>
      <div class="configWarn-right warn-right">
        <div class="warn-add">
          <el-checkbox v-model="isAddWarnMode">符合以下专题类型</el-checkbox>
            <div class="configWarn-add font14" :class="{disabled:!isAddWarnMode}" @click="addWarnMode">
            <i class="el-icon-circle-plus rzl_fc_navy font20"></i>添加模型
          </div>
        </div>
      </div>
    </div>
    <!-- 已选专题类型 -->
    <div class="configWarn-content" v-show="isWarn && isAddWarnMode">
      <div class="configWarn-right chooseWarnMode-right">
        <div class="warn-chooseWarn" v-show="isAddWarnMode">
          <el-tag size="medium" v-for="(chooseWarn, index) in chooseWarnList" :key="index" closable 
            class="rzl_bc_undercoat font14 rzl_fc_darkgray rzl_bd_darkgray tag-chooseWarn"
            @close="deleteChooseWarn(chooseWarn)" :type="chooseWarn.type">
            {{chooseWarn.value}}
          </el-tag>
        </div>
      </div>
    </div>
    <!-- 命中关键词 -->
    <div class="configWarn-content warnKeysWord-content" v-show="isWarn && isAddWarnMode">
      <div class="warnKeysWord-checked">
        <el-checkbox v-model="isHitKeysWord">命中以下任意关键词</el-checkbox>
      </div>
      <div class="warnKeysWord-right" v-show="isAddWarnMode">
        <el-autocomplete class="warnKeysWord-input" v-model="hitKeysWord"
          :disabled="!isHitKeysWord"
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
    <div class="configWarn-content warnType-content" v-show="isWarn">
      <div class="configWarn-left rzl_fc_darkgray font16">预警方式</div>
      <div class="configWarn-right warnType-right">
        <el-checkbox-group v-model="checkedWarns" @change="handleCheckedWarnChange">
          <el-checkbox v-for="(warnOption, index) in warnTypeOptions" :label="warnOption.type" :key="index">{{warnOption.value}}</el-checkbox>
        </el-checkbox-group>
        <div class="warnType-warn rzl_fc_errRed font16" v-show="warnTypeWarn">{{warnTypeWarnText}}</div>
      </div>
    </div>
    <!-- 预警时间 -->
    <div class="configWarn-content warnTime-content" v-show="isWarn">
      <div class="configWarn-left rzl_fc_darkgray font16 warnTime-left">周期性简报</div>
      <div class="configWarn-right warnTime-right">
        <div class="warnTime-all" @click="chooseWarnTime">
          <el-button circle class="circle-radio" :class="{active: warnTimeRadio}"></el-button>
          <span class="font14 rzl_fc_darkgray">预警时间</span>
        </div>
        <el-autocomplete class="warnTime-input" 
          v-model="startTime"
          :maxlength="2"
          :disabled="!warnTimeRadio"
          :fetch-suggestions="queryStartTimeSearch"
          :trigger-on-focus="false" placeholder=""></el-autocomplete>
        <span class="warnTime-middle font14 rzl_fc_darkgray">点</span>
        <span class="warnTime-middle font14 rzl_fc_darkgray">至</span>
        <el-autocomplete class="warnTime-input  warnTime-input-last" 
          v-model="endTime"
          :maxlength="2"
          :disabled="!warnTimeRadio"
          :fetch-suggestions="queryEndTimeSearch"
          :trigger-on-focus="false" placeholder=""></el-autocomplete>
        <span class="warnTime-middle font14 rzl_fc_darkgray">点</span>
        <div class="warnTime-warn rzl_fc_errRed font16" v-show="warnTimeWarn">{{warnTimeWarnText}}</div>
      </div>
    </div>
    <!-- 周末预警 -->
    <div class="configWarn-content weekDay-content" v-show="isWarn">
      <div class="configWarn-right chooseWarnMode-right">
        <div class="warn-chooseWarn">
          <span class="weekDay-warn  font14 rzl_fc_darkgray">周末预警</span>
          <el-switch v-model="isWeekDayWarn" @change="changeWeekDay"></el-switch>
        </div>
      </div>
    </div>
    <IAddModel :isAddModel="isAddModel" 
      :chooseModelList="chooseWarnList"
      @save-model="handleSaveModel"
      @cancel-model="handleCancelModel"></IAddModel>
  </div>  
</template>
<script>
const hitKeysWordEmptyText = '请输入命中关键词！';
const hitKeysWordEnoughText = '命中关键词最多支持3个！';
const warnTimeWarnText = '预警时间不合法，请重新输入！';
const warnTypeWarnText = '请选择预警方式！';
import IAddModel from '@/components/common/AddModel';
export default {
  name: 'i-configWarn',
  components: { IAddModel},
  data () {
    return {
      // 是否开启预警
      isWarn: true,
      // 符合以下专题类型
      isAddWarnMode: true,
      // 已选择专题类型
      chooseWarnList: [],
      // 命中关键词是否开启
      isHitKeysWord: false,
      // 命中关键词
      hitKeysWord: '',
      // 借用查询功能
      hitKeysWordList: [],
      // 命中关键词提示
      warnKeysWordWarn: false,
      // 命中关键词提示信息
      warnKeysWordWarnText: '',
      // 是否添加模型
      isAddModel: false,
      // 预警方式列表
      warnTypeOptions: [],
      // 已选预警方式
      checkedWarns: [],
      // 预警方式提示
      warnTypeWarn: false,
      // 预警方式提示信息
      warnTypeWarnText: '',
      // 预警时间开启
      warnTimeRadio: false,
      // 预警时间提示信息
      warnTimeWarnText: '',
      //预警开始时间点
      startTime: '',
      // 预警结束时间点
      endTime: '',
      startTimeList: [],
      endTimeList: [],
      // 预警时间提示
      warnTimeWarn: false,
      // 是否周末预警
      isWeekDayWarn: false,
    }
  },
  methods: {
    // 添加预警模型
    addWarnMode () {
      if(this.isAddWarnMode){
        this.isAddModel = true;
        this._warnParams();
      }
    },
    // 新增模型数据
    handleSaveModel (modelObj) {
      console.log('保存新增模型');
      console.log(modelObj);
      this.isAddModel = false;
      this._warnParams();
    },
    // 取消新增模型
    handleCancelModel () {
      this.isAddModel = false;
      this._warnParams();
    },
    // 删除已选中专题
    deleteChooseWarn (item) {
      let warnType = item.type;
      let deleteWarnIndex = 0;
      let chooseWarnList = this.chooseWarnList;
      chooseWarnList.forEach( (element, index)=> {
        if( warnType == element.type){
          deleteWarnIndex = index;
          return;
        }
      });
      this.chooseWarnList.splice(deleteWarnIndex, 1);
      this._warnParams();
    },
    // 命中关键词
    queryKeysWordSearch(queryString, callBack) {
      this.hitKeysWord = queryString;      
      let mappingKeyWordsList = this.hitKeysWordList;
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
      let checkedWarns = [];
      this.warnTypeOptions.forEach(item => {
        value.forEach(element => {
          if( item.type == element){
            checkedWarns.push(item.type);
          }
        });
      });
      this.checkedWarns = checkedWarns;
      this._warnParams();
    },
    // 开启预警时间
    chooseWarnTime () {
      this.warnTimeRadio = !this.warnTimeRadio;
      this._warnParams();
    },
    // 预警时间开始
    queryStartTimeSearch (queryString, callBack){
      this.startTime = queryString;
      let mappingStartTimeList = this.startTimeList;
      let results = queryString ? mappingStartTimeList.filter(this._areaFilter(queryString)) : mappingStartTimeList;
      // 调用 callback 返回建议列表的数据
      callBack(results);
      // 生成参数
      this._warnParams();
    },
    queryEndTimeSearch (queryString, callBack){
      this.endTime = queryString;
      let mappingEndTimeList = this.endTimeList;
      let results = queryString ? mappingEndTimeList.filter(this._areaFilter(queryString)) : mappingEndTimeList;
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
      params.isWarn = this.isWarn;
      // 触发条件
      params.isAddWarnMode = this.isAddWarnMode; 
      // 已选择专题类型
      params.chooseWarnList = [];
      params.hitKeysWord = '';
      // 预警方式
      params.checkedWarns = [];
      //周期性简报
      params.startTime = '';
      params.endTime = '';
      // 周末预警
      params.isWeekDayWarn = false;

      // 开启预警的情况
      if(this.isWarn){
        // 预警模型列表  
        if(this.isAddWarnMode){
          this.chooseWarnList.forEach(item => {
            params.chooseWarnList.push(item.type);
          });
        }
        // 命中关键词 '恐怖组织、世界银行、爆炸'
        if(this.isHitKeysWord){        
          // 处理命中的关键词
          let keysWordsList = this.hitKeysWord.split(" ");
          if(keysWordsList.length > 3 && this.isHitKeysWord){
            this.warnKeysWordWarn = true;
            this.warnKeysWordWarnText = hitKeysWordEnoughText;
            return;
          }else{
            params.hitKeysWord = this.hitKeysWord;
            this.warnKeysWordWarn = false;
            this.warnKeysWordWarnText = '';
          }
        }
        // 预警方式 ['1','2','3']
        if(this.checkedWarns.length <=0){
          this.warnTypeWarn = true;
          this.warnTypeWarnText = warnTypeWarnText;
          return;
        }
        params.checkedWarns = this.checkedWarns;
        this.warnTypeWarn = false;
        this.warnTypeWarnText = '';

        //周期性简报
        if(this.warnTimeRadio){
          
          if(this.startTime >= 24 || this.startTime <0){
            this.warnTimeWarn = true;
            this.warnTimeWarnText = warnTimeWarnText;
            return;
          }
          if(this.endTime >= 24 || this.endTime <0) { 
            this.warnTimeWarn=true; 
            this.warnTimeWarnText=warnTimeWarnText; 
            return;
          }
          if(this.endTime <= this.endTime) { 
            this.warnTimeWarn=true; 
            this.warnTimeWarnText=warnTimeWarnText; 
            return; 
          }
          params.startTime = this.startTime;
          params.endTime = this.endTime;
          this.warnTimeWarn=false;
          this.warnTimeWarnText='';
        }
        // 同末预警
        params.isWeekDayWarn = this.isWeekDayWarn;
      }
          
      console.log('预警条件:configWarn');
      console.log(params);
      this.$emit('warn-params', {
        params: params
      });
    },
  },
  created() {
    // 已选专题类型
    const chooseWarnList = [
      {type:'1' ,value:'证券票犯罪'},
      {type:'2',value:'抢劫问题'},
      {type:'3',value:'危险品问题'},
      {type:'4',value:'反恐防恐问题'},
    ];
    this.chooseWarnList = chooseWarnList;
    // 预警方式
    const warnTypeOptions = [
      {type:'mail' ,value:'邮件'},
      {type:'webchat',value:'微信'},
      {type:'app',value:'APP'},
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