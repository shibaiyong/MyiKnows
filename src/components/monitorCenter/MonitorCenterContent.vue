<template>
  <div class="rzl_fc_darkgray">
    <div class="monitor-center" id="monitor-center-content">
      <div class="search-input-box">
        <input type="text" v-model="querystr"/>
        <span class="text-button-navy rzl_bc_navy rzl_fc_white font14" @click="search">搜索</span>
        <i class="rzl_bc_shallowGreen rzl_fc_white" v-if="showInputWarring">!</i>
        <span class="font14 rzl_fc_errRed" v-if="showInputWarring">请减少到20字以内。</span>
      </div>
      <div class="mission-label">
        <div v-for="item in statusData">
          <span class="mission-label-title font16">{{item.title}}：</span>
          <span class="mission-label-status font14"
                v-for="item1 in item.items"
                @click="chooseStatue(item,item1)"
                :class="{rzl_fc_white:item1.isSelected,rzl_bc_navy:item1.isSelected}">{{item1.name}}</span>
        </div>
      </div>
      <div class="empty-button-box font14 rzl_fc_navy">
        <span @click="stopList">批量停止</span>
        <span @click="createCase">新建监测方案</span>
      </div>
      <div class="items-box " v-if="listData.length">
        <div class="item " :class="{itemLeft:index%2==1,itemRight:index%2==0}" v-for="(item,index) in listData"
             :key="item.id">
          <div class="item-title">
            <div class="left-title font16 rzl_fc_darkgray">
              <checkBox :label="item.id" :dataArr="dataArr" :all="checkAll" v-show="hadStop"/>
              {{item.kpName}}
            </div>
            <div class="right-title font14">
              <span>{{ kpType( item.kpType ) }}</span>
            </div>
          </div>
          <div class="table-box rzl_fc_navy font16">
            <span @click="getResult(item)" :class="{rzl_bc_navy:item.buttonStyle[0],rzl_fc_white:item.buttonStyle[0]}"
                  @mouseover='mouseover(item,0)'
                  @mouseout="mouseout(item,0)">
                  查看结果
              </span>
            <span @click="builderDoc(item)" :class="{rzl_bc_navy:item.buttonStyle[1],rzl_fc_white:item.buttonStyle[1]}"
                  @mouseover='mouseover(item,1)'
                  @mouseout="mouseout(item,1)">
                  生成简报
              </span>
            <span @click="updateConfig(item)"
                  :class="{rzl_bc_navy:item.buttonStyle[2],rzl_fc_white:item.buttonStyle[2]}"
                  @mouseover='mouseover(item,2)'
                  @mouseout="mouseout(item,2)"
                  v-show="hadStop">
                  修改配置
              </span>
            <span @click="stopItem(item)"
                  :class="{rzl_bc_navy:item.buttonStyle[3],rzl_fc_white:item.buttonStyle[3]}"
                  @mouseover='mouseover(item,3)'
                  @mouseout="mouseout(item,3)"
                  v-show="hadStop">
                  停止
              </span>
          </div>
        </div>
      </div>
      <div class="no-data" v-if="!listData.length">暂无相关数据</div>
      <div class="pagination" v-if="listData.length">
        <Pagination :totalNum="total"
                    :pageSize="pageSize"
                    @currentChange="currentChange"
                    v-if="hackReset"
                    ref="pagination"/>
      </div>
      <div class="go-top" v-if="showGoTop" @click="goTop">
        <img src="../../assets/up.png"/>
      </div>
      <div class="dialog-box" v-if="showCreateDialog||showCreateSuccessDialog">
        <div v-if="showCreateDialog" class="dialog-content-box ">
          <div class="dialog-title rzl_fc_darkgray font24">生成简报</div>
          <div class="date-rang">
            <span class=" rzl_fc_darkgray font16">数据时间范围</span>
            <!-- <el-radio v-model="dateTypeRadio" label="year" @change="changeDateType()">持续(1年)</el-radio> -->
            <el-radio v-model="dateTypeRadio" label="0" @change="changeDateType()">1天</el-radio>
            <el-radio v-model="dateTypeRadio" label="1" @change="changeDateType()">7天</el-radio>
            <el-radio v-model="dateTypeRadio" label="3" @change="changeDateType()">30天</el-radio>
            <!-- <el-radio v-model="dateTypeRadio" label="customTime" @change="changeDateType()">自定义</el-radio> -->
            <!-- <div class="customTime-date">
              <el-date-picker v-model="customTime" type="daterange"
                              :disabled="disabled"
                              range-separator="-"
                              :default-time="['00:00:00', '23:59:59']"
                               start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div> -->
          </div>
          <div class="date-rang">
            <span class=" rzl_fc_darkgray font16">生成格式 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <!-- <el-radio v-model="reportFormat" label="0" @change="changeDateType()">PDF</el-radio> -->
            <el-radio v-model="reportFormat" label="1" @change="changeDateType()">Word</el-radio>
          </div>
          <div class="dialog-button-box font16 rzl_fc_navy">
            <span class="rzl_bc_navy rzl_fc_white" @click="createReport()">生成</span>
            <span class="rzl_bc_white rzl_fc_navy" @click="cancelCreateReport()">取消</span>
          </div>
        </div>
        <div v-if="showCreateSuccessDialog" class="dialog-success-box">
          <div class="dialog-title rzl_fc_darkgray font24">已经成功生成简报</div>
          <div class="dialog-button-box dialog-success-button-box font16 rzl_fc_navy">
            <span class="rzl_bc_navy rzl_fc_white" @click="downloadBulletin()">查看结果</span>
            <span class="rzl_bc_white rzl_fc_navy" @click="bulletinCenter()">下载简报</span>            
            <span class="rzl_bc_white rzl_fc_navy" @click="backHome()">返回</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 公共组件引入统一采用I开头
  import ITop from '@/components/common/Top';
  import IHeader from '@/components/common/Header';
  import IFooter from '@/components/common/Footer';
  import checkBox from '@/components/common/CheckBox';
  import dataUtil from '../../assets/js/dataUtlis'
  import Pagination from '@/components/common/Pagination'
  import {getPlanList} from '../../assets/js/api.js';
  import {stopPlan, downloadBulletinList, createReport, qryReportSummary} from '../../assets/js/api.js';

  export default {
    name: "monitor-center",
    components: {ITop, IHeader, IFooter, dataUtil, checkBox, Pagination},
    props: ["parentHeight"],
    watch: {
      searchTitle() {
        if (this.searchTitle && this.searchTitle.length > 20) {
          this.showInputWarring = true
        } else {
          this.showInputWarring = false
        }
      },
      parentHeight() {
        var dom = document.getElementById("monitor-center-content")
        if (dom && this.parentHeight != 0 && this.parentHeight > dom.offsetHeight) {
          var a = this.parentHeight > 600 ? this.parentHeight : 600
          dom.style.minHeight = a + "px"
        }
      }
    },
    data() {
      return {
        pageStart: 0,
        showCreateDialog: false,
        showCreateSuccessDialog: false,
        dateTypeRadio: "",
        customTime: '',
        hackReset: true,
        querystr: "",
        showInputWarring: false,
        planType: [1],
        status: 1,
        disabled: true,
        statusData: [],
        listData: [],
        dataArr: [],
        checkAll: "",
        total: 0,
        pageSize: 10,
        showGoTop: false,
        reportFormat: "",
        dateScope: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        flag: true,
        hadStop:true,
        pid:'',
        kpname:'',
        reportId:''
      }
    },
    methods: {
      loadList() {
        var _this = this
        var params = {
          pageStart: this.pageStart,
          pageSize: 10,
          planType: this.planType,
          status: this.status,
          querystr: this.querystr
        }
        params = JSON.stringify(params)
        getPlanList(params).then(response => {
          if (response.code == 200) {
            _this.listData = response.data.simplePlans
            for (var i = 0; i < _this.listData.length; i++) {
              _this.listData[i].buttonStyle = [true, false, false, false]
            }
            if (_this.pageStart == 0) {
              _this.hackReset = false
              _this.$nextTick(() => {
                _this.total = response.data.total
                _this.hackReset = true
              })
            }
          }
        }).catch(error => {
          console.log(error);
        })
      },
      changeDateType() {
        
        if (this.dateTypeRadio == "customTime") {
          this.disabled = false
        } else {
          this.disabled = true
        }
      },
      createReport() {
        let downFlag = this.reportFormat
        let timeType = this.dateTypeRadio
        let pid = this.pid
        if(this.dateTypeRadio=='' && this.customTime=='' || this.reportFormat==''){
          this.$mAlert('时间和报告格式必选')
          return
        }
        let params = {
          pid:pid,
          timeType:timeType
        }
        createReport( params ).then( res => {
          if(res.code == '200' && res.data){
            this.reportId = res.data.uuid
          }
        })
        this.showCreateDialog = false
        this.showCreateSuccessDialog = true
        
      },
      cancelCreateReport() {
        this.showCreateDialog = false;
      },
      downloadBulletin() {
        this.showCreateSuccessDialog = false
        let timeType = this.dateTypeRadio
        let pid = this.pid
        let token = localStorage.iKnowsToken
        let downFlag = 1
        let planName = this.kpname
        let reportId = this.reportId
        //window.open(`/downloadReport?timeType=${timeType}&pid=${pid}&planName=${planName}`);
        window.open(`/downloadReport?timeType=${timeType}&pid=${pid}&planName=${planName}&reportId=${reportId}`);
      },
      bulletinCenter() {
        let timeType = this.dateTypeRadio
        let pid = this.pid
        let token = localStorage.iKnowsToken
        let downFlag = 1
        let reportId = this.reportId
        //window.open(`http://49.4.90.208:8095/iknows/report/download?timeType=${timeType}&pid=${pid}&token=${token}&downFlag=${downFlag}`);
        window.open(`http://49.4.90.208:8095/iknows/report/download?timeType=${timeType}&pid=${pid}&token=${token}&reportId=${reportId}&downFlag=${downFlag}`);
        this.showCreateSuccessDialog = false
      },
      backHome() {
        this.showCreateSuccessDialog = false
      },
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
      getResult(item) {
        this.$router.push("/center/monitorresults/" + item.id)
      },
      stopItem(item) {

        if(!this.hadStop){//监测方案 已经停止，点击停止按钮失效 Fixed by shibaiyong
          this.$mAlert('该监测方案已经停止，不能重复操作')
          return
        }

        this.$mConfirm('是否确认停止该方案监测', {
          confirmButtonText: '停止',
          cancelButtonText: '取消',
        }).then(() => {
          var _this = this
          var str = item.id
          var params = {id: str}
          stopPlan({params: params}).then(response => {
            _this.loadList()
          }).catch(error => {
            console.log(error);
          })
        })
      },
      updateConfig(item) {
        this.$router.push("/center/config/" + item.id)
      },
      builderDoc(item) {
        this.showCreateDialog = true;
        this.pid = item.id;
        this.kpname = item.kpName;
      },
      search() {
        if (this.showInputWarring) {
          return
        }
        this.loadList()
      },
      createCase() {
        this.$router.push("/center/config")
      },
      stopList() {
        var _this = this
        if (this.dataArr.length < 1) {
          this.$mAlert('你未选择需要停止的监测方案')
          return
        }
        this.$mConfirm('是否确认停止已选择的方案监测', {
          confirmButtonText: '停止',
          cancelButtonText: '取消',
        }).then(() => {
          var str = ""
          for (var i = 0; i < _this.dataArr.length; i++) {
            str = str + _this.dataArr[i] + ","
          }
          str = str.substr(0, str.length - 1);
          var params = {id: str}
          stopPlan({params: params}).then(response => {
            _this.loadList()
          }).catch(error => {
            console.log(error);
          })
        })
      },
      mouseover(item, index) {
        var list = item.buttonStyle;
        for (var i = 0; i < list.length; i++) {
          list[i] = false;
        }
        list[index] = true;
        this.$set(this.listData, "test", "1")
        this.$delete(this.listData, "test")
      },
      currentChange(index) {
        this.pageStart = index - 1
        this.loadList()
      },
      mouseout(item, index) {
        var list = item.buttonStyle;
        for (var i = 0; i < list.length; i++) {
          list[i] = false;
        }
        list[0] = true;
        this.$set(this.listData, "test", "1")
        this.$delete(this.listData, "test")
      },
      chooseStatue(parentItem, item) {
        if( item.name == '已停止') {//任务状态已停止时，不显示查询结果按钮 Fixed by shibaiyong 
          this.hadStop = false
        }else if(item.name == '运行中'){
          this.hadStop = true
        }

        if (item.isSelected) {
          return
        } else {
          var list = parentItem.items;
          for (var i = 0; i < list.length; i++) {
            list[i].isSelected = false;
          }
          item.isSelected = !item.isSelected
          this[parentItem.id] = item.id
          this.pageStart = 0;
          this.loadList()
        }
      },
      kpType(value) {// 判断监测方案的类型 Bug fixed by shibaiyong
        let flag = this.hadStop ? '运行中 ' : '已停止 '
        if ( value == '1' || value == '2' ){
          return  flag + '常规监测'
        }else if( value == '3' ){
          return flag + '人物监测'
        }else{
          return flag + '文稿监测'
        }
      }
    },
    
    mounted() {
      this.statusData = dataUtil.getStatusData()
      this.loadList()
      var app = document.getElementById("app");
      var thiz = this;
      app.addEventListener("scroll", function (e) {
        if (window.innerHeight - app.scrollTop < 0) {
          thiz.showGoTop = true
        } else {
          thiz.showGoTop = false
        }
      })
    }
  }
</script>

<style scoped>
  .monitor-center {
    background: white;
    padding-top: 30px;
    width: 100%;
    box-sizing: border-box;
    padding-left: 30px;
    padding-right: 30px;
  }

  .monitor-center .search-input-box {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    align-items: center;
  }

  .monitor-center .search-input-box span {
    margin-left: 20px;
    cursor: pointer;
  }

  .monitor-center .search-input-box i {
    width: 20px;
    margin-left: 20px;
    height: 20px;
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
  }

  .monitor-center .search-input-box input {
    border: #CDCDCD 1px solid;
    outline: none;
    border-radius: 10px;
    height: 38px;
    padding-left: 5px;
    width: 300px;
  }

  .monitor-center .text-button-navy {
    padding: 10px 16px;
    border-radius: 10px;
  }

  .monitor-center .mission-label {
    margin-top: 27px;
    margin-bottom: 8px;
  }

  .monitor-center .mission-label div {
    display: inline-block;
    margin-right: 20px;
  }

  .monitor-center .mission-label span {
    margin-right: 20px;
  }

  .monitor-center .mission-label-title {
    font-weight: bold;
  }

  .monitor-center .mission-label-status {
    padding: 5px 10px;
    border-radius: 12px;
    cursor: pointer;
  }

  .monitor-center .empty-button-box {
    margin-top: 30px;
    margin-bottom: 20px;
  }

  .monitor-center .empty-button-box span {
    cursor: pointer;
    padding: 7px 13px;
    border: #1D2088 2px solid;
    margin-right: 15px;
    border-radius: 10px;
  }

  .monitor-center .items-box {
    margin-top: 40px;
    font-size: 0px;
    /*margin-bottom: 20px;*/
  }

  .monitor-center .items-box .item {
    width: calc(50% - 15px);
    box-sizing: border-box;
    border: #0021C1 2px solid;
    display: inline-block;
    border-radius: 20px;
    margin-bottom: 20px;
  }

  .monitor-center .items-box .itemLeft {
    margin-left: 15px;
  }

  .monitor-center .items-box .itemRight {
    margin-right: 15px;
  }

  .monitor-center .items-box .item-title {
    margin-top: 30px;
    flex-direction: row;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 12.5%;
    margin-right: 12.5%;
  }

  .monitor-center .items-box .item-title .left-title {
    
    text-align: center;
    font-weight: bold;
  }

  .monitor-center .items-box .item-title .right-title {
    /* padding-right: 12.5%; */
    text-align: end;
  }

  .monitor-center .items-box .item-title .right-title span {
    font-weight: bold;
  }

  .monitor-center .items-box .table span {
    font-size: 14px;
  }

  .monitor-center .items-box .table-box {
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-left: 12.5%;
    margin-right: 12.5%;
    justify-content: space-between;
  }

  .monitor-center .items-box .table-box span {
    font-weight: bold;
    margin-top: 46px;
    display: inline-block;
    height: 34px;
    width: 116px;
    border: #1D2088 2px solid;
    border-radius: 10px;
    line-height: 34px;
    text-align: center;
    cursor: pointer;
    margin-bottom: 40px;
  }

  .monitor-center .items-box .table-box .selected {
    background: #1D2088;
    color: white;
  }

  .monitor-center .pagination {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;
    padding-bottom: 40px;
    padding-top: 20px;
  }

  .monitor-center .go-top {
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

  .monitor-center .go-top img {
    cursor: pointer;
    height: 20px;
    width: 20px;
  }

  .monitor-center .dialog-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  .monitor-center .dialog-content-box {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -150px;
    margin-left: -450px;
    width: 900px;
    height: 300px;
    background: white;
    border-radius: 20px;
  }

  .monitor-center .dialog-success-box {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -115px;
    margin-left: -300px;
    width: 600px;
    height: 210px;
    background: white;
    border-radius: 20px;
  }

  .monitor-center .dialog-title {
    font-weight: bold;
    margin-top: 30px;
    text-align: center;
  }

  .monitor-center .date-rang {
    margin-top: 40px;
    font-weight: bold;
    display: flex;
    flex-flow: row;
    align-items: center;
    padding-left: 60px;
    display: -webkit-box;
    justify-content: flex-start;
  }

  .monitor-center .date-rang span {
    font-weight: bold;
    margin-right: 20px;
  }

  .monitor-center .customTime-date {
    margin-left: 18px;
    width: 250px;
    height: 38px;
  }

  .monitor-center .customTime-date >>> .el-input__inner {
    width: 100% !important;
  }

  .monitor-center .dialog-button-box {
    padding-left: 280px;
    padding-right: 280px;
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .monitor-center .dialog-success-button-box {
    padding-left: 60px;
    padding-right: 60px;
    margin-top: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .monitor-center .no-data {
    text-align: center;
    height: 60px;
    line-height: 60px;
    color: #606266;
  }

  .monitor-center .dialog-button-box span {
    cursor: pointer;
    border: #1D2088 2px solid;
    display: inline-block;
    width: 120px;
    height: 38px;
    border-radius: 10px;
    font-weight: bold;
    line-height: 38px;
    text-align: center;
  }
</style>
