<template>
  <div>
    <div id="iDetails" class="iDetails"  v-loading.fullscreen.lock="fullscreenLoading">
      <div class="article-content">
        <h1 class="title font24 rzl_fc_darkgray" v-html ="heightLightShow(articleDate.title)">{{articleDate.title}}</h1>
        <div class="article-describe font14">
          <div>
            <div class="describe">
              <span class="rzl_fc_lightGrey">发布时间：</span>
              <span class="describe-black">{{articleDate.releaseDatetime | formatDate}}</span>
              <!-- <span class="rzl_fc_lightGrey">来源：</span>
              <span class="describe-black">{{articleDate.sourceReport}}</span> -->
              <span class="rzl_fc_lightGrey">采集来源：</span>
              <span class="describe-black">{{articleDate.sourceCrawl}}</span>
              <img src="../../assets/link.png"/>
              <span class="rzl_fc_navy" id="originalLink" @click="jumpSource">原文链接</span>
            </div>
            <!--<div class="describe">-->
            <!--<span class="rzl_fc_lightGrey">新闻ID：</span>-->
            <!--<span class="describe-black">201812141325</span>-->
            <!--</div>-->
          </div>
          <!--<div>-->
          <!--<div class="describe">-->

          <!--</div>-->
          <!--<div class="describe">-->
          <!--<span class="rzl_fc_lightGrey">本站浏览量：</span>-->
          <!--<span class="describe-black">1234</span>-->

          <!--</div>-->
          <!--</div>-->
        </div>
        <div class="key-word-box font14">
          <div class="describe-keyword rzl_fc_lightGrey font14">关键词：</div>
          <div class="keyword-content">
              <span class="blue-label rzl_bc_shallowGreen rzl_fc_undercoat"
                v-for="(item, index) in articleDate.keywords">{{item.keyword}}</span>
          </div>
          <div class="font-choose" @mouseover="fontSizeMouseover" @mouseout="fontSizeMouseout">
            <div class="font14 rzl_fc_darkgray">
              <span class="select-font">字体 ：</span>
              <span>{{getFontSizeText}}&nbsp;
              <i class="el-icon-caret-bottom"></i></span>
              <div class="font-choose-list" v-if="showChooseFontSize">
                <div @click="changeFontSize('font14')">小</div>
                <div @click="changeFontSize('font18')">中</div>
                <div @click="changeFontSize('font20')">大</div>
              </div>
            </div>
          </div>
        </div>
        <div class="abstract-box font14 rzl_bc_undercoat"><span>【机器摘要】</span>
          {{articleDate.summary}}
        </div>
        <div id="content-box" class="content-box" :class="contentFontSize" v-html ="heightLightShow(articleDate.content)">
            <div v-html="articleDate.content"></div>
        </div>
        <div class="content-footer-box rzl_bc_undercoat rzl_fc_darkgray">
          <div class="footer-left">
            <!--<div>新闻ID：201812141325</div>-->
            <!-- <div>原文链接：{{articleDate.webpageUrl}}</div> -->
          </div>
          <!--<div class="footer-right rzl_fc_darkgray font14">-->
          <!--<img src="../../assets/share.png"/>-->
          <!--<span>分享</span>-->
          <!--<img src="../../assets/heart.png"/>-->
          <!--<span>收藏</span>-->
          <!--</div>-->
        </div>
      </div>
      <div class="article-label">
        <div v-for="(item,key,index) in tags">
          <div class="title-label-box" :class="{isTop:index!=0}">
            <!--<div class="title-label-box">-->
            <titleLabel :title="key"/>
          </div>
          <div class="item-label rzl_fc_white font14">
          <span v-for="item1 in item" :class="{activeLabel:item1.status==1}" @click="goBaidu(item1.url)">
             {{item1.title}}<i class="el-icon-close" v-if="false"></i>
          </span>
          </div>
          <!--<div class="add-model" v-if="item.titleLabel=='舆情类型'">-->
          <div class="add-model" v-if="false">
            <img src="../../assets/add.png" class="rzl_bc_navy"/>
            <span class="font14 rzl_fc_darkgray"> 添加模型</span>
          </div>
        </div>
        <!--<div class="article-label-list" v-for="(item,index) in articleDate.correlationNewsData">-->
        <!--<div class="list-title">-->
        <!--<titleLabel :title="item.title"/>-->
        <!--<span class="font14 rzl_fc_navy" v-if="item.showMore"> 更多 ></span>-->
        <!--</div>-->
        <!--<div class="list-item font14 " :class="{listItemBorder:index1!=item.items.length-1}"-->
        <!--v-for="(item1,index1) in item.items">-->
        <!--<span>【{{item1.title}}】</span>-->
        <!--{{item1.content}}-->
        <!--</div>-->
        <!--</div>-->
      </div>
      <!--<div class="go-top" v-if="showGoTop" @click="goTop">-->
        <!--<img src="../../assets/up.png"/>-->
      <!--</div>-->
    </div>
  </div>

</template>

<script>
  import iTop from '@/components/common/Top'
  import iHeader from '@/components/common/Header'
  import titleLabel from '@/components/common/TitleLabel'
  import dataUtil from '@/assets/js/dataUtlis'
  import {detail,getWeixinUrl,detailLabels} from '@/assets/js/api.js';

  export default {
    name: "article-details-content",
    components: {iTop, iHeader, titleLabel, dataUtil},
    computed: {
      getFontSizeText() {
        var text = "";
        if (this.contentFontSize == "font18") {
          text = "中";
        }
        if (this.contentFontSize == "font20") {
          text = "大";
        }
        if (this.contentFontSize == "font14") {
          text = "小";
        }
        return text
      }

    },
    data: function () {
      return {
        articleDate: {},
        contentFontSize: "font18",
        showChooseFontSize: false,
        showGoTop: false,
        tags: [],
        webpageCode: "",
        releaseDatetime: 0,
        planId: "",
        keyWords: "",
        fullscreenLoading: false,
        highlightWords:[],
        sentimentTags:''
      }
    },
    filters: {
      formatDate(val){
        if(!val){
          return
        }
        var value=new Date(val);
        var year= value.getFullYear();
        var month= value.getMonth()+1;
        var day= value.getDate();
        var hour= value.getHours();
        var minutes= value.getMinutes();
        if(month < 10){
          month = '0' + month;
        }
        if(day < 10){
          day = '0' + day;
        }
        if(hour < 10){
          hour = '0' + hour;
        }
        if(minutes < 10){
          minutes = '0' + minutes;
        }

        return year+'-'+month+'-'+day+' '+hour+':'+minutes;
      },
    },
    methods: {
      a: function (index) {
      },
      fontSizeMouseover(event) {
        this.showChooseFontSize = true
      },
      // 回到顶部
      goTop() {
        var app = document.getElementById("app");
        var code = setInterval(function () {
          if (app.scrollTop > 0) {
            app.scrollBy(0, -20)
          } else {
            clearInterval(code)
          }
        }, 3)
      },
      // 跳转百度词条
      goBaidu(val){
        if (val && val != ''){
          window.open(val);
        }
      },
      fontSizeMouseout(event) {
        this.showChooseFontSize = false
      },
      // 修改文字大小
      changeFontSize(fontSize) {
        this.contentFontSize = fontSize
      },
      // 原文链接
      jumpSource() {
        if (this.articleDate.weixinFlag === true){
          var params = {
            weixinNumber: this.articleDate.metaInfoKey,
            wechatName:this.articleDate.wechatName,
            title:this.articleDate.title,
            releaseDatetime:this.articleDate.releaseDatetime,
            webpageUrl:this.articleDate.webpageUrl,
            crawlDatetime:this.articleDate.crawlDatetime
          };
          getWeixinUrl({params: params}).then(response => {
            if (response.code == 200) {
                let url = response.data;
                if (url !=''){
                  window.open(url);
                } else {
                  this.$message.error('原文已删除！');
                }

            }else {
                this.$message.error('原文已删除！');
            }
          }).catch(error => {
              console.log(error);
          })
        } else {
              window.open(this.articleDate.webpageUrl)
        }

      },
      // 获取详情内容
      loadDetail() {
        var _this = this;
        var params = {
          webpageCode: this.webpageCode,
          releaseDatetime: this.releaseDatetime,
          planId:this.planId,
          searchWords:this.keyWords
        }
        this.fullscreenLoading = true;
        detail({params: params}).then(response => {

          if (response.code == 200) {
            _this.articleDate = response.data;
            this.highlightWords = _this.articleDate.highlightWords;
            let tags = response.data.tags;
            _this.detailLabel(tags);
            // this.highlightWords = ['阿根廷','习近平','彭丽媛'];
            _this.tags = response.data.tags;
            if (response.data.sentiment <= 0.7 && response.data.sentiment >= 0.3) {
              _this.tags.情感标签 = [{title:"中性"}];
              _this.sentimentTags =  [{title:"中性"}];
            } else if (response.data.sentiment < 0.3) {
              _this.tags.情感标签 = [{title:"负面"}];
              _this.sentimentTags =  [{title:"负面"}];
            } else {
              _this.tags.情感标签 = [{title:"正面"}];
              _this.sentimentTags =   [{title:"正面"}];
            };
            this.fullscreenLoading = false;
          }
        }).catch(error => {
          console.log(error);
        })
      },
      //词条是否可以跳转百度
      detailLabel(tags){
        var _this = this;
        detailLabels(tags).then(response => {
          if (response.code == 200) {
            _this.tags = response.data;
            _this.tags.情感标签 = _this.sentimentTags;
          }
        }).catch(error => {
          console.log(error);
        })
      },
      openFullScreen() {
          this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 2000);
      },
      // 关键词高亮
      heightLightShow( val ){
        var html = val;
        if (html != null){
          var arr = this.highlightWords;
          if (arr != ''&&arr){
            for (var i = 0; i<arr.length; i++){
              html = html.replace(new RegExp(arr[i],'g'),"<span class='highlightWords'>"+ arr[i] +"</span>");
            }
            return html
          }
          return html
        }else {
          return
        }
      },
    },
    mounted() {
      this.webpageCode = this.$route.query.webpageCode;
      this.releaseDatetime = this.$route.query.releaseDatetime;
      this.planId = this.$route.query.planId;
      this.keyWords = this.$route.query.keyWords;
      if (!this.webpageCode || !this.releaseDatetime || this.webpageCode == "" || this.releaseDatetime == 0) {
        alert("参数传递错误");
        return
      }
      this.loadDetail();
      // var app = document.getElementById("app");
      // var thiz = this;
      // app.addEventListener("scroll", function (e) {
      //   if (window.innerHeight - app.scrollTop < 0) {
      //     thiz.showGoTop = true
      //   } else {
      //     thiz.showGoTop = false
      //   }
      // })
    }
  }
</script>

<style scoped>
  .iDetails {
    position: relative;
    text-align: left;
    display: -webkit-flex; /* Safari */
    display: flex; /* Safari */
    /*display: flex;*/
    /*flex-direction: row;*/
    /*justify-content: center;*/
    /*align-items: start;*/
    padding-top: 40px;
    background: white;
  }

  .iDetails .article-content {
    display: inline-block;
    padding-left: 30px;
    padding-right: 30px;
    width: 58%;
    box-sizing: border-box;
  }

  .iDetails .article-content .title {
    font-weight: bold;
  }

  .iDetails .article-label {
    display: inline-block;
    width: 42%;
    padding-left: 150px;
    padding-right: 30px;
    box-sizing: border-box;
    margin-bottom: 100px;
  }

  .iDetails .font-choose-list {
    margin-top: 3px;
    width: 52px;
    margin-left: 70px;
    border-radius: 5px;
    border: #dddddd 1px solid;
    cursor: pointer;
    box-shadow: 3px 3px 5px #aaaaaa;
    background: white;
  }

  .iDetails .font-choose-list div {
    width: 100%;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
  }

  .iDetails .article-describe {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: start;
  }

  .iDetails .key-word-box {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: space-between;
  }

  .iDetails .item-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .iDetails .font-choose {
    z-index: 10;
    height: 20px;
    line-height: 20px;
    text-align: right;
    font-weight: bold;
    width: 12%;
    min-width: 130px;
  }
  .iDetails .font-choose span {
    margin-right: 5px;
    font-weight: normal;
    cursor: pointer;
    border-radius: 8px;
    border: #CDCDCD 1px solid;
    padding: 2px 8px;
  }
  .iDetails .font-choose span.select-font{
    border: none;
    margin-right: 0px;
    text-align: right;
    padding-right: 0;
  }

  .iDetails .item-label span {
    margin-bottom: 10px;
    height: 20px;
    line-height: 20px;
    padding-left: 8px;
    padding-right: 8px;
    border: 1px solid #e4e4e4;
    color: #999;
    border-radius: 4px;
    vertical-align: middle;
    margin-right: 20px;
    user-select: none;
  }
  .iDetails .item-label .activeLabel {
    border: 1px solid #1DD1EF;
    color: #1DD1EF;
    cursor: pointer;
  }
  .iDetails .item-label .activeLabel:hover {
    background: #1DD1EF;
    color: #ffffff;
    cursor: pointer;
  }


  .iDetails .item-label i {
    height: 20px;
    line-height: 20px;
    vertical-align: middle;
    margin-left: 4px;
    cursor: pointer;
  }

  .iDetails .describe {
    margin-bottom: 10px;
    height: 17px;
    line-height: 17px;
  }

  .iDetails .abstract-box {
    color: #252525;
    margin-top: 33px;
    padding: 20px;
    line-height: 17px;
  }

  .iDetails .content-box {
    margin-top: 39px;
    padding: 3px;
    line-height: 22px;
  }

  .iDetails .content-box p {
    margin-bottom: 17px;
  }
  .iDetails .content-box>>> img {
    width: 100%;
    height: auto;
    display: block;
  }

  .iDetails .content-footer-box {
    margin-top: 40px;
    margin-bottom: 40px;
    display: flex;
    flex-direction: row;
  }

  .iDetails .footer-left {
    padding-left: 20px;
    flex: 4;
    width: 0;
  }

  .iDetails .footer-left div {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    height: 94px;
    line-height: 94px;
    font-weight: bold;
  }

  .iDetails .footer-right {
    align-items: center;
    padding-right: 20px;
    flex: 2;
    height: 94px;
    line-height: 94px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .iDetails .footer-right img {
    margin-left: 17px;
    height: 20px;
    width: 20px;
  }

  .iDetails .footer-right span {
    margin-left: 10px;
    display: inline-block;
    height: 20px;
    line-height: 20px;
  }

  .iDetails .abstract-box span {
    font-weight: bold;
  }

  .iDetails .describe-keyword {
    margin-bottom: 10px;
    line-height: 17px;
    width: 8%;
    min-width: 50px;
    display: block;
  }
  /* .iDetails .describe-keyword span{
    display: inline-block;
    margin-bottom: 10px;
  } */
  .iDetails .keyword-content{
    width: 100%;
    line-height: 17px;
  }
  .iDetails .keyword-content span{
    margin-bottom: 10px;
    user-select: none;
  }
  .iDetails .describe img {
    height: 17px;
    line-height: 17px;
    vertical-align: middle;
  }

  .iDetails .describe-black {
    margin-right: 40px;
  }

  .iDetails .blue-label {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    background: #1DD1EF;
    margin-left: 10px;
    padding: 2px 16px;
    border-radius: 5px;
  }

  .iDetails .isTop {
    padding-top: 20px;
  }

  .iDetails .add-model {
    margin-top: 8px;
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .iDetails .add-model img {
    padding: 2px;
    border-radius: 50%;
    height: 16px;
    width: 16px;
  }

  .iDetails .add-model span {
    margin-left: 10px;
  }

  .iDetails .title-label-box {
    padding-bottom: 20px;
  }

  .iDetails .article-label-list {
    margin-top: 70px;
    margin-bottom: 10px;
  }

  .iDetails .list-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }

  .iDetails .list-item {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    height: 55px;
    line-height: 57px;
    padding-left: 20px;
  }

  .iDetails .listItemBorder {
    border-bottom: #979797 2px solid;

  }

  .iDetails #originalLink {
    cursor: pointer;
  }

  .iDetails .list-item span {
    margin-right: 5px;
    font-weight: bold;
  }

  .iDetails .go-top {
    height: 40px;
    text-align: center;
    width: 40px;
    padding: 10px;
    box-sizing: border-box;
    position: fixed;
    bottom: 180px;
    right: 60px;
    border-radius: 50%;
    background: rgba(91, 91, 91, 0.5);
  }

  .iDetails .go-top img {
    cursor: pointer;
    height: 20px;
    width: 20px;
  }
</style>
