<template>
  <div>
    <!-- 内容区最外层容器均采用rzl-contarner样式 -->
    <div class="rzl-contarner rzl_bc_undercoat">
      <div class="warningList-content">
        <div class="monitor-content rzl_bc_white">
          <!--搜索框-->
          <div>
            <input type="text"  v-model="queryTopNews"  placeholder="请输入文章标题" ref="count" class="rzl_seach_Input font16" >
            <button type="button" class="rzl_seach_button rzl_bc_navy font16 rzl_fc_white">搜索</button>
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
                {{item.name}}({{item.typeNum}})
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
          <p class="latestNews rzl_bc_undercoat rzl_fc_darkgray font14">最新舆情</p>
          <ul  class="topNewsList">
            <li class="topNewsItems clearfix" v-for="(item,index) of monitorResultList" :key="index">
              <div class="topNewsLeft">
                <p class="topNewsTitle font16 rzl_fc_darkgray">{{item.title}}</p>
                <div class="topNewsTag rzl_fc_darkgray font14">
                  <span>发布时间：<i>{{item.time}}</i></span>
                  <span>来源：<i>{{item.source}}</i></span>
                </div>
                <div class="topNewsContent font14">
                  {{item.content}}
                </div>
                <div class="topNewsTag rzl_fc_darkgray font14 mb20">
                  <span>情感指数：<i>{{item.hotNum}}</i></span>
                </div>
              </div>
              <div class="topNewsRight t_center">
                <span class="leavl1 font18 " v-if="item.leavl == 1">重大</span>
                <span class="leavl2 font18 " v-else-if="item.leavl == 2">较大</span>
                <span class="leavl3 font18 " v-else-if="item.leavl == 3">轻微</span>
                <span class="leavl4 font18 " v-else-if="item.leavl == 4">一般</span>
                <span class="leavl5 font18 " v-else>正常</span>
              </div>
              <div class="topNewsRight mt_10">
                <span class="infoBtn rzl_bc_navy rzl_fc_white font16" @click="toDetail(item.id)">查看详情</span>
              </div>
            </li>
          </ul>
          <!--分页-->
          <div class="pagination">
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
   import Pagination from "@/components/common/Pagination"
   export default {
      name: "MonitorResultsContent",
      components: {Pagination},
      data(){
        return{
          // 搜索框
          queryTopNews: '',
          // 监测名称
          monitorName:'苏州民生网全网监测',
          // 字数超出提示
          wordnumber: false,
          // 媒体类型
          mediaType:[],
          // 时间范围
          timeRange:[{
            type:0,
            name:'今日'
          },{
            type:1,
            name:'近7天'
          },{
            type:2,
            name:'近30天'
          },{
            type:3,
            name:'自定义'
          }],
          // 警报等级
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
          }],
          //时间热度排行
          timeOrhot:[{
            name:'时间↑',
            type:0
          },{
            name:'热度',
            type:1
          }],
          // 初始化默认选中数据
          isActive_MediaType:0,
          isActive_AlertLevel:0,
          isActive_TimeRange:0,
          isActive_TimeOrHot:0,
          // 时间控件是否禁用
          disabled: true,
          // 自定义时间范围值
          customTime: [],
          // 限定时间范围-只可选择当前时间之前
          dateScope: {
            disabledDate(time) {
              return time.getTime() > Date.now() - 8.64e6
            }
          },
          timeDefaultShow:'',
          //监测结果列表
          monitorResultList:[],
          // 分页
          total: 0,
          page: 0,
        }
      },
      methods:{
          // 媒体类型数据
          loadMediaType(){
           this.mediaType=[{
             type:0,
             name:'全部',
             typeNum:'123'
           },{
             type:1,
             name:'新闻',
             typeNum:'123'
           },{
             type:2,
             name:'数字报',
             typeNum:'123'
           },{
             type:3,
             name:'微信',
             typeNum:'123'
           },{
             type:4,
             name:'微博',
             typeNum:'123'
           },{
             type:5,
             name:'APP',
             typeNum:'123'
           }]
         },
          //选择媒体类型
          changeMediaType(id){
            this.isActive_MediaType = id;
          },
          //选择警报等级
          changeAlertLevel(id){
            this.isActive_AlertLevel = id;
            // console.log(this.isActive_MediaType)
            // console.log(this.customTime)
            // console.log(this.isActive_TimeRange)
            // console.log(this.isActive_AlertLevel)
          },
          //选择时间范围
          changeTimeRange(id){
             this.isActive_TimeRange = id;
             if (id == 3){
               this.disabled = false;
             }else {
               this.disabled = true;
             }
          },
          //自定义时间选择
          getCustomTime(){
            this.customTime;
            console.log(this.customTime)
            console.log(this.isActive_TimeRange)
          },
          //时间热度排行
          changeTimeOrHot(id){
            this.isActive_TimeOrHot = id;
          },
          //获取监测结果列表数据
          loadMonitorResultData(){
            let data =[{
              id:0,
              title:'美国制裁上瘾新兴市场扛得住吗?这个国家左右为难',
              time:'2018/08/21 12:23',
              source:'人民网',
              hotNum:'100',
              content:' 最近，美国先后宣布对伊朗、俄罗斯和土耳其发动制裁。\n' +
              '受此影响，俄罗斯卢布周一跌至2016年初以来的最低位，土耳其里拉周一开盘再次崩跌10%，南非兰特等新兴市场货币也出现大跌，印尼盾成为亚洲表现最差的货币。\n' +
              '最糟糕的可能是伊朗。自特朗普宣布退出伊核协议后不到三个月内，伊朗货币大幅贬值，里亚尔对美元已贬值近半。\n' +
              '尽管如此，伊朗仍称近期将不会与美国谈判，土耳其和俄罗斯政要也表示将与美国开打“经济战”。',
              leavl:'1'
            },{
              id:1,
              title:'美国制裁上瘾新兴市场扛得住吗?这个国家左右为难',
              time:'2018/08/21 12:23',
              source:'人民网',
              hotNum:'100',
              content:' 最近，美国先后宣布对伊朗、俄罗斯和土耳其发动制裁。\n' +
              '受此影响，俄罗斯卢布周一跌至2016年初以来的最低位，土耳其里拉周一开盘再次崩跌10%，南非兰特等新兴市场货币也出现大跌，印尼盾成为亚洲表现最差的货币。\n' +
              '最糟糕的可能是伊朗。自特朗普宣布退出伊核协议后不到三个月内，伊朗货币大幅贬值，里亚尔对美元已贬值近半。\n' +
              '尽管如此，伊朗仍称近期将不会与美国谈判，土耳其和俄罗斯政要也表示将与美国开打“经济战”。',
              leavl:'2'
            },{
              id:2,
              title:'美国制裁上瘾新兴市场扛得住吗?这个国家左右为难',
              time:'2018/08/21 12:23',
              source:'人民网',
              hotNum:'100',
              content:' 最近，美国先后宣布对伊朗、俄罗斯和土耳其发动制裁。\n' +
              '受此影响，俄罗斯卢布周一跌至2016年初以来的最低位，土耳其里拉周一开盘再次崩跌10%，南非兰特等新兴市场货币也出现大跌，印尼盾成为亚洲表现最差的货币。\n' +
              '最糟糕的可能是伊朗。自特朗普宣布退出伊核协议后不到三个月内，伊朗货币大幅贬值，里亚尔对美元已贬值近半。\n' +
              '尽管如此，伊朗仍称近期将不会与美国谈判，土耳其和俄罗斯政要也表示将与美国开打“经济战”。',
              leavl:'3'
            },{
              id:3,
              title:'美国制裁上瘾新兴市场扛得住吗?这个国家左右为难',
              time:'2018/08/21 12:23',
              source:'人民网',
              hotNum:'100',
              content:' 最近，美国先后宣布对伊朗、俄罗斯和土耳其发动制裁。\n' +
              '受此影响，俄罗斯卢布周一跌至2016年初以来的最低位，土耳其里拉周一开盘再次崩跌10%，南非兰特等新兴市场货币也出现大跌，印尼盾成为亚洲表现最差的货币。\n' +
              '最糟糕的可能是伊朗。自特朗普宣布退出伊核协议后不到三个月内，伊朗货币大幅贬值，里亚尔对美元已贬值近半。\n' +
              '尽管如此，伊朗仍称近期将不会与美国谈判，土耳其和俄罗斯政要也表示将与美国开打“经济战”。',
              leavl:'4'
            },{
              id:3,
              title:'美国制裁上瘾新兴市场扛得住吗?这个国家左右为难',
              time:'2018/08/21 12:23',
              source:'人民网',
              hotNum:'100',
              content:' 最近，美国先后宣布对伊朗、俄罗斯和土耳其发动制裁。\n' +
              '受此影响，俄罗斯卢布周一跌至2016年初以来的最低位，土耳其里拉周一开盘再次崩跌10%，南非兰特等新兴市场货币也出现大跌，印尼盾成为亚洲表现最差的货币。\n' +
              '最糟糕的可能是伊朗。自特朗普宣布退出伊核协议后不到三个月内，伊朗货币大幅贬值，里亚尔对美元已贬值近半。\n' +
              '尽管如此，伊朗仍称近期将不会与美国谈判，土耳其和俄罗斯政要也表示将与美国开打“经济战”。',
              leavl:'5'
            }]
            this.handleData_onitorResult(data)
          },
          handleData_onitorResult(data){
            this.monitorResultList = data;
          },
          //跳转到详情页面
          toDetail(id){
              // alert(id)
          },
          // 分页
          currentChange(i){
              // alert(i)
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
      },
      mounted(){
        this.loadMediaType();
        this.loadMonitorResultData();
        this.total = 100;
        this.$refs.pagination.changeCurrentPage(1);
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
    width: 120px;
    height: 34px;
    border: 2px solid #1D2088;
    border-radius: 10px;
    overflow: hidden;
  }
  .timeOrHot ul li{
    width: 60px;
    height: 34px;
    line-height: 34px;
    padding:0px;
    margin: 0;
    text-align: center;
  }
  .timeOrHot ul li.active{
    width: 60px;
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
  .topNewsItems{
    padding: 0 80px;
    border-bottom:1px solid #CDCDCD;
  }
  .topNewsLeft{
    float: left;
    width: 70%;
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
</style>
