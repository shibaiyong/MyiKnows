<template>
  <!-- 常规监测 -->
  <div class="generalConfig rzl_bc_white">
    <!-- 方案名称 -->
    <div class="generalConfig-content kpName-content">
    <div class="general-left rzl_fc_darkgray font16"><i class="rzl_fc_errRed require-color">*</i>方案名称</div>
    <div class="general-right">
      <el-input class="kpName-input" v-model="kpName" placeholder=""></el-input>
      <el-popover placement="right-start" trigger="hover"
                  content="名称支持最大20个字符!">
        <el-button slot="reference" class="general-hint">
          <i class="el-icon-question rzl_fc_lightGrey font20"></i>
        </el-button>
      </el-popover>
      <div class="kpName-warn rzl_fc_errRed font16" v-show="kpNameWarn">{{kpNameWarnText}}</div>
    </div>
  </div>
    <!-- 模块切换 -->
    <div class="generalConfig-content kpType-content">
      <div class="general-left rzl_fc_darkgray font18">模式切换</div>
      <div class="general-right kpType-right">
        <div class="kpType-item" @click="changeMode(5)" :class="kpType==5? 'rzl_bc_navy rzl_fc_white':''">模糊</div>
        <div class="kpType-item" @click="changeMode(6)" :class="kpType==6? 'rzl_bc_navy rzl_fc_white':''">精准</div>
      </div>
    </div>

    <!-- 模糊匹配 -->
    <div class="mode-fuzzy" v-show="kpType==5">
      <!-- 主体词 -->
      <div class="generalConfig-content excludeWords-content">
        <div class="general-left rzl_fc_darkgray font16"><i class="rzl_fc_errRed require-color">*</i>主体词</div>
        <div class="general-right">
          <el-input class="excludeWords-input" v-model="fuzzySubjectWords" placeholder=""></el-input>
          <el-popover placement="right-start" trigger="hover" content="最大支持5个词，空格或逗号(中英文均可)隔开，每个词最大20个字符!">
            <el-button slot="reference" class="general-hint">
              <i class="el-icon-question rzl_fc_lightGrey font20"></i>
            </el-button>
          </el-popover>
          <div class="excludeWords-warn rzl_fc_errRed font16" v-show="subjectWordsWarn">{{excludeWordsWarnText}}</div>
        </div>
      </div>
      <!-- 事件词 -->
      <div class="generalConfig-content fuzzyType-content">
        <div class="general-left rzl_fc_darkgray font16"><i class="rzl_fc_errRed require-color">*</i>事件词</div>
        <div class="general-right fuzzyType-right">
          <el-popover placement="right-start" trigger="hover"
            content="最大支持200个关键词，可以空格或逗号(中英文均可)隔开，也可以每行一个输入。">
            <el-button slot="reference" class="general-hint">
              <i class="el-icon-question rzl_fc_lightGrey font20"></i>
            </el-button>
          </el-popover>
        </div>
      </div>

      <!-- 关键词组件输入 -->
      <div class="generalConfig-content fuzzyKeyWords-content">
        <el-input type="textarea" v-model="fuzzyWords"
          class="fuzzyWords-input"
          :autosize="{minRows: 10, maxRows: 15}"
          @focus="relativeKeyWords"
          resize="none"></el-input>
        <div class="fuzzyKeyWords-relative" v-show="relativeIsActive">
          <div class="relative-title  rzl_fc_darkgray font16">关键词组合推荐</div>
          <ul class="relative-list">
            <li v-for="(relative, index) in relativeList" :key="index" class="rzl_bc_undercoat font14" @click="chooseRelative(index)">{{relative.name}}</li>
          </ul>
         </div>
      </div>
      <!-- 排除词 -->
      <div class="generalConfig-content excludeWords-content">
        <div class="general-left rzl_fc_darkgray font16">排除词</div>
        <div class="general-right">
          <el-input class="excludeWords-input" v-model="excludeWords" placeholder=""></el-input>
          <el-popover placement="right-start" trigger="hover" content="最大支持99个词，空格或逗号(中英文均可)隔开，每个词最大20个字符!">
            <el-button slot="reference" class="general-hint">
              <i class="el-icon-question rzl_fc_lightGrey font20"></i>
            </el-button>
          </el-popover>
          <div class="excludeWords-warn rzl_fc_errRed font16" v-show="excludeWordsWarn">{{excludeWordsWarnText}}</div>
        </div>
      </div>
      <!-- 地域范围 -->
      <IConfigArea @area-params="configAreaParams"  :regionWords="regionWords" v-if="flag"></IConfigArea>
      <!-- 条件选择模块 -->
      <IConfigSelector @selector-params="configSelectorParams" :selectObj="selectObj" v-if="flag"></IConfigSelector>

    </div>

    <!-- 精准匹配 -->
    <div class="mode-precise" v-show="kpType == 6">
      <div class="generalConfig-content preciseType-content">
        <div class="general-left rzl_fc_darkgray font16">精准匹配</div>
        <div class="general-right preciseType-right">
          <el-popover placement="right-start" trigger="hover" content="每个组合中，包含词最大5个关键词，排除词最大5个关键词，空格或者逗号隔开，每个词不超25个字符。">
            <el-button slot="reference" class="general-hint">
              <i class="el-icon-question  rzl_fc_lightGrey font20"></i>
            </el-button>
          </el-popover>
        </div>
      </div>
      <!-- 主体词 -->
      <div class="generalConfig-content excludeWords-content">
        <div class="general-left rzl_fc_darkgray font16"><i class="rzl_fc_errRed require-color">*</i>主体词</div>
        <div class="general-right">
          <el-input class="excludeWords-input" v-model="preciseSubjectWords" placeholder=""></el-input>
          <el-popover placement="right-start" trigger="hover" content="最大支持5个词，空格或逗号(中英文均可)隔开，每个词最大20个字符!">
            <el-button slot="reference" class="general-hint">
              <i class="el-icon-question rzl_fc_lightGrey font20"></i>
            </el-button>
          </el-popover>
          <div class="excludeWords-warn rzl_fc_errRed font16" v-show="subjectWordsWarn">{{excludeWordsWarnText}}</div>
        </div>
      </div>
      <!-- 关键词组合 -->
      <IConfigPrecise @precise-params="configPreciseParams" :preciseWords="preciseWords" v-if="flag"></IConfigPrecise>
      <!-- 地域范围 -->
      <IConfigArea @area-params="configAreaParams" :regionWords="regionWords"></IConfigArea>
      <!-- 条件选择模块 -->
      <IConfigSelector @selector-params="configSelectorParams" :selectObj="selectObj" v-if="flag"></IConfigSelector>
    </div>
    <!-- 保存和取消 -->
    <div class="monitorConfig-btn rzl_bc_white">
      <button type="button" class="config-btn font16 rzl_fc_white rzl_bc_navy rzl_bd_navy" @click="checkName">保存</button>
      <button type="button" class="config-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="resetConfig">重置</button>
    </div>
  </div>
</template>
<script>
import {planSave, recommendGroup, planUpdate,planCheckName} from '@/assets/js/api.js';
import IConfigArea from '@/components/common/ConfigArea';
import IConfigSelector from '@/components/common/ConfigSelector';
import IConfigPrecise from '@/components/common/ConfigPrecise';

const kpNameEmptyText = '方案名称不能为空!';
const kpNameEnoughText = '方案名称最多支持20个字符!';
const fuzzyWordsEmptyText = "事件词不能为空！";
const fuzzyWordsEnoughText = "事件词最大支持200个！";
const subjectWordsEmptyText = "主体词不能为空";
const subjectWordsEnoughText = "您输入的主体词不符合要求，请重新输入！";
const fuzzyWordsErrorText = "您输入的关键词不符合要求，请重新输入！";
const preciseWordsErrorText = "精准方案监测组件合词最大支持5个！";
const excludeWordsEmptyText = "排除词不能为空";
const excludeWordsEnoughText = "您输入的排除词不符合要求，请重新输入！";
const chooseAreaEmptyText = "地域范围不能为空！";
const chooseAreaEnoughText = "地域范围最多支持5个！";
const kpTimeRangeWarnText = '请选择日期范围！';
const monitorTypeWarnText = "请选择监控范围！";
const kpRpSendTypeTypeWarnText = '请选择简报推送方式！';
const wranModelsText = "预警模型不能为空！";
const wranSelfEmptyText = '请输入命中关键词！';
const wranSelfEnoughText = '命中关键词最多支持200个！';
const wranInfoText = '请选择预警触发条件！';
const warnTypeWarnText = '请选择预警方式！';
const warnTimeWarnText = '预警时间不合法，请重新输入！';
const preciseGroupWarnText = '精准组合的包含词不能为空！';
export default {
  name: 'i-eventConfig',
  components: {IConfigArea, IConfigSelector, IConfigPrecise},
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
      warnObj: {},
      // 方案名称
      kpName: '',
      // 方案名称提示信息是否显示
      kpNameWarn: false,
      // 方案名称提示信息
      kpNameWarnText: '',
      //  方案类型： 1：常规模糊，2：常规精准，3：人物监测，4：文章监测，5：事件模糊，6：事件精准
      kpType: 5,
      // 主体词，空格分隔(模糊)
      fuzzySubjectWords: '',
      // 主体词，空格分隔(精准)
      preciseSubjectWords: '',
      // 主体词提示信息是否显示
      subjectWordsWarn: false,
      // 排除词提示信息
      subjectWordsWarnText: '',
      // 模糊关键词，','分隔
      fuzzyWords: '',
      // 相关推荐标识(只查一次)
      relativeIsActive: false,
      // 关键词组合相关推荐
      relativeList: [],
      // 排除词，','分隔
      excludeWords: '',
      // 排除词提示信息是否显示
      excludeWordsWarn: false,
      // 排除词提示信息
      excludeWordsWarnText: '',
      // 条件筛选参数接收
      selectorParams: {},
      // 预警参数
      warnParams: {},
      // 地域参数
      regionWords: [],
      // 精准组合词
      preciseWords: [],
      //标识
      flag: false,
      // 防止重复提交
      isSaving: false,
      //保存原始方案名称
      kpOriginalName:''
    }
  },
  watch: {
    kpName (newVal, oldVal){
      if(newVal.length > 0 && newVal.length <= 20){
        this.kpNameWarnText = '';
        this.kpNameWarn = false;
      }else if(newVal.length > 20){
        this.kpNameWarnText = kpNameEnoughText;
        this.kpNameWarn = true;
      }
    },
    fuzzySubjectWords (newVal, oldVal){
      this.fuzzySubjectWords = newVal;
    },
    preciseSubjectWords (newVal, oldVal){
      this.preciseSubjectWords = newVal;
    }
  },
  methods: {
    // 切换模式
    changeMode (kpType) {
      if(this.kpType == kpType){
        return;
      }
      this.$mConfirm('是否放弃当前方案配置？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        this.kpType = kpType;
        this.resetConfig();
      },() => {

      })

    },
    // 依据方案名称获取相关词组
    relativeKeyWords () {
      if(this.kpName.length <= 0){
        this.$message.error(kpNameEmptyText);
        return;
      }else if(this.fuzzyWords.length < 2 && !this.relativeIsActive){
        var params = {
          planTitle: this.kpName
        };
        recommendGroup(params).then(response => {
          if(response.code == 200){
            this.relativeList = response.data || [];
            if(this.relativeList.length > 0){
              this.relativeIsActive = true;
            }
          }
        }).catch(error => {
        // this.$message.error('系统异常，请重新尝试！');
        });
      }
    },
    chooseRelative (index) {
      let newFuzzyWords = this.relativeList[index].words;
      if(newFuzzyWords.length == 0){
        return;
      }
      let words = '';
      newFuzzyWords.forEach(item => {
        words += item.name + ','
      });
      words = words.substring(0, words.lastIndexOf(','));
      if(this.fuzzyWords.length != 0){
        this.fuzzyWords = this.fuzzyWords + ',' + words;
      }else{
        this.fuzzyWords =  words;
      }
      this.relativeList.splice(index, 1);
      if(this.relativeIsActive){
        // 3秒后取消显示
        setTimeout(() => {
          this.relativeList = [];
          this.relativeIsActive = false;
        }, 3000);
      }
    },
    // 精准-组合词参数
    configPreciseParams (obj){
      this.preciseWords = obj.params.preciseGroupList;
    },
    // 地域参数
    configAreaParams (obj){
      this.regionWords = obj.params.regionWords;
    },
    // 获取条件选择项的条件参数
    configSelectorParams (obj) {
      this.selectorParams = obj.params;
    },
    // 获取预警部分的参数
    configWarnParams (obj) {
      this.warnParams = obj.params;
    },
    //验证名称是否重名
    checkName(){
      if(this.isSaving){
        return;
      }else{
        this.isSaving = true;
      }
      if(this.kpName.length == 0){
        this.$message.error(kpNameEmptyText);
        this.isSaving = false;
        return;
      }else if(this.kpName.length > 20){
        this.$message.error(kpNameEmptyText);
        this.isSaving = false;
        return;
      }
      let id = this.$route.params.id || '';
      if(id == 'event'){
        id = '';
      }
      if(id == '' || typeof (id) == 'undefined'){
        let params;
        params = {
          name:this.kpName
        };
        planCheckName(params).then(response => {
          if (response.code == 200) {
            let data = response.data;
            if (data.repeatable == false){
              this.saveConfig();
            } else {
              this.isSaving = false;
              this.$message.error(data.msg);
            }
          }else {
            this.$message.error(response.message);
          }
        }).catch(error => {
          console.log(error);
        })
      }else {
        let kpName = this.kpName;
        let kpOriginalName = this.kpOriginalName;
        if (kpName == kpOriginalName){
          this.saveConfig();
        } else {
          let params;
          params = {
            name:this.kpName
          };
          planCheckName(params).then(response => {
            if (response.code == 200) {
              let data = response.data;
              if (data.repeatable == false){
                this.saveConfig();
              } else {
                this.isSaving = false;
                this.$message.error(data.msg);
              }
            }else {
              this.$message.error(response.message);
            }
          }).catch(error => {
            console.log(error);
          })
        }

      }

    },
    // 保存数据
    saveConfig(){
      let id = this.$route.params.id || '';
      if(id == 'event'){
        id = '';
      }
      if(id == '' || typeof (id) == 'undefined'){
        // 合并参数
        var params = Object.assign({}, this.selectorParams, this.warnParams);
        // 方案名称验证
        params.kpName = this.kpName;
        // 方案模式
        params.kpType = 5;

        // 模糊模式
        if(this.kpType == 5){
          params.kpType = 5;
          // 主体词验证
          params.subjectWords = '';
          if(this.fuzzySubjectWords.length > 0){
            let subjectWordsList = this.$iknowsUtil.trim(this.fuzzySubjectWords).replace(/,/ig,"|").replace(/，/ig, "|").replace(/\s/ig, "|").split("|");
            if(subjectWordsList.length > 5){
              this.$message.error(subjectWordsEnoughText);
              this.isSaving = false;
              return;
            }
            let excludes = subjectWordsList.filter(item => {
              return item.length > 20;
            })
            if(excludes.length > 0){
              this.$message.error(subjectWordsEnoughText);
              this.isSaving = false;
              return;
            }
            // 主体词格式 "世界,人民"
            params.subjectWords = subjectWordsList.join(',');
          }else{
            this.$message.error(subjectWordsEmptyText);
            this.isSaving = false;
            return;
          }
          // 关键词组合验证
          params.fuzzyWords = '';
          if(this.fuzzyWords.length == 0){
            this.$message.error(fuzzyWordsEmptyText);
            this.isSaving = false;
            return;
          }
          let keyWordsList = this.$iknowsUtil.trim(this.fuzzyWords).replace(/,/ig,"|").replace(/，/ig, "|").replace(/\s/ig, "|").replace(/[\r\n]/ig,"|").split("|");
          if(keyWordsList.length > 200){
            this.$message.error(fuzzyWordsEnoughText);
            this.isSaving = false;
            return;
          }
          let words = keyWordsList.filter(item => {
            return item.length > 25;
          });
          if(words.length > 0){
            this.$message.error(fuzzyWordsErrorText);
            this.isSaving = false;
            return;
          }
          params.fuzzyWords = keyWordsList.join(',');

          // 排除词验证
          params.excludeWords = '';
          if(this.excludeWords.length > 0){
            let excludeWordsList = this.$iknowsUtil.trim(this.excludeWords).replace(/,/ig,"|").replace(/，/ig, "|").replace(/\s/ig, "|").split("|");
            if(excludeWordsList.length > 99){
              this.$message.error(excludeWordsEnoughText);
              this.isSaving = false;
              return;
            }
            let excludes = excludeWordsList.filter(item => {
              return item.length > 20;
            })
            if(excludes.length > 0){
              this.$message.error(excludeWordsEnoughText);
              this.isSaving = false;
              return;
            }
            // 排除词格式 "北京,天津"
            params.excludeWords = excludeWordsList.join(',');
          }

        }else{
          //  精准模式
          params.kpType = 6;
          // 主体词验证
          params.subjectWords = '';
          if(this.preciseSubjectWords.length > 0){
            let subjectWordsList = this.$iknowsUtil.trim(this.preciseSubjectWords).replace(/,/ig,"|").replace(/，/ig, "|").replace(/\s/ig, "|").split("|");
            if(subjectWordsList.length > 5){
              this.$message.error(subjectWordsEnoughText);
              this.isSaving = false;
              return;
            }
            let excludes = subjectWordsList.filter(item => {
              return item.length > 20;
            })
            if(excludes.length > 0){
              this.$message.error(subjectWordsEnoughText);
              this.isSaving = false;
              return;
            }
            // 主体词格式 "世界,人民"
            params.subjectWords = subjectWordsList.join(',');
          }else{
            this.$message.error(subjectWordsEmptyText);
            this.isSaving = false;
            return;
          }
          // 组合验证
          let groupList =  this.preciseWords.filter(item => {
            if(item.containValue){
              return item.containValue.length > 0;
            }
          });
          if(groupList.length == 0){
            this.$message.error(preciseGroupWarnText);
            this.isSaving = false;
            return;
          }
          // 构造精准模式数据结构
          params.preciseWords = [];
          let preciseQualified = false;
          this.preciseWords.forEach(item => {
            if(item.containValue && item.containValue.length > 0){
              let include = item.containValue || '';
              let execlude = item.excludeValue || '';
              include = include.replace(/,/ig,"|").replace(/，/ig, "|").replace(/\s/ig, "|").split('|');
              execlude = execlude.replace(/,/ig,"|").replace(/，/ig, "|").replace(/\s/ig, "|").split('|');
              if(include.length > 5){
                preciseQualified = true;
                return false;
              }
              params.preciseWords.push({
                include: include,
                execlude: execlude
              })
            }
          });
          if(preciseQualified){
            this.$message.error(preciseWordsErrorText);
            this.isSaving = false;
            return;
          }
        }
        // 地域范围验证
        params.regionWords = [];
        if(this.regionWords.length > 5){
          this.$message.error(chooseAreaEnoughText);
          this.isSaving = false;
          return;
        }
        params.regionWords = this.regionWords;

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
        // 监控范围验证(并处理成Int类型数组)
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

        // 是否预警验证
        // if(params.kpIsWarn){
        //   // 预警命中关键字验证
        //   if(params.wranSelfcheck){
        //     if(params.wranSelf == '' || params.wranSelf.length == 0){
        //       this.$message.error(wranSelfEmptyText);
        //       this.isSaving = false;
        //       return;
        //     }
        //     let fuzzyWordssList = params.wranSelf;
        //     if(fuzzyWordssList.length > 200){
        //       this.$message.error(wranSelfEnoughText);
        //       this.isSaving = false;
        //       return;
        //     }
        //   }
        //   // 预警方式验证(可为空)
        //   let intkpWarnSendType = [];
        //   let timeIsActive = false;
        //   if(params.kpWarnSendType && params.kpWarnSendType.length >0){
        //     params.kpWarnSendType.forEach(item => {
        //       if(item == 2){
        //         timeIsActive = true;
        //       }
        //       intkpWarnSendType.push(parseInt(item));
        //     });
        //   }
        //   params.kpWarnSendType = intkpWarnSendType;

        //   // 预警时间开启（已废弃）
        //   params.kpWranTimeCheck = true;
        //   // 预警时间验证
        //   if(timeIsActive && params.kpWarnStartTime.length != 0 && params.kpWarnEndTime.length != 0){
        //     if(params.kpWarnStartTime >= 24 || params.kpWarnStartTime <0) {
        //       this.$message.error(warnTimeWarnText);
        //       this.isSaving = false;
        //       return;
        //     } if(params.kpWarnEndTime> 24 || params.kpWarnEndTime <=0) {
        //       this.$message.error(warnTimeWarnText);
        //       this.isSaving = false;
        //       return;
        //     } if(parseInt(params.kpWarnEndTime) <= parseInt(params.kpWarnStartTime)) {
        //       this.$message.error(warnTimeWarnText);
        //       this.isSaving = false;
        //       return;
        //     }
        //   }
        // }else{
        //   // 不开启预警
        //   params.kpIsWarn = false;
        //   params.kpRpSendType = [];
        // }

        // 不开启预警
        params.kpIsWarn = false;
        params.kpRpSendType = [];
        // 此方案是否公开(默认)
        params.kpIsPublic = true;
        params.modifyTag = 0;
        // 保存常规监测方案
        planSave(params).then(response => {
          if(response.code == 200){
            this.$alert('方案保存成功！', '提示：', {
              confirmButtonText: '确定',
              callback: action => {
                this.isSaving = false;
                let userName = this.$iknowsUtil.getUserName();
                this.$router.push('/center/monitorcenter/event/'+userName);
              }
            });
          }else{
            this.isSaving = false;
            this.$message.error(response.message);
          }
        }).catch(error => {
          this.isSaving = false;
          this.$message.error('方案保存失败，请重新尝试！');
        });

      }else{
        let _thiz = this;
        this.$mConfirm('是否更新此监测方案?', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
        }).then(() => {
         var params = {};
          // 方案名称验证
          params.kpName = _thiz.kpName;
          // 方案模式
          params.kpType = 5;
          // 模糊模式
          if(_thiz.kpType == 5){
            params.kpType = 5;
            // 主体词验证
            params.subjectWords = '';
            if(_thiz.fuzzySubjectWords.length > 0){
              let subjectWordsList = _thiz.$iknowsUtil.trim(_thiz.fuzzySubjectWords).replace(/,/ig,"|").replace(/，/ig,"|").replace(/\s/ig, "|").split("|");
              if(subjectWordsList.length > 5){
                _thiz.$message.error(subjectWordsEnoughText);
                _thiz.isSaving = false;
                return;
              }
              subjectWordsList = subjectWordsList.filter(item => {
                return item.length > 20;
              })
              if(subjectWordsList.length > 0){
                _thiz.$message.error(subjectWordsEnoughText);
                _thiz.isSaving = false;
                return;
              }
              // 主体词格式 "世界,人民"
              params.subjectWords = _thiz.$iknowsUtil.trim(_thiz.fuzzySubjectWords.replace(/,/ig,"|").replace(/，/ig,"|").replace(/\s/ig, "|").split('|').join(','));
            }else{
              _thiz.$message.error(subjectWordsEmptyText);
              _thiz.isSaving = false;
              return;
            }
            // 事件词组合验证
            params.fuzzyWords = '';
            if(_thiz.fuzzyWords.length == 0){
              _thiz.$message.error(fuzzyWordsEmptyText);
              _thiz.isSaving = false;
              return;
            }
            let keyWordsList = _thiz.$iknowsUtil.trim(_thiz.fuzzyWords).replace(/,/ig,"|").replace(/，/ig, "|").replace(/\s/ig, "|").replace(/[\r\n]/ig,"|").split("|");
            if(keyWordsList.length > 200){
              _thiz.$message.error(fuzzyWordsEnoughText);
              _thiz.isSaving = false;
              return;
            }
            keyWordsList = keyWordsList.filter(item => {
              return item.length > 25;
            });
            if(keyWordsList.length > 0){
              _thiz.$message.error(fuzzyWordsErrorText);
              _thiz.isSaving = false;
              return;
            }
            params.fuzzyWords = _thiz.fuzzyWords;

            let reg = new RegExp(/[\n\r]/);
            if(reg.test(params.fuzzyWords)){
              let keyWordsLists = _thiz.$iknowsUtil.trim(params.fuzzyWords).replace(/,/ig,"|").replace(/，/ig, "|").replace(/\s/ig, "|").replace(/[\r\n]/ig,"|").split("|");
              if(keyWordsLists.length > 200){
                _thiz.$message.error(fuzzyWordsEnoughText);
                _thiz.isSaving = false;
                return;
              }
              let keyLists = keyWordsLists.filter(item => {
                return item.length > 25;
              });
              if(keyLists.length > 0){
                _thiz.$message.error(fuzzyWordsErrorText);
                _thiz.isSaving = false;
                return;
              }
              params.fuzzyWords = keyWordsLists.join(',');
            }

            // 排除词验证
            params.excludeWords = '';
            if(_thiz.excludeWords.length > 0){
              let excludeWordsList = _thiz.$iknowsUtil.trim(_thiz.excludeWords).replace(/,/ig, "|").replace(/，/ig, "|").replace(/\s/ig, "|").split("|");
              if(excludeWordsList.length > 99){
                _thiz.$message.error(excludeWordsEnoughText);
                _thiz.isSaving = false;
                return;
              }
              excludeWordsList = excludeWordsList.filter(item => {
                return item.length > 20;
              })
              if(excludeWordsList.length > 0){
                _thiz.$message.error(excludeWordsEnoughText);
                _thiz.isSaving = false;
                return;
              }
              // 排除词格式 "北京,天津"
              params.excludeWords = _thiz.$iknowsUtil.trim(_thiz.excludeWords.replace(/,/ig, "|").replace(/，/ig, "|").replace(/\s/ig, "|").split("|").join(','));
            }
          }else{
            //  精准模式
            params.kpType = 6;
            // 主体词验证
            params.subjectWords = '';
            if(_thiz.preciseSubjectWords.length > 0){
              let subjectWordsList = _thiz.$iknowsUtil.trim(_thiz.preciseSubjectWords).replace(/,/ig, "|").replace(/，/ig, "|").replace(/\s/ig, "|").split("|");
              if(subjectWordsList.length > 5){
                _thiz.$message.error(subjectWordsEnoughText);
                _thiz.isSaving = false;
                return;
              }
              subjectWordsList = subjectWordsList.filter(item => {
                return item.length > 20;
              })
              if(subjectWordsList.length > 0){
                _thiz.$message.error(subjectWordsEnoughText);
                _thiz.isSaving = false;
                return;
              }
              // 主体词格式 "世界,人民"
              params.subjectWords = _thiz.$iknowsUtil.trim(_thiz.preciseSubjectWords.replace(/,/ig, "|").replace(/，/ig, "|").replace(/\s/ig, "|").split('|').join(','));
            }else{
              _thiz.$message.error(subjectWordsEmptyText);
              _thiz.isSaving = false;
              return;
            }
            // 组合验证
            let groupList =  _thiz.preciseWords.filter(item => {
              if(item.containValue ){
                return item.containValue.length > 0;
              }
            });
            if(groupList.length == 0){
              _thiz.$message.error(preciseGroupWarnText);
              _thiz.isSaving = false;
              return;
            }
            // 构造精准模式数据结构
            params.preciseWords = [];
            let preciseQualified = false;
            _thiz.preciseWords.forEach(item => {
              if(item.containValue && item.containValue.length > 0){
                let include = item.containValue || '';
                let execlude = item.excludeValue || '';
                include = include.replace(/,/ig,"|").replace(/，/ig, "|").replace(/\s/ig, "|").split("|");
                execlude = execlude.replace(/,/ig,"|").replace(/，/ig, "|").replace(/\s/ig, "|").split("|");
                if(include.length>5){
                  preciseQualified = true;
                  return false;
                }
                params.preciseWords.push({
                  include: include,
                  execlude: execlude
                })
              }
            });
            if(preciseQualified){
              _thiz.$message.error(preciseWordsErrorText);
              _thiz.isSaving = false;
              return;
            }
          }

          // 地域范围验证
          params.regionWords = [];
          if(_thiz.regionWords.length > 5){
            _thiz.$message.error(chooseAreaEnoughText);
            _thiz.isSaving = false;
            return;
          }
          params.regionWords = _thiz.regionWords;

          // 日期范围验证
          if(params.kpTimeRange){
            if(params.kpTimeRange == '5' && params.timeSelf.length != 2){
              _thiz.$message.error(kpTimeRangeWarnText);
              _thiz.isSaving = false;
              return;
            }
          }else{ // 取默认数据
            params.kpTimeRange = _thiz.selectObj.kpTimeRange;
            params.timeSelf = _thiz.selectObj.timeSelf;
          }

          // 监控范围验证(并处理成Int类型数组)
          if(params.kpSiteRange){
            if(params.kpSiteRange.length == 0){
              _thiz.$message.error(monitorTypeWarnText);
              _thiz.isSaving = false;
              return;
            }
            let intKpSiteRange = [];
            params.kpSiteRange.forEach(item => {
              intKpSiteRange.push(parseInt(item));
            });
            params.kpSiteRange = intKpSiteRange;
          }else{
            params.kpSiteRange = _thiz.selectObj.kpSiteRange;
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
            params.kpRpType = _thiz.selectObj.kpRpType;
            let intKpRpType = [];
            params.kpRpType.forEach(item => {
              intKpRpType.push(parseInt(item));
            });
            params.kpRpType = intKpRpType;
          }
          // 周期性简报验证(无)
          // 简报推送方式验证(存在周期性简报时，推送方式不能为空)
          params.kpRpSendType = [];
          // if(params.kpRpType && params.kpRpSendType){
          //   if(params.kpRpType.length > 0 && params.kpRpSendType.length == 0){
          //     this.$message.error(kpRpSendTypeTypeWarnText);
//          this.isSaving = false;
          //     return;
          //   }
          //   let intkpRpSendType = [];
          //   params.kpRpSendType.forEach(item => {
          //     intkpRpSendType.push(parseInt(item));
          //   });
          //   params.kpRpSendType = intkpRpSendType;
          // }else{
          //   params.kpRpType = this.selectObj.kpRpType;
          //   params.kpRpSendType = this.selectObj.kpRpSendType;
          //   let intKpRpType = [];
          //   params.kpRpType.forEach(item => {
          //     intKpRpType.push(parseInt(item));
          //   });
          //   params.kpRpType = intKpRpType;
          //   let intkpRpSendType = [];
          //   params.kpRpSendType.forEach(item => {
          //     intkpRpSendType.push(parseInt(item));
          //   });
          //   params.kpRpSendType = intkpRpSendType;
          // }
          // 是否预警验证
          // if(typeof(params.kpIsWarn) != 'undefined'){
          //   if(params.kpIsWarn){
          //     // 预警模型列表验证(废弃)
          //     params.wranModels = [];
          //     // 预警命中关键字验证
          //     if(params.wranSelfcheck){
          //       if(params.wranSelfcheck && params.wranSelf.length == 0){
          //         _thiz.$message.error(wranSelfEmptyText);
          //         _thiz.isSaving = false;
          //         return;
          //       }
          //       let fuzzyWordssList = params.wranSelf;
          //       if(fuzzyWordssList.length > 200){
          //         _thiz.$message.error(wranSelfEnoughText);
          //         _thiz.isSaving = false;
          //         return;
          //       }
          //     }
          //     // 预警推送方式验证(可为空)
          //     let intkpWarnSendType = [];
          //     let timeIsActive = false;
          //     if(params.kpWarnSendType && params.kpWarnSendType.length >0){
          //       params.kpWarnSendType.forEach(item => {
          //         if(item == 2){
          //           timeIsActive = true;
          //         }
          //         intkpWarnSendType.push(parseInt(item));
          //       });
          //     }
          //     params.kpWarnSendType = intkpWarnSendType;

          //     // 预警时间验证
          //     if(timeIsActive && params.kpWarnStartTime.length != 0 && params.kpWarnEndTime.length != 0){
          //       if(params.kpWarnStartTime >= 24 || params.kpWarnStartTime <0) {
          //         _thiz.$message.error(warnTimeWarnText);
          //         _thiz.isSaving = false;
          //         return;
          //       } if(params.kpWarnEndTime> 24 || params.kpWarnEndTime <=0) {
          //         _thiz.$message.error(warnTimeWarnText);
          //         _thiz.isSaving = false;
          //         return;
          //       } if(params.kpWarnEndTime <=params.kpWarnStartTime) {
          //         _thiz.$message.error(warnTimeWarnText);
          //         _thiz.isSaving = false;
          //         return;
          //       }
          //     }
          //   }else{
          //     // 不开启预警
          //     params.kpIsWarn = false;
          //     params.kpRpSendType = [];
          //   }
          // }else{
          //   // 是否开启预警
          //   params.kpIsWarn = _thiz.warnObj.kpIsWarn;
          //   // 符合以下专题类型(废弃)
          //   params.wranCheck = true;
          //   // 已选择专题类型(废弃)
          //   params.wranModels = [];
          //   // 命中关键词是否开启
          //   params.wranSelfcheck = _thiz.warnObj.wranSelfcheck;
          //   // 命中关键词：[]
          //   params.wranSelf = _thiz.warnObj.wranSelf;
          //  if(!(Object.prototype.toString.call(params.wranSelf) == '[object Array]')){
          //     params.wranSelf = params.wranSelf.replace(/,/ig,"|").replace(/，/ig, "|").replace(/\s/ig, "|").split('|');
          //   }
          //   if(params.wranSelf.length > 200){
          //     _thiz.$message.error(wranSelfEnoughText);
          //     _thiz.isSaving = false;
          //     return;
          //   }
          //   if(params.wranSelfcheck && params.wranSelf.length>0){

          //   }else if(params.kpIsWarn){
          //     _thiz.$message.error(wranInfoText);
          //     _thiz.isSaving = false;
          //     return;
          //   }
          //   // 已选预警方式
          //   params.kpWarnSendType = _thiz.warnObj.kpWarnSendType || [];
          //   // 预警时间开启（已废弃）
          //   params.kpWranTimeCheck = true;
          //   //预警开始时间点
          //   params.kpWarnStartTime = parseInt(_thiz.warnObj.kpWarnStartTime);
          //   // 预警结束时间点
          //   params.kpWarnEndTime = parseInt(_thiz.warnObj.kpWarnEndTime);
          //   // 是否周末预警
          //   params.kpHolidayWarn = _thiz.warnObj.kpHolidayWarn;

          //   let intkpWarnSendType = [];
          //   params.kpWarnSendType.forEach(item => {
          //     intkpWarnSendType.push(parseInt(item));
          //   });
          //   params.kpWarnSendType = intkpWarnSendType;
          // }

          // 此方案是否公开(默认)
          params.kpIsPublic = true;
          params.id = id;
          params.modifyTag = 1;
          // 更新常规监测方案
          planUpdate(params).then(response => {
            if(response.code == 200){
              _thiz.$alert('方案保存成功！', '提示：', {
                confirmButtonText: '确定',
                callback: action => {
                  _thiz.isSaving = false;
                  let userName = _thiz.$iknowsUtil.getUserName();
                  _thiz.$router.push('/center/monitorcenter/event/'+userName);
                }
              });
            }else{
              _thiz.$message.error(response.message);
              _thiz.isSaving = false;
            }
          }).catch(error => {
            _thiz.isSaving = false;
            _thiz.$message.error('方案保存失败，请重新尝试！');
          });
        },() => {
          _thiz.isSaving = false;
        })
      }
    },
    resetConfig () {
      this.kpName = '';
      this.kpNameWarn = false;
      this.kpNameWarnText = '';
      this.fuzzySubjectWords = '';
      this.preciseSubjectWords = '';
      this.subjectWordsWarn = false;
      this.subjectWordsWarnText = '';
      this.fuzzyWords = '';
      this.relativeKeyWords = false;
      this.fuzzyWords = '';
      this.excludeWords = '';
      this.excludeWordsWarn = false;
      this.excludeWordsWarnText = '';

      this.preciseWords = [];
      this.preciseWords[0] = {groupName: '组合', contain: '包含', containValue: '', exclude: '排除', excludeValue: ''};
      // 重置地区范围
      this.regionWords = [];
      // 筛选条件
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
        kpSiteRange: ['1','2','4','8'],
        // 无(通过js条件判断此条件)
        noneReportRadio: true,
        // 已选简报周期
        kpRpType: [],
        // 已选简报方式
        kpRpSendType: ['1'],
      };
      // 是否开启预警
      this.warnObj.kpIsWarn = false;
      // 符合以下专题类型
      this.warnObj.wranCheck = false;
      // 已选择专题类型
      this.warnObj.wranModels = [];
      // 命中关键词是否开启
      this.warnObj.wanSelfcheck = false;
      // 命中关键词
      this.warnObj.wranSelf = '';
      // 已选预警方式
      this.warnObj.kpWarnSendType = [];
      //预警开始时间点
      this.warnObj.kpWarnStartTime= '';
      // 预警结束时间点
      this.warnObj.kpWarnEndTime= '';
      // 预警时间开启
      this.warnObj.kpWranTimeCheck= false;
      // 是否周末预警
      this.warnObj.kpHolidayWarn= false;
    },
  },
  mounted () {
    this.allObj = this.allObjInfo;
    this.kpName = this.allObj.kpName || '';
    this.kpOriginalName = this.allObj.kpName;
    this.kpType = this.allObj.kpType;
    this.excludeWords = this.allObj.excludeWords || '';
    this.regionWords = this.allObj.regionWords || [];
    // 主体词保存时,分隔，回显时空格分隔
    if(this.kpType == 5){
      this.fuzzySubjectWords = this.allObj.subjectWords || '';
    }else if(this.kpType == 6){
      this.preciseSubjectWords = this.allObj.subjectWords || '';
    }

    // 模糊关键词，','分隔
    this.fuzzyWords = this.allObj.fuzzyWords || '';
    // 精准：组合词
    this.preciseWords = this.allObj.preciseWords || [];
    // 筛选条件
    this.selectObj = this.allObj.selectObj;
    // 预警条件
    this.warnObj = this.allObj.warnObj;
    this.flag = true;
  },
}
</script>
<style scoped>
.generalConfig{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.generalConfig-content{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
}
.kpName-content{
  margin-top: 22px;
  height: 38px;
}
.general-hint{
  padding: 9px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  box-sizing: border-box;
}
.general-hint i:hover{
  color: #1D2088;
}
.general-left{
  width: 138px;
  height: 100%;
  line-height: 38px;
  text-align: right;
  font-weight: 600;
}
.general-right{
  margin-left: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}
.kpName-input,
.excludeWords-input{
  width: 400px;
  height: 100%;
}
.rzl_fc_lightGrey{
  cursor: pointer;
}
.kpName-warn,
.excludeWords-warn{
  min-width: 450px;
  height: 100%;
  line-height: 38px;
}
.kpTimeRange-warn{
  margin-left: 10px;
}
/* 模式切换 */
.kpType-content{
  margin-top: 30px;
  height: 28px;
  line-height: 28px;
}
.kpType-right{
  width: 120px;
  height: 100%;
  border: 2px solid #1D2088;
  border-radius: 10px;
  overflow: hidden;
}
.kpType-item{
  width: 50%;
  height: 100%;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
}
.fuzzyKeyWords-relative{
  margin-left: 170px;
  width: 200px;
  height: 187px;
  padding: 20px;
  box-shadow: 0 2px 4px 2px #E5E5E5;
  border-radius: 10px;
  box-sizing: border-box;
}
.relative-title{
  width: 100%;
  line-height: 20px;
  font-weight: 600;
}
.relative-list{
  margin-top: 10px;
  width: 100%;
  padding: 0 25px;
  box-sizing: border-box;
}
.relative-list li{
  margin-top: 10px;
  width: 100%;
  height: 28px;
  line-height: 28px;
  border-radius: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
/*统一的borderColor*/
.kpName-input input,
.fuzzyWords-input input,
.excludeWords-input input,
.fuzzyArea-input input{
  border-color: #CDCDCD;
}

/***************匹配*****************/
.mode-fuzzy{
  width: 100%;
  height: auto;
}
.mode-fuzzy .fuzzyType-content,
.mode-precise .preciseType-content{
  margin-top: 18px;
}
.general-hint{
  background: none;
  border: none;
  border-radius: 9px;
}

.mode-fuzzy .fuzzyKeyWords-content{
  width: 100%;
  height: auto;
}
.mode-fuzzy .fuzzyWords-input{
  margin-left: 74px;
  width: 486px;
  min-width: 412px;
  min-height: 200px;
  border-radius: 10px;
  box-sizing: border-box;
}
.mode-fuzzy .excludeWords-content{
  margin-top: 20px;
}
.mode-fuzzy .warn-chooseWarn{
  margin-top: 20px;
  width: 100%;
}
.warn-chooseWarn span{
  margin-right: 15px;
}
.mode-fuzzy .tag-chooseWarn{
  border-radius: 10px;
}
.generalConfig >>>.el-tag .el-icon-close{
  color: #555555;
}
.generalConfig >>>.el-tag--medium .el-icon-close{
  -webkit-transform: scale(1);
  transform: scale(1);
}
.generalConfig >>>.el-tag .el-icon-close:hover{
  background-color: #1D2088;
  color: #ffffff;
}
.generalConfig >>> .el-radio{
  height: 100%;
  line-height: 38px;
}
.generalConfig >>> .el-radio__inner{
  border-color: #979797;
}
.generalConfig >>> .el-radio__inner::after{
  background-color: #1D2088;
}
.generalConfig >>> .el-radio span,
.generalConfig >>> .el-checkbox span{
  color: #555555;
}
.generalConfig >>> .el-radio__input.is-checked .el-radio__inner,
.generalConfig >>> .el-checkbox__input.is-checked .el-checkbox__inner{
  border-color: #1D2088;
  background: #1D2088;
}
.generalConfig >>> .el-radio__inner:hover,
.generalConfig >>> .el-checkbox__inner:hover,
.generalConfig >>> .is-focus .el-checkbox__inner{
  border-color: #1D2088;
}

.generalConfig >>> .el-checkbox{
  height: 100%;
  line-height: 38px;
}

/******提交按钮*****/
.generalConfig .monitorConfig-btn{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
  padding: 110px 0 100px 240px;
  box-sizing: border-box;
}
.generalConfig .monitorConfig-btn .config-btn{
  width: 120px;
  height: 38px;
  line-height: 34px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
}
.generalConfig .monitorConfig-btn .config-btn:last-child{
  margin-left: 120px;
}

/*********************精准匹配**********************/
.mode-precise{
  width: 100%;
  height: auto;
}

/* 覆写element-ui的input框样式*/
.generalConfig >>>.el-input__inner{
  width: 400px;
  height: 38px;
  line-height: 38px;
  border-radius: 10px;
}
.el-message{
  top: 50% !important;
}
</style>
