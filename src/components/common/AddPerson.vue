<template>
  <div class="addPerson" v-show="isAddPerson">
    <div class="addPerson-content">
      <div class="addPerson-content-bg"></div>
      <div class="addPerson-content-layout rzl_bc_white">
        <div class="addPerson-title rzl_fc_darkgray font24">添加模型</div>
        <!-- 人物名称关键字 -->
        <div class="addPerson-name">
          <div class="addPerson-left rzl_fc_darkgray font16">人物名称关键词</div>
          <div class="addPerson-right">
            <el-autocomplete class="addPerson-input" v-model="personName" :fetch-suggestions="queryPersonSearch" :trigger-on-focus="false"
              placeholder=""></el-autocomplete>
            <div class="addPerson-hint">
              <i class="el-icon-question rzl_fc_lightGrey font20"></i>
            </div>
          </div>
        </div>
        <!-- 人物职位关键词 -->
        <div class="addPerson-job">
          <div class="addPerson-left rzl_fc_darkgray font16">人物职位关键词</div>
          <div class="addPerson-right">
            <el-input class="addPerson-input" v-model="personJob" placeholder=""></el-input>
            <div class="addPerson-hint">
              <i class="el-icon-question rzl_fc_lightGrey font20"></i>
            </div>
          </div>
        </div>
        <!-- 添加历史 -->
        <div class="addPerson-history rzl_fc_darkgray font16">添加历史</div>
        <!-- 历史列表 -->
        <div class="addPerson-contentList" v-show="addPersonHistoryList.length > 0">
          <ul class="addPerson-personList">
            <li class="rzl_bc_undercoat">
              <div class="personList-name name-header rzl_fc_darkgray font14">姓名</div>
              <div class="personList-job job-header rzl_fc_darkgray font14">职位</div>
              <div class="personList-operate operate-header rzl_fc_darkgray font14"></div>
            </li>
            <li v-for="(person, index) in addPersonHistoryList" :key="index" class="rzl_bd_lightGrey">
              <div class="personList-name rzl_fc_darkgray font14 ">{{person.name}}</div>
              <div class="personList-job rzl_fc_darkgray font14">{{person.job}}</div>
              <div class="personList-operate font14">
                <button type="button" class="delHistory-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="delHistory(index)">删除</button>
              </div>
            </li>
          </ul>
        </div>
        <div class="addPerson-button rzl_bc_white">
          <button type="button" class="addPerson-btn font16 rzl_fc_white rzl_bc_navy rzl_bd_navy" @click="savePerson">保存</button>
          <button type="button" class="addPerson-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="cancelPerson">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'i-addPerson',
  props: {
    isAddPerson: {
      type: Boolean,
      require: true,
    },
  },
  data () {
    return {
      // 人物名称关键词
      personName: '',
      // 人物职位关键词
      personJob: '',
      // 借用查询功能
      historyList: [],
      // 人物历史
      addPersonHistoryList: [],
    }
  },
  methods: {
    // 人物名称匹配查找
    queryPersonSearch(queryString, callBack) {
      this.personName = queryString;
      let mappingHistoryList = this.historyList;
      let results = queryString ? mappingHistoryList.filter(this._areaFilter(queryString)) : mappingHistoryList;
      // 调用 callback 返回建议列表的数据
      callBack(results);
      // 调用接口获取查询到的历史
      this._loadPersonHistoryList();
    },
    _areaFilter(queryString) {
      return (mappingPerson) => {
        return (mappingPerson.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
    },
    _loadPersonHistoryList (){
      var demoHistoryList = [
        {id: '1', name: '李国美', job: '总经理'},
        {id: '2', name: '赵日天', job: 'BOSS'},
        {id: '3', name: '叶良辰', job: 'CEO'},
        {id: '4', name: '赵大宝', job: '事务部大事务官'},
        {id: '5', name: '张国立', job: '购物部经理'},
        {id: '6', name: '王家怀', job: '采购员、出纳'},
        {id: '7', name: '周产波', job: '经理助理'},
        {id: '8', name: '超爱国', job: '经理助理'},
        {id: '9', name: '张三样', job: '行政专员'},
        {id: '10', name: '李家嘴', job: '开发'},
        {id: '11', name: '方苏芸', job: '开发'},
      ];
      this.addPersonHistoryList = demoHistoryList.filter(element => {
        return element.name.indexOf(this.personName) !== -1;
      });
    },
    // 删除历史
    delHistory(index){
      this.addPersonHistoryList.splice(index,1);
    },
    // 保存人物
    savePerson () {
      this.$emit('save-person',{
        personName: this.personName,
        personJob: this.personJob,
      });
    },
    // 取消人物
    cancelPerson () { 
      this.$emit('cancel-person',{});
    },
  },
  created() {
    this.addPersonHistoryList = [
      {id: '1', name: '李国美', job: '总经理'},
      {id: '2', name: '赵日天', job: 'BOSS'},
      {id: '3', name: '叶良辰', job: 'CEO'},
      {id: '4', name: '赵大宝', job: '事务部大事务官'},
      {id: '5', name: '张国立', job: '购物部经理'},
      {id: '6', name: '王家怀', job: '采购员、出纳'},
      {id: '7', name: '周产波', job: '经理助理'},
      {id: '8', name: '超爱国', job: '经理助理'},
      {id: '9', name: '张三样', job: '行政专员'},
      {id: '10', name: '李家嘴', job: '开发'},
      {id: '11', name: '方苏芸', job: '开发'},
    ];
  },

}
</script>
<style scoped>
.addPerson{
  width: 100%;
  height: 100vw;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
}
.addPerson .addPerson-content{
  width: 100%;
  height: 100%;
  position: relative;
}
.addPerson .addPerson-content-bg{
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0,0,0,0.60);
  z-index: 1000;
  }
.addPerson .addPerson-content-layout{
  position: fixed;
  top: calc((100% - 760px)/2);
  left: calc((100% - 900px)/2);
  z-index: 1999;
  width: 900px;
  height: 760px;
  padding: 30px 60px 40px 60px;
  border-radius: 20px;
  box-sizing: border-box;
}
.addPerson .addPerson-title{
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-weight: 700;
}
.addPerson .addPerson-name{
  margin-top: 30px;
  width: 100%;
  height: 38px;
  display: flex;
  justify-content: flex-start;
}
.addPerson .addPerson-job{
  margin-top: 20px;
  width: 100%;
  height: 38px;
  display: flex;
  justify-content: flex-start;
}
.addPerson .addPerson-left{
  width: 122px;
  height: 100%;
  line-height: 38px;
  text-align: left;
  font-weight: 600;
}
.addPerson .addPerson-right{
  width: 658px;
  height: 100%;
  display: flex;
  justify-content: flex-end;
}
.addPerson .addPerson-input{
  width: 590px;
  height: 100%;
}
.addPerson .addPerson-hint{
  padding: 9px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 9px;
  box-sizing: border-box;
}
.addPerson .addPerson-history{
  margin-top: 30px;
  width: 100%;
  height: 20px;
  text-align: left;
  font-weight: 600;
}
/****历史列表****/
.addPerson .addPerson-contentList{
  margin-top: 12px;
  width: 100%;
  height: 400px;
}
.addPerson .addPerson-personList{
  width: 780px;
  height: 100%;
  overflow-y: auto;
}
.addPerson .addPerson-personList li{
  width: 100%;
  height: 70px;
  line-height: 70px;
  text-align: center;
  display: flex;
  justify-content: flex-start;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  box-sizing: border-box;
}
.addPerson .addPerson-personList li:first-child{
  height: 40px;
  line-height: 40px;
  border: none;
}
.addPerson .personList-name{
  width: 230px;
  text-align: left;
}
.addPerson .personList-job{
  width: 450px;
  text-align: left;
}
.addPerson .personList-operate{
  width: 100px;
}
.addPerson .name-header,
.addPerson .job-header{
  font-weight: 600;
  text-align: left;
}
.addPerson .delHistory-btn{
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
/****保存和取消***/
.addPerson .addPerson-button{
  position: absolute;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  width: 320px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.addPerson .addPerson-button .addPerson-btn{
  width: 120px;
  height: 38px;
  line-height: 34px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
}
.addPerson .addPerson-button-btn .addPerson-btn:last-child{
  margin-left: 120px;
}
/* 覆写element-ui的样式*/
.addPerson >>>.el-input__inner{
  width: 590px;
  height: 38px;
  line-height: 38px;
}
</style>