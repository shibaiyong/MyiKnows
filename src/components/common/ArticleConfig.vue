<template>
  <div class="articleConfig  rzl_bc_white">
    <!-- 方案名称 -->
    <div class="articleConfig-content kpName-content">
      <div class="article-left rzl_fc_darkgray font16"><i class="rzl_fc_errRed require-color">*</i>方案名称</div>
      <div class="article-right">
        <el-input class="kpName-input" v-model="kpName" placeholder=""></el-input>
        <el-popover placement="right-start" trigger="hover" content="名称支持最大20个字符!">
          <el-button slot="reference" class="article-hint">
            <i class="el-icon-question rzl_fc_lightGrey font20"></i>
          </el-button>
        </el-popover>
        <div class="kpName-warn rzl_fc_errRed font16" v-show="kpNameWarn">方案名称不能为空</div>
      </div>
    </div>
    <!-- 文章线索添加 -->
    <div class="articleConfig-content goal-content">
      <div class="article-left rzl_fc_darkgray font16">文稿线索添加</div>
      <div class="article-right goal-right">
        <el-popover placement="right-start" trigger="hover" content="最多支持添加5篇文稿。">
          <el-button slot="reference" class="article-hint">
            <i class="el-icon-question rzl_fc_lightGrey font20"></i>
          </el-button>
        </el-popover>
      </div>
    </div>
    <!-- 添加新文章 -->
    <div class="articleConfig-content add-content">
      <div class="article-add font14" @click="addArticleMode">
        <i class="el-icon-circle-plus rzl_fc_navy font20 articleAdd-icon"></i>
        <i class="rzl_fc_errRed require-color">*</i>
        <span>添加新文章</span>
      </div>
    </div>
    <!-- 文章列表 -->
    <div class="articleConfig-content" v-show="articles.length >0">
      <ul class="articleConfig-articleList">
        <li class="articleList-header rzl_bc_undercoat  rzl_fc_darkgray font14">文章标题</li>
        <li v-for="(article, index) in articles" :key="index" class="rzl_bd_lightGrey">
          <div class="articleList-title rzl_fc_darkgray font14 ">{{article.title}}</div>
          <div class="articleList-operate font14">
            <button type="button" class="delArticle-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="delArticle(index)">删除</button>
          </div>
        </li>
      </ul>
    </div>
    <!-- 条件选择模块 -->
    <IConfigSelector @selector-params="configSelectorParams" :selectObj="selectObj" v-if="flag"></IConfigSelector>
    <!-- 添加文章 -->
    <IAddArticle :isAddArticle="isAddArticle"
      :articles="articles"
      @save-article="handleSaveArticle"
      v-if="flag"
      @cancel-article="handleCancelArticle"></IAddArticle>
    <!-- 保存和取消 -->
    <div class="monitorConfig-btn rzl_bc_white">
      <button type="button" class="config-btn font16 rzl_fc_white rzl_bc_navy rzl_bd_navy" @click="saveConfig">保存</button>
      <button type="button" class="config-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="resetConfig">重置</button>
    </div>
  </div>
</template>
<script>
import {planSave, planUpdate} from '../../assets/js/api.js';
import IConfigSelector from '@/components/common/ConfigSelector';
import IAddArticle from '@/components/common/AddArticle';

const kpNameEmptyText = '方案名称不能为空!';
const kpNameEnoughText = '方案名称最多支持20个字符!';
const dateTypeWarnText = '请选择日期范围！';
const monitorTypeWarnText = "请选择监控范围！";
const kpRpSendTypeTypeWarnText = '请选择简报推送方式！';
const articlesWarnText = "文稿线索不能为空,请添加监测文章！";
export default{
  name: 'i-articleConfig',
  components: {IConfigSelector, IAddArticle},
  props: {
    allObjInfo: {
      type: Object,
      require: true,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      // 中转数据
      allObj: {},
      selectObj: {},
      kpName: '',
      // 方案名称提示信息是否显示
      kpNameWarn: false,
      // 是否添加文章
      isAddArticle: false,
      // 添加的文章列表
      articles: [],
      // 条件筛选参数
      selectorParams: {},
      // 新添加的文章
      articleParams: {},
      // 标识
      flag: false,
      // 防止重复提交
      isSaving: false,
    }
  },
  methods: {
    // 添加文章
    addArticleMode () {
      this.isAddArticle = true;
      document.getElementById('configMask').style.display="block";
    },
    // 删除文章
    delArticle(index){
      this.$mConfirm('是否删除此文稿?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        this.articles.splice(index,1);
      },() => {

      })
    },
    // 新增人物数据
    handleSaveArticle (articleObj) {
      this.isAddArticle = false;
      this.articles.push({
        title: articleObj.articleTitle,
        url: articleObj.articleURL,
        content: articleObj.articleContent
      });
    },
    // 取消人物
    handleCancelArticle () {
      this.isAddArticle = false;
    },
    // 获取条件选择项的条件参数
    configSelectorParams (obj) {
      this.selectorParams = obj.params;
    },
    // 保存数据
    saveConfig(){
      if(this.isSaving){
        return;
      }else{
        this.isSaving = true;
      }
      let id = this.$route.params.id || '';
      if(id == '' || typeof (id) == 'undefined'){
        // 合并参数
        var params = Object.assign({}, this.selectorParams);
        params.kpType = 4;
        // 方案名称验证
        params.kpName = '';
        if(this.kpName.length == 0){
          this.$message.error(kpNameEmptyText);
          this.isSaving = false;
          return;
        }else if(this.kpName.length > 20){
          this.$message.error(kpNameEnoughText);
          this.isSaving = false;
          return;
        }else{
          params.kpName = this.kpName;
        }

        // 文章列表
        params.articles = this.articles || [];
        if(params.articles.length == 0){
          this.$message.error(articlesWarnText);
          this.isSaving = false;
          return;
        }

        // 日期范围验证
        if(typeof(params.kpTimeRange) == 'undefined'){
          params.kpTimeRange = this.selectObj.kpTimeRange;
        }
        if(typeof(params.timeSelf) == 'undefined'){
          params.timeSelf = [];
        }
        if(params.kpTimeRange == '5' && params.timeSelf && params.timeSelf.length != 2){
          this.$message.error(dateTypeWarnText);
          this.isSaving = false;
          return;
        }

        // 监控范围验证
        if(typeof(params.kpSiteRange) == 'undefined'){
          params.kpSiteRange = this.selectObj.kpSiteRange;
        }else{
          if(params.kpSiteRange.length == 0){
            this.$message.error(monitorTypeWarnText);
            this.isSaving = false;
            return;
          }
          let intKpSiteRange = [];
          params.kpSiteRange.forEach(item => {
            intKpSiteRange.push(parseInt(item));
          });
          params.kpSiteRange = intKpSiteRange;
        }

        // 周报类型处理
        if(typeof(params.kpRpType) == 'undefined'){
          params.kpRpType = this.selectObj.kpRpType;
        }else{
          if(params.kpRpType.length > 0){
            let intKpRpType = [];
            params.kpRpType.forEach(item => {
              intKpRpType.push(parseInt(item));
            });
            params.kpRpType = intKpRpType;
          }
        }

        // 周期性简报验证(无)
        // 简报推送方式验证(存在周期性简报时，推送方式不能为空)
        if(typeof(params.kpRpSendType) == 'undefined'){
            params.kpRpSendType = this.selectObj.kpRpSendType;
        }else if(params.kpRpSendType.length == 0){
            this.$message.error(kpRpSendTypeTypeWarnText);
            this.isSaving = false;
            return;
        }else{
          let intkpRpSendType = [];
          params.kpRpSendType.forEach(item => {
            intkpRpSendType.push(parseInt(item));
          });
          params.kpRpSendType = intkpRpSendType;
        }

        // 额外参数
        // 此方案是否公开(默认)
        params.kpIsPublic = true;
        params.modifyTag = 0;
        console.log("articleConfig数据：");
        console.log(params);

        // 保存文稿监测方案
        planSave(params).then(response => {
          // console.log(response);
          if(response.code == 200){
            this.$alert('方案保存成功！', '提示：', {
              confirmButtonText: '确定',
              callback: action => {
                this.isSaving = false;
                this.$router.push('/monitorcenter');
              }
            });
          }else{
            this.isSaving = false;
            this.$message.error(response.message);
          }
        }).catch(error => {
          this.isSaving = false;
          this.$message.error('方案保存失败，请重新偿试！');
        });
      }else{
        this.$mConfirm('是否更新此监测方案?', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
        }).then(() => {
          var params = {};
          // 方案名称验证
          params.kpName = '';
          if(this.kpName.length == 0){
            this.$message.error(kpNameEmptyText);
            this.isSaving = false;
            return;
          }else if(this.kpName.length > 20){
            this.$message.error(kpNameEmptyText);
            this.isSaving = false;
            return;
          }else{
            params.kpName = this.kpName;
          }
          // 方案模式
          params.kpType = 4;
          // 文章列表
          params.articles = this.articles;

          // 日期范围验证
          if(params.kpTimeRange){
            if(params.kpTimeRange == '5' && params.timeSelf.length != 2){
              this.$message.error(kpTimeRangeWarnText);
              this.isSaving = false;
              return;
            }
          }else{ // 取默认数据
            params.kpTimeRange = this.selectObj.kpTimeRange;
            params.timeSelf = this.selectObj.timeSelf;
          }

          // 监控范围验证(并处理成Int类型数组)
          if(params.kpSiteRange){
            if(params.kpSiteRange.length == 0){
              this.$message.error(monitorTypeWarnText);
              this.isSaving = false;
              return;
            }
            let intKpSiteRange = [];
            params.kpSiteRange.forEach(item => {
              intKpSiteRange.push(parseInt(item));
            });
            params.kpSiteRange = intKpSiteRange;
          }else{
            params.kpSiteRange = this.selectObj.kpSiteRange;
            let intKpSiteRange = [];
            params.kpSiteRange.forEach(item => {
              intKpSiteRange.push(parseInt(item));
            });
            params.kpSiteRange = intKpSiteRange;
          }

          // 周报类型处理
          if(params.kpRpType){
            if(params.kpRpType.length > 0){
              let intKpRpType = [];
              params.kpRpType.forEach(item => {
                intKpRpType.push(parseInt(item));
              });
              params.kpRpType = intKpRpType;
            }
          }else{
            params.kpRpType = this.selectObj.kpRpType;
            let intKpRpType = [];
            params.kpRpType.forEach(item => {
              intKpRpType.push(parseInt(item));
            });
            params.kpRpType = intKpRpType;
          }
          // 周期性简报验证(无)
          // 简报推送方式验证(存在周期性简报时，推送方式不能为空)
          if(params.kpRpType && params.kpRpSendType){
            if(params.kpRpType.length > 0 && params.kpRpSendType.length == 0){
              this.$message.error(kpRpSendTypeTypeWarnText);
              this.isSaving = false;
              return;
            }
            let intkpRpSendType = [];
            params.kpRpSendType.forEach(item => {
              intkpRpSendType.push(parseInt(item));
            });
            params.kpRpSendType = intkpRpSendType;
          }else{
            params.kpRpType = this.selectObj.kpRpType;
            params.kpRpSendType = this.selectObj.kpRpSendType;
            let intKpRpType = [];
            params.kpRpType.forEach(item => {
              intKpRpType.push(parseInt(item));
            });
            params.kpRpType = intKpRpType;
            let intkpRpSendType = [];
            params.kpRpSendType.forEach(item => {
              intkpRpSendType.push(parseInt(item));
            });
            params.kpRpSendType = intkpRpSendType;
          }

          // 此方案是否公开(默认)
          params.kpIsPublic = true;
          params.id = id;
          params.modifyTag = 1;

          // 更新文稿监测方案
          planUpdate(params).then(response => {
            if(response.code == 200){
              this.$alert('方案保存成功！', '提示：', {
                confirmButtonText: '确定',
                callback: action => {
                  this.isSaving = false;
                  this.$router.push('/monitorcenter');
                }
              });
            }else{
              this.isSaving = false;
              this.$message.error(response.message);
            }
          }).catch(error => {
            this.isSaving = false;
            this.$message.error('方案保存失败，请重新偿试！');
          });
        },() => {
          this.isSaving = false;
        })

      }
    },
    resetConfig () {
      this.kpName = '';
      this.kpNameWarn = false;
      this.kpNameWarnText = '';
      this.articles = [];
      // 条件选择初始化
      this.selectObj = {
        // 日期范围类型
        kpTimeRange: '3',
        // 日期控件是否
        disabled: true,
        // 自定义日期范围值
        timeSelf: [],
        // 是否全部监控
        allMonitorRadio: true,
        // 已选监控范围
        kpSiteRange: ['1','2','4','8','16','32','64'],
        // 无(通过js条件判断此条件)
        noneReportRadio: true,
        // 已选简报周期
        kpRpType: [],
        // 已选简报方式
        kpRpSendType: ['1'],
      };
    },
  },
  mounted () {
    this.allObj = this.allObjInfo;
    this.kpName = this.allObj.kpName || '';
    this.kpType = this.allObj.kpType;
    this.excludeWords = this.allObj.excludeWords || '';
    // 文章列表
    this.articles = this.allObj.articles || [];

    // 筛选条件
    this.selectObj = this.allObj.selectObj;
    this.flag = true;
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
.articleConfig .kpName-content{
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
.articleConfig .article-hint i:hover{
  color: #1D2088;
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
.articleConfig .kpName-input,
.articleConfig .excludeWords-input{
  width: 400px;
  height: 100%;
}
.rzl_fc_lightGrey{
  cursor: pointer;
}
.articleConfig .kpName-warn,
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
