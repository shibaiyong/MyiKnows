<template>
  <!-- 添加新文章 -->
  <div class="addArticle" v-show="isAddArticle">
    <div class="addArticle-content">
      <div class="addArticle-content-bg"></div>
      <div class="addArticle-content-layout rzl_bc_white">
        <div class="addArticle-title rzl_fc_darkgray font24">添加文章</div>
        <div class="addArticle-articleURLWarn rzl_fc_errRed font14">{{articleURLWarnText}}</div>
        <!-- 文章URL -->
        <div class="addArticle-articleUrl">
          <div class="addArticle-left rzl_fc_darkgray font16">文章URL</div>
          <div class="addArticle-right">
            <el-input class="addArticle-input" v-model="articleURL" placeholder=""></el-input>
            <button type="button" class="articleUrl-btn font16 rzl_fc_white rzl_bc_navy rzl_bd_navy" @click="queryArticleByURL">抓取</button>
          </div>
        </div>
        <!-- 文章标题 -->
        <div class="addArticle-articleTitle">
          <div class="addArticle-left rzl_fc_darkgray font16">文章标题</div>
          <div class="addArticle-right">
            <el-input class="addArticle-input" v-model="articleTitle" placeholder=""></el-input>
            <div class="addArticle-hint">
              <i class="el-icon-question rzl_fc_lightGrey font20"></i>
            </div>         
          </div>
        </div>
        <!-- 文章正文 -->
        <div class="addArticle-articleContent">
          <div class="articleContent-left rzl_fc_darkgray font16">文章正文</div>
          <div class="articleContent-right">
            <div class="addArticle-input-contnet">
              <el-input type="textarea" v-model="articleContent"
                class="articleContent-input rzl_bd_lightGrey"
                :autosize="{minRows: 10, maxRows: 15}" resize="none"></el-input>
                <div class="articleContent-count">
                  <div class="addArticle-articleContentWarn rzl_fc_errRed font14">{{articleContentWarnText}}</div>
                  <div>
                    <span class="rzl_fc_darkgray font14">目前字数：</span>
                    <span class="rzl_fc_darkgray font14" :class="{rzl_fc_errRed: countNum >2000}">{{countNum}}</span>
                    <span class="rzl_fc_darkgray font14">/2000</span>
                  </div>
                </div>
            </div>
            <div class="addArticle-hint">
              <i class="el-icon-question rzl_fc_lightGrey font20"></i>
            </div>
          </div>
        </div>
        <div class="addArticle-button rzl_bc_white">
          <button type="button" class="addArticle-btn font16 rzl_fc_white rzl_bc_navy rzl_bd_navy" @click="saveArticle">保存</button>
          <button type="button" class="addArticle-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="cancelArticle">取消</button>
        </div>

      </div>
    </div> 
  </div>
</template>
<script>
const crawlErrorText = "抓取失败，请您手动输入";
const urlEmptyText = "文章url不能为空！";
const titleEmptyText = "文章标题不能为空!";
const titleEnoughText = "标题最多支持100个字符!";
const contentEmptyText = "文章正文不能为空！";
const contentEngoughText = "正文不得超过2000字符!";
export default {
  name: 'i-addArticle',
  props: {
    isAddArticle: {
      type: Boolean,
      require: true,
    },
  },
  data () {
    return {
      // 文章url
      articleURL: '',
      // 抓取失败提示
      articleURLWarnText: '',
      // 文章标题
      articleTitle: '',
      // 文章正文
      articleContent: '',
      // 正文提示
      articleContentWarnText: '',
      // 正文字数
      countNum: 0,
      // 假list
      articleList: [],
    }
  },
  watch: {
    articleContent (newVal, oldVal){
      this.countNum = newVal.length;
      if(this.countNum > 2000){
        this.articleContentWarnText = contentEngoughText;
      }
    }
  },
  methods: {
    // 名称匹配查找
    queryArticleByURL() {
      let url = this.articleURL;
      let articleDemo = {
        articleURL: url,
        articleTitle: '国际爱牙日 | 平均每个中国孩子有2.8颗蛀牙，宝宝牙齿不好会有怎样的影响?',
        articleContent: '家长们都知道幼儿时期是生长发育的旺盛期，而口腔是消化系统的第一道门户，牙齿是重要的咀嚼器官，健康的乳牙有助于消化作用，'
                        +'有利于生长发育。如果发生了蛀牙，孩子会减少进食，即使进食也也减少咀嚼的时间和次数，那么没有充分咀嚼的食物到达胃部，增加了胃部的负担，孩子'
                        +'容易消化不良。2、影响面部发育同时，良好的咀嚼功能又能有助于颌面部的正常发育，为将来恒牙的萌出和整齐排列创造良好条件。蛀牙疼痛，导致儿童养'
                        +'成偏侧咀嚼习惯，久而久之容易造成面部发育不对称。小贴士:这里也要提醒家长一点，不要过于精细地养育孩子，也不要在孩子长出小牙后还是一直喂养'
                        +'流质食物，嚼功能的刺激，才能促进颌骨的正常发育哦!婴幼儿期是儿童学习语言的时期，完整的乳牙有助于孩子掌握正确的发音，乳牙龋坏和早失则会使'
                        +'孩子发音不清。乳前牙区严重的龋蚀，影响美观，使有些孩子羞于开口说话，对孩子的心理发育也很不利。'
      };
      this.articleTitle = articleDemo.articleTitle;
      this.articleContent = articleDemo.articleContent; 
      if(!url || url.length == 0){
        this.articleURLWarnText = urlEmptyText;
      }else{
        this.articleURLWarnText = '';
      }
      // 失败的警告信息
      this.articleURLWarnText = crawlErrorText;
    },
    // 保存文章
    saveArticle () {
      // url验证
      if(!this.articleURL || this.articleURL == ''){
        this.articleURLWarnText = urlEmptyText;
        return ;
      }
      // 标题验证
      if(!this.articleTitle || this.articleTitle == ''){
        this.articleURLWarnText = titleEmptyText;
        return ;
      }
      if(this.articleTitle.length > 100){
        this.articleURLWarnText = titleEnoughText;
        return ;
      }
      this.articleURLWarnText = '';
      // 正文验证
      if(!this.articleContent || this.articleContent == ''){
        this.articleContentWarnText = contentEmptyText;
        return ;
      }
      if(this.countNum > 2000){
        this.articleContentWarnText = contentEngoughText;
        return;
      }

      this.articleContentWarnText = '';
      
      this.$emit('save-article',{
        articleURL: this.articleURL,
        articleTitle: this.articleTitle,
        articleContent: this.articleContent,
      });
    },
    // 取消文章
    cancelArticle () {
      this.$emit('cancel-article',{});
    },
  },
  mounted() {
    this.articleURL = '';
    this.articleTitle = '';
    this.articleContent = '';
  },
}  
</script>
<style scoped>
.addArticle{
  width: 100%;
  height: 100vw;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
}
.addArticle .addArticle-content{
  width: 100%;
  height: 100%;
  position: relative;
}
.addArticle .addArticle-content-bg{
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0,0,0,0.60);
  z-index: 1000;
}
.addArticle .addArticle-content-layout{
  position: fixed;
  top: calc((100% - 560px)/2);
  left: calc((100% - 900px)/2);
  z-index: 1999;
  width: 900px;
  height: 560px;
  padding: 30px 78px 40px 60px;
  border-radius: 20px;
  box-sizing: border-box;
}
.addArticle .addArticle-title{
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-weight: 700;
}
.addArticle-articleURLWarn{
  margin-top: 5px;
  margin-bottom: 5px;
  width: 100%;
  height: 20px;
  line-height: 20px;
  padding-left: 92px;
  box-sizing: border-box;
}

.addArticle .addArticle-articleUrl{
  width: 100%;
  height: 38px;
  display: flex;
  justify-content: flex-start;
}
.addArticle .addArticle-articleTitle{
  margin-top: 20px;
  width: 100%;
  height: 38px;
  display: flex;
  justify-content: flex-start;
}
.addArticle .addArticle-left{
  width: 72px;
  height: 100%;
  line-height: 38px;
  text-align: right;
  font-weight: 600;
}
.addArticle .addArticle-right{
  padding-left: 20px;
  width: 680px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
}
.addArticle .addArticle-input{
  width: 590px;
  height: 100%;
}
.addArticle .addArticle-hint{
  padding: 9px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 9px;
  box-sizing: border-box;
}
.addArticle .articleUrl-btn{
  margin-left: 20px;
  width: 60px;
  height: 38px;
  line-height: 34px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
}
.addArticle .addArticle-articleContent{
  margin-top: 20px;
  width: 100%;
  height: 227px;
  display: flex;
  justify-content: flex-start;
}
.addArticle .articleContent-left{
  width: 72px;
  height: 100%;
  text-align: right;
  font-weight: 600;
  vertical-align: text-top;
}
.addArticle .articleContent-right{
  padding-left: 20px;
  width: 680px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
}
.addArticle-input-contnet{
  width: 590px;
  height: 227px;
  display: block;
}
.addArticle .articleContent-input{
  width: 100%;
  height: 227px;
  border-radius: 10px;
  border-color: #CDCDCD;
  outline: none;
  overflow-y: auto;
}

.addArticle .articleContent-count{
  margin-top: 10px;
  width: 100%;
  height: 17px;
  line-height: 17px;
  text-align: right;
  display: flex;
  justify-content: space-between;
}
.addArticle-articleContentWarn{
  width: 300px;
  height: 17px;
  line-height: 17px;
  text-align: left;
}
.articleContent-count span{
  display: inline-block;
  line-height: 17px;
}


/****保存和取消***/
.addArticle .addArticle-button{
  position: absolute;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  width: 320px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.addArticle .addArticle-button .addArticle-btn{
  width: 120px;
  height: 38px;
  line-height: 34px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
}
/* 覆写element-ui的input框样式*/
.addArticle >>>.el-input__inner{
  width: 590px;
  height: 38px;
  line-height: 38px;
  border-radius: 10px;
}
.addArticle >>> .el-textarea__inner{
  overflow: hidden;
}
</style>