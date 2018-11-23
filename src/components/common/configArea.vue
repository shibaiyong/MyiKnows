<template>
  <div class="configArea">
    <div class="configArea-content">
      <div class="configArea-left rzl_fc_darkgray font16">地域范围</div>
      <div class="configArea-right">
        <div class="configArea-region">
          <el-autocomplete class="configArea-input" v-model="configArea" :fetch-suggestions="queryAreaSearch"
            :trigger-on-focus="false" placeholder="" @select="areaSelect"></el-autocomplete>
          <el-popover placement="right-start" trigger="hover" content="地域范围最多支持5个！">
            <el-button slot="reference" class="configArea-hint">
              <i class="el-icon-question rzl_fc_lightGrey font20"></i>
            </el-button>
          </el-popover>
          <div class="configArea-warn rzl_fc_errRed font16" v-show="configAreaWarn">{{configAreaWarnText}}</div>
        </div>
        <div class="configArea-chooseArea">
          <!-- <el-tag size="medium" v-for="(chooseArea, index) in chooseAreaList" :key="index" closable class="rzl_bc_undercoat font14 rzl_fc_darkgray rzl_bd_darkgray tag-chooseArea"
            @close="deleteChooseArea(chooseArea)" :type="chooseArea.regionCode">
            {{chooseArea.value}}
          </el-tag> -->
          <!-- <span>{{chooseArea.value}}</span> -->
          <span class="el-tag rzl_bc_undercoat font14 rzl_fc_darkgray rzl_bd_darkgray tag-chooseArea el-tag--12001 el-tag--medium"
            v-for="(chooseArea, index) in chooseAreaList" :key="index">
            {{chooseArea.regionName}}
            <i class="el-tag__close el-icon-close" @click="deleteChooseArea(chooseArea)"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {regionQuery} from '../../assets/js/api.js';
const chooseAreaEnoughText = "地域范围最多支持5个！";
export default{
  name: 'i-configArea',
  props: {
    // 当前选中的地区
    regionWords: {
      type: Array,
      require: true,
      default () {
        return [];
      }
    }
  },
  watch: {
    regionWords(newVal, oldVal) {
      this.chooseAreaList = this.regionWords;
    },
  },
  data () {
    return {
      // 接收父组件的参数(用于中转)
      chooseAreaList: [],
      // 地区范围
      configArea: '',
      // 查找返回的地域列表
      mappingAreaList: [],
      // 地域提示信息
      configAreaWarn: false,
      // 地域提示信息
      configAreaWarnText: '',
    }
  },
  methods: {
    // 地载范围匹配查找
    queryAreaSearch(queryString, callBack) {
      let mappingAreaList = [];
      let params = {};
      params.partten = queryString;
      regionQuery(params).then(response => {
        if(response.code == 200){
          let data = response.data || [];
          let regionLabel = '';
          let len = 0;
          let prefixLabel = '';
          let suffixLabel = '';
          // 最多显示40个字符
          // data.push({
          //   code: 432123,
          //   regionLabel: '新疆维吾尔自治区-克孜勒苏柯尔克孜自治州-南昌不新技术产业开发区艾溪湖管理处溪湖南社区居委会（南昌高新开发区）'
          // });         
          data.forEach( item => {
            // 处理字符超长的问题
            regionLabel = item.regionLabel;
            len = regionLabel.length;           
            if(len > 40){
              suffixLabel = regionLabel.substr(regionLabel.lastIndexOf('-')+1, len); 
              prefixLabel = regionLabel.substr(0, (40 - suffixLabel.length));
              regionLabel = prefixLabel + '...' + suffixLabel;
            }
            mappingAreaList.push({
              regionCode: item.code,
              value: regionLabel,
              regionValue: item.regionLabel
            });
          });         
          let results = queryString ? mappingAreaList.filter(this._areaFilter(queryString)) : mappingAreaList;
          // 调用 callback 返回建议列表的数据
          callBack(results);
        }
      }).catch(err => {
        this.$message.error('地域查询失败，请重新偿试！');
      });    
    },
    _areaFilter(queryString) {
      return (mappingArea) => {
        return (mappingArea.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    // 选中下拉列表中匹配的地域条件(todo?全部刷新 or 给出提示：针对已经筛选的地区用户二次筛选的情形)
    areaSelect (item) {
      let chooseAreaInnerId = item.regionCode;
      let chooseAreaList = this.chooseAreaList;
      chooseAreaList = chooseAreaList.filter(element => {
        return chooseAreaInnerId != element.regionCode;
      });
      // 限定最多5个
      if(chooseAreaList.length >= 5){
        this.$message.error(chooseAreaEnoughText);
        this.configArea = '';
        return;
      }else{
        chooseAreaList.push({regionCode: chooseAreaInnerId, regionName: item.regionValue});
      }
      this.chooseAreaList = chooseAreaList;
      this.configArea = '';
      this._configAreaParams();
    },
    // 删除已选中地域
    deleteChooseArea (item) {
      let regionCode = item.regionCode;
      let deleteAreaIndex = 0;
      let chooseAreaList = this.chooseAreaList;
      chooseAreaList.forEach( (element, index)=> {
        if( regionCode == element.regionCode){
          deleteAreaIndex = index;
          return;
        }
      });
      this.chooseAreaList.splice(deleteAreaIndex, 1);
      this._configAreaParams();
    },
    _configAreaParams () {
      var params = {};
      params.regionWords = [];
      // 处理返回结果
      this.chooseAreaList.forEach(item => {
        params.regionWords.push({
          regionCode: item.regionCode,
          regionName: item.regionName
        });
      });
      this.$emit('area-params', {
        params: params
      });
    }
  },
  mounted() {
    this.chooseAreaList = this.regionWords;
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
  background: none;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  box-sizing: border-box;
}
.configArea .configArea-hint i:hover{
  color: #1D2088;
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
  width: 85%;
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
.configArea  .configArea-chooseArea{
  margin-top: 20px;
  width: 100%;
}
.configArea  .configArea-chooseArea span{
  margin-right: 15px;
  margin-bottom: 10px;
  display: inline-block;
}
.configArea .tag-chooseArea{
  border-radius: 10px;
}
</style>
