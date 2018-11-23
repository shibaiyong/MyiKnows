<template>
  <!-- 人物监测 -->
  <div class="personConfig rzl_bc_white">
    <!-- 方案名称 -->
    <div class="personConfig-content kpName-content">
      <div class="person-left rzl_fc_darkgray font16"><i class="rzl_fc_errRed require-color">*</i>方案名称</div>
      <div class="person-right">
        <el-input class="kpName-input" v-model="kpName" placeholder=""></el-input>
        <el-popover placement="right-start" trigger="hover" content="名称支持最大20个字符!">
          <el-button slot="reference" class="person-hint">
            <i class="el-icon-question rzl_fc_lightGrey font20"></i>
          </el-button>
        </el-popover>
        <div class="kpName-warn rzl_fc_errRed font16" v-show="kpNameWarn">{{kpNameWarnText}}</div>
      </div>
    </div>
    <!-- 目标人物添加 -->
    <div class="personConfig-content goal-content">
      <div class="person-left rzl_fc_darkgray font16">目标人物添加</div>
      <div class="person-right goal-right">
        <el-popover placement="right-start" trigger="hover" content="最多支持添加5个目标人物。">
          <el-button slot="reference" class="person-hint">
            <i class="el-icon-question rzl_fc_lightGrey font20"></i>
          </el-button>
        </el-popover>
      </div>
    </div>
    <!-- 添加新人物 -->
    <div class="personConfig-content add-content">
      <div class="person-add font14" @click="addPersonMode">
        <i class="el-icon-circle-plus rzl_fc_navy font20 personAdd-icon"></i>
        <i class="rzl_fc_errRed require-color">*</i>
        <span>添加新人物</span>
      </div>
    </div>
    <!-- 人物列表 -->
    <div class="personConfig-content" v-show="personWords.length >0">
      <ul class="personConfig-personList">
        <li class="rzl_bc_undercoat">
          <div class="personList-name name-header rzl_fc_darkgray font14">姓名</div>
          <div class="personList-job job-header rzl_fc_darkgray font14">职位</div>
          <div class="personList-operate operate-header rzl_fc_darkgray font14"></div>
        </li>
        <li v-for="(person, index) in personWords" :key="index" class="rzl_bd_lightGrey">
          <div class="personList-name rzl_fc_darkgray font14 ">{{person.name}}</div>
          <div class="personList-job rzl_fc_darkgray font14">{{person.job}}</div>
          <div class="personList-operate font14">
            <button type="button" class="delPerson-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="delPerson(index)">删除</button>
          </div>
        </li>
      </ul>
    </div>
    <!-- 排除词 -->
    <div class="personConfig-content excludeWords-content">
      <div class="person-left rzl_fc_darkgray font16">排除词</div>
      <div class="person-right">
        <el-input class="excludeWords-input" v-model="excludeWords" placeholder=""></el-input>
        <el-popover placement="right-start" trigger="hover" content="每个组合中，包含词最大5个关键词，排除词最大5个关键词，空格或者逗号隔开，每个词不超10个字符。">
          <el-button slot="reference" class="person-hint">
            <i class="el-icon-question  rzl_fc_lightGrey font20"></i>
          </el-button>
        </el-popover>
        <div class="excludeWords-warn rzl_fc_errRed font16" v-show="excludeWordsWarn">排除词不能为空</div>
      </div>
    </div>
    <!-- 地域范围 -->
    <IConfigArea @area-params="configAreaParams" :regionWords="regionWords" v-if="flag"></IConfigArea>
    <!-- 条件选择模块 -->
    <IConfigSelector @selector-params="configSelectorParams" :selectObj="selectObj" v-if="flag"></IConfigSelector>
    <!-- 添加人物 -->
    <IAddPerson :isAddPerson="isAddPerson"
    :personWords="personWords"
    @save-person="handleSavePerson"
    @cancel-person="handleCancelPerson"></IAddPerson>
    <!--预警模块  -->
    <IConfigWarn @warn-params="configWarnParams" :warnInfoObj="warnObj" v-if="flag"></IConfigWarn>
    <!-- 保存和取消 -->
    <div class="monitorConfig-btn rzl_bc_white">
      <button type="button" class="config-btn font16 rzl_fc_white rzl_bc_navy rzl_bd_navy" @click="saveConfig">保存</button>
      <button type="button" class="config-btn font16 rzl_bc_white rzl_fc_navy rzl_bd_navy" @click="resetConfig">重置</button>
    </div>
  </div>
</template>
<script>
import {planSave, planUpdate} from '../../assets/js/api.js';
import IConfigArea from '@/components/common/ConfigArea';
import IConfigSelector from '@/components/common/ConfigSelector';
import IConfigWarn from '@/components/common/ConfigWarn';
import IAddPerson from '@/components/common/AddPerson';

const kpNameEmptyText = '方案名称不能为空!';
const kpNameEnoughText = '方案名称最多支持20个字符!';
const excludeWordsEmptyText = "排除词不能为空";
const excludeWordsEnoughText = "您输入的排除词不符合要求，请重新输入！";
const chooseAreaEmptyText = "地域范围不能为空！";
const chooseAreaEnoughText = "地域范围最多支持5个！";
const dateTypeWarnText = '请选择日期范围！';
const monitorTypeWarnText = "请选择监控范围！";
const briefsTypeWarnText = '请选择简报推送方式！';
const chooseWarnListText = "预警模型不能为空！";
const hitKeysWordEmptyText = '请输入命中关键词！';
const hitKeysWordEnoughText = '命中关键词最多支持3个！';
const wranInfoText = '请选择预警触发条件！';
const warnTypeWarnText = '请选择预警方式！';
const warnTimeWarnText = '预警时间不合法，请重新输入！';
const preciseGroupWarnText = '包含词或排除词不能为空！';
export default {
  name: 'i-personConfig',
  components: {IConfigArea, IConfigSelector, IConfigWarn, IAddPerson},
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
      kpName: '',
      //  方案类型： 1：常规模糊，2：常规精准，3：人物监测，4：文章监测
      kpType: 0,
      // 方案名称提示信息是否显示
      kpNameWarn: false,
      // 方案名称提示信息
      kpNameWarnText: '',
      // 是否添加人物
      isAddPerson: false,
      // 添加的人物列表
      personWords: [],
      // 排除词，','分隔
      excludeWords: '',
      // 排除词提示信息是否显示
      excludeWordsWarn: false,
      // 排除词提示信息
      excludeWordsWarnText: '',
      // 条件筛选参数
      selectorParams: {},
      // 预警参数
      warnParams: {},
      // 地域参数
      regionWords: [],
      //标识
      flag: false,
      // 防止重复提交
      isSaving: false,
    }
  },
  methods: {
    // 添加人物
    addPersonMode () {
      this.isAddPerson = true;
      document.getElementById('configMask').style.display= 'block';
    },
    // 删除人物
    delPerson(index){
      this.$mConfirm('是否删除此人物?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        this.personWords.splice(index,1);
      },() => {

      })
    },
    // 新增人物数据
    handleSavePerson (obj) {
      this.isAddPerson = false;
      this.personWords.push({
        name: obj.name,
        job: obj.job
      });
    },
    // 取消人物
    handleCancelPerson () {
      this.isAddPerson = false;
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
        var params = Object.assign({}, this.selectorParams, this.warnParams);
        params.kpType = 3;
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
        //添加的人物验证
        params.personWords = [];
        this.personWords.forEach(item => {
          params.personWords.push({
            name: item.name.split(' '),
            job: item.job.split(' ')
          })
        });
        // 排除词验证
        params.excludeWords = '';
        if(this.excludeWords.length > 0){
          let excludeWordsList = this.$iknowsUtil.trim(this.excludeWords).replace(/,/ig,"|").replace(/，/ig, "|").replace(/\s/ig, "|").split("|");
          if(excludeWordsList.length > 5){
            this.$message.error(excludeWordsEnoughText);
            this.isSaving = false;
            return;
          }
          let excludes = excludeWordsList.filter(item => {
            return item.length > 10;
          })
          if(excludes.length > 0){
            this.$message.error(excludeWordsEnoughText);
            this.isSaving = false;
            return;
          }
          // 排除词格式 "北京,天津"
          params.excludeWords = excludeWordsList.join(',');
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
        params.kpRpSendType = [];
        // if(typeof(params.kpRpSendType) == 'undefined'){
        //     params.kpRpSendType = this.selectObj.kpRpSendType;
        // }else if(params.kpRpSendType.length == 0){
        //     this.$message.error(kpRpSendTypeTypeWarnText);
//        this.isSaving = false;
        //     return;
        // }else{
        //   let intkpRpSendType = [];
        //   params.kpRpSendType.forEach(item => {
        //     intkpRpSendType.push(parseInt(item));
        //   });
        //   params.kpRpSendType = intkpRpSendType;
        // }
        // 是否预警验证
        if(params.kpIsWarn){
          // 是否开启专题模型
          if(params.wranCheck){
            // 预警模型列表验证
            let isModelChecked = false;
            if(params.wranModels && params.wranModels.length > 0){
              isModelChecked = true;
            }
            // 预警命中关键字验证
            let isSlefChecked = false;
            if(params.wranSelfcheck){
              if(params.wranSelfcheck && params.wranSelf.length == 0){
                this.$message.error(wranSelfEmptyText);
                this.isSaving = false;
                return;
              }
              let fuzzyWordssList = params.wranSelf;
              if(fuzzyWordssList.length > 3){
                this.$message.error(wranSelfEnoughText);
                this.isSaving = false;
                return;
              }
              isSlefChecked = true;
            }
            if(!isModelChecked && !isSlefChecked){
              this.$message.error(wranInfoText);
              this.isSaving = false;
              return;
            }           
          }
          // 预警推送方式验证
          params.kpWarnSendType = [];
          // if(params.kpWarnSendType && params.kpWarnSendType.length <=0) {
          //   this.$message.error(warnTypeWarnText);
//          this.isSaving = false;
          //   return;
          // }
          // let intkpWarnSendType = [];
          // params.kpWarnSendType.forEach(item => {
          //   intkpWarnSendType.push(parseInt(item));
          // });
          // params.kpWarnSendType = intkpWarnSendType;
          // 周期性简报验证
          if(params.kpWranTimeCheck && params.kpWarnStartTime.length != 0 && params.kpWarnEndTime.length != 0){
            if(params.kpWarnStartTime >= 24 || params.kpWarnStartTime <0) {
              this.$message.error(warnTimeWarnText);
              this.isSaving = false;
              return;
            } if(params.kpWarnEndTime> 24 || params.kpWarnEndTime <=0) {
              this.$message.error(warnTimeWarnText);
              this.isSaving = false;
              return;
            } if(params.kpWarnEndTime <=params.kpWarnStartTime) {
              this.$message.error(warnTimeWarnText);
              this.isSaving = false;
              return;
            }
          }
        }else{
          // 不开启预警
          params.kpIsWarn = false;
        }
        // 此方案是否公开(默认)
        params.kpIsPublic = true;
        params.modifyTag = 0;
        // 保存人物监测方案
        let _thiz = this;
        setTimeout( function () {
          planSave(params).then(response => {
            if(response.code == 200){
              _thiz.$alert('方案保存成功！', '提示：', {
                confirmButtonText: '确定',
                callback: action => {
                  _thiz.isSaving = false;
                  _thiz.$router.push('/monitorcenter');
                }
              });
            }else{
              _thiz.isSaving = false;
              _thiz.$message.error(response.message);
            }
          }).catch(error => {
            _thiz.isSaving = false;
            _thiz.$message.error('方案保存失败，请重新偿试！');
          });
        },500);
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
          params.kpType = 3;

          //添加的人物验证
          params.personWords = [];
          this.personWords.forEach(item => {
            let personJob = item.job.split('，');
            let job = [];
            if(!!personJob && personJob.length > 0){
              personJob.forEach(e => {
                job.push(e);
              });
            }
            params.personWords.push({
              name: item.name.split('，'),
              job: job
            })
          });
          // 地域范围验证
          params.regionWords = [];
          if(this.regionWords.length > 5){
            this.$message.error(chooseAreaEnoughText);
            this.isSaving = false;
            return;
          }
          params.regionWords = this.regionWords;

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
          if(typeof(params.kpIsWarn) != 'undefined'){
            if(params.kpIsWarn){
              // 是否开启专题模型
              if(params.wranCheck){
                // 预警模型列表验证
                let isModelChecked = false;
                if(params.wranModels && params.wranModels.length > 0){
                  isModelChecked = true;
                }
                // 预警命中关键字验证
                let isSlefChecked = false;
                if(params.wranSelfcheck){
                  if(params.wranSelfcheck && params.wranSelf.length == 0){
                    this.$message.error(wranSelfEmptyText);
                    this.isSaving = false;
                    return;
                  }
                  let fuzzyWordssList = params.wranSelf;
                  if(fuzzyWordssList.length > 3){
                    this.$message.error(wranSelfEnoughText);
                    this.isSaving = false;
                    return;
                  }
                  isSlefChecked = true;
                }
                if(!isModelChecked && !isSlefChecked){
                  this.$message.error(wranInfoText);
                  this.isSaving = false;
                  return;
                }  
              }
              // 预警推送方式验证
              params.kpWarnSendType = [];
              // if(params.kpWarnSendType && params.kpWarnSendType.length <=0) {
              //   this.$message.error(warnTypeWarnText);
//              this.isSaving = false;
              //   return;
              // }
              // let intkpWarnSendType = [];
              // params.kpWarnSendType.forEach(item => {
              //   intkpWarnSendType.push(parseInt(item));
              // });
              // params.kpWarnSendType = intkpWarnSendType;

              // 预警时间验证
              if(params.kpWranTimeCheck && params.kpWarnStartTime.length != 0 && params.kpWarnEndTime.length != 0){
                if(params.kpWarnStartTime >= 24 || params.kpWarnStartTime <0) {
                  this.$message.error(warnTimeWarnText);
                  this.isSaving = false;
                  return;
                } if(params.kpWarnEndTime> 24 || params.kpWarnEndTime <=0) {
                  this.$message.error(warnTimeWarnText);
                  this.isSaving = false;
                  return;
                } if(parseInt(params.kpWarnEndTime) <= parseInt(params.kpWarnStartTime)) {
                  this.$message.error(warnTimeWarnText);
                  this.isSaving = false;
                  return;
                }
              }
            }else{
              // 不开启预警
              params.kpIsWarn = false;
            }
          }else{
            // 是否开启预警
            params.kpIsWarn = this.warnObj.kpIsWarn;
            // 符合以下专题类型
            params.wranCheck = this.warnObj.wranCheck;
            // 已选择专题类型
            params.wranModels = this.warnObj.wranModels || [];
            // 命中关键词是否开启
            params.wranSelfcheck = this.warnObj.wranSelfcheck;
            // 命中关键词：[]
            params.wranSelf = this.warnObj.wranSelf || [];
            if(Object.prototype.toString.call(params.wranSelf) == '[object Array]'){

            }else{
              params.wranSelf = params.wranSelf.split(',');
            }
            if(params.wranSelf.length > 3){
              this.$message.error(wranSelfEnoughText);
              this.isSaving = false;
              return;
            }
            if(params.wranModels.length > 0 || (params.wranSelfcheck && params.wranSelf.length>0)){

            }else{
              this.$message.error(wranInfoText);
              this.isSaving = false;
              return;
            }
            // 已选预警方式
            params.kpWarnSendType = this.warnObj.kpWarnSendType || [];
            // 预警时间开启
            params.kpWranTimeCheck = this.warnObj.kpWranTimeCheck;
            //预警开始时间点
            params.kpWarnStartTime = parseInt(this.warnObj.kpWarnStartTime);
            // 预警结束时间点
            params.kpWarnEndTime = parseInt(this.warnObj.kpWarnEndTime);
            // 是否周末预警
            params.kpHolidayWarn = this.warnObj.kpHolidayWarn;

            let intkpWarnSendType = [];
            params.kpWarnSendType.forEach(item => {
              intkpWarnSendType.push(parseInt(item));
            });
            params.kpWarnSendType = intkpWarnSendType;
          }
          // 此方案是否公开(默认)
          params.kpIsPublic = true;
          params.id = id;
          params.modifyTag = 1;
          // 更新人物监测方案
          planUpdate(params).then(response => {
            console.log(response);
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
        });
      }
    },
    resetConfig () {
      this.kpName = '';
      this.kpNameWarn = false;
      this.kpNameWarnText = '';
      this.excludeWords = '';
      this.excludeWordsWarn = false;
      this.excludeWordsWarnText = '';
      this.personWords = [];
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
    this.kpType = this.allObj.kpType;
    this.excludeWords = this.allObj.excludeWords || '';
    this.regionWords = this.allObj.regionWords || [];
    // 人物列表
    this.personWords = this.allObj.personWords || [];

    // 筛选条件
    this.selectObj = this.allObj.selectObj;
    // 预警条件
    this.warnObj = this.allObj.warnObj;
    this.flag = true;
  },
}
</script>
<style scoped>
.personConfig{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.personConfig-content{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
}
.personConfig .kpName-content{
  margin-top: 22px;
  height: 38px;
}
.personConfig .person-hint{
  padding: 9px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 9px;
  box-sizing: border-box;
}
.personConfig .person-hint i:hover{
  color: #1D2088;
}
.personConfig .person-left{
  width: 138px;
  height: 100%;
  line-height: 38px;
  text-align: right;
  font-weight: 600;
}
.personConfig .person-right{
  margin-left: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}
.personConfig .kpName-input,
.personConfig .excludeWords-input{
  width: 400px;
  height: 100%;
}
.rzl_fc_lightGrey{
  cursor: pointer;
}
.personConfig .kpName-warn,
.personConfig .excludeWords-warn{
  min-width: 450px;
  height: 100%;
  line-height: 38px;
}
.personConfig .dateType-warn{
  margin-left: 10px;
}
.personConfig .goal-content{
  margin-top: 18px;
}
.personConfig .add-content{
  margin-top: 25px;
  width: 100%;
  cursor: pointer;
}
.personConfig .person-add{
  width: 100%;
  padding-left: 54px;
  box-sizing: border-box;
  height: 20px;
  line-height: 20px;
}
.personConfig .person-add span{
  display: inline-block;
  line-height: 20px;
}
.personConfig .person-add .personAdd-icon{
  margin-right: 10px;
  position: relative;
  top: 2px;
}
.personConfig .personConfig-personList{
  width: 680px;
  height: auto;
  margin-top: 30px;
  margin-left: 56px;
}
.personConfig .personConfig-personList li{
  width: 100%;
  height: 70px;
  line-height: 70px;
  padding: 0 30px 0 20px;
  text-align: center;
  display: flex;
  justify-content: flex-start;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  box-sizing: border-box;
}
.personConfig .personConfig-personList li:first-child{
  height: 40px;
  line-height: 40px;
  border: none;
}
.personConfig .personList-name{
  width: 230px;
  text-align: left;
}
.personConfig .personList-job{
  width: 350px;
  text-align: left;
}
.personConfig .personList-operate{
  width: 100px;
}
.name-header,
.job-header{
  font-weight: 600;
  text-align: left;
}

.personConfig .monitorConfig-btn{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
  padding: 110px 0 100px 240px;
  box-sizing: border-box;
}
.personConfig .delPerson-btn{
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
.personConfig .excludeWords-content{
  margin-top: 30px;
}
.personConfig >>> .el-checkbox{
  height: 100%;
  line-height: 38px;
}
.personConfig >>>.el-tag .el-icon-close{
  color: #555555;
}
.personConfig >>>.el-tag--medium .el-icon-close{
  -webkit-transform: scale(1);
  transform: scale(1);
}
.personConfig >>>.el-tag .el-icon-close:hover{
  background-color: #1D2088;
  color: #ffffff;
}
.personConfig >>> .el-radio{
  height: 100%;
  line-height: 38px;
}
.personConfig >>> .el-radio__inner{
  border-color: #979797;
}
.personConfig >>> .el-radio__inner::after{
  background-color: #1D2088;
}
.personConfig >>> .el-radio span,
.personConfig >>> .el-checkbox span{
  color: #555555;
}
.personConfig >>> .el-radio__input.is-checked .el-radio__inner,
.personConfig >>> .el-checkbox__input.is-checked .el-checkbox__inner{
  border-color: #1D2088;
  background: #1D2088;
}
.personConfig >>> .el-radio__inner:hover,
.personConfig >>> .el-checkbox__inner:hover,
.personConfig >>> .is-focus .el-checkbox__inner{
  border-color: #1D2088;
}

/******提交按钮*****/
.personConfig .monitorConfig-btn{
  width: 100%;
  display: flex;
  display: -webkit-box;
  justify-content: flex-start;
  padding: 110px 0 100px 240px;
  box-sizing: border-box;
}
.personConfig .monitorConfig-btn .config-btn{
  width: 120px;
  height: 38px;
  line-height: 34px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
}
.personConfig .monitorConfig-btn .config-btn:last-child{
  margin-left: 120px;
}


/* 覆写element-ui的input框样式*/
.personConfig >>>.el-input__inner{
  width: 400px;
  height: 38px;
  line-height: 38px;
  border-radius: 10px;
}
</style>
