<template>
  <div class="event_analysis">

    <div class="time_choose">
      <span>筛选时间: </span>
      <el-date-picker
        v-model="eventAnalysisTimeRange"
        type="daterange"
        :editable="false"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="timeChooseChanged">
      </el-date-picker>
    </div>

    <div class="floatBox menu" id="menu">
      <a v-for="item in menuData" :href="item.id"><span class="menu_title" :class="('#'+menuCurrentID)===item.id?'menu_title_selected':''">{{item.name}}</span></a>
    </div>

    <div class="menuFloat" id="menuFloat">
      <a v-for="item in menuData" :href="item.id"><span class="menu_title" :class="('#'+menuCurrentID)===item.id?'menu_title_selected':''">{{item.name}}</span></a>
    </div>

    <!--事件概述-->
    <div class="summary" id="summary">
      <div class="eventAnalysisTitle font18 rzl_bc_white no_padding" style="text-align: center">事件概述</div>
      <span class="summary_content">{{summaryData}}</span>
    </div>

    <!--首发媒体-->
    <div class="first_media" id="first_media">
      <div class="eventAnalysisTitle font18 rzl_bc_white">首发媒体</div>
      <div class="first_media_content">
        <ITable id="first_media_table"
                :data="latestOpinionData"
                :category="latestOpinionCategory"
                @click-table-cell="clickFirstMediaTableCell">
        </ITable>
      </div>
    </div>


    <!--发展趋势-->
    <div class="developing_trend" id="developing_trend">
      <div class="eventAnalysisTitle font18 rzl_bc_white no_padding">发展趋势</div>
      <!--<div class="overview floatBox">-->
        <div class="developing_trend_content">
          <ILine id="overview" :data="developingTrendData" axis="splitTime" :category="developingTrendCategory"></ILine>
        </div>
      <!--</div>-->
    </div>


    <!--媒体分布+情感指数-->
    <div class="floatBox" id="publish">
      <!--媒体分布-->
      <div class="analysis_item">
        <div class="eventAnalysisTitle font18 rzl_bc_white no_padding">媒体分布</div>
        <div class="publish_content">
          <IPie id="publish_pie" :data="publishData" label="mediaName" prop="articleNum"></IPie>
        </div>
      </div>
      <!--情感指数-->
      <div class="analysis_item" id="emotion_trend">
        <div class="eventAnalysisTitle font18 rzl_bc_white no_padding">情感指数</div>
        <div class="emotion_trend_content">
          <ILine id="emotion_trend_line" :data="emotionTrendData" axis="splitTime"
                 :category="emotionTrendCategory"></ILine>
        </div>
      </div>

    </div>


    <div class="floatBox" id="world_cloud">

      <!--词云分布-->
      <div class="analysis_item">
        <div class="eventAnalysisTitle font18 rzl_bc_white no_padding">词云分布</div>
        <div class="world_cloud_content floatBox">
          <div style="width: 60%">
            <IWorld id="world_cloud_world" :data="worldCloudData" label="keywordName" prop="articleNum"></IWorld>
          </div>
          <div style="width: 40%">
            <ITable id="world_cloud_table"
                    :data="worldCloudData.slice(0,10)"
                    :category="worldCloudCategory">
            </ITable>

          </div>
        </div>
      </div>
      <!--发布热区-->
      <div class="analysis_item" id="hot_area">
        <div class="eventAnalysisTitle font18 rzl_bc_white no_padding">发布热区</div>
        <div class="hot_area_content floatBox">
          <div style="width: 50%">
            <IMap id="hot_area_map" :data="hotAreaData" label="areaName" prop="articleNum"></IMap>
          </div>
          <div style="width: 50%">
            <ITable id="hot_area_table"
                    :data="hotAreaRankData"
                    :category="hotAreaCategory">
            </ITable>
          </div>
        </div>
      </div>

    </div>

    <!--事件脉络-->
    <div class="event_context" id="event_context">
      <div class="eventAnalysisTitle font18 rzl_bc_white">事件脉络</div>
      <div class="event_context_content">
        <ITable id="event_context_table"
                :data="eventContextData"
                :category="eventContextCategory"
                @click-table-cell="clickEventContextTableCell">
        </ITable>

        <div class="loadMore" v-if="eventContextData.length" @click="loadMoreData()">
          <i :class="isLoading?'el-icon-loading':'el-icon-refresh'" v-if="eventContextData.length < EventContextTotal"></i>
          <span>{{isLoading?"正在加载":(eventContextData.length >= EventContextTotal?"没有更多数据":"点击加载更多")}}</span>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import ILine from '@/components/common/ZCChartsLine'
  import IBar from '@/components/common/ZCChartsBar.vue'
  import IPie from '@/components/common/ZCChartsPie.vue'
  import IMap from '@/components/common/ZCChartsMap.vue'
  import IWorld from '@/components/common/ZCChartsWorld.vue'
  import ITable from '@/components/common/ZCTable.vue'


  import {planType} from '../../assets/js/api.js'
  /*事件概述+首发媒体+发展趋势*/
  import {qryReportSummary,getEventFirstMedia,getMonitorAnalysis_mediaTrend} from '../../assets/js/api.js'
  /*媒体分布+情感指数*/
  import {getMonitorAnalysis_mediaDistribution,getMonitorAnalysis_emotionTrend} from '../../assets/js/api.js'
  /*词云分布+热点地域+事件脉络*/
  import {getMonitorAnalysis_wordCloud,getMonitorAnalysis_hotRegion,getEventContextData} from '../../assets/js/api.js'

  export default {
    name: "event-analysis",
    components: {ILine, IBar, IPie, IMap, IWorld, ITable},
    data(){
      return {

        eventAnalysisTimeRange:'',
        menuData:[
          {name:"事件概述",id:"#summary"},
          {name:"首发媒体",id:"#first_media"},
          {name:"发展趋势",id:"#developing_trend"},
          {name:"媒体分布",id:"#publish"},
          {name:"关键词云",id:"#world_cloud"},
          {name:"事件脉络",id:"#event_context"},
          ],
        menuCurrentID:'summary',

        /*事件概述*/
        summaryData:'',

        /*首发媒体*/
        latestOpinionData: [],
        latestOpinionCategory: [
          {
            prop: 'mediaName',
            label: '媒体类型',
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            width: 150
          },
          {
            prop: 'publishTime',
            label: '发布时间',
            style: {padding: '10px 0',textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            width: 150
          },
          {
            prop: 'title',
            label: '文章标题',
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            showHover:true,
          },
          {
            prop: 'source',
            label: '信息来源',
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            width: 150
          },

        ],

        /*发展趋势*/
        developingTrendData: [],
        developingTrendCategory: [
          {prop: 'website', label: '网媒'},
          {prop: 'weixin', label: '微信'},
          {prop: 'weibo', label: '微博'},
          {prop: 'app', label: 'APP'},
          {prop: 'total', label: '全部'}
        ],

        /*媒体发布*/
        publishData: [],

        /*情感指数趋势*/
        emotionTrendData: [],
        emotionTrendCategory: [
          {prop: 'emoIndexAvg', label: '正常'},
        ],

        /*词云分布*/
        worldCloudData: [],
        worldCloudCategory:[
          {
            prop: 'keywordNames',
            label: '事件高频词',
            style: {padding: '0 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
          },
          {
            prop: 'articleNums',
            label: '',
            style: {padding: '0 0',textAlign: 'right'},
            headerStyle: {textAlign: 'right'},
            width: 70
          },
        ],

        /*发布热区*/
        hotAreaData: [],
        hotAreaRankData: [],
        hotAreaCategory: [
          {prop: 'areaName', label: '地区',width: 180,  style: {padding: '0 0',},},
          {prop: 'articleNum', label: '热度指数', style: {padding: '0 0'}},
        ],


        /*事件脉络*/
        eventContextData:[],
        eventContextCategory:[
          {
            prop: 'publishTime',
            label: '发布时间',
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            width: 150
          },
          {
            prop: 'source',
            label: '来源',
            style: {padding: '10px 0',textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            width: 150
          },
          {
            prop: 'title',
            label: '文章标题',
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            showHover:true,
          },
          {
            prop: 'inclination',
            label: '情感倾向',
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            width: 150
          },
        ],
        EventContextPageNo:0,
        EventContextTotal:0,

        isLoading:false,
        isError:false,

      }
    },
    methods:{


      loadInitTime(){

        planType(this.$route.params.id).then(response=>{
          // console.log('初始时间');
          // console.log(response);

          if (response && response.code == 200 && response.data) {

            let startTime = new Date(response.data.kpStartTime), endTime = new Date(response.data.kpEndTime);

            let start = startTime.getFullYear()+'-'+(startTime.getMonth()<9?('0'+(startTime.getMonth()+1)):(startTime.getMonth()+1))+'-'+(startTime.getDate()<10?('0'+startTime.getDate()):startTime.getDate());
            let end = endTime.getFullYear()+'-'+(endTime.getMonth()<9?('0'+(endTime.getMonth()+1)):(endTime.getMonth()+1))+'-'+(endTime.getDate()<10?('0'+endTime.getDate()):endTime.getDate());
            this.eventAnalysisTimeRange = Array(start,end);

            this.loadData();
          }



        }).catch(errro=>{

        })
      },

      loadData(){

        let pid = this.$route.params.id;

        let start = '',end = '';

        if(Array.isArray(this.eventAnalysisTimeRange)){
          start = this.eventAnalysisTimeRange[0];
          end = this.eventAnalysisTimeRange[1];
        }else{
          let time = this.eventAnalysisTimeRange.split(',');
          start = time[0];
          end = time[1];
        }


        // console.log(`start=${start},end=${end}`);

        // 0:今日,1:近7天,2:近15天,3:近30天    默认为1

        /*事件概述*/
        this.loadSummaryData(pid, start, end);
        /*首发媒体*/
        this.loadLatestOpinionData(pid);
        /*发展趋势*/
        this.loadOverviewData(pid, 4, start, end);

        /*媒体分布饼图*/
        this.loadPublishData(pid, 4, start, end);

        /*情感指数折线图*/
        this.loadEmotionTrendData(pid, 4, start, end);

        /*词云分布*/
        this.loadWordCloudData(pid, 4,start, end);

        /*发布热区地图*/
        this.loadHotAreaData(pid, 4,start, end);

        /*事件脉络*/
        this.LoadEventContextData(pid,start, end);


      },

      /*事件概述*/
      loadSummaryData(id, start, end){
        qryReportSummary({pid:id,timeType:4,timeRangeStart:start,timeRangeEnd:end}).then(response=>{
          // console.log('事件概述');
          // console.log(response);

          if (response && response.code == 200 && response.data) {
            this.summaryData = response.data.summary;
          }


        }).catch(error=>{
          console.log(error);
        })
      },

      /*首发媒体*/
      loadLatestOpinionData(id) {

        getEventFirstMedia({pid:id}).then(response => {

          // console.log('首发媒体');
          // console.log(response);
          if (response && response.code == 200 && response.data) {
            this.latestOpinionData = response.data;
          }

        }).catch(error => {
          console.log(error);
        })
      },
      clickFirstMediaTableCell(row,column){

        let thiz = this;
        let pid = thiz.$route.params.id;
        thiz.latestOpinionData.forEach(function (value,index) {
          if (row == index) {
            let id =  value.webpageCode;
            let time = value.publishTime;
            time = time.replace(/\-/ig, '/');
            let releaseDatetime= new Date(time).getTime();
            let userName = thiz.$iknowsUtil.getUserName();
            window.open('/details/'+userName+'?webpageCode='+id+'&releaseDatetime='+ releaseDatetime+'&planId='+pid );
          }
        })

      },

      /*发展趋势*/
      loadOverviewData(id, type, start, end) {

        let params = {timeType: type, pid: id, timeRangeStart:start, timeRangeEnd:end};
        getMonitorAnalysis_mediaTrend(params).then(response => {

          // console.log('发展趋势');
          // console.log(response);
          if (response && response.code == 200 && response.data) {

            response.data.forEach(function (item) {
              item.total = (item.website + item.weixin+item.weibo+item.app);
            });
            this.developingTrendData = response.data;
          }

        }).catch(error => {
          console.log(error);
        })
      },


      /*媒体分布*/
      loadPublishData(id, type,start,end) {

        let params = {timeType: type, pid: id,timeRangeStart:start,timeRangeEnd:end};

        // console.log(params);
        getMonitorAnalysis_mediaDistribution(params).then(response => {

          // console.log('媒体分布');
          // console.log(response);
          if (response && response.code == 200 && response.data) {
            // this.publishData = response.data;
            let Data = response.data;
            let mediaType = [];
            Data.forEach(function (value,index) {
              if (value.articleNum > 0){
                mediaType.push(value)
              }
            })
            this.publishData = mediaType;
          }

        }).catch(error => {
          console.log(error);
        })
      },


      /*情感指数*/
      loadEmotionTrendData(id, type,start,end) {

        let params = {timeType: type, pid: id,timeRangeStart:start,timeRangeEnd:end};
        getMonitorAnalysis_emotionTrend(params).then(response => {

          // console.log('情感指数');
          // console.log(response);
          if (response && response.code == 200 && response.data) {

            this.emotionTrendData = response.data;
          }

        }).catch(error => {
          console.log(error);
        })
      },

      /*词云分布*/
      loadWordCloudData(id, type,start,end) {

        let params = {timeType: type, pid: id,timeRangeStart:start,timeRangeEnd:end};
        getMonitorAnalysis_wordCloud(params).then(response => {

          // console.log('词云分布');
          // console.log(response);
          if (response && response.code == 200 && response.data) {

            let result = response.data;
            result.forEach(function (item,index) {
              item.keywordNames = (index+1)+'.'+item.keywordName;
              item.articleNums = item.articleNum>=10000?(item.articleNum/10000 + '万'):item.articleNum +'次';
            });

            this.worldCloudData = result;
          }

        }).catch(error => {
          console.log(error);
        })
      },

      /*热点地域*/
      loadHotAreaData(id, type,start,end) {

        let params = {timeType: type, pid: id,timeRangeStart:start,timeRangeEnd:end};
        getMonitorAnalysis_hotRegion(params).then(response => {

          // console.log('热点地域');
          // console.log(response);
          if (response && response.code == 200 && response.data) {
            this.hotAreaData = response.data;
            this.hotAreaRankData = response.data.slice(0, response.data.length>10?10:response.data.length);
          }

        }).catch(error => {
          console.log(error);
        })
      },

      /*事件脉络*/
      LoadEventContextData(id,start,end){

        this.isLoading = true;
        let thiz = this;

        let params = {pid:id,pageStart:this.EventContextPageNo*10,pageSize:10, timeRangeStart:start,timeRangeEnd:end};

        // console.log(params);
        getEventContextData(params).then(response=>{
          // console.log('事件脉络');
          // console.log(response);

          this.isLoading = false;

          if (response && response.code == 200 && response.data) {

            this.EventContextTotal = response.data.totalElements;

            let result = response.data.content;

            result.forEach(function (item) {
              if(parseFloat(item.qg) < 0.3){
                item.inclination = '负面';
              }else if(parseFloat(item.qg) > 0.7){
                item.inclination = '正面';
              }else{
                item.inclination = '中性';
              }
            });

            thiz.eventContextData = this.eventContextData.concat(result);

            thiz.EventContextPageNo++;

          }else{
            thiz.isError = true;
          }

          }).catch(error=>{
          thiz.isLoading = false;

        });

      },
      clickEventContextTableCell(row,column){
        let thiz = this;
        let pid = thiz.$route.params.id;
        thiz.eventContextData.forEach(function (value,index) {

          if (row == index) {
            let id =  value.webpageCode;
            let time = value.publishTime;
            time = time.replace(/\-/ig, '/');
            let releaseDatetime= new Date(time).getTime();
            let userName = thiz.$iknowsUtil.getUserName();
            window.open('/details/'+userName+'?webpageCode='+id+'&releaseDatetime='+ releaseDatetime+'&planId='+pid );
          }
        })
      },
      loadMoreData(){
        this.LoadEventContextData(this.$route.params.id);
      },



      getElementTop(id){
        return document.getElementById(id).getBoundingClientRect().top;
      },

      timeChooseChanged(timeValue){
        this.loadData();

        // alert(timeValue);
        // alert(this.eventAnalysisTimeRange);
      },

      addEventListenerScroll(){
        /*控制当前菜单的吸附效果*/
        let menuTop = document.getElementById('menu').getBoundingClientRect().top;
        if(menuTop <=0){
          document.getElementById('menuFloat').style.opacity = 1;
        }else{
          document.getElementById('menuFloat').style.opacity = 0;
        }

        /*顶部菜单根据滚动事件 切换当前选中菜单项*/
        if(this.getElementTop('summary') >=0){
          this.menuCurrentID = 'summary';
        } else if(this.getElementTop('first_media') >=0){
          this.menuCurrentID = 'first_media';
        }else if(this.getElementTop('developing_trend') >=0){
          this.menuCurrentID = 'developing_trend';
        }else if(this.getElementTop('publish') >=0){
          this.menuCurrentID = 'publish';
        }else if(this.getElementTop('world_cloud') >=0){
          this.menuCurrentID = 'world_cloud';
        }else if(this.getElementTop('hot_area') >=0){
          this.menuCurrentID = 'hot_area';
        }else if(this.getElementTop('event_context') >=0){
          this.menuCurrentID = 'event_context';
        }
      }
    },

    mounted(){

      this.loadInitTime();
      window.addEventListener('scroll', this.addEventListenerScroll, true);

    },

    beforeDestroy(){
      window.removeEventListener('scroll',this.addEventListenerScroll,true);
    }
  }
</script>

<style scoped>

  /*块*/
  .floatBox {
    display: flex;
    justify-content: center;
    background-color: #fff;
    overflow: hidden;
    /* display: -ms-flexbox; */
  }

  /*统一标题*/
  .eventAnalysisTitle{
    height: 24px;
    line-height: 24px;
    color: #555;
    font-weight: 900;
    padding:20px 30px;
    padding-bottom: 0;
  }

  .event_analysis{
    padding-bottom: 30px;
    position: relative;
    width: 100%;
  }

  /*时间选择器*/
  .time_choose{
    position: absolute;
    height: 40px;
    line-height: 40px;
    right: 0;
    top: -40px;
    padding: 0 20px 0 40px;
    background: linear-gradient(135deg, transparent 25px, #fff 0) top left;
    font-size: 14px;
    color: #999;

  }
  .time_choose >>> .el-input__inner{
    line-height: 30px;
    height: 30px;
    border: 0;
  }

  .time_choose >>> .el-input__icon{
    display: none;
  }

  .time_choose >>> input{
    border: 1px solid #979797;
    border-radius: 4px;
    width: 90px;
    font-size: 14px;
    color: #999;
  }

  .time_choose >>> .el-range-separator{
    line-height: 30px;
    height: 30px;
  }
  .time_choose >>> .el-date-editor{
    width: 210px;
  }

  /*菜单*/
  .menu{
    border-bottom: 1px solid #f5f5f5;
  }
  .menuFloat{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    background-color: #fff;
    opacity: 0;
    z-index: 100;
    padding: 0 60px;
    border-bottom: 1px solid #f5f5f5;
  }

  .menu a,.menuFloat a{
    display: block;
    width: 180px;
    text-align: center;
    font-size: 16px;
    height: 50px;
    line-height: 50px;
  }
  .menu_title{
    display: inline-block;
    height: 48px;
    color: #555;
  }
  .menu_title:hover{
    color: #11B7D3;
  }
  .menu_title_selected{
    border-bottom: 2px solid #11B7D3 ;
    color: #11B7D3;
  }

  /*概述*/
  .summary{
    /*height: 300px;*/
    padding: 16px;
    background-color: #fff;
  }
  .summary_content{
    display: inline-block;
    font-size: 16px;
    color: #555555;
    letter-spacing: 0;
    text-align: center;
    line-height: 32px;
    padding: 0 120px;
  }


  /*首发媒体*/
  .first_media_content {
    background-color: #fff;
    padding: 20px 30px 0 30px;
  }

  /*发展趋势*/
  .developing_trend{
    padding: 30px;
    background-color: #fff;
  }

  .developing_trend_content {
    width: 100%;
    background-color: #fff;
    height: 400px;
  }

  /*媒体分布*/
  .publish_content {
    height: 300px;
  }
  /*情感指数*/
  .emotion_trend_content{
    height: 300px;
  }
  /*词云分布*/
  .world_cloud_content {
    height: 300px;
  }
  /*发布热区*/
  .hot_area_content {
    height: 300px;
  }
  /*事件脉络*/
  .event_context_content {
    background-color: #fff;
    padding: 20px 30px 0 30px;
  }



  .analysis_item {
    padding: 30px;
    width: calc(50% - 30px * 2);
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
  }

  .analysis_item:nth-child(2n-1) {
    border-right: 1px solid #f5f5f5;
  }

  .no_padding{
    padding: 0;
  }


  /*加载更更多*/
  .loadMore{
    text-align: center;
    font-size: 14px;
    color: #aaa;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
</style>
