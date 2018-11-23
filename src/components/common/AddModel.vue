<template>
  <!-- 配置页面-添加模型 -->
  <div class="addModel" v-show="isAddModel">
    <div class="addModel-content">
      <!-- <div class="addModel-content-bg"></div> -->
      <div class="addModel-content-layout rzl_bc_white">
        <div class="addModel-title rzl_fc_darkgray font24">添加模型</div>
        <!-- 已选中模型 -->
        <div class="addModel-tag">
          <div class="addModel-selectedTag-tag rzl_fc_darkgray font16 ">已选中模型</div>
          <div class="addModel-selectedTag-item">
            <!-- <el-tag size="medium" v-for="(chooseWarn, index) in selectedModeList" :key="index" closable
              class="rzl_bc_undercoat font14 rzl_fc_darkgray rzl_bd_darkgray tag-chooseWarn"
              @close="deleteModel(chooseWarn)" :type="chooseWarn.type">
              {{chooseWarn.value}}
            </el-tag> -->
            <span class="el-tag rzl_bc_undercoat font14 rzl_fc_darkgray rzl_bd_darkgray tag-chooseWarn el-tag--1 el-tag--medium"
              v-for="(chooseWarn, index) in selectedModeList" :key="index">
            {{chooseWarn.name}}</span>
          </div>
        </div>
        <!-- 模型查询 -->
        <div class="addModel-query">
          <div class="addModel-query-tag rzl_fc_darkgray font16 ">模型列表</div>
          <div class="addModel-query-item">
            <el-input class="addModel-input" v-model="queryModel" placeholder=""></el-input>
            <button class="queryModel-btn font16 rzl_fc_white rzl_bc_navy rzl_bd_navy" @click="queryModelList">搜索</button>
          </div>
        </div>
        <div class="addModel-modelList">
          <el-checkbox-group v-model="checkedModels" @change="handleCheckedModelChange">
            <el-checkbox v-for="(modelOption, index) in modelOptions"
            :label="modelOption.id"
            v-bind:checked="modelOption.id == modelOption.checkId"
            :key="index">{{modelOption.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      <div class="addModel-button rzl_bc_white">
        <button type="button" class="addModel-btn font16 rzl_fc_white rzl_bc_navy rzl_bd_navy" @click="saveModel">保存</button>
        <button type="button" class="addModel-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="cancelModel">取消</button>
      </div>
      </div>
    </div>
  </div>
</template>
<script>
import {modelShow} from '../../assets/js/api.js';
const addModelEnoughText = "最多支持勾选5个模型！";
export default {
  name: 'i-addModel',
  props: {
    isAddModel: {
      type: Boolean,
      require: true
    },
    checkedWarnList: {
      type: Array,
      require: true,
      default() {
        return []
      }
    },
  },
  watch: {
    checkedWarnList (newVal, oldVal){
      // 将父元素传入的值 重新保存起来
      this.selectedModeList = this.checkedWarnList || [];
      return this.checkedWarnList;
    }
  },
  data () {
    return {
      // 已选中的列表(此处数据由父组件传入，在这里需中转一下)
      selectedModeList: [],
      // 模型列表
      modelOptions: [],
      // 查询模型
      queryModel: '',
      // 通过查询后勾选的模型列表
      checkedModels: [],
      // 存放全部的模型数据
      allModelOptions: [],
    }
  },
  //  watch: {
  //    modelOptions (newVal, oldVal){
  //      this.modelOptions = [];
  //      this.modelOptions = newVal;
  //      console.log('变化了');
  //    }
  //  },
  methods: {
    // 删除已选择模型
    deleteModel (item) {
      let warnId = item.id;
      let deleteWarnIndex = 0;
      let chooseModelList = this.selectedModeList;
      chooseModelList.forEach( (element, index)=> {
        if( warnId == element.id){
          deleteWarnIndex = index;
          return;
        }
      });
      this.selectedModeList.splice(deleteWarnIndex, 1);
      let modelOptions = this.modelOptions;
      // 同时更新下方的选中状态
      modelOptions.forEach( element => {
        if( element.id == warnId){
          element.checkId = '';
        }
      });
      this.modelOptions = modelOptions;
      console.log(this.modelOptions);
    },
    // 勾选下方查询到的模型(同时将勾选的模型更新到已选中chooseModelList模型列表中)
    handleCheckedModelChange (value) {
      
      if(value.length > 5){
        // 获取最后一个选中项，将其选中状态取消
        let lastId = value.pop();
        this.modelOptions.forEach( item => {
          if(item.id == lastId){
            item.checkId = '';
          }
        });
        this.$message.error(addModelEnoughText);
        return;
      }
      let newCheckedModels = [];
      this.allModelOptions.forEach(element => {
        value.forEach(item => {
          if(item == element.id){
            element.checkId = element.id;
            newCheckedModels.push(element);
          }else{
            element.checkId = '';
          }
        });
      });
      // 更新已选中模型chooseModelList列表
      this.selectedModeList = newCheckedModels;
    },
    queryModelList () {
      let params = {};
      params.name = this.queryModel || '';
      modelShow(params).then(response => {
        if(response.code == 200){
          this.modelOptions = response.data || [];
          if(this.modelOptions.length > 0){
            this.modelOptions.forEach( item => {
              this.selectedModeList.forEach(element => {
                if(item.id == element.id){
                  item.checkId = item.id;
                }
              });
            });
          }
        }
      }).catch(error => {
//        this.$message.error('系统异常，请重新偿试！');
      });
    },
    // 保存模型
    saveModel () {
      document.getElementById('configMask').style.display= 'none';
      this.$emit('save-model',{
        chooseModelList: this.selectedModeList || [],
      });
    },
    // 取消模型
    cancelModel () {
      this.$emit('cancel-model',{});
      document.getElementById('configMask').style.display= 'none';
    },
  },
  mounted() {
    // 将父元素传入的值 重新保存起来
    this.selectedModeList = this.checkedWarnList || [];
    this.queryModelList();

    // modelOptions.forEach( item => {
    //   this.selectedModeList.forEach(element => {
    //     if(item.id == element.id){
    //       item.checkId = item.id;
    //     }
    //   });
    // });
    // this.modelOptions = modelOptions;
  },
  created() {
    let params = {};
    params.name = '';
    modelShow(params).then(response => {
      if(response.code == 200){
        this.allModelOptions = response.data || [];
      }
    }).catch(error => {
//        this.$message.error('系统异常，请重新偿试！');
    });
  }
}
</script>
<style scoped>
.addModel{
  width: 100%;
  height: 100vw;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
}
.addModel-content{
  width: 100%;
  height: 100%;
  position: relative;
}
.addModel-content-bg{
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0,0,0,0.60);
  z-index: 1000;
}
.addModel-content-layout{
  position: fixed;
  top: calc((100% - 500px)/2);
  left: calc((100% - 900px)/2);
  z-index: 1999;
  width: 900px;
  min-height: 500px;
  padding: 30px 70px 40px 60px;
  border-radius: 20px;
  box-sizing: border-box;
}
.addModel-title{
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-weight: 700;
}
/***已选中模型**/
.addModel-tag{
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
}
.addModel-selectedTag-tag{
  width: 120px;
  line-height: 28px;
  text-align: left;
  font-weight: 600;
}
.addModel-selectedTag-item{
  width: 650px;
  line-height: 28px;
}
.tag-chooseWarn{
  margin-right: 15px;
  margin-bottom: 10px;
}
/***模型查询**/
.addModel-query{
  width: 100%;
  height: 38px;
  margin-top: 30px;
  padding-bottom: 20px;
  border-bottom: 1px;
  border-color: #cdcdcd;
  border-style: solid;
  display: flex;
  justify-content: space-between;
}
.addModel-query-tag{
  width: 120px;
  line-height: 38px;
  text-align: left;
  font-weight: 600;
}
.addModel-query-item{
  width: 650px;
  line-height: 38px;
  display: flex;
  justify-content: flex-end;
}
.addModel-input{
  width: 300px;
  height: 38px;
  margin-right: 20px;
  border-radius: 10px;
}
.queryModel-btn{
  width: 60px;
  height: 38px;
  line-height: 34px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
  overflow: hidden;
}
/****模型列表*****/
.addModel-modelList{
  width: 100%;
  height: 170px;
  padding-top: 15px;
  overflow-y: auto;
}
/****保存和取消***/
.addModel-button{
  margin: 0 auto;
  width: 340px;
  display: flex;
  justify-content: space-between;
  padding-top: 40px;
  box-sizing: border-box;
}
.addModel-button .addModel-btn{
  width: 120px;
  height: 38px;
  line-height: 34px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
}

/* 覆写element-ui的样式*/
.addModel >>>.el-input__inner{
  width: 300px !important;
  height: 38px;
  line-height: 38px;
}
.addModel >>> .el-checkbox:first-child{
  margin-right: 30px;
}
.addModel >>> .el-checkbox+.el-checkbox{
  margin-left: 0;
  margin-right: 30px;
}
</style>
