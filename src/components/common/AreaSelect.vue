<template>
  <div class="manyAreaSelect ">
    <div class="item">
      <div class="item-title">
        <span>请选择区域</span>
      </div>
      <div class="item-content">
        <ul>
          <li v-for="(item, index) in chinaArea" :class="item.selected? 'active': ''" :key="index" @click="getCityList(item)">{{item.regionName}}</li>
        </ul>
      </div>
      <div class="item-footer"></div>
    </div>
    <div class="item">
      <div class="item-title">
        <span>请选择省份</span>
      </div>
      <div class="item-content">
        <ul v-show="!notLimitButton.notLimitCity && cityList.length!==0">
          <li v-for="(item, index) in cityList" :class="item.selected? 'active': ''" :key="index" @click="getDistricList(item)">{{item.regionName}}</li>
        </ul>
      </div>
      <div class="item-footer">
        <button type="button" class="button" 
          :class="notLimitButton.notLimitCity?'success': ''" 
          @click="cityNotLitmit({regionName:'不限',regionId:'0'})"
          :disabled="!selectItem.province.regionName">不限城市</button>
      </div>
    </div>
    <div class="item">
      <div class="item-title">
        <span>选择地区</span>
      </div>
      <div class="item-content">
        <ul v-show="districList.length === 0">
          <li>请选择城市</li>
        </ul>
        <ul v-show="!notLimitButton.notLimitCity && !notLimitButton.notLimitDistrict.length !== 0">
          <li v-for="(item,index) in districList" :class="item.selected?'active':''" :key="index" @click="getAreaCombineID(item)">{{item.regionName}}</li>
        </ul>
      </div>
      <div class="item-footer">
        <button type="button" class="button" 
          :class="notLimitButton.notLimitDistrict ?'success':''" 
          @click="districNotLitmit({regionName:'不限',regionId:'0'})"
          :disabled="!selectItem.city.regionName ||!selectItem.province.regionName || notLimitButton.notLimitCity ">不限地区</button>
      </div>
    </div>
    <div class="trangle">
      <div class="trangle-wrap">
        <div class="left">
          <button type="button" class="button" @click="transferToRight" :disabled="direactionStatusToRight">
            <i :class="this.iconDirection.right"></i>
          </button>
        </div>
        <div class="right">
          <button type="button" class="button" @click="transferToLeft" :disabled="direactionStatusToLeft">
            <i :class="this.iconDirection.left"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="item-title">
        <span>已选位置</span>
      </div>
      <div class="item-content">
        <ul class="selectedContent">
          <li v-for="(item, index) in selectedList" :class="item.selected? 'active': ''" :key="index" @click="selectedAreaSignle(item)">{{item.regionName}}</li>
        </ul>
      </div>
      <div class="item-footer">
        <button type="button" class="button" 
          @click="selectedAllArea()" 
          :disabled="rightDataList.length=== 0" 
          :class="selectedAllButtonStatus?'success':''">{{selectedAllButtonStatus?'反选':'全部'}}</button>
      </div>
    </div>
  </div>
</template>
<script>
// 一个快捷进行数组处理的封装工具 
import lodash from 'lodash';
export default {
  name: 'area-select',
  data () {
    return {
      chinaArea: JSON.parse(localStorage.getItem('chinaArea')) || [],
      notLimitButton: {
        notLimitCity: false, // 城市不限
        notLimitDistrict: false, // 地区不限
      },
      selectedAllButtonStatus: false, // 已选位置列表全部按钮的状态
      selectItem: {
        province: {},
        city: {},
        distric: {},
      },
      cityList: [], // 城市列表
      districList: [], // 地区列表
      rightDataList: [], // 选中项目组合成的渲染列表
      rightData: [], // 选中需要移除的
      leftData: [], //右边选中的转发
      selectedData: [], 
      iconDirection: {
        left: 'el-icon-d-arrow-left',
        right: 'el-icon-d-arrow-right'
      }
    }
  },
  props: { 
    // selectedData: { type: [String, Object, Array] }, 
    // iconDirection: { 
    //   type: Object, 
    //   default: function () { // 箭头图标
    //     return { 
    //       left: 'fzicon fz-ad-you', 
    //       right: 'fzicon fz-ad-right' 
    //     } 
    //   } 
    // } 
  },
  computed: {
    // 已选中列表
    selectedList () {
      if(this.selectedData && this.selectedData !== ''){
        this.rightDataList = this.selectedData;
        return this.rightDataList;
      }else{
        return this.rightDataList;
      }
    },
    // 控制可以转移的箭头状态
    direactionStatusToRight () {
      if(this.notLimitButton.notLimitCity || this.notLimitButton.notLimitDistrict){
        if( this.notLimitButton.notLimitCity){
          this.removeAllSelected(this.cityList);
          this.removeAllSelected(this.districList);
          return false;
        }else{
          if(this.notLimitButton.notLimitDistrict){
            this.removeAllSelected(this.districList);
            return false;
          }
        }
        return false;
      }else{
        if(this.selectItem.distric.regionName){
          return false;
        }
        return true;
      }
    },
    // 控制可以移转的箭头状态
    direactionStatusToLeft () {
      if(this.rightData.length === 0){
        return true;
      }else{
        return false;
      }
    },
  },
  methods: {
    // 高亮选中
    mapSelect (list, value, type) {
      if(type){
        return list.map( pitem => {
          if(pitem.regionId == value.regionId){
            if( value.selected && value.selected === true){
              this.$delete(pitem, 'selected');
            }else{
              this.$set(pitem, 'selected', true);
            }
          }
        });
      }else{
        return list.map(pitem => {
          if (pitem.regionId === value.regionId) { 
            if (value.selected && value.selected === true) { 
              this.$delete(pitem, 'selected');
            } else { 
              this.$set(pitem, 'selected', true) 
            } 
          } else { 
            this.$delete(pitem, 'selected'); 
          }
        });
      }
    },
    // 恢复默认
    resetToDefault () {
      this.leftData = []; // 清空需要转移的数组
      this.notLimitButton = { // 重置按钮状态
        notLimitCity: false, // 城市不限
        notLimitDistrict: false, //地区不限
      };
      this.selectItem.city = {};
      this.selectItem.distric = {};
      this.removeAllSelected(this.cityList || []); // 清除选中状态
      this.removeAllSelected(this.districList); //清除选中状态
      this.cityList = [];
      this.districList = [];
    },  
    // 获取城市列表
    getCityList (item) {
      debugger;
      this.resetToDefault();
      if(item){
        this.cityList = item.child? item.child: []; // 获取城市列表
        this.selectItem.province = item; //保存省份对象
        this.mapSelect(this.chinaArea, item); //高亮选中，单选
      }
    },
    // 获取地区列表
    getDistricList (item) {
      this.leftData = []; // 清空需要转移的数组
      this.notLimitButton.notLimitDistrict = false; // 重置按钮状态
      this.removeAllSelected(this.districList); // 清除选中状态
      this.selectItem.distric = {};
      this.districList = [];
      if(item){
        this.districList = item.child; // 获取区域列表、
        this.selectItem.city = item; // 保存城市对象
        this.mapSelect(this.cityList, item); //高亮选择，单选
      }
    },
    // 获取组合ID
    getAreaCombineID (item) {
      if(item){
        this.selectItem.distric = item;
        this.mapSelect(this.districList, item, 'manySlect') // 区域高亮反选，多选

        this.leftData.push({
          regionName: this.selectItem.province.regionName + '-' + this.selectItem.city.regionName + '-' + item.regionName, 
          regionId: this.selectItem.province.regionId + '-' + this.selectItem.city.regionId + '-' + item.regionId
        });
        
        console.log(this.leftData);
        // 此方法的功能未知？
        this.leftData = lodash.uniqBy(this.leftData, 'regionId');
        console.log('loadsh.uniqBy函数==' + this.leftData);

        if(this.leftData.length === this.districList.length){
          this.leftData = [];
          this.selectItem.distric = {};
          this.notLimitButton.notLimitDistrict = true; // 转为不限制地区
          this.leftData.push({ 
            regionName: this.selectItem.province.regionName + '-' + this.selectItem.city.regionName + '-不限', 
            regionId: this.selectItem.province.regionId + '-' + this.selectItem.city.regionId + '-0' 
          });        
        }
      }
    },
    // 城市不限
    cityNotLimit (item) {
      this.leftData = [];
      this.selectItem.distric = {};
      this.removeAllSelected(this.districList);
      this.notLimitButton.notLimitCity = !this.notLimitButton.notLimitCity; // 不限制按钮状态
      this.leftData.push({ 
        regionName: this.selectItem.province.regionName + '-不限-不限', 
        regionId: this.selectItem.province.regionId + '-0-0' 
      });   
    },
    // 区域不限
    districNotLitmit (item) {
      this.leftData = []; // 清空数组
      this.notLimitButton.notLimitDistrict = !this.notLimitButton.notLimitDistrict;
      this.leftData.push({ 
        regionName: this.selectItem.province.regionName + '-' + this.selectItem.city.regionName + '-不限', 
        regionId: this.selectItem.province.regionId + '-' + this.selectItem.city.regionId + '-0' 
      });
      if(!this.notLimitButton.notLimitDistrict){
        this.leftData = [];
      }
    },
    // 选中推入到已选中列表区域
    transferToRight () {
      if(this.leftData && this.leftData.length !== 0){
        // 如果长度为1则表示是不限城市或不限地区这种情况
        if( this.leftData.length === 1){
          let limitId = this.leftData[0].regionId.split('-');
          // 处理：？
          this.rightDataList.map( item => {
            let id = item.regionId.split('-');
            if(limitId[0] === id[0]){
              // 不限城市
              if(limitId[1] === '0'){
                this.rightDataList = this.rightDataList.filter( ritem => {
                  let rid = ritem.regionId.split('-');
                  if(limitId[0] != rid[0]){
                    return ritem;
                  }
                });
              }
            }
          });
        }else{
          // 不限地区
          if(limitId[2] ==='0'){
            this.rightDataList = this.rightDataList.filter(ritem => {
              let rid = ritem.regionId.split('-');
              if( (limitId[0] === rid[0] && limitId[1] === rid[1])){
                if(ritem[2] ==='0'){
                  return ritem;
                }
              }else{
                if(limitId[0] !== rid[0] || limitId[1] !== rid[1]){
                  return ritem;
                }
              }
            });
          }else{
            this.rightDataList = this.rightDataList.filter( ritem => {
              let rid = ritem.regionId.split('-');
              if(limitId[0] === rid[0]){
                if(limitId[1] === rid[1]){
                  if(!(rid[2] === '0')){
                    return ritem;
                  }
                }else {
                  if(!(rid[1] ==='0')){
                    return ritem;
                  }
                }
              }else{
                return ritem;
              }
            });
          }
        } 
      }else{
        let limitId = this.leftData[0].regionId.split('-');
        this.rightDataList = this.rightDataList.filter( ritem => {
          let rid = ritem.regionId.split('-');
          if(limitId[0] === rid[0]){
            if(limitId[1] === rid[1]){
              if(!(rid[2] === '0')){
                return ritem;
              }
            }else{
              if(!(rid[1] === '0')){
                return ritem;
              }
            }
          }else{
            return ritem;
          }
        });
      }
      this.leftData.map( item => {
        this.rightDataList.push(item);
      });
      this.rightDataList = lodash.uniqBy(this.rightDataList, 'regionId');
      this.resetToDefault();
    },
    // 已选择区域：单个选择
    selectedAreaSignle (item) {
    if(item){
      this.rightData = [];
      this.mapSelect(this.rightDataList, item, 'maynSelect'); // 区域高亮选择： 多选
      this.rightDataList.map(item => {
        if(item.selected){
          this.rightData.push(item);
        }
      });
    }
    },
    // 已选中区域的全选和反选
    selectedAllArea () {
      if(this.selectedAllButtonStatus) {
        this.removeAllSelected(this.rightDataList);
        this.rightData = [];
      }else{
        this.rightDataList.map( item => {
          this.$set(item, 'selected', true);
        });
        this.rightData = this.rightDataList;
      }
      this.selectedAllButtonStatus = !this.selectedAllButtonStatus;
    },
    // 从已选择列表区域退回待转发区域
    transferToLeft () {
      if(this.rightData && this.rightData.length !== 0){
        this.rightDataList = this.rightDataList.filter(item => {
          if(!item.selected){
            return item;
          }
        });
        this.rightData = [];
      }
    },
    // 清空选中状态
    removeAllSelected (list) {
      list.map( item => this.$delete(item, 'selected'));
    } 
  },
  watch: {
    // 选择列表的值变动响应外部值的变动
    'rightDataList' (newValue, oldValue) {
      if(newValue.length !== this.rightData.length){
        this.selectedAllButtonStatus = false;
      }else {
        if(newValue.length === 0){
          this.selectedAllButtonStatus = false;
        }else{
          this.selectedAllButtonStatus = true;
        }
      }
      this.$emit('update:selectedData', newValue);
    }
  },
  created() {
    // 构建数据结构 
    let dataDemoList = [
      {
        regionId: '1',
        regionName: '国外地区'
      },{
        regionId: '2',
        regionName: '中国地区',
        child: [
          {
            regionId: '52',
            regionName: '北京',
            child: [
              {
                regionId: '500',
                regionName: '北京市'
              }
            ]
          },{
            regionId: '3',
            regionName: '河北',
            child: [
              {
                regionId: '600',
                regionName: '石家庄'
              },{
                regionId: '601',
                regionName: '唐山'
              },{
                regionId: '602',
                regionName: '衡水'
              },{
                regionId: '603',
                regionName: '沧州'
              }
            ]
          },{
            regionId: '4',
            regionName: '河南',
            child: [
              {
                regionId: '700',
                regionName: '郑州'
              },{
                regionId: '701',
                regionName: '新乡'
              },{
                regionId: '702',
                regionName: '周口'
              },{
                regionId: '703',
                regionName: '信阳'
              },{
                regionId: '704',
                regionName: '漯河'
              }
            ]
          }
        ]
      }
    ];
    this.chinaArea = dataDemoList;
  },
}  
</script>
<style scoped>
ul{
  padding: 0;
  margin: 0;
  max-height: 100%;
  overflow-y: auto;
}  
ul li{
 cursor: pointer; 
 text-align: center; 
 padding: 5px;
}
ul li.active,
ul li:hover{
 background: #e4e8f1; 
 color: #48576a;
}
.manyAreaSelect { 
  position: relative; 
  z-index: 2005; 
}
.manyAreaSelect .item{ 
  border: 1px solid #d1dbe5; 
  background: #fff; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); 
  display: inline-block; 
  vertical-align: middle; 
  min-width: 180px; 
  box-sizing: border-box; 
  position: relative; 
  height: 100%; 
  min-height: 260px; 
  margin: 5px; 
} 
.manyAreaSelect .item .item-title {
  height: 36px; 
  line-height: 36px; 
  background: #fbfdff; 
  margin: 0; 
  border-bottom: 1px solid #d1dbe5; 
  box-sizing: border-box; color: #1f2d3d; 
  text-align:center; 
  } 
.manyAreaSelect .trangle {
  background: transparent; 
  display: inline-block; 
  vertical-align: middle; 
  width: 40px; 
  box-sizing: border-box;
  height: 100%; 
  position: relative; 
}    
 .manyAreaSelect .trangle .trangle-wrap {
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%);
} 
.manyAreaSelect .trangle .left,
.manyAreaSelect .trangle .right {
  margin: 10px 5px; 
} 
.manyAreaSelect .item .item-content {
  font-size: 13px; 
  height: 190px; 
  padding: 8px 2px; 
} 
.manyAreaSelect .item .item-footer{
  padding: 5px 0; 
  height: 40px; 
  text-align: center;  
} 
.selectedContent li {
  text-align: left; 
  padding-left: 25px; 
}
.button { 
  display: inline-block; 
  line-height: 1; 
  white-space: nowrap; 
  cursor: pointer; 
  background: #fff; 
  border: 1px solid#c4c4c4; 
  color: #1f2d3d; 
  margin: 0; 
  border-radius: 4px; 
  padding: 4px; 
  font-size: 12px; 
  border-radius: 4px; 
  -webkit-appearance: button; 
  outline: none; 
}
.button .success{
  background: #42d885; 
  border-color: #42d885; 
  color: #fff; 
} 
.button:disabled {
  color: #bfcbd9;
  cursor: not-allowed; 
  background-image: none; 
  background-color: #eef1f6; 
  border-color: #d1dbe5;  
}
</style>