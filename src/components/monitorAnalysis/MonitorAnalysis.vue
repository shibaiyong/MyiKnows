<template>
  <div class="monitor-analysis">

    <!--总览-->
    <div class="overview floatBox">
      <div class="overview_content">
        <ILine id="overview" :data="overviewData" axis="create_time" :category="overviewCategory"></ILine>
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

          <ITable id="latest_opinion"
                  :data="latestOpinionData"
                  :category="latestOpinionCategory">
          </ITable>

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
          <IPie id="publish" :data="publishData" label="create_time" prop="read_num"></IPie>
        </div>
      </div>
      <!--发布热区-->
      <div class="analysis_item">
        <div class="analysis_title font18">发布热区</div>
        <div class="hot_area_content floatBox">
          <IMap id="hot_area" :data="hotAreaData" label="create_time" prop="read_num"></IMap>
          <ITable id="hot_area"
                  :data="hotAreaData"
                  :category="hotAreaCategory">
          </ITable>
        </div>
      </div>
    </div>


    <!--来源排行-->
    <div class="sourceRank">
      <div class="analysis_title font18">来源排行</div>
      <div class="sourceRank_content">
        <IBar id="sourceRank" :data="sourceRankData" axis="create_time" :category="sourceRankCategory"></IBar>
      </div>
    </div>


    <div class="floatBox">
      <!--情感指数趋势-->
      <div class="analysis_item">
        <div class="analysis_title font18">情感指数趋势</div>
        <div class="emotion_trend_content">
          <ILine id="emotion_trend" :data="emotionTrendData" axis="create_time"
                 :category="emotionTrendCategory"></ILine>
        </div>
      </div>
      <!--词云分布-->
      <div class="analysis_item">
        <div class="analysis_title font18">词云分布</div>
        <div class="world_cloud_content">
          <IWorld id="world_cloud" :data="worldCloudData" label="create_time" prop="read_num"></IWorld>
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

  export default {

    name: "monitor-analysis",
    components: {ILine, IBar, IPie, IMap, IWorld, ITable},
    data() {
      return {
        overviewData: [],
        overviewCategory: [],
        /*最新舆情*/
        latestOpinionBtn: [
          {name: '最新', selected: true},
          {name: '最大', selected: false},
          {name: '较大', selected: false},
        ],
        latestOpinionData: [],
        latestOpinionCategory: [
          {
            prop: 'title',
            label: '文章标题',
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'}
          },
          {
            prop: 'create_time',
            label: '文章来源',
            style: {padding: '10px 0', textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            width: 150
          },
          {prop: 'publish_time', label: '发布时间', style: {padding: '10px 0'}, width: 120},
        ],
        /*预警分析*/
        warningData: [],
        warningCategory: [],
        /*媒体发布*/
        publishData: [],
        /*发布热区*/
        hotAreaData: [],
        hotAreaRankData:[],
        hotAreaCategory:[
          {prop: 'create_time', label: '地区',style: {padding: '5px 0',},},
          {prop: 'click_num', label: '热度指数',style: {padding: '5px 0'}},
        ],
        /*情感指数趋势*/
        emotionTrendData: [],
        emotionTrendCategory: [],
        /*词云分布*/
        worldCloudData: [],
        /*来源排行*/
        sourceRankData: [],
        sourceRankCategory: [],
      }
    },

    methods: {
      latestOpinionBtnClick(ind) {
        this.latestOpinionBtn.forEach(function (item, index) {
          if (ind === index) {
            item.selected = true;
            alert(item.name)
          } else {
            item.selected = false;
          }
        })


      },
      latestOpinionMoreBtnClick() {
        alert('更多按钮被点击')
      }
    },

    mounted() {
      let thiz = this;
      let lineData = [
        {
          "comprehensive_num": 0,
          "read_num": 1,
          "trans_num": 2,
          "comment_num": 3,
          "click_num": 3,
          "create_time": "01/01"
        },
        {
          "comprehensive_num": 3,
          "read_num": 2,
          "trans_num": 3,
          "comment_num": 4,
          "click_num": 9,
          "create_time": "01/02"
        },
        {
          "comprehensive_num": 8,
          "read_num": 3,
          "trans_num": 4,
          "comment_num": 5,
          "click_num": 6,
          "create_time": "01/03"
        },
        {
          "comprehensive_num": 2,
          "read_num": 4,
          "trans_num": 5,
          "comment_num": 6,
          "click_num": 2,
          "create_time": "01/04"
        },
        {
          "comprehensive_num": 4,
          "read_num": 2,
          "trans_num": 3,
          "comment_num": 4,
          "click_num": 7,
          "create_time": "01/05"
        },
        {
          "comprehensive_num": 3,
          "read_num": 6,
          "trans_num": 7,
          "comment_num": 8,
          "click_num": 3,
          "create_time": "01/06"
        },
        {
          "comprehensive_num": 2,
          "read_num": 7,
          "trans_num": 8,
          "click_num": 10,
          "comment_num": 9,
          "create_time": "01/07"
        },
      ];
      let barData = [
        {
          "comprehensive_num": 0,
          "title": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
          "read_num": 1,
          "trans_num": 2,
          "comment_num": 3,
          "click_num": 3,
          "create_time": "河北",
          "publish_time": "2018/08/21 12:32",
        },
        {
          "comprehensive_num": 3,
          "title": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
          "read_num": 2,
          "trans_num": 3,
          "comment_num": 4,
          "click_num": 9,
          "create_time": "微博",
          "publish_time": "2018/08/21 12:32",
        },
        {
          "comprehensive_num": 8,
          "title": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
          "read_num": 3,
          "trans_num": 4,
          "comment_num": 5,
          "click_num": 6,
          "create_time": "APP",
          "publish_time": "2018/08/21 12:32",
        },
        {
          "comprehensive_num": 2,
          "title": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
          "read_num": 4,
          "trans_num": 5,
          "comment_num": 6,
          "click_num": 2,
          "create_time": "网站",
          "publish_time": "2018/08/21 12:32",
        },
        {
          "comprehensive_num": 4,
          "title": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
          "read_num": 2,
          "trans_num": 3,
          "comment_num": 4,
          "click_num": 7,
          "create_time": "报刊",
          "publish_time": "2018/08/21 12:32",
        },
        {
          "comprehensive_num": 3,
          "title": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
          "read_num": 6,
          "trans_num": 7,
          "comment_num": 8,
          "click_num": 3,
          "create_time": "论坛",
          "publish_time": "2018/08/21 12:32",
        },

      ];

      setTimeout(function () {
        /*总览*/
        thiz.overviewData = lineData;
        thiz.overviewCategory = [
          {prop: 'trans_num', label: '网站'},
          {prop: 'comment_num', label: '微信'},
          {prop: 'read_num', label: '微博'},
          {prop: 'comprehensive_num', label: 'APP'},
          {prop: 'click_num', label: '数字报'},
        ];


        /*最新舆情*/
        thiz.latestOpinionData = barData.slice(0, 5);

        /*预警分析*/
        thiz.warningData = barData;
        thiz.warningCategory = [
          {prop: 'trans_num', label: '正常'},
          {prop: 'comment_num', label: '一般'},
          {prop: 'read_num', label: '轻微'},
          {prop: 'comprehensive_num', label: '较大'},
          {prop: 'click_num', label: '重大'},
        ];

        /*媒体发布*/
        thiz.publishData = barData;
        /*发布热区*/
        thiz.hotAreaData = barData;

        /*情感指数趋势*/
        thiz.emotionTrendData = lineData;
        thiz.emotionTrendCategory = [
          {prop: 'trans_num', label: '网站'},
        ];

        /*词云分布*/
        thiz.worldCloudData = barData;

        /*来源排行*/
        thiz.sourceRankData = barData;
        thiz.sourceRankCategory = [
          {prop: 'trans_num', label: '正常'},
          // {prop: 'comment_num', label: '一般'},
          // {prop: 'read_num', label: '轻微'},
          // {prop: 'comprehensive_num', label: '较大'},
          // {prop: 'click_num', label: '重大'},
        ]
      }, 1000);

    }
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
    font-weight: bolder;
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
    width: 100%;
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
  }
</style>
