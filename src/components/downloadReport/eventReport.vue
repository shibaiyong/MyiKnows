<template>
  <div id="eventReport" class="rzl-contarner eventReport" style="min-width: 200px">

    <div class="reportTitle font40">{{titleName}}</div>

    <h2 class="font18">一、舆情概述</h2>

    <div class="summary">{{summaryData}}</div>

    <h2 class="font18">二、舆情分析</h2>

    <h3 class="font16">1.首发媒体</h3>

    <div class="first_media">

      <ITable id="first_media_table"
              :data="latestOpinionData"
              :category="latestOpinionCategory">
      </ITable>

    </div>

    <h3 class="font16">2.发展趋势</h3>

    <div class="developing_trend">
      <ILine id="developing_trend_line"
             :data="developingTrendData"
             axis="splitTime"
             :category="developingTrendCategory">
      </ILine>
    </div>

    <h3 class="font16">3.媒体分布</h3>

    <div class="publish">
      <IPie id="publish_pie"
            :data="publishData"
            label="mediaName"
            prop="articleNum">
      </IPie>
    </div>

    <h3 class="font16">4.情感指数趋势</h3>

    <div class="emotion_trend">
      <ILine id="emotion_trend_line"
             :data="emotionTrendData"
             axis="splitTime"
             :category="emotionTrendCategory">
      </ILine>
    </div>

    <h3 class="font16">5.关键词云</h3>

    <p class="font14" v-if="worldCloudData.length">据下图可知，媒体关注集中在{{worldCloudInfo}}等热词。</p>
    <div class="world_cloud">
      <div style="width: 60%;height: 300px;">
        <IWorld id="world_cloud_world" :data="worldCloudData" label="keywordName" prop="articleNum"></IWorld>
      </div>
      <div style="width: 40%;height: 300px;">
        <ITable id="world_cloud_table"
                :data="worldCloudData.slice(0,10)"
                :category="worldCloudCategory">
        </ITable>
      </div>
    </div>

    <h3 class="font16">6.热点地域</h3>

    <p class="font14" v-if="hotAreaData.length">据下图可知，热点地域主要分布于{{hotAreaInfo}}等地。</p>
    <div class="hot_area">
      <div style="width: 60%;height: 300px;">
        <IMap id="hot_area_map" :data="hotAreaData" label="areaName" prop="articleNum"></IMap>
      </div>
      <div style="width: 40%;height: 300px;">
        <ITable id="hot_area_table"
                :data="hotAreaRankData"
                :category="hotAreaCategory">
        </ITable>
      </div>
    </div>

    <h3 class="font16">7.事件脉络</h3>

    <p class="font14" v-if="eventContextData.length">由下图可知，事件最早从{{eventContextInfo}}开始: </p>
    <div class="event_context">
      <ITable id="event_context_table"
              :data="eventContextData"
              :category="eventContextCategory">
      </ITable>
    </div>

    <h2 class="font18">二、结论与建议</h2>
    <p class="font14">对于舆情信息中的敏感信息和潜在危害，应给予持续关注并即时采取应对措施，防止不良影响的产生和扩散</p>

  </div>
</template>

<script>

  import ILine from '@/components/common/ZCChartsLine';
  import IBar from '@/components/common/ZCChartsBar';
  import IPie from '@/components/common/ZCChartsPie.vue';
  import IMap from '@/components/common/ZCChartsMap.vue'
  import ITable from '@/components/common/ZCTable.vue'
  import IWorld from '@/components/common/ZCChartsWorld.vue'

  /*事件概述+首发媒体+发展趋势*/
  import {qryReportSummary, getEventFirstMedia, getMonitorAnalysis_mediaTrend} from '../../assets/js/api.js'
  /*媒体分布+情感指数*/
  import {getMonitorAnalysis_mediaDistribution, getMonitorAnalysis_emotionTrend,getReport_detail} from '../../assets/js/api.js'
  /*词云分布+热点地域+事件脉络*/
  import {getMonitorAnalysis_wordCloud, getMonitorAnalysis_hotRegion, getEventContextData} from '../../assets/js/api.js'

  export default {
    name: "event-report",
    components: {ILine, IBar, IPie, IMap, ITable, IWorld},
    data() {
      return {
        titleName: '',
        /*事件概述*/
        summaryData: '',

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
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            width: 150
          },
          {
            prop: 'title',
            label: '文章标题',
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
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
        worldCloudCategory: [
          {
            prop: 'keywordNames',
            label: '事件高频词',
            style: {padding: '0 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
          },
          {
            prop: 'articleNums',
            label: '',
            style: {padding: '0 0', textAlign: 'right'},
            headerStyle: {textAlign: 'right'},
            width: 70
          },
        ],
        worldCloudInfo:'',

        /*发布热区*/
        hotAreaData: [],
        hotAreaRankData: [],
        hotAreaCategory: [
          {prop: 'areaName', label: '地区', width: 180, style: {padding: '0 0',},},
          {prop: 'articleNum', label: '热度指数', style: {padding: '0 0'}},
        ],
        hotAreaInfo:'',


        /*事件脉络*/
        eventContextData: [],
        eventContextCategory: [
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
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            width: 150
          },
          {
            prop: 'title',
            label: '文章标题',
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
          },
          {
            prop: 'inclination',
            label: '情感倾向',
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            width: 150
          },
        ],
        EventContextPageNo: 0,
        EventContextTotal: 0,
        isLoading: false,
        isError: false,
        eventContextInfo:'',
      }
    },
    methods: {

      loadData() {

        let pid = this.$route.query.pid, type = this.$route.query.timeType, reportId = this.$route.query.reportId;
        // this.titleName = this.$route.query.planName;

        this.loadReportTitle(pid, reportId, type);
        /*事件概述*/
        this.loadSummaryData(pid, reportId, type);
        /*首发媒体*/
        this.loadLatestOpinionData(pid, reportId, type);
        /*发展趋势*/
        this.loadOverviewData(pid, reportId, type);

        /*媒体分布饼图*/
        this.loadPublishData(pid, reportId, type);

        /*情感指数折线图*/
        this.loadEmotionTrendData(pid, reportId, type);

        /*词云分布*/
        this.loadWordCloudData(pid, reportId, type);

        /*发布热区地图*/
        this.loadHotAreaData(pid, reportId, type);

        /*事件脉络*/
        this.LoadEventContextData(pid, reportId, type);
      },

      /*报告标题*/
      loadReportTitle(pid, rid, timeType){
        getReport_detail({reportId: rid}).then(response=>{
          console.log('报告标题');
          console.log(response);
          if (response && response.code == 200 && response.data) {
            this.titleName = response.data.reportName;
          }

        }).catch(error=>{

        })
      },

      /*事件概述*/
      loadSummaryData(pid, rid, timeType) {
        qryReportSummary({pid: pid, reportId: rid, timeType: timeType}).then(response => {
          // console.log('事件概述');
          // console.log(response);

          if (response && response.code == 200 && response.data) {
            this.summaryData = response.data.summary;
          }


        }).catch(error => {
          console.log(error);
        })
      },

      /*首发媒体*/
      loadLatestOpinionData(pid, rid, timeType) {

        getEventFirstMedia({pid: pid, reportId: rid}).then(response => {

          // console.log('首发媒体');
          // console.log(response);
          if (response && response.code == 200 && response.data) {
            this.latestOpinionData = response.data;
          }

        }).catch(error => {
          console.log(error);
        })
      },
      clickFirstMediaTableCell(row, column) {

        let thiz = this;
        let pid = thiz.$route.params.id;
        thiz.latestOpinionData.forEach(function (value, index) {
          if (row == index) {
            let id = value.webpageCode;
            let time = value.publishTime;
            time = time.replace(/\-/ig, '/');
            let releaseDatetime = new Date(time).getTime();
            let userName = thiz.$iknowsUtil.getUserName();
            window.open('/details/' + userName + '?webpageCode=' + id + '&releaseDatetime=' + releaseDatetime + '&planId=' + pid);
          }
        })

      },

      /*发展趋势*/
      loadOverviewData(pid, rid, timeType) {

        let params = {pid: pid, reportId: rid, timeType: timeType};
        getMonitorAnalysis_mediaTrend(params).then(response => {

          // console.log('发展趋势');
          // console.log(response);
          if (response && response.code == 200 && response.data) {

            response.data.forEach(function (item) {
              item.total = (item.website + item.weixin + item.weibo + item.app);
            });
            this.developingTrendData = response.data;
          }

        }).catch(error => {
          console.log(error);
        })
      },


      /*媒体分布*/
      loadPublishData(pid, rid, timeType) {

        let params = {pid: pid, reportId: rid, timeType: timeType};

        // console.log(params);
        getMonitorAnalysis_mediaDistribution(params).then(response => {

          // console.log('媒体分布');
          // console.log(response);
          if (response && response.code == 200 && response.data) {
            // this.publishData = response.data;
            let Data = response.data;
            let mediaType = [];
            Data.forEach(function (value, index) {
              if (value.articleNum > 0) {
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
      loadEmotionTrendData(pid, rid, timeType) {

        let params = {pid: pid, reportId: rid, timeType: timeType};
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
      loadWordCloudData(pid, rid, timeType) {

        let params = {pid: pid, reportId: rid, timeType: timeType};
        getMonitorAnalysis_wordCloud(params).then(response => {

          // console.log('词云分布');
          // console.log(response);
          if (response && response.code == 200 && response.data) {

            let result = response.data;
            result.forEach(function (item, index) {
              item.keywordNames = (index + 1) + '.' + item.keywordName;
              item.articleNums = item.articleNum >= 10000 ? (item.articleNum / 10000 + '万') : item.articleNum + '次';
            });

            this.worldCloudData = result;

            let topArr = result.slice(0,4),top = [];
            topArr.forEach(function (item) {
              top.push(item.keywordName);
            });
            this.worldCloudInfo = top.join('、');
          }

        }).catch(error => {
          console.log(error);
        })
      },

      /*热点地域*/
      loadHotAreaData(pid, rid, timeType) {

        let params = {pid: pid, reportId: rid, timeType: timeType};
        getMonitorAnalysis_hotRegion(params).then(response => {

          // console.log('热点地域');
          // console.log(response);
          if (response && response.code == 200 && response.data) {
            this.hotAreaData = response.data;
            this.hotAreaRankData = response.data.slice(0, response.data.length > 10 ? 10 : response.data.length);

            let topArr = response.data.slice(0,4),top = [];

            topArr.forEach(function (item) {
              top.push(item.areaName);
            })
            this.hotAreaInfo = top.join('、');

          }

        }).catch(error => {
          console.log(error);
        })
      },

      /*事件脉络*/
      LoadEventContextData(pid, rid, timeType) {

        this.isLoading = true;
        let thiz = this;

        let params = {
          pid: pid,
          reportId: rid,
          pageStart: 0,
          pageSize: 30,
        };

        // console.log(params);
        getEventContextData(params).then(response => {
          // console.log('事件脉络');
          // console.log(response);

          this.isLoading = false;

          if (response && response.code == 200 && response.data) {

            this.EventContextTotal = response.data.totalElements;

            let result = response.data.content,top = 0;

            result.forEach(function (item,index) {
              if (parseFloat(item.qg) < 0.3) {
                item.inclination = '负面';
              } else if (parseFloat(item.qg) > 0.7) {
                item.inclination = '正面';
              } else {
                item.inclination = '中性';
              }

              if(index === 0){
                top = new Date(item.publishTime).getTime();
                thiz.eventContextInfo = item.publishTime;
              } else if(new Date(item.publishTime).getTime() < top){
                thiz.eventContextInfo = item.publishTime;
              }
            });

            thiz.eventContextData = this.eventContextData.concat(result);
            thiz.EventContextPageNo++;



          } else {
            thiz.isError = true;
          }

        }).catch(error => {
          thiz.isLoading = false;

        });

      },
      clickEventContextTableCell(row, column) {
        let thiz = this;
        let pid = thiz.$route.params.id;
        thiz.eventContextData.forEach(function (value, index) {

          if (row == index) {
            let id = value.webpageCode;
            let time = value.publishTime;
            time = time.replace(/\-/ig, '/');
            let releaseDatetime = new Date(time).getTime();
            let userName = thiz.$iknowsUtil.getUserName();
            window.open('/details/' + userName + '?webpageCode=' + id + '&releaseDatetime=' + releaseDatetime + '&planId=' + pid);
          }
        })
      },
      loadMoreData() {
        this.LoadEventContextData(this.$route.params.id);
      },


    },

    mounted() {

      this.loadData();
    }
  }
</script>

<style scoped>

  .reportTitle {
    text-align: center;
    font-weight: bold;
    color: rgb(30, 169, 232);
    padding: 20px 0;
  }

  .eventReport h2 {
    font-weight: bold;
    color: #333;
    padding: 10px 0;
  }

  .eventReport h3 {
    color: #333;
    font-weight: bold;
    padding: 10px 0;

  }

  .summary, .eventReport p {
    line-height: 20px;
    /*min-height: 100px;*/
    text-indent: 2em;
    padding: 10px 0 20px 0;
  }

  .first_media {
    width: 100%;
  }

  .developing_trend {
    width: 100%;
    height: 400px;
  }

  .publish {
    width: 100%;
    height: 400px;
  }

  .emotion_trend {
    width: 100%;
    height: 400px;
  }

  .world_cloud {
    width: 100%;
    display: flex;
    height: 400px;
  }

  .hot_area {
    width: 100%;
    display: flex;
    height: 400px;
  }

  .event_context {
    width: 100%;
    height: 400px;
  }


</style>
