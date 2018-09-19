<template>
  <div>
    <div class="rzl_bc_white monitor-title">
      <p class="rzl-contarner font14">{{monitorName}}</p>
    </div>
    <!-- 内容区最外层容器均采用rzl-contarner样式 -->
    <div class="rzl-contarner rzl_bc_undercoat">
      <div class="warningList-content">
        <ITabConfig ></ITabConfig>
        <div class="monitor-content rzl_bc_white">
          <input type="text"  v-model="queryTopNews"  placeholder="请输入文章标题" ref="count" class="rzl_seach_Input font16" >
          <button type="button" class="rzl_seach_button rzl_bc_navy font16 rzl_fc_white">搜索</button>
          <span><el-alert
              title="请减少到20字以内"
              type="warning"
              center
              show-icon class="font14 rzl_fc_errRed" v-show="wordnumber">
            </el-alert></span>
          <div class="mediaSeach clearfix">
            <span class="font16">媒体类型</span>
            <ul class="clearfix">
              <li v-for="(item,index) of mediaType" :key="index" class="font14" @click="mediaType(item.type)" v-bind:class='{active:item.type==isActive}'>
                {{item.type}}({{item.typeNum}})
              </li>
            </ul>
          </div>
          <div class="mediaSeach clearfix">
            <span class="font16">警报等级</span>
            <ul class="clearfix">
              <li v-for="(item,index) of alertLevel" :key="index" class="font14" @click="alertLevel(item.alertLevel)" v-bind:class='{active:item.alertLevel==isActive}'>
                {{item.name}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
   import ITabConfig from '@/components/common/TabConfig';
   export default {
      name: "MonitorResultsContent",
      components: {ITabConfig},
      data(){
        return{
          queryTopNews: '',
          monitorName:'苏州民生网全网监测',
          wordnumber: false,
          items: {
            text:'',
          },
          mediaType:[],
          alertLevel:[{
            name:'全部',
            alertLevel:0
          },{
            name:'重大',
            alertLevel:1
          },{
            name:'较大',
            alertLevel:2
          },{
            name:'轻微',
            alertLevel:3
          },{
            name:'一般',
            alertLevel:4
          },{
            name:'正常',
            alertLevel:5
          }]
        }
      },
      methods:{
         loadMediaType(){
           this.mediaType=[{
             type:'全部',
             typeNum:'123'
           },{
             type:'新闻',
             typeNum:'123'
           },{
             type:'数字报',
             typeNum:'123'
           },{
             type:'微信',
             typeNum:'123'
           },{
             type:'微博',
             typeNum:'123'
           },{
             type:'APP',
             typeNum:'123'
           }]
         },
          //tab切换
          mediaType(id){
            this.isActive = id;
          },
          alertLevel(id){
            this.isActive = id;
          }
      },
     watch:{
       queryTopNews:{
         handler:function(){
           var _this = this;
           var _sum = 20; //字体限制为20个
           _this.$refs.count.setAttribute("maxlength",_sum);
           if (_this.$refs.count.value.length > 19){
             this.wordnumber=true;
           }else {
             this.wordnumber=false;
           }
         },
         deep:true
       }
     },
     mounted(){
          this.loadMediaType();
     }
    }
</script>

<style scoped>
  .el-alert{
    width: 150px;
    padding: 0;
    display: INHERIT;
    margin-left: 10px;
  }
  .monitor-title{
    height:30px ;
    line-height: 30px;
    box-shadow: 0 1px 4px 0 #CDCDCD;
    margin-bottom: 4px;
  }
  .warningList-content{
    padding-top: 16px;
    width: 100%;
    height: 100%;
  }
  .monitor-content{
    padding: 30px;
    box-sizing: border-box;
  }
  .mediaSeach{
    margin: 20px 0;
  }
  .mediaSeach span{
    float: left;
    font-weight: 600;
    height: 20px;
    line-height: 20px;
  }
  .mediaSeach ul{
    float: left;
    margin-left: 10px;
  }
  .mediaSeach ul li{
    float: left;
    margin: 0 20px;
    font-weight: 600;
    height: 20px;
    line-height: 20px;
  }
  .mediaSeach ul li.active{
    padding: 5px;
    background:#1D2088 ;
    color: #ffffff;
    border: 10px;
  }
</style>
