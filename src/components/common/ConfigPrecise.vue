<template>
  <!-- 精准匹配组合 -->
  <div class="configPrecise">
    <ul class="configPrecise-list">
      <li v-for="(preciseGroup, index) in preciseGroupList" :index="index">
        <div class="configPrecise-groupTitle">
          <div class="configPrecise-left  rzl_fc_darkgray font18">{{preciseGroup.groupName}}</div>
        </div>
        <!-- 包含 -->
        <div class="configPrecise-contain">
          <div class="configPrecise-left  rzl_fc_darkgray font14"><i class="rzl_fc_errRed require-color">*</i>{{preciseGroup.contain}}</div>
          <div class="configPrecise-right">
            <el-input class="configPrecise-input" v-model="preciseGroup.containValue"
              placeholder="" value="preciseGroup.containValue" @blur="handleAllInput"></el-input>
            <!-- <el-autocomplete class="configPrecise-input"
              v-model="preciseGroup.containValue"
              value="preciseGroup.containValue"
              :fetch-suggestions="querypreciseWordsearch" :trigger-on-focus="false" placeholder=""></el-autocomplete> -->
          </div>
        </div>
        <!-- 排除 -->
        <div class="configPrecise-exclude">
          <div class="configPrecise-left  rzl_fc_darkgray font14">{{preciseGroup.exclude}}</div>
          <div class="configPrecise-right">
            <el-input class="configPrecise-input" v-model="preciseGroup.excludeValue"
              placeholder="" value="preciseGroup.excludeValue" @blur="handleAllInput"></el-input>
            <div class="general-add" @click="addPreciseGroup">
              <i class="el-icon-circle-plus rzl_fc_navy font20"></i>
            </div>
            <div class="general-del" @click="delPreciseGroup(index)">
              <i class="el-icon-remove rzl_fc_navy font20"></i>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'i-configPrecise',
  props: {
    // 当前选中的地区
    preciseWords: {
      type: Array,
      require: true,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      preciseGroupList: []
    }
  },
  watch: {
    preciseWords(newVal, oldVal) {
      this.preciseGroupList = this.preciseWords;
    },
  },
  methods: {
    // 添加组合
    addPreciseGroup () {
      let groupId = this.preciseGroupList.length + 1;
      if(groupId > 5){
        return false;
      }
      let preciseGroup = {
        groupName: '组合',
        contain: '包含',
        cantainValue: '',
        exclude: '排除',
        excludeValue: ''
      };
      this.preciseGroupList.push(preciseGroup);
    },
    // 删除组合
    delPreciseGroup (index) {
      if(this.preciseGroupList.length > 1){
        this.preciseGroupList.splice(index, 1);
      }
    },
    // 监听所有input框输入
    handleAllInput( ){
      this._preciseParams();
    },
    _preciseParams () {
       console.log(this.preciseGroupList);
      var params = {};
      params.preciseGroupList = this.preciseGroupList;
      this.$emit('precise-params', {
        params: params
      });
    }
  },
  mounted() {
    this.preciseGroupList = this.preciseWords;
    // 处理数据结构
    if(this.preciseGroupList && this.preciseGroupList.length > 0){
      this.preciseGroupList.forEach( item => {
        let include = item.containValue && item.containValue.length >0? item.containValue.join(','): '';
        let execlude = item.excludeValue && item.excludeValue.length>0? item.excludeValue.join(','): '';
        item.containValue = include;
        item.excludeValue = execlude;
      });
    }

    
    
  },
}
</script>
<style scoped>
.configPrecise{
  width: 100%;
  height: auto;
  overflow: hidden
}
.configPrecise-list{
  width: 100%;
}
.configPrecise-list li{
  width: 100%;
  height: 136px;
  padding: 10px 0 20px 0;
}
.configPrecise-groupTitle{
  width: 100%;
  height: 20px;
  padding-bottom: 20px;
}
.configPrecise-groupTitle div{
  line-height: 20px;
}
.configPrecise-left{
  width: 138px;
  height: 100%;
  line-height: 38px;
  text-align: right;
  font-weight: 600;
}
.configPrecise-right{
  margin-left: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}
.configPrecise-contain,
.configPrecise-exclude{
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
.configPrecise-exclude{
  margin-top: 10px;
}
.configPrecise-input{
  width: 400px;
  height: 100%;
}
.configPrecise-input input{
  border-color: #CDCDCD;
}
.general-add,
.general-del{
  padding: 9px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  box-sizing: border-box;
}
/* 覆写element-ui的input框样式*/
.configPrecise >>>.el-input__inner{
  width: 400px;
  height: 38px;
  line-height: 38px;
  border-radius: 10px;
}
</style>
