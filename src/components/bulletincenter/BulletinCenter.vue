<template>
<div>
  <div class="top-header">
    <iTop/>
    <iHeader/>
  </div>
  <div id="pageCenter" class="rzl-contarner">
    <div class="pagecontainer">
      <div><button class="btn btn8030">批量删除</button></div>
      <iDataTable :data="tableData" :transformData="getData"></iDataTable>
      <div class="paginationContainer"><Pagination :totalNum="total"></Pagination></div>
    </div>
  </div>
  <iFooter/>
</div>
</template>

<script>

  import Vue from 'vue'
  import iDataTable from "@/components/common/DataTable"
  import Pagination from "@/components/common/Pagination"
  import iHeader from '@/components/common/Header'
  import iFooter from '@/components/common/Footer'
  import iTop from '@/components/common/Top'
  export default {
    name: "BulletinCenter",
    data() {
      return {
        tableData:[
          {id:1,time:'2018/08/21 12:23',type:'常规',taskName:'苏州民生监测',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134'},
          {id:2,time:'2018/08/21 12:23',type:'常规',taskName:'苏州某群体事件监测',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134'},
          {id:3,time:'2018/08/21 12:23',type:'常规',taskName:'苏州民生监测',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134?这个国家左-20180913092134'},
          {id:4,time:'2018/08/21 12:23',type:'常规',taskName:'苏州某群体事件监测',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134'},
          {id:5,time:'2018/08/21 12:23',type:'常规',taskName:'苏州民生监测',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134'},
          {id:6,time:'2018/08/21 12:23',type:'常规',taskName:'苏州某群体事件监测',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134'},
          {id:7,time:'2018/08/21 12:23',type:'常规',taskName:'苏州民生监测',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134?这个国家左-20180913092134'},
          {id:8,time:'2018/08/21 12:23',type:'常规',taskName:'苏州某群体事件监测',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134'},
          {id:9,time:'2018/08/21 12:23',type:'常规',taskName:'苏州民生监测',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134?这个国家左-20180913092134'},
          {id:10,time:'2018/08/21 12:23',type:'常规',taskName:'苏州某群体事件监测',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134'}
        ],
        total:7,
      } 
    },
    updated(){
    },
    created() {
      
    },
    methods: {
      getData(data){
        console.log(data);
      }
    },
    mounted(){
      
      this.total=100;
      console.log(this.total)
    },
    components:{
      iDataTable,
      Pagination,
      iHeader,
      iFooter,
      iTop
    }
  }
</script>

<style scoped>
  .pagecontainer{
    background:white;
    padding:30px 30px 40px;
  }
  
  .rzl-contarner{
    margin:0 auto;
    background:#F5F5F6;
    box-sizing: border-box;
  }
  .btn8030{
    width:80px;
    height:30px;
    margin-bottom:34px;
  }
  .paginationContainer{
    text-align: right;
    margin-top:15px;
  }
</style>
