<template>
  <!-- 内容区最外层容器均采用rzl-contarner样式 -->
  <div class="rzl-contarner rzl_bc_undercoat index-wapper">
    <div class="blank_1 rzl_bc_undercoat"></div>
    <!--首页舆情折线图-->
    <div class="index-chartsLine" >
      <lineChart id="indexChartLine"
                 :data="intelligenceLineData"
                 axis="create_time"
                 :category="intelligenceCategory"
      ></lineChart>
    </div>
    <div class="index-content">
      <!--近期预警趋势图表-->
      <div class="index-warning-trend mr20" >
        <div class="rzl_fc_darkgray font18 index-title">近期预警趋势</div>
        <div class="index-charts" >
          <barChart id="indexChartBar"
                    :data="recentTrendsData"
                    axis="create_time"
                    :category="recentTrendsCategory"
          ></barChart>
        </div>
      </div>
      <!--热点舆情列表-->
      <div class="index-warning-trend">
        <div class="rzl_fc_darkgray font18 index-title">热点舆情</div>
        <div class="rzl_fc_navy font14 loadMore" @click="loadMore">更多></div>
        <div class=" hot-charts"  >
            <hotTable :data="hotIntelligenceData"
                      :category="hotIntelligenceCategory"
                      @click-table-cell="clickTableCell"
            ></hotTable>
        </div>
      </div>
    </div>
    <div class="blank_1 rzl_bc_undercoat"></div>
  </div>
</template>

<script>
  import { getListPage  } from '@/assets/js/api';
  import lineChart from '@/components/common/ZCChartsLine';
  import barChart from '@/components/common/ZCChartsBar';
  import hotTable from '@/components/common/ZCTable';
  export default {
    name: 'Home-content',
    components: {lineChart,barChart,hotTable},
    data() {
      return {
        intelligenceLineData:[],
        intelligenceCategory:[],
        recentTrendsData:[],
        recentTrendsCategory:[],
        hotIntelligenceData: [],
        hotIntelligenceCategory: [],
        options: {},
      }
    },
    methods: {
      // 舆情折线图数据
      loadDatas_IntelliGence() {
        let linedata=[{
          "create_time": "09/13",
          "weixin_num":20,
          "weibo_num":20,
          "web_num":50,
          "app_num":10,
          "paper_num": 35
        },{
          "create_time": "09/14",
          "weixin_num":20,
          "weibo_num":20,
          "web_num":50,
          "app_num":10,
          "paper_num": 15
        },{
          "create_time": "09/15",
          "weixin_num":10,
          "weibo_num":20,
          "web_num":5,
          "app_num":10,
          "paper_num": 15
        }];
        this.handleData_IntelliGence(linedata)
        // let para = {};
        // getListPage(para).then((res) => {
        //   let response = JSON.parse(res.bodyText);
        //   this.intelliGenceTrendDatas = {categoryArr: [], valueArr: []};
        //   if (response.code == 200 && response.data) {
        //     this.handleData_TimeTrend(response.data)
        //   }
        // });
      },
      handleData_IntelliGence(data) {
        let thiz =this;
        setTimeout(function () {
          thiz.intelligenceLineData = data;
          thiz.intelligenceCategory=[
            {prop: 'weixin_num', label: '微信'},
            {prop: 'weibo_num', label: '微博'},
            {prop: 'web_num', label: '网站'},
            {prop: 'app_num', label: 'APP'},
            {prop: 'paper_num', label: '数字报'},
          ]
        },1000)
      },

      //近期预警趋势数据
      loadDatas_RecentTrends() {
        let bardata=[{
          "create_time": "09/131",
          "levelZD":20,
          "levelJD":20,
          "levelQW":50,
          "levelYB":10,
          "levelZC": 35
        },{
          "create_time": "09/14",
          "levelZD":20,
          "levelJD":20,
          "levelQW":50,
          "levelYB":10,
          "levelZC": 15
        },{
          "create_time": "09/15",
          "levelZD":10,
          "levelJD":20,
          "levelQW":5,
          "levelYB":10,
          "levelZC": 15
        },{
          "create_time": "09/13",
          "levelZD":20,
          "levelJD":20,
          "levelQW":50,
          "levelYB":10,
          "levelZC": 35
        },{
          "create_time": "09/14",
          "levelZD":20,
          "levelJD":20,
          "levelQW":50,
          "levelYB":10,
          "levelZC": 15
        },{
          "create_time": "09/18",
          "levelZD":10,
          "levelJD":20,
          "levelQW":5,
          "levelYB":10,
          "levelZC": 15
        },{
          "create_time": "09/13",
          "levelZD":20,
          "levelJD":20,
          "levelQW":50,
          "levelYB":10,
          "levelZC": 35
        },{
          "create_time": "09/14",
          "levelZD":20,
          "levelJD":20,
          "levelQW":50,
          "levelYB":10,
          "levelZC": 15
        },{
          "create_time": "09/15",
          "levelZD":10,
          "levelJD":20,
          "levelQW":5,
          "levelYB":10,
          "levelZC": 15
        }];

        this.handleData_RecentTrends(bardata)
        // let para = {};
        // getListPage(para).then((res) => {
        //   let response = JSON.parse(res.bodyText);
        //   this.intelliGenceTrendDatas = {categoryArr: [], valueArr: []};
        //   if (response.code == 200 && response.data) {
        //     this.handleData_RecentTrends(response.data)
        //   }
        // });
      },
      handleData_RecentTrends(data) {
        let thiz = this;
        setTimeout(function () {
          thiz.recentTrendsData = data;
          thiz.recentTrendsCategory=[
            {prop: 'levelZC', label: '正常'},
            {prop: 'levelYB', label: '一般'},
            {prop: 'levelQW', label: '轻微'},
            {prop: 'levelJD', label: '较大'},
            {prop: 'levelZD', label: '重大'},
          ]
        },1000)


      },
      //表格
      loadDatas_hotIntelligence(){
        let data = {
          limit: 5,
          content: [
            {
              id:1,
              title: "IS武装或对西欧发动袭击?英军增派部队进驻阿富汗",
              time: "2018-09-10 14:27",
              source: "临夏市党建网临夏市委…",
              type:"微博"
            },
            {
              id:2,
              title: "针对中俄高超音速武器？美研发滑翔破坏者拦截器",
              time: "2018-09-10 14:27",
              source: "临夏市党建网临夏市委…",
              type:"微博"
            },
            {
              id:3,
              title: "小伙网上买克隆出租车拉活 运营仨月被刑拘",
              time: "2018-09-10 14:27",
              source: "临夏市党建网临夏市委…",
              type:"微博"
            },
            {
              id:4,
              title: "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
              time: "2018-09-10 14:27",
              source: "临夏市党建网临夏市委…",
              type: "微博"
            },
            {
              id:5,
              title: "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
              time: "2018-09-10 14:27",
              source: "临夏市党建网临夏市委…",
              type: "微博"
            }
          ]
        };
        this.handleData_hotIntelligence(data)
        // let para = {};
        // getListPage(para).then((res) => {
        //   let response = JSON.parse(res.bodyText);
        //   this.intelliGenceTrendDatas = {categoryArr: [], valueArr: []};
        //   if (response.code == 200 && response.data) {
        //     this.handleData_RecentTrends(response.data)
        //   }
        // });
      },
      handleData_hotIntelligence(data){
        let thiz = this;
        setTimeout(function () {
          thiz.hotIntelligenceData = data.content;
          thiz.hotIntelligenceCategory=[
            {prop: 'title', label: '文章标题',showHover:true},
            {prop: 'source', label: '来源', width: 130},
            {prop: 'type', label: '媒体类型', width: 70},
            {prop: 'time', label: '发布时间', width: 120}]
        },1000)
      },
      //跳转到文章详情
      clickTableCell(rowIndex) {
        let thiz = this;
        thiz.hotIntelligenceData.forEach(function (value,index) {
          if (rowIndex == index) {
            console.log(value.title);
          }
        })
      },
      // 更多-跳转到舆情列表
      loadMore(){
        this.$router.push('/intelligencetopnews');
      }

    },
    mounted(){
      this.loadDatas_IntelliGence();
      this.loadDatas_RecentTrends();
      this.loadDatas_hotIntelligence();
    }
  }
</script>

<style scoped type="text/css">
  .blank_1{
    height: 1px;
  }
  .index-wapper{
    height: auto;
  }
  .index-chartsLine{
    width: 100%;
    height: 535px;
    overflow-x: hidden;
    margin: 20px 0;
    background: #ffffff;
  }
  .index-content{
    width: 100%;
    height:440px;
    margin-bottom: 30px;
    display: -webkit-flex;
    display: flex;
  }
  .index-warning-trend{
    -webkit-flex: 1;
    flex: 1;
    background: #ffffff;
  }
  .index-charts{
    width: 100%;
    height:380px;
  }
  .hot-charts{
    width: 99.5%;
    height: 330px;
    padding:0 30px;
    box-sizing: border-box;
  }
  .index-title{
    padding: 30px 0 0 30px;
    font-weight: 600;
  }
  .mr20{
    margin-right: 20px;
  }
  .loadMore{
    text-align: right;
    font-weight: 600;
    height: 40px;
    line-height: 40px;
    padding-right: 30px;
    cursor: pointer;
  }
</style>



