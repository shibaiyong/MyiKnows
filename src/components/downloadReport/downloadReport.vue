<template>
  <div id="downloadreport" class="rzl-contarner" style="min-width: 200px">
    <h2></h2>
    <div class="reportTitle font40">{{titleName}}舆情报告</div>
    <div class=""></div>
    <!-- 整体信息报道量走势 -->
    <div id="downloadContent">

      <h2 class="font18">一、舆情概述</h2>
      <div class="introduceContent">
        {{summary}}
      </div>



      <h2 class="font18">二、舆情分析</h2>
      <ul>
        <li>
          <h3 class="font16">1.整体信息报道量走势</h3>
          <p class="font14">据下图可知，整体信息报道量走势如下：{{ totleReportDate }}信息总量为{{ totleReportNumber }}条。</p>
          <div class="overallTrend">
              <lineChart id="indexChartLine"
                        :data="overviewData"
                        axis="splitTime"
                        :category="overviewCategory"
              ></lineChart>
          </div>
        </li>
        <li>
          <h3 class="font16">2.媒体分布</h3>
          <p class="font14" v-if="publishData.length != 0">据下图可知，在媒体分布中，<span v-for="(item,index) in publishData">{{item.mediaName}}{{item.articleNum}}条，占比{{publishPiePersent[item.mediaName]}}%{{index==publishData.length-1?'。':';'}}</span></p>
          <div class="warningTrend">
            <IPie id="publish" :data="publishData" label="mediaName" prop="articleNum"></IPie>
          </div>
        </li>
        <li>
          <h3 class="font16">3.情感指数变化趋势</h3>
          <div class="warningTrend">
                  <lineChart id="emotion_trend"
                    :data="emotionTrendData"
                    axis="splitTime"
                    :category="emotionTrendCategory"
          ></lineChart>
          </div>
        </li>
        <li class="activePublic">
          <h3 class="font16">4.活跃媒体</h3>
          <p class="font14">据下图可知，信息主要来源于<span v-for="(item,index) in activeRange">{{item.siteName}}共报道{{item.articleNum}}条{{index==activeRange.length-1?'。':'，'}}</span></p>
          <div class="warningTrend">
            <barChart id="sourceRank" :data="sourceRankData"
                                      axis="siteName"
                                      :category="sourceRankCategory">
            </barChart>
          </div>
        </li>
        <li>
          <h3 class="font16">5.词云</h3>
          <p class="font14" v-if="worldCloudData.length">据下图可知，媒体关注集中在<span v-for="(item,index) in worldCloudData">{{item.keywordName}}共报道{{item.articleNum}}条{{index==worldCloudData.length-1?'':'，'}}</span>等热词。</p>
          <div class="warningTrend">
            <IWorld id="world_cloud" :data="worldCloudData" label="keywordName" prop="articleNum"></IWorld>
          </div>
        </li>
        <li>
          <h3 class="font16">6.地图</h3>
          <p class="font14" v-if="hotAreaRankData.length">据下图可知，发布热区主要分布于<span v-for="(item,index) in hotAreaRankData">{{item.areaName}}{{index == hotAreaRankData.length-1 ? '':'，'}}</span>等地。</p>
          <div class="hotArea">
            <div style="width: 50%;height:100%;">
              <IMap id="hot_area" :data="hotAreaData" label="areaName" prop="articleNum"></IMap>
            </div>
            <div style="width: 50%">
              <ITable id="hot_area"
                                :data="hotAreaRankData"
                                :category="hotAreaCategory">
              </ITable>
            </div>
          </div>
        </li>
        <li>
          <h3 class="font16">7.预警变化走势</h3>
          <p class="font14">据下图可知，{{warningTrendDate}}信息量为{{warningTrendNumber}}条。</p>
          <div class="warningTrend">
              <lineChart id="warningChange"
                         :data="warningChangeDatas"
                         axis="create_time"
                         :category="warningChangeCategory">
              </lineChart>
            </div>
        </li>
        <li>
          <h3 class="font16">8.预警分类分析</h3>
          <p class="font14" v-if="warningTypeDatas.length">据下图可知，预警分类如下：其中<span v-for="(item,index) in warningTypeDatas">{{item.levelLabel}}等级{{ item.count }}条，占{{warningPiePersent[item.levelLabel]}}%{{index==warningTypeDatas.length-1?'。':'；'}}</span></p>
          <div class="warningTrend">
              <IPie id="warningType"
                         :data="warningTypeDatas"
                         label="levelLabel"
                         prop="count"></IPie>
            </div>
        </li>

      </ul>
      <h2 class="font18">三、结论与建议</h2>
      <div class="introduceContent">
        对于舆情信息中的敏感信息和潜在危害，应给予持续关注并即时采取应对措施，防止不良影响的产生和扩散。
      </div>
    </div>
  </div>
</template>

<script>

import messageBox from "@/components/common/messageBox";
import lineChart from '@/components/common/ZCChartsLine';
import barChart from '@/components/common/ZCChartsBar';
import IPie from '../common/ZCChartsPie.vue';
import IMap from '../common/ZCChartsMap.vue'
import ITable from '../common/ZCTable.vue'
import IWorld from '../common/ZCChartsWorld.vue'

import {  getMonitorAnalysis_mediaTrend,getMonitorAnalysis_warningAnalysis,
          getMonitorAnalysis_mediaDistribution,getMonitorAnalysis_emotionTrend,
          getMonitorAnalysis_sourceRank,getMonitorAnalysis_hotRegion,
          getMonitorAnalysis_wordCloud,getWarnChange,
          getWarnLevel, qryReportSummary } from '@/assets/js/api';
import sha256 from "js-sha256";

export default {
  name: "login",
  data() {
    return {
      titleName:'',
      summary:'',
      /*整体信息报道量走势*/
      overviewData: [],
      overviewCategory: [
        {prop: 'website', label: '网媒'},
        {prop: 'weixin', label: '微信'},
        {prop: 'weibo', label: '微博'},
        {prop: 'app', label: 'APP'}
      ],
      /*预警变化走势*/

      warningChangeDatas:[],
      warningChangeCategory:[
        {prop: 'website', label: '网媒'},
        {prop: 'weixin', label: '微信'},
        {prop: 'weibo', label: '微博'},
        {prop: 'app', label: 'APP'},
      ],
      warningTrendNumber:0,
      warningTrendDate:'',
      /*媒体分布*/
      publishData:[],
      publishPiePersent:{},
      /*情感指数变化趋势*/
      emotionTrendData: [],
      emotionTrendCategory: [
        {prop: 'emoIndexAvg', label: '正常'},
      ],
      /*活跃媒体*/
      sourceRankData: [],
      sourceRankCategory: [
        {prop: 'articleNum', label: '正常'},
      ],
      activeRange:[],
      /*发布热区*/
      hotAreaData: [],
      hotAreaRankData: [],
      hotAreaCategory: [
        {prop: 'areaName', label: '地区', style: {padding: '0 0',},},
        {prop: 'articleNum', label: '热度指数', style: {padding: '0 0'}},
      ],
      /*词云分布*/
      worldCloudData: [],
      //预警分类占比
      warningTypeDatas:[],
      warningPiePersent:{},

      title:'',
      totleReportNumber:0,
      totleReportDate:'',
      // 区别于页面来自于app还是pc
      resource: '',
    };
  },
  created() {

  },
  mounted() {
    let queryObj = this.$iknowsUtil.getQueryObjectByUrl();
    let resource = queryObj.resource || '';
    console.log(resource);
    let pid = this.$route.query.pid
    let type = this.$route.query.timeType
    this.titleName = this.$route.query.planName
    let reportid = this.$route.query.reportId
    this.qryReportSummary(pid,type,reportid,resource)
    //1.整体信息报道量走势
    this.loadOverviewData(pid, type, reportid,resource)
    //2.媒体分布
    this.loadPublishData(pid, type, reportid,resource)
    //3.预警变化走势
    this.loadDatas_WarningChange(pid, type,resource)
    //4.情感指数趋势
    this.loadEmotionTrendData(pid, type,resource)
    /*5.媒体排行柱状图*/
    this.loadSourceRankData(pid, type, reportid,resource)
    /*6.发布热区地图*/
    this.loadHotAreaData(pid, type, reportid,resource)
    /*词云分布*/
    this.loadWordCloudData(pid, type, reportid,resource)
    //预警分析占比
    this.loadDatas_WarningType(pid,resource)
  },
  methods: {
    qryReportSummary(id,type,reportid,resource){
      let params = {
        pid:id,
        timeType:type,
        resource: resource,
        reportId:reportid
      }
      qryReportSummary(params).then(res => {
        if(res.code == '200' && res.data){
          this.summary = res.data.summary
        }

      })
    },
    // 整体信息报道量走势
    loadOverviewData(id, type, reportid,resource) {

      let params = {timeType: type, pid: id,resource: resource, reportId:reportid};
      getMonitorAnalysis_mediaTrend(params).then(response => {

        if (response && response.code == 200 && response.data) {
          this.overviewData = response.data;
          this.sumPublics( response.data );//计算报道总量;
        }

      }).catch(error => {
        console.log(error);
      })
    },

    /*2.7.3	预警分析柱状图*/
    loadDatas_WarningChange(id, type,resource) {
      let params = new URLSearchParams();
      params = {
        planId:id,
        resource: resource || '',
      };

      getWarnChange(params).then(response => {
        if (response.code == 200) {
          this.warningChangeDatas = response.data
          this.sumPublics1( response.data, '-' );
        }else {
          this.$message.error(response.message);
        }
      }).catch(error => {
        console.log(error);
      })
    },

    loadPublishData(id, type, reportid,resource) {//媒体分布饼图

      let params = {timeType: type, pid: id,resource: resource, reportId: reportid};
      getMonitorAnalysis_mediaDistribution(params).then(response => {

        if (response && response.code == 200 && response.data) {
          let Data = response.data;
          let mediaType = [];
          let totalNum = 0;
          let publishPiePersent = {};
          Data.forEach(function (value,index) {
            if (value.articleNum > 0){
              mediaType.push(value);
              totalNum += value.articleNum;
            }
          })
          this.publishData = mediaType;
          //计算占比
          for(var i=0; i < mediaType.length; i++){
            var per = parseInt(mediaType[i].articleNum/totalNum*10000)/100;
            publishPiePersent[mediaType[i].mediaName] = per;
          }
          this.publishPiePersent = publishPiePersent;
        }

      }).catch(error => {
        console.log(error);
      })
    },
    /*情感指数折线图*/
    loadEmotionTrendData(id, type,resource) {

      let params = {timeType: type,resource: resource, pid: id};
      getMonitorAnalysis_emotionTrend(params).then(response => {

        if (response && response.code == 200 && response.data) {
          this.emotionTrendData = response.data;
        }
      }).catch(error => {
        console.log(error);
      })
    },
    /*活跃媒体排行柱状图*/
    loadSourceRankData(id, type, reportid,resource) {

      let params = {timeType: type, pid: id,resource: resource, reportId: reportid};
      getMonitorAnalysis_sourceRank(params).then(response => {
        if (response && response.code == 200 && response.data) {
          this.sourceRankData = response.data;
          this.activeRange = response.data.length > 5 ? response.data.slice(0,5): response.data;
        }
      }).catch(error => {
        console.log(error);
      })
    },

    /*2.7.5	发布热区地图*/
    loadHotAreaData(id, type, reportid,resource) {

      let params = {timeType: type, pid: id,resource: resource, reportId: reportid};
      getMonitorAnalysis_hotRegion(params).then(response => {

        if (response && response.code == 200 && response.data) {
          this.hotAreaData = response.data;
          this.hotAreaRankData = response.data.slice(0, response.data.length>10?10:response.data.length);
        }

      }).catch(error => {
        console.log(error);
      })
    },
    /*词云分布*/
    loadWordCloudData(id, type, reportid,resource) {

      let params = {timeType: type, pid: id,resource: resource, reportId:reportid};
      getMonitorAnalysis_wordCloud(params).then(response => {

        if (response && response.code == 200 && response.data) {
          this.worldCloudData = response.data;
        }

      }).catch(error => {
        console.log(error);
      })
    },
    //预警分类占比数据
    loadDatas_WarningType(id,resource){
      let params = new URLSearchParams();
      params = {
        resource: resource,
        planId:id
      };

      getWarnLevel(params).then(response => {
        if (response.code == 200) {
          this.warningTypeDatas = response.data ? response.data : [];
          let data = this.warningTypeDatas
          let warningPiePersent = {};
          let totalNum = 0;
          for(var i =0; i < data.length; i++){
            totalNum += data[i].count;
          }
          //计算占比
          for(var i=0; i < data.length; i++){
              var per = parseInt(data[i].count/totalNum*10000)/100;
              warningPiePersent[data[i].levelLabel] = per;
            }
            this.warningPiePersent = warningPiePersent;
        }else {
          this.$message.error(response.message);
        }
      }).catch(error => {
        console.log(error);
      })
    },
    //整体信息走势求和
    sumPublics( arr, fat ){
      let fatt = fat ? fat : '/';
      if(arr.length == 0){
        this.totleReportNumber = 0;
        this.totleReportDate = '';
        return '';
      }
      for(let i = 0;i < arr.length; i++){
        var sum = arr[i].weibo + arr[i].app + arr[i].website + arr[i].weixin;
        this.totleReportNumber = sum > this.totleReportNumber ? sum : this.totleReportNumber;
        this.totleReportDate = sum >= this.totleReportNumber ? '监测结果在' + arr[i].splitTime.replace('/','月') + '日达到最大,' : this.totleReportDate;
      }
    },

    sumPublics1( arr, fat ){
      let fatt = fat ? fat : '/';
      if(arr.length == 0){
        this.totleReportNumber = 0;
        this.totleReportDate = '';
        return '';
      }
      for(let i = 0;i < arr.length; i++){
        var sum = arr[i].weibo + arr[i].app + arr[i].website + arr[i].weixin;
        this.warningTrendNumber = sum > this.warningTrendNumber ? sum : this.warningTrendNumber;
        this.warningTrendDate = sum >= this.warningTrendNumber ? '预警变化走势如下：在' + arr[i].create_time.replace(fatt,'月') + '日达到波峰,' : this.totleReportDate;
      }
    }
  },
  beforeDestroy(){

  },
  watch: {

  },
  components: {
    lineChart,
    barChart,
    IPie,
    IMap,
    ITable,
    IWorld
  }
};
</script>

<style scoped>
#downloadreport ul{
  width:100%;
  overflow: hidden;
}
#downloadContent h2{
  font-weight: bold;
  color:black;
  margin-bottom:10px;
}
#downloadreport ul li h3{
    margin-bottom:10px;
    font-weight: bold;
  }
  #downloadreport ul li{
    width:100%;
  }

  .overallTrend, .warningTrend,.hotArea{
    width: 100%;
    height: 495px;
    overflow-x: hidden;
    margin: 20px 0;
    box-sizing:border-box;
    background: #ffffff;
  }
  .hotArea div{
    float:left;
  }
  .downloadBtn{
    width: 60px;
    height: 30px;
    margin: 20px;
  }
  .reportTitle{
    text-align: center;
    font-weight: bold;
    color:rgb(30,169,232);
    padding:20px 0;
  }
  .introduceContent,#downloadreport ul li p{
    line-height: 20px;
    min-height: 100px;
    text-indent: 2em;
  }

</style>
