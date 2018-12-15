<template>
  <div class="rzl-contarner rzl_bc_undercoat" >
    <div class="blank_1 rzl_bc_undercoat"></div>
    <ul class="topNewsTab">
      <li v-for="(item,index) of topNewsTab" :key="index" @click="NewsTab(item.type)" v-bind:class='{active:item.type==isActive}'>
        <span>{{item.title}}</span>
      </li>
    </ul>
    <div class="topNews rzl_bc_white" >
      <!--<input type="text" v-model="queryTopNews"  placeholder="" class="rzl_seach_Input font16" >-->
      <!--<button  type="button" class="rzl_seach_button rzl_bc_navy font16 rzl_fc_white">搜索</button>-->
      <p class="latestNews rzl_bc_undercoat rzl_fc_darkgray font14" @click="loadNowData()">最 新</p>
      <div v-show="dataload"  class="noData font16">数据加载中...</div>
      <div v-if="topNewsList.length >0">
        <ul  class="topNewsList" >
          <li class="topNewsItems clearfix" v-for="(item,index) of topNewsList" :key="index" @click="toDetail(item.id,item.publishTime)">
            <div class="topNewsLeft">
              <p class="topNewsTitle font16 rzl_fc_darkgray">{{item.title}}</p>
              <div class="topNewsTag rzl_fc_darkgray font14">
                <span>发布时间：<i>{{getDate(item.publishTime)}}</i></span>
                <span class="source">来源：<i>{{item.source}}</i></span>
                <span  v-if="localHotNum">舆情预测指数：<i>{{item.predicIndex}}</i></span>
              </div>
              <div class="topNewsContent font14">
                {{item.content}}
              </div>
            </div>
            <!--已读未读-->
            <!--<div class="topNewsRight">-->
            <!--<span class="isread font18" v-if="item.read == 1">已读</span>-->
            <!--<span class="unread font18" v-else>未读</span>-->
            <!--</div>-->
          </li>
        </ul>
        <div class="rzl_fc_navy t-center loadMore" v-show="loadmore" @click="loadMore()">加载更多</div>
      </div>
      <div v-show="nodata" class="noData font16" >暂无相关数据</div>
    </div>
    <div class="blank_1 rzl_bc_undercoat"></div>
  </div>
</template>

<script>
    import {getIntelligentTopNews}  from '@/assets/js/api';
    import iKnowsUtil from '@/assets/js/iknowsUtil';
    export default {
        name: "IntelligenceTopNewsContent",
        props: ["parentHeight"],
        watch: {
          parentHeight() {
            var dom = document.getElementById("doc")
            dom.style.height = this.parentHeight+"px"
            // if (dom && this.parentHeight != 0 && this.parentHeight > dom.offsetHeight) {
            //
            // }
          }
        },
        data(){
          return{
            // 搜索条件
            queryTopNews: '',
            // 头条列表
            topNewsList:[],
            // tab切换
            topNewsTab:[{
              'title':'推荐',
              'type':1
            },{
              'title':'本地热点',
              'type':2
            },{
              'title':'全国热点',
              'type':3
            }],
            // 默认显示推荐数据
            isActive:1,
            // 初始化默认10条
            loadMorePage:10,
            topNewsArray:[],
            loadmore:true,
            dataload:false,
            nodata:false,
            localHotNum:false
          }
        },
        methods:{
          // 时间格式处理
          getDate(time) {
            if (!time || time == null || time == "" || time == undefined) {
              return "未知时间"
            }
            return iKnowsUtil.dataFormat(time)
          },
          //tab切换
          NewsTab(id){
            if (id == 2){
              this.localHotNum = true
            } else {
              this.localHotNum = false
            }
            this.isActive = id;
            this.topNewsArray=[];
            this.loadMorePage=10;
            let _this = this;
            _this.loadTopNewsData()
          },
          //获取舆情头条数据
          loadTopNewsData(){
            this.dataload = true;
            this.nodata = false;
            this.topNewsList=[];
            let params = {};
            params = {
              searchType:this.isActive
            };
            let _this = this;
            getIntelligentTopNews(params).then(response => {
              if (response.code == 200) {
                setTimeout(function () {
                  _this.handleData_TopNews(response.data);
                  _this.topNewsArray = response.data;
                },100);
              }else {
                this.$message.error(response.message);
              }
            }).catch(error => {
              console.log(error);
            })

          },
          // 处理数据首次显示10条
          handleData_TopNews(data){
            let Data = data;
            if (Data != ''&& Data != null){
              let topNewsData =[];
              let loadPage = this.loadMorePage;
              Data.forEach(function (v,i) {
                if (i<loadPage){
                  if (v.score == '' || v.score== null){
                    v.score = '0'
                  }
                  topNewsData.push(v)
                }
              })
              if (Data.length < 10){
                this.loadmore = false
              }else {
                this.loadmore = true
              }
              this.topNewsList = topNewsData;
              this.dataload = false;
            } else {
              this.nodata = true;
              this.dataload = false;
            }

          },
          // 加载更多分页数据处理
          handleData_TopNewsPage(){
            let Data = this.topNewsArray;
            let length = Data.length;
            let topNewsData =[];
            let loadPage = this.loadMorePage + 5;

            if (loadPage < length ){
              Data.forEach(function (v,i) {
                if(i<loadPage){
                  if (v.score == '' || v.score== null){
                    v.score = '0'
                  }
                  topNewsData.push(v)
                }
              })
              this.topNewsList = topNewsData;
              this.loadMorePage = loadPage;
              this.loadmore = true
            } else {
              Data.forEach(function (v,i) {
                if(i<loadPage){
                  topNewsData.push(v)
                }
              })
              this.loadmore = false;
              this.topNewsList = topNewsData;
            }


          },
          //跳转到详情页面
          toDetail(id,time){
            let releaseDatetime = time;
            let userName = this.$iknowsUtil.getUserName();
             window.open('/details/'+userName+'?webpageCode='+id+'&releaseDatetime='+ releaseDatetime );
              // this.$router.push({
              //   path: '/details',
              //   query: {
              //     webpageCode: id,
              //     releaseDatetime:new Date(time).getTime()
              //   }
              // })
          },
          //加载更多数据
          loadMore(){
            this.handleData_TopNewsPage()
          },
          //获取最新数据
          loadNowData(){
            this.loadTopNewsData();
          }

        },
        mounted(){
          this.loadTopNewsData();
        },
    }
</script>

<style scoped type="text/css">
  .blank_1{
    height: 1px;
  }
  .topNews{
    padding: 30px;
    margin-bottom: 30px;
    min-height: 600px;
  }
  .topNewsTab{
    display: flex;
    width: 50%;
    margin-top: 30px;
  }
  .topNewsTab li{
    flex: 1;
    font-weight: 600;
    height: 38px;
    line-height: 38px;
    text-align: center;
    font-size: 18px;
    cursor: pointer;
  }
  .topNewsTab li span{
    line-height: 38px;
    color: #999;
    font-weight: 600;
  }
  .topNewsTab li.active{
    background: #ffffff;
    border-radius: 10px 10px 0 0;
  }
  .topNewsTab li.active span{
    color: #2D2B4C;
    border-bottom: 3px solid #2D2B4C;
    padding-bottom: 6px;
  }
  .latestNews{
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-weight: 600;
    cursor: pointer;
  }
  .topNewsList{
    min-height: 260px;
  }
  .topNewsItems{
    padding: 0 90px;
    border-bottom:1px solid #CDCDCD;
  }
  .topNewsLeft{
    float: left;
    width: 100%;
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
  .topNewsTag span.source{
    width: 30%;
  }
  .topNewsTag span i{
    color: #252525;
    font-style:normal;
  }
  .topNewsContent{
    margin: 20px 0;
    line-height: 22px;
    max-height: 44px;
    overflow: hidden;
  }
  .topNewsRight{
    float: right;
    width: 5%;
    margin-top: 20px;
    text-align: right;
  }
  .topNewsRight span{
    font-weight: 600;
  }
  .isread{
    color: #3B87F5;
  }
  .unread{
    color: #DC4D4D;
  }
  .loadMore{
    font-weight: bold;
    text-align: center;
    margin-top: 30px;
    cursor: pointer;
  }
  .noData{
    height: 600px;
    text-align: center;
    padding-top: 30px;
    color: #606266;
  }

</style>
