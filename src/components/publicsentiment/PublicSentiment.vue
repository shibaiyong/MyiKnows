<template>
  <div id="latestpublic">
    <table class="inews-table">
      <thead>
        <tr>
          <!--<th :style="{'width':'174px'}"><CheckBox :totalSelect="isTotal" :allSelect="hasTotal"/><span class="allcheck">全选</span></th>-->
          <th>监控任务名称</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='item in tableData'> 
          <!-- <td><CheckBox :label="item.id" :dataArr="dataArr" :all="checkAll"/></td> -->
          <td>
            <div class="publicdetail">

              <h3 class="margintop20">美国制裁上瘾新兴市场扛得住吗?这个国家左右为难</h3>
              <ul class="articaldetail margintop20">
                <li class="font14"><span>发布时间&nbsp;:&nbsp;</span><span>2018/08/21 12:23</span></li>
                <li class="font14"><span>文章来源&nbsp;:&nbsp;</span><span>人民网</span></li>
              </ul>
              <p class="margintop20">
                最近，美国先后宣布对伊朗、俄罗斯和土耳其发动制裁。
                受此影响，俄罗斯卢布周一跌至2016年初以来的最低位，土耳其里拉周一开盘再次崩跌10%，
                南非兰特等新兴市场货币也出现大跌，印尼盾成为亚洲表现最差的货币。
              </p>
              <ul class="articalrelative margintop20 marginbottom20">
                <li class="font14"><span>发布时间&nbsp;:&nbsp;</span><span>2018/08/21 12:23</span></li>
                <li class="font14"><span>文章来源&nbsp;:&nbsp;</span><span>人民网</span></li>
              </ul>
            </div>
          </td>
          <td class="font18">{{ item.type }}</td>
          <td><button class="btn btn12038 font16">查看详情</button></td>
        </tr>
      </tbody>
    </table>
    <div class="paginationContainer"><Pagination :totalNum="total"></Pagination></div>
  </div>
</template>

<script>

  import Vue from 'vue'
  import Pagination from "@/components/common/Pagination"
  import CheckBox from "@/components/common/CheckBox"

  export default {
    name: "BulletinCenter",
    data() {
      return {
        tableData:[
          {id:1,time:'2018/08/21 12:23',type:'常规',taskName:'苏州民生监测美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134'},
          {id:2,time:'2018/08/21 12:23',type:'常规',taskName:'苏州某群体事件监测',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134'},
          {id:3,time:'2018/08/21 12:23',type:'常规',taskName:'苏州民生监测',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134?这个国家左-20180913092134'},
          {id:4,time:'2018/08/21 12:23',type:'常规',taskName:'苏州某群体事件监测',reportName:'美国制裁上瘾新兴市场扛得住吗?这个国家左-20180913092134'}
        ],
        total:7
      } 
    },
    updated(){
    },
    created() {
      
    },
    methods: {
      
    },
    mounted(){
      
      this.total=100;
      console.log(this.total);

    },
    computed:{
      
    },
    components:{
      CheckBox,
      Pagination
    }
  }
</script>

<style scoped>
  #latestpublic{
    background:white;
    width:92%;
    padding:30px 30px 40px;
    margin:0 auto;
  }
  /* 表格固定布局 */
  .inews-table{
      width:100%;
      table-layout:fixed; word-break: break-all; word-wrap: break-word;
      font-size: 14px;
      color: #555555;
  }
  /* 按钮的公共样式 */
  .btn12038{
      width:120px;
      height:38px;
      color:white;
      background: #1D2088;
      font-weight: bold;
  }

  .inews-table .textleft{
      text-align: left;
  }
  .inews-table .margintop20{
    margin-top:20px;
  }

  .inews-table .marginbottom20{
    margin-bottom:20px;
  }

  .inews-table td,.inews-table th{
      text-align: center;
      border:none;
      vertical-align: middle;
  }
  .inews-table th{
      height: 40px;
      font-weight: bold;
      background: #F5F5F5;
  }
  .inews-table th:first-child{
      width:65%;
  }
  .inews-table th:nth-child(2){
      width:16%;
  }
  .inews-table th:nth-child(3){
      width:19%;
  }
  .inews-table td:first-child{
    text-align: left;
    padding-left:10px;
  }
  .inews-table td:nth-child(2){
    color: #3B87F5;
    font-weight: bold;
  }
  .inews-table tr{
      border-top:1px solid #ccc;
  }
  .inews-table tr:last-child{
      border-bottom:1px solid #ccc;
  }
  
  .articaldetail,.articalrelative{
    overflow:hidden;
  }
  .articaldetail li,.articalrelative li{
    float:left;
    width:226px;
  }
  .articaldetail li span:first-child,.articalrelative li span:first-child{
    font-weight:bold;
  }
  .inews-table p{
    line-height: 17px;
  }
  .inews-table td h3{
    font-size: 16px;
    color: #555555;
    font-weight: bold;
  }
  .paginationContainer{
    text-align: right;
    margin-top:15px;
  }
</style>
