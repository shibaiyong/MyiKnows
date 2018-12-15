<template>
  <div>
    <!-- 内容区最外层容器均采用rzl-contarner样式 -->
    <div class="">
      <div class="warningList-content">
        <div class="monitor-content rzl_bc_white">
          <!--搜索框-->
          <div>
            <input type="text"  v-model="queryTopNews"  placeholder="请输入文章标题" ref="count" class="rzl_seach_Input font16" >
            <button type="button" class="rzl_seach_button rzl_bc_navy font16 rzl_fc_white" @click="seachKey()">搜索</button>
            <i class="rzl_bc_shallowGreen rzl_fc_white inputI" v-if="wordnumber">!</i>
            <span class="font14 rzl_fc_errRed" v-if="wordnumber">请减少到20字以内。</span>
          </div>
          <!--筛选条件-->
          <!--文章类型-->
          <div class="mediaSeach clearfix">
            <span class="font16">文章类型</span>
            <ul class="clearfix">
              <li v-for="(item,index) of mediaType" :key="index" class="font14" @click="changeMediaType(item.type)" v-bind:class='{active:item.type==isActive_MediaType}'>
                {{item.name}}
              </li>
            </ul>
          </div>
          <!--时间范围-->
          <div class="mediaSeach clearfix">
            <span class="font16">时间范围</span>
            <ul class="clearfix">
              <li v-for="(item,index) of timeRange" :key="index" class="font14" @click="changeTimeRange(item.type)" v-bind:class='{active:item.type==isActive_TimeRange}'>
                {{item.name}}
              </li>
            </ul>
            <div class="customTime-date">
              <el-date-picker v-model="customTime"
                              type="daterange"
                              range-separator="-"
                              prefix-icon=""
                              v-bind:disabled="disabled"
                              value-format="yyyy-MM-dd"
                              @change="getCustomTime()"
                              :picker-options="dateScope"
                              :default-value="timeDefaultShow"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
          <!--类型筛选-->
          <div class="mediaSeach clearfix" v-if="isShow">
            <span class="font16">类型筛选</span>
            <ul class="clearfix">
              <li v-for="(item,index) of alertLevel" :key="index" class="font14" @click="changeAlertLevel(item.alertLevel)" v-bind:class='{active:item.alertLevel==isActive}'>
                {{item.name}}
              </li>
            </ul>
          </div>
         
         
          
          <!--舆情列表-->
          <p class="latestNews rzl_bc_undercoat rzl_fc_darkgray font16"  >
              <span>结果列表</span>
              <span>
                  <span class= "xuu">
                      <span v-if="xu" @click="s_ort">按时间正序<i class="el-icon-sort-up"></i></span>
                      <span v-else @click="s_ort" >按时间倒序<i style="margin-left:7px" class="el-icon-sort-down"></i></span>
                  </span>
                  <span>共{{dataTotal}}条数据</span>
              </span>
          </p>
          <div v-show="dataload"  class="noData font16">数据加载中...</div>
          <div v-show="noData"   class="noData font16">暂无相关数据</div>
          <ul id="topNewsList" class="topNewsList" v-if="monitorResultList.length >0">
            <li  class="topNewsItems clearfix" v-for="(item,index) of monitorResultList" :key="index" @click="toDetail(item.webpageCode,item.publishTime)">
              <div class="topNewsLeft">
                <p class="topNewsTitle font16 rzl_fc_darkgray" v-html ="heightLightShow(item.title)"></p>
                <div class="topNewsTag rzl_fc_darkgray font14">
                  <span>发布时间：<i>{{getDate(item.publishTime)}}</i></span>
                  <span>来源：<i>{{item.source}}</i></span>
                </div>
                <div class="topNewsContent font14" v-html ="heightLightShow(item.summary)">
                </div>
               
              </div>
              <div class="topNewsRight mt_10">
                <span class="infoBtn rzl_bc_navy rzl_fc_white font16" >查看详情</span>
              </div>
            </li>
          </ul>
          <!--分页-->
          <div class="pagination" v-if="total>-1">
            <Pagination :totalNum="total"
                        @currentChange="currentChange"
                        ref="pagination"/>
          </div>
        </div>
      </div>
    </div>
    <div class="blank_1 rzl_bc_undercoat"></div>
  </div>
</template>

<script>
   // import ITabConfig from '@/components/common/TabConfig';
   import { getsearchResults ,getMonitorType,planType}from '@/assets/js/api';
   import Pagination from "@/components/common/Pagination";
   import iKnowsUtil from '@/assets/js/iknowsUtil';
   let vm;
   export default {
      name: "MonitorResultsContent",
      components: {Pagination},
      data(){
        vm = this
        return{
          // 搜索框
          queryTopNews: this.TopNews,
          // 监测名称
          monitorName:'苏州民生网全网监测',
          // 字数超出提示
          wordnumber: false,
          // 媒体类型
          mediaType:[
              {name:'全文',type:1},
              {name:'标题',type:2},
              {name:'正文',type:3},
              
          ],
          // 时间范围
          timeRange:[],
          // 类型筛选
          alertLevel:['全部', '标题', '正文'],
          dataTotal:0,//搜索总条数
          xu:false,//正序和倒序
          // 初始化默认选中数据
          isActive_MediaType:1,
          isActive:this.isActivee,
          isActive_TimeRange:2,
          // 时间控件是否禁用
          disabled: true,
          // 自定义时间范围值
          customTime: [],
          // 限定时间范围-只可选择当前时间之前
          dateScope: {
            disabledDate(time) {
              // time.getTime() > Date.now() - 8.64e6;
              return time.getTime() < Date.now() - 8.64e7 * 60;
            }
          },
          timeDefaultShow:'',
          //监测结果列表
          monitorResultList:[],
          // 分页总数
          total: -1,
          // 当前页
          page:1,
          dataload:false,
          noData:false,
          highlightWords:[],
          isShow:true
        }
      },
      props: ['TopNews','isActivee'],
      methods:{
          //关键字搜索
          seachKey(){
              if (this.queryTopNews != ''){
                this.loadMonitorResultData()
                  // alert(this.queryTopNews)
              } else {
                this.$message.error('请输入关键字搜索');
              }
          },
          //文章类型
          changeMediaType(id){
            // 防止用户选择自定时间后未选择时间值的操作
            if(this.customTime.length !=2 && parseInt(this.isActive_TimeRange) === 4){
              this.$message.error('请选择时间范围！');
              return;
            }
            this.isActive_MediaType = id;
            this.page=1;
            this.monitorResultList=[];
            this.loadMonitorResultData()
          },
          
          //选择时间范围
          changeTimeRange(id){
             this.isActive_TimeRange = id;
             if (id == 4){
               this.disabled = false;
             }else {
               this.disabled = true;
               this.page=1;
               this.monitorResultList=[];
               this.loadMonitorResultData()
             }

          },
          //自定义时间选择
          getCustomTime(){
            this.page=1;
            this.monitorResultList=[];
            this.loadMonitorResultData()
          },
          //类型筛选
          changeAlertLevel(id){
            // 防止用户选择自定时间后未选择时间值的操作
            if(this.customTime.length !=2 && parseInt(this.isActive_TimeRange) === 4){
              this.$message.error('请选择时间范围！');
              return;
            }
            this.isActive = id;
            this.page=1;
            this.monitorResultList=[];
            this.loadMonitorResultData()
          },
         
          
          //最新数据
          loadNowData(){
            this.loadMonitorResultData();
          },
          //获取监测结果列表数据
          loadMonitorResultData(){
            // 防止用户选择自定时间后未选择时间值的操作
            if(this.customTime.length !=2 && parseInt(this.isActive_TimeRange) === 4){
              this.$message.error('请选择时间范围！');
              return;
            }
            this.noData = false;
            this.dataload = true;
            let params = {};
            let time=[];
            let start =  new Date(this.customTime[0]).getTime();
            let end =  new Date(this.customTime[1]).getTime();
            // if (start == end){
            //   this.$message.error('结束时间须大于开始时间，请重新选择');
            //   this.customTime =[];
            //   this.dataload = false;
            //   return false;
            // } else{
            //   var starttime =  start;
            //   var endtime =  end;
            // }
            var starttime =  start;
            var endtime =  end;
            time.push(start);
            time.push(end);
            let sortFie,sortType;console.log(this.xu)
            //let isHot = this.xuu;
            if (this.xu === true){
              sortFie='releaseDatetime'
              sortType = 1
            } else if(this.xuu ===false) {
              sortFie='releaseDatetime'
              sortType = 0
            }else {
              sortFie='weight'
              sortType = 0
            }
            let page = this.page -1;
            let pagestart = page * 10;
            params = {
                searchValue:this.queryTopNews,
                time:this.isActive_TimeRange,
                match:this.isActive_MediaType,
                carrier:this.isActive,
                //type:0,
                timeRangeStart:starttime,
                timeRangeEnd:endtime,
                pageStart:pagestart,
                pageSize:10,
                sortField:'',
                sortType:sortType

            };
            this.$nextTick(()=>{
                params.searchValue = this.queryTopNews;
                params.carrier = this.isActive
            })
            let _this = this;
            this.monitorResultList=[];

            getsearchResults(params).then(response => {
              _this.handleData_onitorResult(response);
               if (response.code == 200) {
                 _this.handleData_onitorResult(response.data);
               }else {
                 this.$message.error(response.message);
               }
            }).catch(error => {

            })
          },
          handleData_onitorResult(data){
            this.total = -1;
            this.dataTotal = 0;
            let Data = data.content;
            if (Data != '' && Data != null) {

              Data.forEach(function (v) {
                var sentiment = v.sentiment;
                // v.sentiment = sentiment.toFixed(2);
                // if (sentiment <= 0.7 && sentiment >= 0.3) {
                //   v.tags = '中性'
                // } else if (sentiment < 0.3) {
                //   v.tags = '负面'
                // } else {
                //   v.tags = '正面'
                // }
              });
              //var highlightWords = data.highlightWords;
              this.monitorResultList = Data;
              this.total = this.dataTotal= data.totalElements;
              this.dataload = false;
              this.noData = false;
              this.highlightWords = this.queryTopNews.split(' ');
              // this.highlightWords = ['阿根廷','习近平','彭丽媛'];
            }else {
              this.noData = true;
              this.dataload = false;
            }

          },
          //时间格式处理
          getDate(time) {
            if (!time || time == null || time == "" || time == undefined) {
              return "未知时间"
            }
            return iKnowsUtil.dataFormat(time)
          },
          //跳转到详情页面
          toDetail(id,time){
            let Time = new Date(time).getTime();
            let userName = this.$iknowsUtil.getUserName();
            let planId = this.$route.params.id;
            let keyWords = vm.queryTopNews;
            window.open('/details/'+userName+'?webpageCode='+id+'&releaseDatetime='+ Time +'&keyWords='+keyWords );
          },
          // 分页
          currentChange(i){
          if(i>10000/this.pageSize){
              this.page = 10000/this.pageSize
          }else{
          this.page = i;
          }
          this.loadMonitorResultData()
        },
          // 关键词高亮
          heightLightShow( val ){
            if (val !=null){
              var arr = this.highlightWords;
              if (arr){
                for (var i = 0; i<arr.length; i++){
                  val = val.replace(new RegExp(arr[i],'g'),"<span class='red'>"+ arr[i] +"</span>");
                }
                return val
              }
              return val
            } else {
              return
            }

       },
        //时间热度排行
            s_ort(){
                this.xu = !this.xu;
                this.monitorResultList=[];
                this.loadMonitorResultData();
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
       },
       TopNews(val){
           this.queryTopNews = val
       },
       isActivee(val){
           this.isActive = val
       }
     },

      created(){
        // 日期选择显示当前月和上一月
        this.timeDefaultShow = new Date();
        this.timeDefaultShow.setMonth(new Date().getMonth() - 1);
        // 时间范围
        this.timeRange=[{
                type:1,
                name:'今日'
            },{
                type:2,
                name:'近7天'
            },{
                type:3,
                name:'近30天'
            },{
                type:4,
                name:'自定义'
        }];
        // 警报等级
        this.alertLevel=[
            {
                name:'全部',
                alertLevel:1
            },{
                name:'网媒',
                alertLevel:6
            },{
                name:'微信',
                alertLevel:8
            },{
                name:'微博',
                alertLevel:7
            },{
                name:'APP',
                alertLevel:9
            }
        ];
        //是否去重
        // this.isDuplicate=[
        //   {
        //     name:'混合排重',
        //     type:3
        //   },{
        //     name:'不排重',
        //     type:0
        //   }
        //   // ,{  name:'标题排重',
        //   //   type:1
        //   // },{
        //   //   name:'正文排重',
        //   //   type:2
        //   // }

        // ];
        //情感倾向
        // this.emotionalDirection=[
        //   {
        //     name:'全部',
        //     type:0
        //   },{
        //     name:'正面',
        //     type:3
        //   },{
        //     name:'负面',
        //     type:1
        //   },{
        //     name:'中性',
        //     type:2
        //   }
        // ];
        //时间热度排行
        this.timeOrhot=[
          {
            name:'时间降序↓',
            type:0
          },{
            name:'时间升序↑',
            type:1
          },
        
        ]
      },
      mounted(){//console.log(this.queryTopNews)
           //this.isActive = this.isActive;console.log(this.isActive)
        //this.queryTopNews = this.props.queryTopNewss
        //this.loadPlanType();
        //this.loadMediaType();
        this.loadMonitorResultData();
      }
    }
</script>

<style scoped>
  .blank_1{
    height: 40px;
  }
  .el-alert{
    width: 150px;
    padding: 0;
    display: INHERIT;
    margin-left: 10px;
  }
  .warningList-content{
    width: 100%;
    height: 100%;
  }
  .monitor-content{
    padding: 30px;
    box-sizing: border-box;
  }
  .mediaSeach{
    margin: 10px 0 0;
    height: 38px;
    line-height: 38px;
  }
  .mediaSeach span{
    float: left;
    font-weight: 600;
    height: 20px;
    line-height: 20px;
    margin-top:10px ;
  }
  .mediaSeach ul{
    float: left;
    margin-left: 10px;
    margin-top:10px ;
  }
  .mediaSeach ul li{
    float: left;
    margin: 0 12px;
    padding: 0 10px;
    font-weight: 600;
    height: 20px;
    line-height: 20px;
    cursor: pointer;
  }
  .mediaSeach ul li.active{
    padding:0 10px;
    background:#1D2088 ;
    color: #ffffff;
    border-radius: 8px;
  }
  .customTime-date{
    width:240px ;
    height: 38px;
    line-height: 38px;
    float: left;
  }
  .customTime-date >>> .el-input__inner{
    width: 100%;
    height: 100%;
  }
  .timeOrHot{
    margin: 20px 0;
  }
  .timeOrHot ul{
    margin-top: 0;
    margin-left: 0;
    /*width: 120px;*/
    height: 34px;
    border: 2px solid #1D2088;
    border-radius: 10px;
    overflow: hidden;
  }
  .timeOrHot ul li{
    width: 75px;
    height: 34px;
    line-height: 34px;
    padding:0px;
    margin: 0;
    text-align: center;
  }
  .timeOrHot ul li.active{
    width: 75px;
    padding:0px;
    border-radius: 0;
  }
  .latestNews{
    height: 40px;
    line-height: 40px;
    display: flex;
    margin-top:20px;
    justify-content: space-between;
    font-weight: 600;
    cursor: pointer;
    padding: 0px 16px 0 24px;
  }
  .xuu{
      margin-right: 34px;
  }
  .xuu:hover{
      color:#11B7D3
  }
  .topNewsList{
    min-height: 260px;
  }
  .topNewsItems{
    padding: 0 80px;
    border-bottom:1px solid #CDCDCD;
  }
  .topNewsLeft{
    float: left;
    width: 80%;
    cursor: pointer;
  }
  .topNewsTitle{
    font-weight: 600;
    margin: 25px 0;
  }
  .topNewsTag span{
    width:30%;
    text-align: left;
    display: inline-block;
    font-weight: 600;
  }
  .topNewsTag span i{
    color: #252525;
    font-style:normal;
  }
  .topNewsTag i.redLabel{
    color: #D62828;
  }
  .topNewsContent{
    margin: 20px 0;
    line-height: 22px;
    min-height: 26px;
    max-height: 66px;
    overflow: hidden;
  }
  .topNewsRight{
    float: left;
    width: 15%;
    margin-top: 100px;
    text-align: right;
    margin-left: 56px;
  }
  .topNewsRight span{
    font-weight: 600;
  }
  .infoBtn{
    width: 120px;
    height: 38px;
    line-height: 38px;
    display: inline-block;
    text-align: center;
    border-radius: 10px;
    cursor: pointer;
  }
  .leavl1{
    color: #DC4D4D;
  }
  .leavl2{
    color: #FF9241;
  }
  .leavl3{
    color: #F1D33A;
  }
  .leavl4{
    color: #3B87F5;
  }
  .leavl5{
    color: #7FB800;
  }
  .t_center{
    text-align: center;
  }
  .mt_10{
    margin-top: 90px;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .pagination {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 10px;
  }
  .noData{
    height: 260px;
    text-align: center;
    padding-top: 30px;
    color: #606266;
  }
  .inputI{
    width: 20px;
    margin: 0 20px;
    height: 20px;
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
    display: inline-block;
  }
</style>
