<template>
  <div class="addPerson" v-show="isAddPerson">
    <div class="addPerson-content">
      <!-- <div class="addPerson-content-bg"></div> -->
      <div class="addPerson-content-layout rzl_bc_white">
        <div class="addPerson-title rzl_fc_darkgray font24">添加模型</div>
        <!-- 人物名称关键字 -->
        <div class="addPerson-name">
          <div class="addPerson-left rzl_fc_darkgray font16"><i class="rzl_fc_errRed require-color">*</i>人物名称关键词</div>
          <div class="addPerson-right">
            <el-autocomplete class="addPerson-input" v-model="personName" :fetch-suggestions="queryPersonSearch" :trigger-on-focus="false"
              placeholder=""></el-autocomplete>
            <el-popover placement="right-start" trigger="hover" content="人物名称不得超过10个字!">
              <el-button slot="reference" class="addPerson-hint">
                <i class="el-icon-question  rzl_fc_lightGrey font20"></i>
              </el-button>
            </el-popover>
          </div>
        </div>
        <!-- 人物职位关键词 -->
        <div class="addPerson-job">
          <div class="addPerson-left rzl_fc_darkgray font16"><i class="rzl_fc_errRed require-color">*</i>人物职位关键词</div>
          <div class="addPerson-right">
            <el-input class="addPerson-input" v-model="personJob" placeholder=""></el-input>
            <el-popover placement="right-start" trigger="hover" content="人物职位关键词不可超过4个，每个小于10字，用空格隔开!">
              <el-button slot="reference" class="addPerson-hint">
                <i class="el-icon-question  rzl_fc_lightGrey font20"></i>
              </el-button>
            </el-popover>
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
              <!--<div class="personList-operate font14">-->
                <!--<button type="button" class="delHistory-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="delHistory(index)">删除</button>-->
              <!--</div>-->
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
import {recommendUsers} from '../../assets/js/api.js';
const nameEmptyText = '人物名称关键词不能为空!';
const nameEnoughText = '人物名称关键词最多支持10个字符!';
const jobEmptyText = "人物职位关键词不能为空";
const jobEnoughText = "您输入的人物职位关键词不符合要求，请重新输入！";
const jobFullText = "最多支持添加5个目标人物!";
export default {
  name: 'i-addPerson',
  props: {
    isAddPerson: {
      type: Boolean,
      require: true,
    },
    personWords: {
      type: Array,
      require: true,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      // 人物名称关键词
      personName: '',
      // 人物职位关键词
      personJob: '',
      // 目前添加的人物列表
      personWordsAdded: [],
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
      let params = {
        userName: this.personName
      };
      recommendUsers(params).then(response => {
        console.log(response);
        if(response.code == 200){
          this.addPersonHistoryList = response.data || [];
        }
      }).catch(error => {
//        this.$message.error('系统异常，请重新偿试！');
      });
    },
    // 删除历史
//    delHistory(index){
//      this.addPersonHistoryList.splice(index,1);
//    },
    // 保存人物
    savePerson () {
      // 人物名称验证
      if(this.personName == '' || this.personName.length == 0){
        this.$message.error(nameEmptyText);
        return
      }
      if( this.personName.length > 10){
        this.$message.error(nameEnoughText);
        return
      }
      // 人物职位验证
      if(this.personJob == '' || this.personJob.length == 0){
        this.$message.error(jobEmptyText);
        return
      }
      let jobs = this.personJob.split(' ');
      if(jobs.length > 4){
        this.$message.error(jobEnoughText);
        return
      }
      jobs = jobs.filter(item => {
        return item.length > 10;
      });
      if(jobs.length > 0){
        this.$message.error(jobEnoughText);
        return
      }

      // 不超过5个
      if(this.personWordsAdded.length >=5){
        this.$message.error(jobFullText);
        return
      }

      this.$emit('save-person',{
        name: this.$iknowsUtil.trim(this.personName),
        job: this.$iknowsUtil.trim(this.personJob),
      });
      this.personName = '';
      this.personJob = '';
      document.getElementById('configMask').style.display= 'none';
    },
    // 取消人物
    cancelPerson () {
      this.$emit('cancel-person',{});
      this.personName = '';
      this.personJob = '';
      document.getElementById('configMask').style.display= 'none';
    },
  },
  mounted() {
    this.personWordsAdded = this.personWords;
    this.personName = '';
    this.personJob = '';
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
@media screen and (max-width:1440px){
  .addPerson .addPerson-content-layout{
    top: calc((100% - 560px)/2);
    left: calc((100% - 900px)/2);
    width: 900px;
    height: 560px;
  }
  .addPerson .addPerson-contentList{
    height: 200px;
  }
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
  width: 130px;
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
.addPerson .addPerson-hint i:hover{
  color: #1D2088;
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
  width: 210px;
  padding-left: 20px;
  text-align: left;
}
.addPerson .personList-job{
  width: 520px;
  text-align: left;
}
/*.addPerson .personList-operate{*/
  /*width: 100px;*/
/*}*/
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
