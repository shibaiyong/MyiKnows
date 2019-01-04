<template>
      <div :id="idd" class="calenderWrapper">
        <div class="inputCalender">
            <input :name="idd" type="text" v-model="selectValue"/>
            <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow" :class={rotate:rotate}></i>
        </div>
        <div class="selectWrapper" v-show="isShow">
            <ul>
              <li v-for="item in datas" :class="[item.id == id ? 'selected' : '']" @click="changeState(item)">{{item.name}}</li>
              
            </ul>
        </div>
    </div>  
</template>
<script>
// import TreeContent from "@/components/common/TreeContent"

export default {
  name: "Select",
  props:{
    
    datas:{
      type:Array,
      default:function(){
        return [
          {id:1,name:'item1'},
          {id:2,name:'item2'},
          {id:3,name:'item3'}
        ]
      }
    },
    idd:{
      type:String,
      required:true
    }
  },
  data() {
    return {
      isShow:false,
      isselected:false,
      id:'',
      selectValue:'',
      rotate:false
    };
  },
  updated() {},
  beforeCreate: function() {
    
  },
  created() {
    console.log(this.idd)
  },
  methods: {
    
    //点击下拉框的某一项时，改变状态
    changeState(item){
      this.id = item.id
      this.selectValue = item.name
      //this.$emit('input',item.name)//向外传值
    }
    
  },
  mounted() {

    document.getElementById(this.idd).addEventListener('click', (e)=>{
      //document.addEventListener('click', (e)=>{
　　　 //下面这句代码是获取 点击的区域是否包含你的菜单，如果包含，说明点击的是菜单以外，不包含则为菜单以内
      //let flag = e.target.contains(document.getElementsByClassName('selectWrapper')[0])
      let parentName = (e.target.parentNode.parentNode.parentNode).getAttribute('id')
      if(e.target.getAttribute('name') != this.idd || parentName != this.idd) this.isShow = false
      if(e.target.getAttribute('name') == this.idd) this.isShow = true; this.rotate = true
      
    })
  }
};
</script>
<style scoped>
.calenderWrapper{
  width:158px;
  position: relative;
  display:inline-block;
  z-index: 99;
  vertical-align: middle;
}
.inputCalender{
  overflow: hidden;
  border: 1px solid #99601c ;
  /* 防止出现内阴影 */
  border-radius: 16px;
  width:100%;
  height: 30px;
  background:#ffe6c1;
}
.inputCalender input {
  padding-left: 10px;
  margin: 0;
  height: 100%;
  border:none;
  background:#ffe6c1;
  width:85%;
}
ul {
  overflow: hidden;
  
}
ul,
ul li {
  list-style: none;
  width:100%;
  
}
ul li {
  height: 34px;
  line-height: 34px;
  padding-left:16px;
  box-sizing: border-box
}
.inputCalender,.selectWrapper {
  width: 100%;
}
.selectWrapper{
  border-top:none;
  position: absolute;
  border:1px solid #e4e7ed;
  left:0;
  top:38px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  background:white;
  padding:6px 0;
}
.selectWrapper ul li:hover{
  background:#f5f7fa;
}
.selected{
  background:#f5f7fa;

}
.rotate{
  transform:rotateZ(180deg);
}

/* <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow"></i> */
</style>
