<template>
  <!-- 配置页面-添加模型 -->
  <div class="addModel" v-show="isAddModel">
    <div class="addModel-content">
      <div class="addModel-content-bg"></div>
      <div class="addModel-content-layout rzl_bc_white">
        <div class="addModel-title rzl_fc_darkgray font24">添加模型</div>
        <!-- 已选中模型 -->
        <div class="addModel-tag">
          <div class="addModel-selectedTag-tag rzl_fc_darkgray font16 ">已选中模型</div>
          <div class="addModel-selectedTag-item">
            <el-tag size="medium" v-for="(chooseWarn, index) in selectedModeList" :key="index" closable
              class="rzl_bc_undercoat font14 rzl_fc_darkgray rzl_bd_darkgray tag-chooseWarn"
              @close="deleteModel(chooseWarn)" :type="chooseWarn.type">
              {{chooseWarn.value}}
            </el-tag>
          </div>
        </div>
        <!-- 模型查询 -->
        <div class="addModel-query">
          <div class="addModel-query-tag rzl_fc_darkgray font16 ">已选中模型</div>
          <div class="addModel-query-item">
            <el-input class="addModel-input" v-model="queryModel" placeholder=""></el-input>
            <button class="queryModel-btn font16 rzl_fc_white rzl_bc_navy rzl_bd_navy">搜索</button>
          </div>
        </div>
        <div class="addModel-modelList">
          <el-checkbox-group v-model="checkedModels" @change="handleCheckedModelChange">
            <el-checkbox v-for="(modelOption, index) in modelOptions" 
            :label="modelOption.type" :key="index">{{modelOption.value}}</el-checkbox>
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
export default {
  name: 'i-addModel',
  props: {
    isAddModel: {
      type: Boolean, 
      require: true
    },
    chooseModelList: {
      type: Array, 
      require: true, 
      default() {
        return []
      }
    },
  },
  // computed: {
  //   modelOptionsList () {
  //     // 复显选中项
  //     this.modelOptions.forEach(element => {
  //       element.selectType = '';
  //       this.selectedModeList.forEach(item => {
  //         if( element.type == item.type){
  //           element.selectType = element.type;
  //         }
  //       });
  //     });
  //     return this.modelOptions;
  //   }
  // },
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
    }
  },
  methods: {
    // 删除已选择模型
    deleteModel (item) {
      let warnType = item.type;
      let deleteWarnIndex = 0;
      let chooseModelList = this.selectedModeList;
      chooseModelList.forEach( (element, index)=> {
        if( warnType == element.type){
          deleteWarnIndex = index;
          return;
        }
      });
      this.selectedModeList.splice(deleteWarnIndex, 1);
    },
    // 勾选下方查询到的模型(同时将勾选的模型更新到已选中chooseModelList模型列表中)
    handleCheckedModelChange (value) {
      console.log(value);
      let newCheckedModels = [];
      this.modelOptions.forEach(element => {
        value.forEach(item => {
          if(item == element.type){
            newCheckedModels.push(element);
          }
        });
      });
      // 更新已选中模型chooseModelList列表
      newCheckedModels.forEach((item, index) => {
        if( this._getItemIndexOfArray(this.selectedModeList, item) == -1 && this.selectedModeList.length <5){
          this.selectedModeList.push(item)
        }
      });
    },
    // 获取元素在数组中的位置
    _getItemIndexOfArray(array, item){
      let selectedIndex = -1;
      if(array.length >0){
        array.forEach((element, index) => {
          if( element.type == item.type){
            selectedIndex = index;
          }
        })
      }
      return selectedIndex;
    },
    // 保存模型
    saveModel () {
      this.$emit('save-model',{
        chooseModelList: this.chooseModelList || [],
      });
    },
    // 取消模型
    cancelModel () {
      this.$emit('cancel-model',{});
    },
  },
  created() {
    // 将父元素传入的值 重新保存起来
    this.selectedModeList = this.chooseModelList;
    // 所有模型
    const modelOptions = [
      {type:'1' ,value:'证券票犯罪'},
      {type:'2',value:'抢劫问题'},
      {type:'3',value:'危险品问题'},
      {type:'4',value:'反恐防恐问题'},
      {type:'5' ,value:'反腐舆情类'},
      {type:'6',value:'政策导向类'},
      {type:'7',value:'涉黄舆情类'},
      {type:'8',value:'涉恐舆情类'},
      {type:'9',value:'反动舆情类9'},
      {type:'10',value:'反动舆情类10'},
      {type:'11',value:'反动舆情类11'},
      {type:'12',value:'反动舆情类12'},
      {type:'13',value:'反动舆情类13'},
      {type:'14',value:'反动舆情类14'},
      {type:'15',value:'反动舆情类15'},
      {type:'16',value:'反动舆情类16'},
      {type:'17',value:'反动舆情类17'},
      {type:'18',value:'反动舆情类18'},
      {type:'19',value:'反动舆情类19'},
      {type:'20',value:'反动舆情类20'},
      {type:'21',value:'反动舆情类21'},
      {type:'22',value:'反动舆情类22'},
      {type:'23',value:'反动舆情类23'},
      {type:'24',value:'反动舆情类24'},
      {type:'25',value:'反动舆情类25'},
      {type:'26',value:'反动舆情类26'},
      {type:'27',value:'反动舆情类27'},
      {type:'28',value:'反动舆情类28'},
      {type:'29',value:'反动舆情类29'},
      {type:'30',value:'反动舆情类30'},
    ];
    this.modelOptions = modelOptions;
  },

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
  height: 500px;
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
  height: 145px;
  padding-top: 15px;
  overflow-y: auto;
}

/****保存和取消***/
.addModel-button{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
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
.addModel-button-btn .addModel-btn:last-child{
  margin-left: 120px;
}

/* 覆写element-ui的样式*/
.addModel >>>.el-input__inner{
  width: 300px;
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