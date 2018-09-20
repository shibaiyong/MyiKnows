<template>
  <!-- 人物监测 -->
  <div class="personConfig rzl_bc_white">
    <!-- 方案名称 -->
    <div class="personConfig-content programName-content">
      <div class="person-left rzl_fc_darkgray font16">方案名称</div>
      <div class="person-right">
        <el-input class="programName-input" v-model="programName" placeholder=""></el-input>
        <div class="person-hint">
          <i class="el-icon-question rzl_fc_lightGrey font20"></i>
        </div>
        <div class="programName-warn rzl_fc_errRed font16" v-show="programNameWarn">方案名称不能为空</div>
      </div>
    </div>
    <!-- 目标人物添加 -->
    <div class="personConfig-content goal-content">
      <div class="person-left rzl_fc_darkgray font16">目标人物添加</div>
      <div class="person-right goal-right">
        <el-popover placement="right-start" trigger="hover" content="最多支持添加5个目标人物。">
          <el-button slot="reference" class="person-hint">
            <i class="el-icon-question rzl_fc_navy font20"></i>
          </el-button>
        </el-popover>
      </div>
    </div>
    <!-- 添加新人物 -->
    <div class="personConfig-content add-content">
      <div class="person-add font14" @click="addPersonMode">
        <i class="el-icon-circle-plus rzl_fc_navy font20 personAdd-icon"></i>
        <span>添加新人物</span>
      </div>
    </div>
    <!-- 人物列表 -->
    <div class="personConfig-content" v-show="personAddList.length >0">
      <ul class="personConfig-personList">
        <li class="rzl_bc_undercoat">
          <div class="personList-name name-header rzl_fc_darkgray font14">姓名</div>
          <div class="personList-job job-header rzl_fc_darkgray font14">职位</div>
          <div class="personList-operate operate-header rzl_fc_darkgray font14"></div>
        </li>
        <li v-for="(person, index) in personAddList" :key="index" class="rzl_bd_lightGrey">
          <div class="personList-name rzl_fc_darkgray font14 ">{{person.name}}</div>
          <div class="personList-job rzl_fc_darkgray font14">{{person.job}}</div>
          <div class="personList-operate font14">
            <button type="button" class="delPerson-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="delPerson(index)">删除</button>
          </div>
        </li>
      </ul>
    </div>
    <!-- 排除词 -->
    <div class="personConfig-content excludeWords-content">
      <div class="person-left rzl_fc_darkgray font16">排除词</div>
      <div class="person-right">
        <el-input class="excludeWords-input" v-model="excludeWords" placeholder=""></el-input>
        <div class="person-hint">
          <i class="el-icon-question rzl_fc_lightGrey font20"></i>
        </div>
        <div class="excludeWords-warn rzl_fc_errRed font16" v-show="excludeWordsWarn">排除词不能为空</div>
      </div>
    </div>
    <!-- 地域范围 -->
    <IConfigArea @area-params="configAreaParams"></IConfigArea>
    <!-- 条件选择模块 -->
    <IConfigSelector @selector-params="configSelectorParams"></IConfigSelector>
    <!--预警模块  -->
    <IConfigWarn @warn-params="configWarnParams"></IConfigWarn>
    <!-- 添加人物 -->
    <IAddPerson :isAddPerson="isAddPerson" 
      @save-person="handleSavePerson" 
      @cancel-person="handleCancelPerson"></IAddPerson>
  </div>  
</template>
<script>
import IConfigArea from '@/components/common/ConfigArea';
import IConfigSelector from '@/components/common/ConfigSelector';
import IConfigWarn from '@/components/common/ConfigWarn';
import IAddPerson from '@/components/common/AddPerson';
export default {
  name: 'i-personConfig',
  components: {IConfigArea, IConfigSelector, IConfigWarn, IAddPerson},
  data () {
    return {
      programName: '',
      // 方案名称提示信息是否显示
      programNameWarn: true,
      // 是否添加人物
      isAddPerson: false,
      // 添加的人物列表
      personAddList: [],
      // 排除词，','分隔
      excludeWords: '',
      // 排除词提示信息是否显示
      excludeWordsWarn: true,
      // 条件筛选参数
      selectorParams: {},
      // 预警参数
      warnParams: {},
      // 地域参数
      chooseAreaList: [],
    }
  },
  methods: {
    // 添加人物
    addPersonMode () {
      this.isAddPerson = true;
    },
    // 删除人物
    delPerson(index){
      console.log(index);
      this.personAddList.splice(index,1);
    },
    // 新增人物数据
    handleSavePerson (personName, personJob) {
      console.log('保存新增人物');
      this.isAddPerson = false;
      this.personAddList.push({
        name: personName, 
        job: personJob
      });
      this._configAllParams();
    },
    // 取消人物
    handleCancelPerson () {
      this.isAddPerson = false;
      this._configAllParams();
    },
    // 地域参数
    configAreaParams (params){
      this.chooseAreaList = params.chooseAreaList;
      this._configAllParams();
    },
    // 获取条件选择项的条件参数
    configSelectorParams (obj) {
      this.selectorParams = obj.params;
      this._configAllParams();
    },
    // 获取预警部分的参数
    configWarnParams (obj) {
      this.warnParams = obj.params;
      this._configAllParams();
    },
    // 获取本页面配置的所有参数
    _configAllParams(){
      // 合并参数
      var params = Object.assign({}, this.selectorParams, this.warnParams);

      // 方案名称
      params.programName = this.programName;
      //添加的人物  
      params.personAddList = this.personAddList;
      // 排除词
      params.excludeWords = this.excludeWords;
      // 地域范围
      params.areaSelect = this.chooseAreaList;
      
      console.log('所有参数');
      console.log(params);
      this.$emit('config-allParams', {
        params: params
      })
    }
  },
  created() {
    const personAddList = [
      {id: '1', name: '李国美', job: '总经理'},
      {id: '2', name: '赵日天', job: 'BOSS'},
      {id: '3', name: '叶良辰', job: 'CEO'},
    ];
    this.personAddList = personAddList;
  },
}
</script>
<style scoped>
.personConfig{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.personConfig-content{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
}
.personConfig .programName-content{
  margin-top: 22px;
  height: 38px;
}
.personConfig .person-hint{
  padding: 9px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 9px;
  box-sizing: border-box;
}
.personConfig .person-left{
  width: 138px;
  height: 100%;
  line-height: 38px;
  text-align: right;
  font-weight: 600;
}
.personConfig .person-right{
  margin-left: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}
.personConfig .programName-input,
.personConfig .excludeWords-input{
  width: 400px;
  height: 100%;
}
.rzl_fc_lightGrey{
  cursor: pointer;
}
.personConfig .programName-warn,
.personConfig .excludeWords-warn{
  min-width: 450px;
  height: 100%;
  line-height: 38px;
}
.personConfig .dateType-warn{
  margin-left: 10px;
}
.personConfig .goal-content{
  margin-top: 18px;
}
.personConfig .add-content{
  margin-top: 25px;
  width: 100%;
  cursor: pointer;
}
.personConfig .person-add{
  width: 100%;
  padding-left: 54px;
  box-sizing: border-box;
  height: 20px;
  line-height: 20px;
}
.personConfig .person-add span{
  display: inline-block;
  line-height: 20px;
}
.personConfig .person-add .personAdd-icon{
  margin-right: 10px;
  position: relative;
  top: 2px;
}
.personConfig .personConfig-personList{
  width: 680px;
  height: auto;
  margin-top: 30px;
  margin-left: 56px;
}
.personConfig .personConfig-personList li{
  width: 100%;
  height: 70px;
  line-height: 70px;
  padding: 0 30px 0 20px;
  text-align: center;
  display: flex;
  justify-content: flex-start;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  box-sizing: border-box;
}
.personConfig .personConfig-personList li:first-child{
  height: 40px;
  line-height: 40px;
  border: none;
}
.personConfig .personList-name{
  width: 230px;
  text-align: left;
}
.personConfig .personList-job{
  width: 350px;
  text-align: left;
}
.personConfig .personList-operate{
  width: 100px;
}
.name-header,
.job-header{
  font-weight: 600;
  text-align: left;
}

.personConfig .monitorConfig-btn{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
  padding: 110px 0 100px 240px;
  box-sizing: border-box;
}
.personConfig .delPerson-btn{
  width: 60px;
  height: 30px;
  line-height: 26px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
  overflow: hidden;
}
.personConfig .excludeWords-content{
  margin-top: 30px;
}
.personConfig >>> .el-checkbox{
  height: 100%;
  line-height: 38px;
}
.personConfig >>>.el-tag .el-icon-close{
  color: #555555;
}
.personConfig >>>.el-tag--medium .el-icon-close{
  -webkit-transform: scale(1);
  transform: scale(1);
}
.personConfig >>>.el-tag .el-icon-close:hover{
  background-color: #1D2088;
  color: #ffffff;
}
.personConfig >>> .el-radio{
  height: 100%;
  line-height: 38px;
}
.personConfig >>> .el-radio__inner{
  border-color: #979797;
}
.personConfig >>> .el-radio__inner::after{
  background-color: #1D2088;
}
.personConfig >>> .el-radio span,
.personConfig >>> .el-checkbox span{
  color: #555555;
}
.personConfig >>> .el-radio__input.is-checked .el-radio__inner,
.personConfig >>> .el-checkbox__input.is-checked .el-checkbox__inner{
  border-color: #1D2088;
  background: #1D2088;
}
.personConfig >>> .el-radio__inner:hover,
.personConfig >>> .el-checkbox__inner:hover,
.personConfig >>> .is-focus .el-checkbox__inner{
  border-color: #1D2088;
}

/* 覆写element-ui的input框样式*/
.personConfig >>>.el-input__inner{
  width: 400px;
  height: 38px;
  line-height: 38px;
  border-radius: 10px;
}
</style>