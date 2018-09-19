<template>
  <!-- 最外层容器统一添加rzl-contarner作为外层控制样式 -->
  <div class="demo rzl-contarner">
    <ul v-if="demoList.length>0">
      <li v-for="(demo, index) in demoList" :key="index">{{demo.name}}</li>
    </ul>
  </div>
</template>
<script>
 import {getDemoList} from '../../assets/js/api.js';
 export default {
   name: 'test',
   data () {
     return {
       demoList: []
     }
   },
   methods: {
     getDemoList () {
       // 解决跨域问题
       var params = new URLSearchParams();
       params.append('id', 123);
       let _this = this;
      //  注意箭头函数内部的this指向问题
       getDemoList(params).then(response => {
          _this.demoList = [{name: 'dgdkh'},{name: 'dgdkh'}];

       }).catch(error => {
          console.log(error);
       })
     },
     loadDataHistoryList(){
       let list = [];
      //  内部方法定义方式
       this._dealHistoryLIST();
     },
     _dealHistoryLIST(){

     }

     
   }
 }
</script>
<style scoped type="css">
  .demo{
    margin: 0 auto;
    width: 600px;
    height: 400px;
    background-color: #eee
  }
</style>