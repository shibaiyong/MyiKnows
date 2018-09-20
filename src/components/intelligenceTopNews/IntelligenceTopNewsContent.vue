<template>
  <div class="rzl-contarner rzl_bc_undercoat">
    <div class="blank_1 rzl_bc_undercoat"></div>
    <ul class="topNewsTab">
      <li v-for="(item,index) of topNewsTab" :key="index" @click="NewsTab(item.type)" v-bind:class='{active:item.type==isActive}'>
        {{item.title}}
      </li>
    </ul>
    <div class="topNews rzl_bc_white" >
      <!--<input type="text" v-model="queryTopNews"  placeholder="" class="rzl_seach_Input font16" >-->
      <!--<button  type="button" class="rzl_seach_button rzl_bc_navy font16 rzl_fc_white">搜索</button>-->
      <p class="latestNews rzl_bc_undercoat rzl_fc_darkgray font14">最新舆情</p>
      <ul  class="topNewsList">
        <li class="topNewsItems clearfix" v-for="(item,index) of topNewsList" :key="index" @click="toDetail(item.id)">
            <div class="topNewsLeft">
              <p class="topNewsTitle font16 rzl_fc_darkgray">{{item.title}}</p>
              <div class="topNewsTag rzl_fc_darkgray font14">
                <span>发布时间：<i>{{item.time}}</i></span>
                <span>来源：<i>{{item.source}}</i></span>
                <span>热度指数：<i>{{item.hotNum}}</i></span>
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
      <div class="rzl_fc_navy t-center loadMore" @click="loadMore()">加载更多</div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "IntelligenceTopNewsContent",
        data(){
          return{
            queryTopNews: '',
            topNewsList:[],
            topNewsTab:[{
              'title':'推荐',
              'type':1
            },{
              'title':'本地热点',
              'type':2
            },{
              'title':'周边热点',
              'type':3
            },{
              'title':'全国热点',
              'type':4
            }],
            isActive:1,
          }
        },
        methods:{
          //tab切换
          NewsTab(id){
            this.isActive = id;
          },
          //获取舆情头条数据
          loadTopNewsData(){
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
              read:'1'
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
              read:'2'
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
              read:'1'
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
              read:'2'
            }]
            this.handleData_TopNews(data)
          },
          handleData_TopNews(data){
            this.topNewsList = data;
          },
          //跳转到详情页面
          toDetail(id){

          },
          //加载更多数据
          loadMore(){

          },
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
    margin-bottom: 20px;
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
  .active{
    background: #ffffff;
    border-radius: 10px 10px 0 0;
  }
  .latestNews{
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-weight: 600;
  }
  .topNewsItems{
    padding: 0 90px;
    border-bottom:1px solid #CDCDCD;
  }
  .topNewsLeft{
    float: left;
    width: 100%;
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

</style>
