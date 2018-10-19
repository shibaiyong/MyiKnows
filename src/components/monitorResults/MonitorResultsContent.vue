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
            <span><el-alert
              title="请减少到20字以内"
              type="warning"
              center
              show-icon class="font14 rzl_fc_errRed" v-show="wordnumber">
            </el-alert></span>
          </div>
          <!--筛选条件-->
          <!--媒体类型-->
          <div class="mediaSeach clearfix">
            <span class="font16">媒体类型</span>
            <ul class="clearfix">
              <li v-for="(item,index) of mediaType" :key="index" class="font14" @click="changeMediaType(item.type)" v-bind:class='{active:item.type==isActive_MediaType}'>
                {{item.name}}({{item.count}})
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
          <!--警报等级-->
          <div class="mediaSeach clearfix">
            <span class="font16">警报等级</span>
            <ul class="clearfix">
              <li v-for="(item,index) of alertLevel" :key="index" class="font14" @click="changeAlertLevel(item.alertLevel)" v-bind:class='{active:item.alertLevel==isActive_AlertLevel}'>
                {{item.name}}
              </li>
            </ul>
          </div>
          <!--时间热度-->
          <div class="mediaSeach timeOrHot clearfix">
            <ul class="clearfix">
              <li v-for="(item,index) of timeOrhot" :key="index" class="font14 rzl_fc_navy" @click="changeTimeOrHot(item.type)" v-bind:class='{active:item.type==isActive_TimeOrHot}'>
                {{item.name}}
              </li>
            </ul>
          </div>
          <!--舆情列表-->
          <p class="latestNews rzl_bc_undercoat rzl_fc_darkgray font14">最 新</p>
          <div v-show="dataload"  class="noData font16">数据加载中...</div>
          <div v-show="noData"   class="noData font16">暂无相关数据</div>
          <ul  class="topNewsList" v-if="monitorResultList.length >0">
            <li class="topNewsItems clearfix" v-for="(item,index) of monitorResultList" :key="index" @click="toDetail(item.webpageCode,item.releaseDatetime)">
              <div class="topNewsLeft">
                <p class="topNewsTitle font16 rzl_fc_darkgray" v-html ="heightLightShow(item.title)"></p>
                <div class="topNewsTag rzl_fc_darkgray font14">
                  <span>发布时间：<i>{{getDate(item.releaseDatetime)}}</i></span>
                  <span>来源：<i>{{item.sourceCrawl}}</i></span>
                </div>
                <div class="topNewsContent font14" v-html ="heightLightShow(item.summary)">
                </div>
                <div class="topNewsTag rzl_fc_darkgray font14 mb20">
                  <span>情感倾向：<i :class="{redLabel:item.tags == '负面'}">{{item.tags}}</i></span>
                </div>
              </div>
              <div class="topNewsRight t_center">
                <span class="leavl1 font18 " v-if="item.status == 4">重大</span>
                <span class="leavl2 font18 " v-else-if="item.status == 3">较大</span>
                <span class="leavl3 font18 " v-else-if="item.status == 2">轻微</span>
                <span class="leavl4 font18 " v-else-if="item.status == 1">一般</span>
                <span class="leavl5 font18 " v-else>正常</span>
              </div>
              <div class="topNewsRight mt_10">
                <span class="infoBtn rzl_bc_navy rzl_fc_white font16" @click="toDetail(item.webpageCode,item.releaseDatetime)">查看详情</span>
              </div>
            </li>
          </ul>
          <!--分页-->
          <div class="pagination" v-if="monitorResultList.length">
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
   import { getMonitorResults ,getMonitorType}from '@/assets/js/api';
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
          queryTopNews: '',
          // 监测名称
          monitorName:'苏州民生网全网监测',
          // 字数超出提示
          wordnumber: false,
          // 媒体类型
          mediaType:[{
            name:'全部',
            count:0,
            type:null
          }],
          // 时间范围
          timeRange:[],
          // 警报等级
          alertLevel:[],
          //时间热度排行
          timeOrhot:[],
          // 初始化默认选中数据
          isActive_MediaType:null,
          isActive_AlertLevel:0,
          isActive_TimeRange:2,
          isActive_TimeOrHot:0,
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
          total: 0,
          // 当前页
          page:1,
          dataload:false,
          noData:false
        }
      },
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
          // 媒体类型数据
          loadMediaType(){
            let params;
            params = {
              id:this.$route.params.id,
            };
            getMonitorType(params).then(response => {
              if (response.code == 200) {
                this.mediaType=response.data
                this.mediaType = this.mediaType.reverse()
              }else if(response.code == 103){
                this.$message.error(response.msg);
              }else {
                this.$message.error(response.message);
              }
            }).catch(error => {
              // console.log(error);
            })
         },
          //选择媒体类型
          changeMediaType(id){
            this.isActive_MediaType = id;
            this.page=1;
            this.monitorResultList=[];
            this.loadMonitorResultData()
          },
          //选择警报等级
          changeAlertLevel(id){
            this.isActive_AlertLevel = id;
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
          //时间热度排行
          changeTimeOrHot(id){
            this.isActive_TimeOrHot = id;
            this.page=1;
            this.monitorResultList=[];
            this.loadMonitorResultData();
          },
          //获取监测结果列表数据
          loadMonitorResultData(){
            this.noData = false;
            this.dataload = true;
            let params = new URLSearchParams();
            let time=[];
            let start =  new Date(this.customTime[0]).getTime();
            let end =  new Date(this.customTime[1]).getTime();
            if (start == end){
              this.$message.error('结束时间须大于开始时间，请重新选择');
              this.customTime =[];
              this.dataload = false;
              return false;
            } else{
              var starttime =  start;
              var endtime =  end;
            }
            time.push(start);
            time.push(end);
            let sortFie,sortType;
            let isHot = this.isActive_TimeOrHot;
            if (isHot == 0){
              sortFie='releaseDatetime'
              sortType = 0
            } else if(isHot == 1) {
              sortFie='releaseDatetime'
              sortType = 1
            }else {
              sortFie='weight'
              sortType = 0
            }
            let page = this.page -1;
            let pagestart = page * 10;
            params = {
              id:this.$route.params.id,
              searchArticleTitle:this.queryTopNews,
              level:this.isActive_AlertLevel,
              carrier:this.isActive_MediaType,
              timeType:this.isActive_TimeRange,
              startTime:starttime,
              endTime:endtime,
              sortField:sortFie,
              sortType:sortType,
              pageStart:pagestart,
              pageSize:10
            };
            let _this = this;
            getMonitorResults(params).then(response => {
              _this.handleData_onitorResult(response);
              // if (response.code == 200) {
              //   _this.handleData_onitorResult(response.data);
              // }else {
              //   this.$message.error(response.message);
              // }
            }).catch(error => {
              // console.log(error);
            })
          },
          handleData_onitorResult(data){
            let Data = data.content;
            if (Data != '' && Data != null) {
              Data.forEach(function (v) {
                var sentiment = v.sentiment;
                // v.sentiment = sentiment.toFixed(2);
                if (sentiment <= 0.7 && sentiment >= 0.3) {
                  v.tags = '中性'
                } else if (sentiment < 0.3) {
                  v.tags = '负面'
                } else {
                  v.tags = '正面'
                }
              })
              this.dataload = false;
              this.noData = false;
              this.monitorResultList = Data;
              this.total = data.totalElements;
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
            return iKnowsUtil.dataFormat(new Date(time).getTime())
          },
          //跳转到详情页面
          toDetail(id,time){
          let Time = new Date(time).getTime();
          window.open('/details?webpageCode='+id+'&releaseDatetime='+ Time );
        },
        // 分页
        currentChange(i){
          this.page = i;
          this.loadMonitorResultData()
        },
        heightLightShow( val ){
          let queryStr = vm.queryTopNews
          var newVal = val
          let replaceStr = "<span class='red'>"+ queryStr +"</span>"
          if( queryStr != ''){
            newVal = val.replace(new RegExp(queryStr,'g'),replaceStr)
          }
          return newVal
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
        this.alertLevel=[{
          name:'全部',
          alertLevel:0
        },{
          name:'重大',
          alertLevel:4
        },{
          name:'较大',
          alertLevel:3
        },{
          name:'轻微',
          alertLevel:2
        },{
          name:'一般',
          alertLevel:1
        },
//          {
//          name:'正常',
//          alertLevel:5
//        }
        ];
        //时间热度排行
        this.timeOrhot=[
          {
            name:'时间降序↓',
            type:0
          },{
            name:'时间升序↑',
            type:1
          },
        //   {
        //   name:'热度',
        //   type:2
        // }
        ]
      },
      mounted(){
        this.loadMediaType();
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
    margin: 10px 0;
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
    text-align: center;
    font-weight: 600;
    margin-top: 20px;
  }
  .latestNews{
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-weight: 600;
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
    width: 70%;
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
    max-height: 64px;
    overflow: hidden;
  }
  .topNewsRight{
    float: left;
    width: 15%;
    margin-top: 100px;
    text-align: right;
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
</style>
