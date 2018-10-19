<template>
  <!-- 内容区最外层容器均采用rzl-contarner样式 -->
  <div class="rzl-contarner rzl_bc_undercoat index-wapper">
    <div class="blank_1 rzl_bc_undercoat"></div>

    <!--首页舆情折线图-->
    <div class="rzl_bc_white mt20">
      <div class="rzl_fc_darkgray font18 index-title">监测结果走势</div>
      <div class="index-chartsLine" >
        <lineChart id="indexChartLine"
                   :data="intelligenceLineData"
                   axis="create_time"
                   :category="intelligenceCategory"
        ></lineChart>
      </div>
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
        <div class="rzl_fc_darkgray font18 index-title">热 点</div>
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
  import { getHomeCount,getRecentTrends,getHotIntelligence } from '@/assets/js/api';
  import lineChart from '@/components/common/ZCChartsLine';
  import barChart from '@/components/common/ZCChartsBar';
  import hotTable from '@/components/common/ZCTable';
  import iKnowsUtil from '@/assets/js/iknowsUtil';
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
        hotIntelligenceCategory:[
        {prop: 'articleTitle',
          label: '文章标题',
          showHover:true,
          style: {textAlign: 'left'},
          headerStyle: {textAlign: 'left'}
        },
        {prop: 'articleSource',
          label: '来源',
          width: 130,
          style: {textAlign: 'left'},
          headerStyle: {textAlign: 'left'}
        },
        {prop: 'articleType', label: '媒体类型', width: 80},
        {prop: 'time', label: '发布时间', width: 140}],
        options: {},
      }
    },
    methods: {
      // 舆情折线图数据
      loadDatas_IntelliGence() {
        let params = new URLSearchParams();
        params = {};
        let _this = this;
        getHomeCount(params).then(response => {
          if (response.code == 200) {
            _this.handleData_IntelliGence(response.data)
          }else {
            this.$message.error(response.message);
          }
        }).catch(error => {
          console.log(error);
        })
      },
      handleData_IntelliGence(data) {
        let thiz =this;
        setTimeout(function () {
          thiz.intelligenceLineData = data;
          thiz.intelligenceCategory=[
            {prop: 'website', label: '网媒'},
            {prop: 'weixin', label: '微信'},
            {prop: 'weibo', label: '微博'},
            {prop: 'app', label: 'APP'},
          ]
        },100)
      },

      //近期预警趋势数据
      loadDatas_RecentTrends() {
        let params = new URLSearchParams();
        params = {};
        let _this = this;
        getRecentTrends(params).then(response => {
          if (response.code == 200) {
            _this.handleData_RecentTrends(response.data)
          }else {
            this.$message.error(response.message);
          }
        }).catch(error => {
          console.log(error);
        })
      },
      handleData_RecentTrends(data) {
        let thiz = this;
        setTimeout(function () {
          thiz.recentTrendsData = data;
          thiz.recentTrendsCategory=[
            {prop: 'level1', label: '一般'},
            {prop: 'level0', label: ''},
            {prop: 'level2', label: '轻微'},
            {prop: 'level3', label: '较大'},
            {prop: 'level4', label: '重大'},
          ]
        },100)
      },
      //表格
      loadDatas_hotIntelligence(){
        let params = new URLSearchParams();
        params = {};
        let _this = this;
        getHotIntelligence(params).then(response => {
          if (response.code == 200) {
            _this.handleData_hotIntelligence(response.data)
          }else {
            this.$message.error(response.message);
          }
        }).catch(error => {
          console.log(error);
        })
      },
      handleData_hotIntelligence(data){
        let thiz = this;
        setTimeout(function () {
          thiz.hotIntelligenceData = data.content;
          if (thiz.hotIntelligenceData) {
            thiz.hotIntelligenceData.forEach((value, index) => {
              let publishTime = new Date(value.publishTime).getTime();
              let time =iKnowsUtil.dataFormat(publishTime);
              value.time = time;
              if (value.articleType==''|| value.articleType == null) {
                value.articleType = '-'
              }
            })
          }


        },100)
      },
      //跳转到文章详情
      clickTableCell(rowIndex) {
        let thiz = this;
        thiz.hotIntelligenceData.forEach(function (value,index) {
          if (rowIndex == index) {
            let id =  value.articleId;
            let time = value.publishTime;
            let releaseDatetime= new Date(time).getTime();
             window.open('/details?webpageCode='+id+'&releaseDatetime='+ releaseDatetime );
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
  .mt20{
    margin-top: 20px;
  }
  .blank_1{
    height: 1px;
  }
  .index-wapper{
    height: auto;
  }
  .index-chartsLine{
    width: 100%;
    height: 495px;
    overflow-x: hidden;
    margin: 20px 0;
    padding: 20px 0px 20px 20px;
    box-sizing:border-box;
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
    /*-webkit-flex: 1;*/
    /*flex: 1;*/
    width: 50%;
    background: #ffffff;
  }
  .index-charts{
    width: 99%;
    height:380px;
    padding: 0 30px;
    box-sizing: border-box;
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
    height: 30px;
    line-height: 30px;
    padding-right: 30px;
    cursor: pointer;
  }
  .loadingData{
    height: 500px;
    text-align: center;
    line-height: 500px;
  }
</style>



