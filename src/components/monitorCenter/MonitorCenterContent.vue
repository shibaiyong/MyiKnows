<template>
  <div>
    <div class=" top-label ">
      <div class="rzl-contarner font14 rzl_fc_darkgray">
        监测中心 > {{ moniterTitle }}
      </div>
    </div>
    <div class="rzl_fc_darkgray rzl-contarner">
      <div class="monitor-center " id="monitor-center-content">
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
                <checkBox :label="item.id" :checklist="checklist" :all="checkAll" v-show="hadStop"/>
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
              <el-radio v-model="dateTypeRadio" label="2" @change="changeDateType()">30天</el-radio>
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
  </div>

</template>

<script>
  // 公共组件引入统一采用I开头
  import checkBox from '@/components/common/CheckBox';
  import dataUtil from '@/assets/js/dataUtlis'
  import Pagination from '@/components/common/Pagination'
  import {getPlanList, url} from '@/assets/js/api.js';
  import {stopPlan, downloadBulletinList, createReport, qryReportSummary} from '../../assets/js/api.js';
  const typeObj = {
    general: 1,
    person: 2,
    article: 3,
    event: 4,
  };
  export default {
    name: "monitor-center",
    components: { dataUtil, checkBox, Pagination},
    props: {
      // parentHeight: {
      //   type: Number,
      //   require: true,
      //   default () {
      //     return 0;
      //   }
      // },
      type: {
        type: String,
        require: true,
        default () {
          return '';
        }
      },
    },
    watch: {
      type(newVal,oldVal){
        this.type = newVal;
        this.loadList();
      },
      querystr() {
        if (this.querystr && this.querystr.length > 20) {
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
      },
      $route: {
        handler: function(){
          this.querystr =''
          //this.type = this.$route.params.type;
        },
        // 深度观察监听
        deep: true
      },
    },
    data() {
      return {
        parentHeight: 0,
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
        checklist: [],
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
        reportId:'',
        moniterTitle:''
      }
    },
    methods: {
      loadList() {
        var _this = this;
        this.planType =  [typeObj[_this.type]];
        if (this.planType == 1){
          this.moniterTitle = '常规监测'
        } else if (this.planType == 2){
          this.moniterTitle = '人物监测'
        } else if (this.planType == 3){
          this.moniterTitle = '文稿监测'
        }else if (this.planType == 4){
          this.moniterTitle = '事件监测'
        }
        if(!typeObj[_this.type]){
          return;
        }
        var params = {
          pageStart: this.pageStart,
          pageSize: 10,
          planType: [typeObj[_this.type]],
          status: this.status,
          querystr:this.querystr
        }
        this.$nextTick(()=>{
        params.querystr = this.querystr
        params = JSON.stringify(params); 
        })   
               
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
            this.reportId = res.data.uuid;
            this.showCreateSuccessDialog = true;
          }
          else{
            this.$message.error(res.message);
          }
        })
        this.showCreateDialog = false
      },
      cancelCreateReport() {
        this.showCreateDialog = false;
      },
      downloadBulletin() {
        this.showCreateSuccessDialog = false
        let timeType = this.dateTypeRadio
        let pid = this.pid;
        let userName = this.$iknowsUtil.getUserName();
        let token = localStorage.getItem('iKnows'+userName+'Token');
        let downFlag = 1
        let planName = this.kpname
        let reportId = this.reportId
        //window.open(`/downloadReport?timeType=${timeType}&pid=${pid}&planName=${planName}`);
        window.open(`/downloadReport/`+userName+`?timeType=${timeType}&pid=${pid}&planName=${planName}&reportId=${reportId}`);
      },
      bulletinCenter() {
        let timeType = this.dateTypeRadio
        let pid = this.pid
        let userName = this.$iknowsUtil.getUserName();
        let token = localStorage.getItem('iKnows'+userName+'Token');
        let downFlag = 1
        let reportId = this.reportId
        //window.open(`http://49.4.90.208:8095/iknows/report/download?timeType=${timeType}&pid=${pid}&token=${token}&downFlag=${downFlag}`);
        let baseUrl = url;
        window.open(`${baseUrl}/report/download?timeType=${timeType}&pid=${pid}&token=${token}&reportId=${reportId}&downFlag=${downFlag}`);
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
        let userName = this.$iknowsUtil.getUserName();
        //事件监测默认跳转到事件分析
        if(item.kpType && parseInt(item.kpType) > 4){
          this.$router.push("/event/eventanalysis/" + item.id+'/'+userName)
        }else{
          this.$router.push("/center/monitorresults/" + item.id+'/'+userName)
        }

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
        let type = this.$route.params.type;
        let userName = this.$iknowsUtil.getUserName();
        if(type == 'event'){
          this.$router.push("/event/config/" + item.id+"/"+userName);
        }else{
          this.$router.push("/center/config/" + item.id+"/"+userName);
        }
      },
      builderDoc(item) {
        this.showCreateDialog = true;
        this.pid = item.id;
        this.kpname = item.kpName;
      },
      search() {
        if (this.querystr.length > 20) {
          this.showInputWarring = true
          return
        } else {
          this.showInputWarring = false
        }
       
        this.loadList()
      },
      createCase() {
        let userName = this.$iknowsUtil.getUserName();
        let type = this.type;
        this.$router.push("/center/config/"+type+'/'+userName);
      },
      stopList() {
        var _this = this
        if (this.checklist.length < 1) {
          this.$mAlert('你未选择需要停止的监测方案')
          return
        }
        this.$mConfirm('是否确认停止已选择的方案监测', {
          confirmButtonText: '停止',
          cancelButtonText: '取消',
        }).then(() => {
          var str = ""
          for (var i = 0; i < _this.checklist.length; i++) {
            str = str + _this.checklist[i] + ","
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
        }else  if( value == '4' ){
          return flag + '文稿监测'
        }else  if( value == '5' || value == '6'){
          return flag + '事件监测'
        }
      }
    },

    mounted() {
      this.parentHeight = document.getElementById("monitorContentBox").offsetHeight;
      this.statusData = dataUtil.getStatusData()
      this.querystr ='';
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
    /* height: 60px; */
    line-height: 60px;
    color: #606266;
    min-height: calc(100% -348px);
  }
  @media screen and (min-width:1440px) and (max-width:3840px){
    .monitor-center {
      min-height: 630px;
    }
  }
  @media screen and (max-width:1440px){
    .monitor-center .no-data {
      min-height: 400px;
    }
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
  .top-label{
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #FFFFFF;
    box-shadow: 0 1px 4px 0 #CDCDCD;
    margin-bottom: 20px;
  }
</style>
