<template>
  <div class="configArea">
    <div class="configArea-content">
      <div class="configArea-left rzl_fc_darkgray font16">地域范围</div>
      <div class="configArea-right">
        <div class="configArea-region">
          <el-autocomplete class="configArea-input" v-model="fuzzyArea" :fetch-suggestions="queryAreaSearch"
            :trigger-on-focus="false" placeholder="" @select="areaSelect"></el-autocomplete>
          <div class="configArea-hint">
            <i class="el-icon-question rzl_fc_lightGrey font20"></i>
          </div>
          <div class="configArea-warn rzl_fc_errRed font16" v-show="configAreaWarn">最多可选择几个地域？</div>
        </div>
        <div class="configArea-chooseArea">
          <el-tag size="medium" v-for="(chooseArea, index) in chooseAreaList" :key="index" closable class="rzl_bc_undercoat font14 rzl_fc_darkgray rzl_bd_darkgray tag-chooseArea"
            @close="deleteChooseArea(chooseArea)" :type="chooseArea.innerId">
            {{chooseArea.value}}
          </el-tag>
        </div>
      </div>
    </div>
  </div>  
</template>
<script>
export default{
  name: 'i-configArea',
  data () {
    return {
      // 地区范围
      configArea: '',
      // 查找返回的地域列表
      mappingAreaList: [],
      fuzzyArea: '',
      // 当前选中的地区
      chooseAreaList: [],
      // 地域提示信息
      configAreaWarn: true,
    }
  },
  methods: {
    // 地载范围匹配查找
    queryAreaSearch(queryString, callBack) {
      let mappingAreaList = this.mappingAreaList;
      let results = queryString ? mappingAreaList.filter(this._areaFilter(queryString)) : mappingAreaList;
      // 调用 callback 返回建议列表的数据
      callBack(results);
    },
    _areaFilter(queryString) {
      return (mappingArea) => {
        return (mappingArea.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    // 选中下拉列表中匹配的地域条件(todo?全部刷新 or 给出提示：针对已经筛选的地区用户二次筛选的情形)
    areaSelect (item) {
      let chooseAreaInnerId = item.innerId.split('-')[1];
      let chooseAreaList = this.chooseAreaList;
      chooseAreaList = chooseAreaList.filter(element => {
        return chooseAreaInnerId != element.innerId;
      });
      chooseAreaList.push({innerId: chooseAreaInnerId, value: item.value});
      this.chooseAreaList = chooseAreaList;
      this.configArea = '';
      this._configAreaParams();
    },
    // 删除已选中地域
    deleteChooseArea (item) {
      let innerId = item.innerId;
      let deleteAreaIndex = 0;
      let chooseAreaList = this.chooseAreaList;
      chooseAreaList.forEach( (element, index)=> {
        if( innerId == element.innerId){
          deleteAreaIndex = index;
          return;
        }
      });
      this.chooseAreaList.splice(deleteAreaIndex, 1);
      this._configAreaParams();
    },
    _configAreaParams () {
      var params = {};
      params.chooseAreaList = this.chooseAreaList;
      console.log(params.chooseAreaList);
      this.$emit('area-params', {
        params: params
      });
    }
  },
  created() {
    this.mappingAreaList = [
      { "innerId":'10000-10000',"value": "北京"},
      { "innerId":'10000-10001',"value": "北京-东城区"},
      { "innerId":'10000-10002',"value": "北京-西城区"},
      { "innerId":'10000-10003',"value": "北京-海淀区"},
      { "innerId":'12000-12000',"value": "河北"},
      { "innerId":'12000-12001',"value": "河北-张家口"},
      { "innerId":'12000-12002',"value": "河北-唐山"},
      { "innerId":'12000-12003',"value": "河北-石家庄"},
      { "innerId":'12000-12004',"value": "河北-沧州"},
      {"innerId":'12800-12800', "value": "张家口"},
      {"innerId":'12800-12801', "value": "张家口-怀来县"},
      {"innerId":'12800-12802', "value": "张家口-张北县"},
      { "innerId":'12800-12803', "value": "张家口-万全区"},
      { "innerId":'12800-12804', "value": "张家口-赤城县"},
      { "innerId":'12800-12805', "value": "张家口-桥东区"},
      { "innerId":'12800-12806', "value": "张家口-桥西区"},
    ];
  },
}
</script>
<style scoped>
.configArea{
  width: 100%;
  height: auto;
  overflow: hidden;
}
.configArea .configArea-content{
  margin-top: 30px;
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
}
.configArea .configArea-hint{
  padding: 9px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  box-sizing: border-box;
}
.configArea .configArea-left{
  width: 138px;
  height: 100%;
  line-height: 38px;
  text-align: right;
  font-weight: 600;
}
.configArea .configArea-right{
  margin-left: 20px;
  width: 100%;
  height: 100%;
  min-height: 38px;
  display: block;
  justify-content: flex-start;
}
.configArea .configArea-region{
  width: 100%;
  height: 38px;
  display: flex;
  justify-content: flex-start;
}
.configArea .configArea-input{
  width: 400px;
  height: 100%;
}
.configArea .configArea-warn{
  min-width: 450px;
  height: 100%;
  line-height: 38px;
}
.configArea  .configArea-chooseArea,{
  margin-top: 20px;
  width: 100%;
}
.configArea  .configArea-chooseArea span{
  margin-right: 15px;
}
.configArea .tag-chooseArea{
border-radius: 10px;
}
</style>