<template>
  <!-- 常规监测 -->
  <div class="generalConfig rzl_bc_white">
    <!-- 方案名称 -->
    <div class="generalConfig-content programName-content">
      <div class="general-left rzl_fc_darkgray font16">方案名称</div>
      <div class="general-right">
        <el-input class="programName-input" v-model="programName" placeholder=""></el-input>
        <el-popover placement="right-start" trigger="hover" 
          content="名称支持最大20个字符!">
          <el-button slot="reference" class="general-hint">
            <i class="el-icon-question rzl_fc_lightGrey font20"></i>
          </el-button>
        </el-popover>
        <div class="programName-warn rzl_fc_errRed font16" v-show="programNameWarn">{{programNameWarnText}}</div>
      </div>  
    </div>
    <!-- 模块切换 -->
    <div class="generalConfig-content modeType-content">
      <div class="general-left rzl_fc_darkgray font18">模式切换</div>
      <div class="general-right modeType-right">
        <div class="modeType-item" @click="changeMode()" :class="modeIsActive==true? 'rzl_bc_navy rzl_fc_white':''">模糊</div>
        <div class="modeType-item" @click="changeMode()" :class="modeIsActive==false? 'rzl_bc_navy rzl_fc_white':''">精准</div>
      </div>
    </div>
    <!-- 模糊匹配 -->
    <div class="mode-fuzzy" v-show="modeIsActive">
      <div class="generalConfig-content fuzzyType-content">
        <div class="general-left rzl_fc_darkgray font16">模糊匹配</div>
        <div class="general-right fuzzyType-right">
          <el-popover placement="right-start" trigger="hover"
            content="最大支持99个关键词，可以以空格或逗号（中英文均可）隔开，也可以每行一个输入。">
            <el-button slot="reference" class="general-hint">
              <i class="el-icon-question rzl_fc_lightGrey font20"></i>
            </el-button>
          </el-popover>         
        </div>
      </div>
      <!-- 关键词组件输入 -->
      <div class="generalConfig-content fuzzyKeyWords-content">
        <el-input type="textarea" v-model="keysWord" 
          class="keysWord-input"
          :autosize="{minRows: 10, maxRows: 15}" 
          @focus="relativeKeyWords"
          resize="none"></el-input>
        <div class="fuzzyKeyWords-relative" v-show="relativeIsActive">
          <div class="relative-title  rzl_fc_darkgray font16">关键词组合推荐</div>
          <ul class="relative-list">
            <li v-for="(relative, index) in relativeList" :key="index" class="rzl_bc_undercoat font14">{{relative}}</li>
          </ul>
         </div> 
      </div>
      <!-- 排除词 -->
      <div class="generalConfig-content excludeWords-content">
        <div class="general-left rzl_fc_darkgray font16">排除词</div>
        <div class="general-right">
          <el-input class="excludeWords-input" v-model="excludeWords" placeholder=""></el-input>
          <el-popover placement="right-start" trigger="hover" content="最大支持5个词，空格或逗号隔开，每个词最大10个字符!">
            <el-button slot="reference" class="general-hint">
              <i class="el-icon-question rzl_fc_lightGrey font20"></i>
            </el-button>
          </el-popover>
          <div class="excludeWords-warn rzl_fc_errRed font16" v-show="excludeWordsWarn">{{excludeWordsWarnText}}</div>
        </div>
      </div>
      <!-- 地域范围 -->
      <IConfigArea @area-params="configAreaParams"></IConfigArea>
      <!-- 条件选择模块 -->
      <IConfigSelector @selector-params="configSelectorParams"></IConfigSelector>
       <!--预警模块  -->
      <IConfigWarn @warn-params="configWarnParams"></IConfigWarn>

    </div>
    
    <!-- 精准匹配 -->
    <div class="mode-precise" v-show="!modeIsActive">
      <div class="generalConfig-content preciseType-content">
        <div class="general-left rzl_fc_darkgray font16">精准匹配</div>
        <div class="general-right preciseType-right">
            <el-popover placement="right-start" trigger="hover" content="每个组合中，包含词最大5个关键词，排除词最大5个关键词，空格或者逗号隔开，每个词不超10个字符。">
            <el-button slot="reference" class="general-hint">
              <i class="el-icon-question  rzl_fc_lightGrey font20"></i>
            </el-button>
          </el-popover>
        </div>
      </div>
      <!-- 关键词组合 -->
      <IConfigPrecise @precise-params="configPreciseParams"></IConfigPrecise>
      <!-- 地域范围 -->
      <IConfigArea @area-params="configAreaParams"></IConfigArea>
      <!-- 条件选择模块 -->
      <IConfigSelector @selector-params="configSelectorParams"></IConfigSelector>
      <!--预警模块  -->
      <IConfigWarn @warn-params="configWarnParams"></IConfigWarn>
    </div>
    <!-- 保存和取消 -->
    <div class="monitorConfig-btn rzl_bc_white">
      <button type="button" class="config-btn font16 rzl_fc_white rzl_bc_navy rzl_bd_navy" @click="saveConfig">保存</button>
      <button type="button" class="config-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="resetConfig">重置</button>
    </div>
  </div>
</template>
<script>  
import IConfigArea from '@/components/common/ConfigArea';
import IConfigSelector from '@/components/common/ConfigSelector';
import IConfigWarn from '@/components/common/ConfigWarn';
import IConfigPrecise from '@/components/common/ConfigPrecise';

const programNameEmptyText = '方案名称不能为空!';
const programNameEnoughText = '方案名称最多支持20个字符!';
const excludeWordsEmptyText = "排除词不能为空";
const excludeWordsEnoughText = "您输入的排除词不符合要求，请重新输入！";
export default {
  name: 'i-generalConfig',
  components: {IConfigArea, IConfigSelector, IConfigWarn, IConfigPrecise},
  data () {
    return {
      programName: '',
      // 方案名称提示信息是否显示
      programNameWarn: false,
      // 方案名称提示信息
      programNameWarnText: '',
      modeIsActive: true,
      // 关键词，','分隔
      keysWord: '',
      // 相关推荐标识(只查一次)
      relativeIsActive: false,
      // 关键词组合相关推荐
      relativeList: [],
      // 排除词，','分隔
      excludeWords: '',
      // 排除词提示信息是否显示
      excludeWordsWarn: true, 
      // 排除词提示信息
      excludeWordsWarnText: '',
      // 条件筛选参数
      selectorParams: {},
      // 预警参数
      warnParams: {},
      // 地域参数
      chooseAreaList: [],
      // 精准组合词
      preciseGroupList: [],
    }
  },
  watch: {
    programName (newVal, oldVal){
      if(newVal.length > 0 && newVal.length <= 20){
        this.programNameWarnText = '';
        this.programNameWarn = false;
      }else if(newVal.length > 20){
        this.programNameWarnText = programNameEnoughText;
        this.programNameWarn = true;
      }
    },
    keysWord (newVal, oldVal){
      if(newVal.length > 5){
        this.relativeIsActive = false;
      }
    },
  },
  methods: {
    // 切换模式
    changeMode () {
      this.modeIsActive = !this.modeIsActive;
    },
    // 依据方案名称获取相关词组
    relativeKeyWords () {
      if(this.programName.length <= 0){
        this.programNameWarnText = programNameEmptyText;
        this.programNameWarn = true;
        return;
      }else{
        this.programNameWarn = false;
        if(this.keysWord.length < 5 && !this.relativeIsActive){
          this.relativeIsActive = true;
          // 获取相关关键词
          let relativeList = ['银行爆炸问题','银行抢劫问题','银行着火并丢失金钱问题'];
          this.relativeList = relativeList;
        }
      }
    },
    // 精准-组合词参数
    configPreciseParams (params){
      this.preciseGroupList = prams.preciseGroupList;
    },
    // 地域参数
    configAreaParams (obj){
      this.chooseAreaList = obj.params.chooseAreaList;
    },
    // 获取条件选择项的条件参数
    configSelectorParams (obj) {
      this.selectorParams = obj.params;
    },
    // 获取预警部分的参数
    configWarnParams (obj) {
      this.warnParams = obj.params;
    },
    // 保存数据
    saveConfig(){
      // 合并参数
      var params = Object.assign({}, this.selectorParams, this.warnParams);
      
      // 方案名称验证
      params.programName = '';
      if(this.programName.length == 0){
        this.programNameWarnText = programNameEmptyText;
        this.programNameWarn = true;
        return;
      }else if(this.programName.length > 20){
        this.programNameWarnText = programNameEnoughText;
        this.programNameWarn = true;
        return;
      }else{
        this.programNameWarnText = '';
        this.programNameWarn = false;
        params.programName = this.programName;
      }

      debugger;
      // 方案模式
      params.modeType = '';
      if(this.modeIsActive){
        params.modeType = '模糊';

        // 关键词组合验证(todo? 提示信息如何给出)
        params.keysWord = '';
        if(this.keysWord.length == 0){
          return;
        }
        let keyWordsList = this.keysWord.replace(";","|").replace('；', "|").replace(" ", "|").split("|");
        keyWordsList = keyWordsList.filter(item => {
          return item.length > 10;
        });
        if(keyWordsList.length == 0){
          params.keysWord = this.keysWord;
          // 提示信息： todo?
        }else{
          // 提示信息？ todo
          return;
        }

        // 排除词验证
        params.excludeWords = '';
        if(this.excludeWords.length == 0){
          this.excludeWordsWarnText = excludeWordsEmptyText;
          this.excludeWordsWarn = false;
          return;
        }
        let excludeWordsList = this.excludeWords.replace(";","|").replace(" ", "|").split("|");
        excludeWordsList = excludeWordsList.filter(item => {
          return item.length > 10;
        })
        if(excludeWordsList.length == 0){
          params.excludeWords = this.excludeWords;
          this.excludeWordsWarnText = '';
          this.excludeWordsWarn = false;          
        }else{
          this.excludeWordsWarnText = excludeWordsEnoughText;
          this.excludeWordsWarn = true;
          return;
        }
        // 地域范围验证
        params.areaSelect = this.chooseAreaList;
        
      }else{
        params.modeType = '精准';

      }
      
      console.log("generalConfig数据：");
      console.log(params);
    },
    resetConfig () {
      this.programName = '';
      this.programNameWarn = false;
      this.programNameWarnText = '';
      this.keysWord = '';
      this.relativeKeyWords = false;
      this.excludeWords = '';
      this.excludeWordsWarn = false;
      this.excludeWordsWarnText = '';

    },

  },
  created () {
       
  }
}
</script>
<style scoped>
.generalConfig{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.generalConfig-content{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
}
.programName-content{
  margin-top: 22px;
  height: 38px;
}
.general-hint{
  padding: 9px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  box-sizing: border-box;
}
.general-hint i:hover{
  color: #1D2088;
}
.general-left{
  width: 138px;
  height: 100%;
  line-height: 38px;
  text-align: right;
  font-weight: 600;
}
.general-right{
  margin-left: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start; 
}
.programName-input,
.excludeWords-input{
  width: 400px;
  height: 100%;
}
.rzl_fc_lightGrey{
  cursor: pointer;
}
.programName-warn,
.excludeWords-warn{
  min-width: 450px;
  height: 100%;
  line-height: 38px;
}
.dateType-warn{
  margin-left: 10px;
}
/* 模式切换 */
.modeType-content{
  margin-top: 30px;
  height: 28px;
  line-height: 28px;
}
.modeType-right{
  width: 120px;
  height: 100%;
  border: 2px solid #1D2088;
  border-radius: 10px;
  overflow: hidden;
}
.modeType-item{
  width: 50%;
  height: 100%;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
}
.fuzzyKeyWords-relative{
  margin-left: 80px;
  width: 200px;
  height: 187px;
  padding: 20px;
  box-shadow: 0 2px 4px 2px #E5E5E5;
  border-radius: 10px;
  box-sizing: border-box;
}
.relative-title{
  width: 100%;
  line-height: 20px;
  font-weight: 600;
}
.relative-list{
  margin-top: 10px;
  width: 100%;
  padding: 0 25px;  
  box-sizing: border-box;
}
.relative-list li{
  margin-top: 10px;
  width: 100%;
  height: 28px;
  line-height: 28px;
  border-radius: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/*统一的borderColor*/
.programName-input input,
.keysWord-input input,
.excludeWords-input input,
.fuzzyArea-input input{
  border-color: #CDCDCD;
}

/***************匹配*****************/
.mode-fuzzy{
  width: 100%;
  height: auto;
}
.mode-fuzzy .fuzzyType-content,
.mode-precise .preciseType-content{
  margin-top: 18px;
}
.general-hint{
  background: none;
  border: none;
  border-radius: 9px;
}

.mode-fuzzy .fuzzyKeyWords-content{
  width: 100%;
  height: auto;
}
.mode-fuzzy .keysWord-input{
  margin-left: 74px;
  min-width: 412px;
  min-height: 200px;
  border-radius: 10px;
}
.mode-fuzzy .excludeWords-content{
  margin-top: 20px;
}
.mode-fuzzy .warn-chooseWarn{
  margin-top: 20px;
  width: 100%;
}
.warn-chooseWarn span{
  margin-right: 15px;
}
.mode-fuzzy .tag-chooseWarn{
  border-radius: 10px;
}
.generalConfig >>>.el-tag .el-icon-close{
  color: #555555;
}
.generalConfig >>>.el-tag--medium .el-icon-close{
  -webkit-transform: scale(1);
  transform: scale(1);
}
.generalConfig >>>.el-tag .el-icon-close:hover{
  background-color: #1D2088;
  color: #ffffff;
}
.generalConfig >>> .el-radio{
  height: 100%;
  line-height: 38px;
}
.generalConfig >>> .el-radio__inner{
  border-color: #979797;
}
.generalConfig >>> .el-radio__inner::after{
  background-color: #1D2088;
}
.generalConfig >>> .el-radio span,
.generalConfig >>> .el-checkbox span{
  color: #555555;
}
.generalConfig >>> .el-radio__input.is-checked .el-radio__inner,
.generalConfig >>> .el-checkbox__input.is-checked .el-checkbox__inner{
  border-color: #1D2088;
  background: #1D2088;
}
.generalConfig >>> .el-radio__inner:hover,
.generalConfig >>> .el-checkbox__inner:hover,
.generalConfig >>> .is-focus .el-checkbox__inner{
  border-color: #1D2088;
}

.generalConfig >>> .el-checkbox{
  height: 100%;
  line-height: 38px;
}

/******提交按钮*****/
.generalConfig .monitorConfig-btn{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
  padding: 110px 0 100px 240px;
  box-sizing: border-box;
}
.generalConfig .monitorConfig-btn .config-btn{
  width: 120px;
  height: 38px;
  line-height: 34px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
}
.generalConfig .monitorConfig-btn .config-btn:last-child{
  margin-left: 120px;
}

/*********************精准匹配**********************/
.mode-precise{
  width: 100%;
  height: auto;
}

/* 覆写element-ui的input框样式*/
.generalConfig >>>.el-input__inner{
  width: 400px;
  height: 38px;
  line-height: 38px;
  border-radius: 10px;
}

</style>