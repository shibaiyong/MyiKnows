<template>
  <div class="articleConfig  rzl_bc_white">
    <!-- 方案名称 -->
    <div class="articleConfig-content programName-content">
      <div class="article-left rzl_fc_darkgray font16">方案名称</div>
      <div class="article-right">
        <el-input class="programName-input" v-model="programName" placeholder=""></el-input>
        <div class="article-hint">
          <i class="el-icon-question rzl_fc_lightGrey font20"></i>
        </div>
        <div class="programName-warn rzl_fc_errRed font16" v-show="programNameWarn">方案名称不能为空</div>
      </div>
    </div>
    <!-- 文章线索添加 -->
    <div class="articleConfig-content goal-content">
      <div class="article-left rzl_fc_darkgray font16">文章线索添加</div>
      <div class="article-right goal-right">
        <el-popover placement="right-start" trigger="hover" content="最多支持添加5篇文稿。">
          <el-button slot="reference" class="article-hint">
            <i class="el-icon-question rzl_fc_navy font20"></i>
          </el-button>
        </el-popover>
      </div>
    </div>
    <!-- 添加新文章 -->
    <div class="articleConfig-content add-content">
      <div class="article-add font14" @click="addArticleMode">
        <i class="el-icon-circle-plus rzl_fc_navy font20 articleAdd-icon"></i>
        <span>添加新文章</span>
      </div>
    </div>
    <!-- 文章列表 -->
    <div class="articleConfig-content" v-show="articleAddList.length >0">
      <ul class="articleConfig-articleList">
        <li class="articleList-header rzl_bc_undercoat  rzl_fc_darkgray font14">文章标题</li>
        <li v-for="(article, index) in articleAddList" :key="index" class="rzl_bd_lightGrey">
          <div class="articleList-title rzl_fc_darkgray font14 ">{{article.title}}</div>
          <div class="articleList-operate font14">
            <button type="button" class="delArticle-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="delArticle(index)">删除</button>
          </div>
        </li>
      </ul>
    </div>
    <!-- 条件选择模块 -->
    <IConfigSelector @selector-params="configSelectorParams"></IConfigSelector>
    <!-- 添加文章 -->
    <IAddArticle :isAddArticle="isAddArticle" 
      @save-article="handleSaveArticle" 
      @cancel-article="handleCancelArticle"></IAddArticle>
    <!-- 保存和取消 -->
    <div class="monitorConfig-btn rzl_bc_white">
      <button type="button" class="config-btn font16 rzl_fc_white rzl_bc_navy rzl_bd_navy" @click="saveConfig">保存</button>
      <button type="button" class="config-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="resetConfig">重置</button>
    </div>
  </div>
</template>
<script>
import IConfigSelector from '@/components/common/ConfigSelector';
import IAddArticle from '@/components/common/AddArticle';
export default{
  name: 'i-articleConfig',
  components: {IConfigSelector, IAddArticle},
  data () {
    return {
      programName: '',
      // 方案名称提示信息是否显示
      programNameWarn: true,
      // 是否添加文章
      isAddArticle: false,
      // 添加的文章列表
      articleAddList: [],
      // 条件筛选参数
      selectorParams: {},
      // 新添加的文章
      articleParams: {},
    }
  },
  methods: {
    // 添加文章
    addArticleMode () {
      this.isAddArticle = true;
    },
    // 删除文章
    delArticle(index){
      console.log(index);
      this.articleAddList.splice(index,1);
    },
    // 新增人物数据
    handleSaveArticle (articleObj) {
      this.isAddArticle = false;
      this.articleAddList.push({
        title: articleObj.articleTitle,
        url: articleObj.articleURL,
        content: articleObj.articleContent
      });
    this._configAllParams();
    },
    // 取消人物
    handleCancelArticle () {
      this.isAddArticle = false;
      this._configAllParams();
    },
    // 获取条件选择项的条件参数
    configSelectorParams (obj) {
      this.selectorParams = obj.params;
      this._configAllParams();
    },
    // 保存数据
    saveConfig(){

    },
    resetConfig () {
      this.programName = '';
      this.programNameWarn = false;
      this.programNameWarnText = '';
    },
    // 获取本页面配置的所有参数
    _configAllParams(){
      // 合并参数
      var params = Object.assign({}, this.selectorParams);
      params.programName = this.programName;
      params.articleAddList = this.articleAddList;

      console.log('所有参数');
      console.log(params);
      this.$emit('config-allParams', {
        params: params
      });
    }
  },
  created() {
    const articleAddList = [
      {id: '1', title: '延迟退休新政策实施，除了退休年龄，你还会受到哪些影响', url:'', content: ''},
      {id: '2', title: '农村生“三胎”上户口到底要不要交钱', url: '', content: ''},
      {id: '3', title: '大学宿舍里的奇葩改造，到底是你太飘，还是宿管阿姨拿不动刀了', url: '', content: ''},
    ];
    this.articleAddList = articleAddList;
  },
}
</script>
<style scoped>
.articleConfig{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.articleConfig-content{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
}
.articleConfig .programName-content{
  margin-top: 22px;
  height: 38px;
}
.articleConfig .article-hint{
  padding: 9px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 9px;
  box-sizing: border-box;
}
.articleConfig .article-left{
  width: 138px;
  height: 100%;
  line-height: 38px;
  text-align: right;
  font-weight: 600;
}
.articleConfig .article-right{
  margin-left: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}
.articleConfig .programName-input,
.articleConfig .excludeWords-input{
  width: 400px;
  height: 100%;
}
.rzl_fc_lightGrey{
  cursor: pointer;
}
.articleConfig .programName-warn,
.articleConfig .excludeWords-warn{
  min-width: 450px;
  height: 100%;
  line-height: 38px;
}
.articleConfig .dateType-warn{
  margin-left: 10px;
}
.articleConfig .goal-content{
  margin-top: 18px;
}
.articleConfig .add-content{
  margin-top: 25px;
  width: 100%;
  cursor: pointer;
}
.articleConfig .article-add{
  width: 100%;
  padding-left: 54px;
  box-sizing: border-box;
  height: 20px;
  line-height: 20px;
}
.articleConfig .article-add span{
  display: inline-block;
  line-height: 20px;
}
.articleConfig .article-add .articleAdd-icon{
  margin-right: 10px;
  position: relative;
  top: 2px;
}
.articleConfig .articleConfig-articleList{
  width: 680px;
  height: auto;
  margin-top: 30px;
  margin-left: 56px;
}
.articleConfig .articleConfig-articleList li{
  width: 100%;
  height: 70px;
  line-height: 70px;
  padding: 0 30px 0 20px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  box-sizing: border-box;
}
.articleConfig .articleConfig-articleList li:first-child{
  height: 40px;
  line-height: 40px;
  border: none;
  font-weight: 600;
}
.articleConfig .articleList-title{
  width: 580px;
  text-align: left;
}
.articleConfig .articleList-operate{
  width: 100px;
}
.articleConfig .articleList-operate .delArticle-btn{
  width: 60px;
  height: 30px;
  line-height: 26px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
  overflow: hidden;
}
.articleConfig >>> .el-checkbox{
  height: 100%;
  line-height: 38px;
}
.articleConfig >>>.el-tag .el-icon-close{
  color: #555555;
}
.articleConfig >>>.el-tag--medium .el-icon-close{
  -webkit-transform: scale(1);
  transform: scale(1);
}
.articleConfig >>>.el-tag .el-icon-close:hover{
  background-color: #1D2088;
  color: #ffffff;
}
.articleConfig >>> .el-radio{
  height: 100%;
  line-height: 38px;
}
.articleConfig >>> .el-radio__inner{
  border-color: #979797;
}
.articleConfig >>> .el-radio__inner::after{
  background-color: #1D2088;
}
.articleConfig >>> .el-radio span,
.articleConfig >>> .el-checkbox span{
  color: #555555;
}
.articleConfig >>> .el-radio__input.is-checked .el-radio__inner,
.articleConfig >>> .el-checkbox__input.is-checked .el-checkbox__inner{
  border-color: #1D2088;
  background: #1D2088;
}
.articleConfig >>> .el-radio__inner:hover,
.articleConfig >>> .el-checkbox__inner:hover,
.articleConfig >>> .is-focus .el-checkbox__inner{
  border-color: #1D2088;
}

/******提交按钮*****/
.articleConfig .monitorConfig-btn{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
  padding: 110px 0 100px 240px;
  box-sizing: border-box;
}
.articleConfig .monitorConfig-btn .config-btn{
  width: 120px;
  height: 38px;
  line-height: 34px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
}
.articleConfig .monitorConfig-btn .config-btn:last-child{
  margin-left: 120px;
}



/* 覆写element-ui的input框样式*/
.articleConfig >>>.el-input__inner{
  width: 400px;
  height: 38px;
  line-height: 38px;
  border-radius: 10px;
}
/****点击input的边框样式****/
.articleConfig >>> .el-range-editor.is-active, .el-range-editor.is-active:hover{
  border-color: #1D2088;
  outline: none;
}
</style>