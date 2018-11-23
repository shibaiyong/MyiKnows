<template>
  <div class="monitor-analysis">

    <!--总览-->
    <div>
      <div class="monitorResultsTitle font18 rzl_bc_white">监测结果走势</div>
      <div class="overview floatBox">
        <div class="overview_content">
          <ILine id="overview" :data="overviewData" axis="splitTime" :category="overviewCategory"></ILine>
        </div>
      </div>
    </div>


    <div class="floatBox">
      <!--最新舆情-->
      <div class="analysis_item">

        <div class="analysis_title font18">最新舆情</div>
        <div class="latest_opinion_content">

          <span class="latest_opinion_btn font14"
                v-for="(item,index) in latestOpinionBtn"
                :class="item.selected?'latest_opinion_btn_selected':''"
                v-text="item.name" @click="latestOpinionBtnClick(index)">
          </span>

          <span class="latest_opinion_btn_more font14" @click="latestOpinionMoreBtnClick">更多></span>

          <div style="width: 100%">
            <ITable id="latest_opinion"
                    :data="latestOpinionData"
                    :category="latestOpinionCategory"
                    @click-table-cell="clickTableCell1">
            </ITable>

          </div>

        </div>

      </div>
      <!--预警分析-->
      <div class="analysis_item">

        <div class="analysis_title font18">预警分析</div>
        <div class="warning_content">
          <IBar id="warning" :data="warningData" axis="create_time" :category="warningCategory"></IBar>
        </div>

      </div>
    </div>


    <div class="floatBox">
      <!--媒体分布-->
      <div class="analysis_item">
        <div class="analysis_title font18">媒体分布</div>
        <div class="publish_content">
          <IPie id="publish" :data="publishData" label="mediaName" prop="articleNum"></IPie>
        </div>
      </div>
      <!--发布热区-->
      <div class="analysis_item">
        <div class="analysis_title font18">发布热区</div>
        <div class="hot_area_content floatBox">
          <div style="width: 50%">
            <IMap id="hot_area" :data="hotAreaData" label="areaName" prop="articleNum"></IMap>
          </div>
          <div style="width: 50%">
            <ITable id="hot_area"
                    :data="hotAreaRankData"
                    :category="hotAreaCategory">
            </ITable>
          </div>
        </div>
      </div>
    </div>


    <!--来源排行-->
    <div class="sourceRank">
      <div class="analysis_title font18">来源排行</div>
      <div class="sourceRank_content">
        <IBar id="sourceRank" :data="sourceRankData" axis="siteName" :category="sourceRankCategory"></IBar>
      </div>
    </div>


    <div class="floatBox">
      <!--情感指数趋势-->
      <div class="analysis_item">
        <div class="analysis_title font18">情感指数趋势</div>
        <div class="emotion_trend_content">
          <ILine id="emotion_trend" :data="emotionTrendData" axis="splitTime"
                 :category="emotionTrendCategory"></ILine>
        </div>
      </div>
      <!--词云分布-->
      <div class="analysis_item">
        <div class="analysis_title font18">词云分布</div>
        <div class="world_cloud_content">
          <IWorld id="world_cloud" :data="worldCloudData" label="keywordName" prop="articleNum"></IWorld>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import ILine from '../common/ZCChartsLine'
  import IBar from '../common/ZCChartsBar.vue'
  import IPie from '../common/ZCChartsPie.vue'
  import IMap from '../common/ZCChartsMap.vue'
  import IWorld from '../common/ZCChartsWorld.vue'
  import ITable from '../common/ZCTable.vue'
  import iKnowsUtil from '@/assets/js/iknowsUtil';

  import {getMonitorAnalysis_mediaTrend} from '../../assets/js/api.js'
  import {getMonitorAnalysis_lastArticle} from '../../assets/js/api.js'
  import {getMonitorAnalysis_warningAnalysis} from '../../assets/js/api.js'
  import {getMonitorAnalysis_mediaDistribution} from '../../assets/js/api.js'
  import {getMonitorAnalysis_hotRegion} from '../../assets/js/api.js'
  import {getMonitorAnalysis_sourceRank} from '../../assets/js/api.js'
  import {getMonitorAnalysis_emotionTrend} from '../../assets/js/api.js'
  import {getMonitorAnalysis_wordCloud} from '../../assets/js/api.js'


  export default {

    name: "monitor-analysis",
    components: {ILine, IBar, IPie, IMap, IWorld, ITable},
    data() {
      return {
        /*总览*/
        overviewData: [],
        overviewCategory: [
          {prop: 'website', label: '网媒'},
          {prop: 'weixin', label: '微信'},
          {prop: 'weibo', label: '微博'},
          {prop: 'app', label: 'APP'},
        ],
        /*最新舆情*/
        latestOpinionBtn: [
          {name: '最新', selected: true, value: 0},
          {name: '重大', selected: false, value: 4},
          {name: '较大', selected: false, value: 3},
        ],
        latestOpinionData: [],
        latestOpinionCategory: [
          {
            prop: 'articleTitle',
            label: '文章标题',
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            showHover:true,
          },
          {
            prop: 'articleSource',
            label: '文章来源',
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            width: 150
          },
          {prop: 'publishtime', label: '发布时间', style: {padding: '10px 0'}, width: 150},
        ],
        /*预警分析*/
        warningData: [],
        warningCategory: [
          {prop: 'level5', label: '正常'},
          {prop: 'level4', label: '一般'},
          {prop: 'level3', label: '轻微'},
          {prop: 'level2', label: '较大'},
          {prop: 'level1', label: '重大'},
        ],
        /*媒体发布*/
        publishData: [],
        /*发布热区*/
        hotAreaData: [],
        hotAreaRankData: [],
        hotAreaCategory: [
          {prop: 'areaName', label: '地区', style: {padding: '0 0',},},
          {prop: 'articleNum', label: '热度指数', style: {padding: '0 0'}},
        ],
        /*来源排行*/
        sourceRankData: [],
        sourceRankCategory: [
          {prop: 'articleNum', label: '正常'},
        ],
        /*情感指数趋势*/
        emotionTrendData: [],
        emotionTrendCategory: [
          {prop: 'emoIndexAvg', label: '正常'},
        ],
        /*词云分布*/
        worldCloudData: [],


      }
    },

    methods: {

      /*加载页面所有数据*/
      loadData() {

        let pid = this.$route.params.id;
        // 0:今日,1:近7天,2:近15天,3:近30天    默认为1
        this.loadOverviewData(pid, 1);
        /*媒体分组汇总趋势图*/
        this.loadLatestOpinionData(pid, 0);
        /*最新舆情表格*/
        this.loadWarningData(pid, 2);
        /*预警分析柱状图*/
        this.loadPublishData(pid, 1,);
        /*媒体分布饼图*/
        this.loadHotAreaData(pid, 1);
        /*发布热区地图*/
        this.loadSourceRankData(pid, 1);
        /*来源排行柱状图*/
        this.loadEmotionTrendData(pid, 1);
        /*情感指数折线图*/
        this.loadWordCloudData(pid, 1);
        /*词云分布*/

      },


      /*2.7.1	媒体分组汇总趋势图*/
      loadOverviewData(id, type) {

        let params = {timeType: type, pid: id};
        getMonitorAnalysis_mediaTrend(params).then(response => {

          console.log('2.7.1 媒体分组汇总趋势图');
          console.log(response);
          if (response && response.code == 200 && response.data) {

            this.overviewData = response.data;
          }

        }).catch(error => {
          console.log(error);
        })
      },

      /*2.7.2	最新舆情表格*/
      loadLatestOpinionData(id, type) {

        let params = {warnLevel: type, pid: id};
        getMonitorAnalysis_lastArticle(params).then(response => {

          console.log('2.7.2 最新舆情表格');
          console.log(response);
          if (response && response.code == 200 && response.data) {
            this.latestOpinionData = response.data.content;
            this.latestOpinionData.forEach((value, index) => {
              value.publishtime = value.publishTime;
            })
          }

        }).catch(error => {
          console.log(error);
        })
      },
      _dataFormat: function (dateTime) {
        var date = new Date(dateTime);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if (minutes.length == 1) {
          minutes = "0" + minutes
        }
        return checkTime(year) + "-" + checkTime(month) + "-" + checkTime(day) + " " + checkTime(hours) + ":" + checkTime(minutes)
        // 补0
        function checkTime(time) {
          if (time < 10) {
            time = "0" + time;
          }
          return time;
        }
      },
      //跳转到文章详情
      clickTableCell1(rowIndex) {
        let thiz = this;
        thiz.latestOpinionData.forEach(function (value,index) {
          if (rowIndex == index) {
            let id =  value.articleId;
            let time = value.publishTime;
            time = time.replace(/\-/ig, '/');
            let releaseDatetime= new Date(time).getTime();
            window.open('/details?webpageCode='+id+'&releaseDatetime='+ releaseDatetime );
          }
        })
      },

      /*最新舆情类型切换*/
      latestOpinionBtnClick(ind) {
        let thiz = this;
        this.latestOpinionBtn.forEach(function (item, index) {
          if (ind === index) {
            item.selected = true;

            thiz.loadLatestOpinionData(thiz.$route.params.id,item.value);

          } else {
            item.selected = false;
          }
        })


      },

      /*最新舆情更多按钮*/
      latestOpinionMoreBtnClick() {
        let id = this.$route.params.id;
        window.location.replace('/center/monitorresults/'+id);
      },

      /*2.7.3	预警分析柱状图*/
      loadWarningData(id, type) {

        let params = {timeType: type, pid: id};
        getMonitorAnalysis_warningAnalysis(params).then(response => {

          console.log('2.7.3 预警分析柱状图')
          console.log(response);
          if (response && response.code == 200 && response.data) {
            let data = response.data;
            data.forEach(function (v,i) {
              v.create_time = v.create_time.split('-')[1]+'/'+ v.create_time.split('-')[2]
            })
            this.warningData = data;
          }

        }).catch(error => {
          console.log(error);
        })
      },

      /*2.7.4	媒体分布饼图*/
      loadPublishData(id, type) {

        let params = {timeType: type, pid: id};
        getMonitorAnalysis_mediaDistribution(params).then(response => {

          console.log('2.7.4\t媒体分布饼图 返回结构不对');
          console.log(response);
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

      /*2.7.5	发布热区地图*/
      loadHotAreaData(id, type) {

        let params = {timeType: type, pid: id};
        getMonitorAnalysis_hotRegion(params).then(response => {

          console.log('2.7.5\t发布热区地图');
          console.log(response);
          if (response && response.code == 200 && response.data) {
            this.hotAreaData = response.data;
            this.hotAreaRankData = response.data.slice(0, response.data.length>10?10:response.data.length);
          }

        }).catch(error => {
          console.log(error);
        })
      },

      /*2.7.6	来源排行柱状图*/
      loadSourceRankData(id, type) {

        let params = {timeType: type, pid: id};
        getMonitorAnalysis_sourceRank(params).then(response => {

          console.log('2.7.6\t来源排行柱状图');
          console.log(response);
          if (response && response.code == 200 && response.data) {

            this.sourceRankData = response.data;
          }

        }).catch(error => {
          console.log(error);
        })
      },

      /*2.7.7	情感指数折线图*/
      loadEmotionTrendData(id, type) {

        let params = {timeType: type, pid: id};
        getMonitorAnalysis_emotionTrend(params).then(response => {

          console.log('2.7.7\t情感指数折线图');
          console.log(response);
          if (response && response.code == 200 && response.data) {

            this.emotionTrendData = response.data;
          }

        }).catch(error => {
          console.log(error);
        })
      },

      /*2.7.8	词云分布*/
      loadWordCloudData(id, type) {

        let params = {timeType: type, pid: id};
        getMonitorAnalysis_wordCloud(params).then(response => {

          console.log('2.7.8\t词云分布  返回结构不正确');
          console.log(response);
          if (response && response.code == 200 && response.data) {

            this.worldCloudData = response.data;
          }

        }).catch(error => {
          console.log(error);
        })
      },

    },

    mounted() {

      this.loadData();
    },
    // mounted() {
    //
    //   let thiz = this;
    //   let lineData = [
    //     {
    //       "comprehensive_num": 0,
    //       "read_num": 1,
    //       "trans_num": 2,
    //       "comment_num": 3,
    //       "click_num": 3,
    //       "create_time": "01/01"
    //     },
    //     {
    //       "comprehensive_num": 3,
    //       "read_num": 2,
    //       "trans_num": 3,
    //       "comment_num": 4,
    //       "click_num": 9,
    //       "create_time": "01/02"
    //     },
    //     {
    //       "comprehensive_num": 8,
    //       "read_num": 3,
    //       "trans_num": 4,
    //       "comment_num": 5,
    //       "click_num": 6,
    //       "create_time": "01/03"
    //     },
    //     {
    //       "comprehensive_num": 2,
    //       "read_num": 4,
    //       "trans_num": 5,
    //       "comment_num": 6,
    //       "click_num": 2,
    //       "create_time": "01/04"
    //     },
    //     {
    //       "comprehensive_num": 4,
    //       "read_num": 2,
    //       "trans_num": 3,
    //       "comment_num": 4,
    //       "click_num": 7,
    //       "create_time": "01/05"
    //     },
    //     {
    //       "comprehensive_num": 3,
    //       "read_num": 6,
    //       "trans_num": 7,
    //       "comment_num": 8,
    //       "click_num": 3,
    //       "create_time": "01/06"
    //     },
    //     {
    //       "comprehensive_num": 2,
    //       "read_num": 7,
    //       "trans_num": 8,
    //       "click_num": 10,
    //       "comment_num": 9,
    //       "create_time": "01/07"
    //     },
    //   ];
    //   let barData = [
    //     {
    //       "comprehensive_num": 0,
    //       "title": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
    //       "read_num": 1,
    //       "trans_num": 2,
    //       "comment_num": 3,
    //       "click_num": 3,
    //       "create_time": "河北",
    //       "publish_time": "2018/08/21 12:32",
    //     },
    //     {
    //       "comprehensive_num": 3,
    //       "title": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
    //       "read_num": 2,
    //       "trans_num": 3,
    //       "comment_num": 4,
    //       "click_num": 9,
    //       "create_time": "微博",
    //       "publish_time": "2018/08/21 12:32",
    //     },
    //     {
    //       "comprehensive_num": 8,
    //       "title": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
    //       "read_num": 3,
    //       "trans_num": 4,
    //       "comment_num": 5,
    //       "click_num": 6,
    //       "create_time": "APP",
    //       "publish_time": "2018/08/21 12:32",
    //     },
    //     {
    //       "comprehensive_num": 2,
    //       "title": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
    //       "read_num": 4,
    //       "trans_num": 5,
    //       "comment_num": 6,
    //       "click_num": 2,
    //       "create_time": "网站",
    //       "publish_time": "2018/08/21 12:32",
    //     },
    //     {
    //       "comprehensive_num": 4,
    //       "title": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
    //       "read_num": 2,
    //       "trans_num": 3,
    //       "comment_num": 4,
    //       "click_num": 7,
    //       "create_time": "报刊",
    //       "publish_time": "2018/08/21 12:32",
    //     },
    //     {
    //       "comprehensive_num": 3,
    //       "title": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
    //       "read_num": 6,
    //       "trans_num": 7,
    //       "comment_num": 8,
    //       "click_num": 3,
    //       "create_time": "论坛",
    //       "publish_time": "2018/08/21 12:32",
    //     },
    //
    //   ];
    //
    //   setTimeout(function () {
    //     /*总览*/
    //     thiz.overviewData = lineData;
    //     thiz.overviewCategory = [
    //       {prop: 'trans_num', label: '网站'},
    //       {prop: 'comment_num', label: '微信'},
    //       {prop: 'read_num', label: '微博'},
    //       {prop: 'comprehensive_num', label: 'APP'},
    //       {prop: 'click_num', label: '数字报'},
    //     ];
    //
    //
    //     /*最新舆情*/
    //     thiz.latestOpinionData = barData.slice(0, 5);
    //
    //     /*预警分析*/
    //     thiz.warningData = barData;
    //     thiz.warningCategory = [
    //       {prop: 'trans_num', label: '正常'},
    //       {prop: 'comment_num', label: '一般'},
    //       {prop: 'read_num', label: '轻微'},
    //       {prop: 'comprehensive_num', label: '较大'},
    //       {prop: 'click_num', label: '重大'},
    //     ];
    //
    //     /*媒体发布*/
    //     thiz.publishData = barData;
    //     /*发布热区*/
    //     thiz.hotAreaData = barData;
    //
    //     /*情感指数趋势*/
    //     thiz.emotionTrendData = lineData;
    //     thiz.emotionTrendCategory = [
    //       {prop: 'trans_num', label: '网站'},
    //     ];
    //
    //     /*词云分布*/
    //     thiz.worldCloudData = barData;
    //
    //     /*来源排行*/
    //     thiz.sourceRankData = barData;
    //     thiz.sourceRankCategory = [
    //       {prop: 'trans_num', label: '正常'},
    //       // {prop: 'comment_num', label: '一般'},
    //       // {prop: 'read_num', label: '轻微'},
    //       // {prop: 'comprehensive_num', label: '较大'},
    //       // {prop: 'click_num', label: '重大'},
    //     ]
    //   }, 1000);
    //
    //   this.loadData();
    //
    // }
  }
</script>

<style scoped>

  .overview {
    padding: 20px;
  }

  /*总览*/
  .overview_content {
    width: 100%;
    background-color: #fff;
    height: 400px;
  }

  /*最新舆情*/
  .latest_opinion_content {
    height: 300px;
  }

  .latest_opinion_btn {
    display: inline-block;
    padding: 5px 15px;
    cursor: pointer;
  }

  .latest_opinion_btn_more {
    display: inline-block;
    float: right;
    color: #1D2088;
    cursor: pointer;
    line-height: 20px;
    font-weight: bolder;
  }

  .latest_opinion_btn_selected {
    cursor: default;
    box-shadow: 0 -1px 4px 0 #E5E5E5;
    border-radius: 10px 10px 0 0;
    font-weight: bolder;
  }

  /*预警分析*/
  .warning_content {
    height: 300px;
  }

  /*媒体发布*/
  .publish_content {
    height: 300px;
  }

  /*发布热区*/
  .hot_area_content {
    height: 300px;
  }

  /*情感指数趋势*/
  .emotion_trend_content {
    height: 300px;
  }

  /*词云分布*/
  .world_cloud_content {
    height: 300px;
  }

  .analysis_item {
    padding: 30px;
    width: calc(50% - 30px * 2);
    border-top: 1px solid #f5f5f5;
  }

  .analysis_item:nth-child(2n-1) {
    border-right: 1px solid #f5f5f5;
  }

  .analysis_title {
    color: #555;
    font-weight: 900;
    margin-bottom: 20px;
  }

  .sourceRank {
    box-sizing: padding-box;
    padding: 30px;
    border-top: 1px solid #f5f5f5;
    width: calc(100% - 30px * 2);
    background-color: #fff;
  }

  .sourceRank_content {
    height: 300px;
  }

  .floatBox {
    display: flex;
    justify-content: center;
    background-color: #fff;
    /* height: 100%; */
    overflow: hidden;
  }
  .monitorResultsTitle{
    height: 24px;
    line-height: 24px;
    color: #555;
    font-weight: 900;
    padding:20px 30px;
    padding-bottom: 0;
  }
</style>
