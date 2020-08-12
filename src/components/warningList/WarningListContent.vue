<template>
  <div>
    <!-- 内容区最外层容器均采用rzl-contarner样式 -->
    <div class="">
      <div class="warningList-content rzl_bc_white">
        <div class="index-content rzl_bc_white">
          <!--近期预警趋势图表-->
          <div class="index-warning-trend" >
            <div class="rzl_fc_darkgray font18 index-title">预警变化趋势</div>
            <div class="index-charts border-r" v-if="warningChangeDatas">
              <lineChart id="warningChange"
                         :data="warningChangeDatas"
                         axis="create_time"
                         :category="warningChangeCategory">
              </lineChart>
            </div>
            <div v-else class="noData">暂无相关数据</div>
          </div>
          <!--预警分类占比-->
          <div class="index-warning-trend">
            <div class="rzl_fc_darkgray font18 index-title">预警分类占比</div>
            <div class="index-charts" v-if="warningTypeDatas">
              <pieCharts id="warningType"
                         :data="warningTypeDatas"
                         label="levelLabel"
                         prop="count"></pieCharts>
            </div>
            <div v-else class="noData">没有更多数据</div>
          </div>
        </div>
        <!--<button class="rzl_bc_white btn allRead font14" @click="allRead()">全部标记为已读</button>-->
        <div class="warningTable rzl_bc_white" >
          <warningTable id="warningTable"
                        :data="tableData"
                        :category="category"
                        :operations="operations"
                        :showPageControl="true"
                        :total="this.totalPages"
                        @refresh-data="refreshdata"
                        @click-table-cell="clickTableCell"
                        @operate-data="operateData"
          ></warningTable>
        </div>
      </div>
      <div class="blank_1"></div>
    </div>
  </div>
</template>

<script>
    import { getWarnList ,getWarnLevel,getWarnChange} from '@/assets/js/api';
    import lineChart from '@/components/common/ZCChartsLine';
    import pieCharts from'@/components/common/ZCChartsPie';
    import warningTable from '@/components/common/ZCTable';
    import iKnowsUtil from '@/assets/js/iknowsUtil';
    export default {
        name: "WarningListContent",
        components: {lineChart,pieCharts,warningTable},
        data() {
          return {
            warningChangeDatas:[],
            warningChangeCategory:[],
            warningTypeDatas:[],
            tableData:[],
            category:[
              {prop: 'level', label: '预警等级', width: 180},
              {prop:'title',label:'文章标题',showHover:true,},
              {prop:'time',label:'发布时间', width: 200},
              {prop:'source',label:'文章来源', width: 200}],
            operations:[],
            itemsStyle:[],
            isRead:[],
            page:1,
            totalPages:0
          }
        },
        methods:{
          // 预警变化趋势数据
          loadDatas_WarningChange() {
            let params = {};
            params = {
              planId:this.$route.params.id,
            };
            let _this = this;
            getWarnChange(params).then(response => {
              if (response.code == 200) {
                _this.handleData_WarningChange(response.data)
              }else {
                this.$message.error(response.message);
              }
            }).catch(error => {
              console.log(error);
            })
          },
          handleData_WarningChange(data) {
            this.warningChangeDatas = data;
            this.warningChangeCategory=[
              {prop: 'website', label: '网媒'},
              {prop: 'weixin', label: '微信'},
              {prop: 'weibo', label: '微博'},
              {prop: 'app', label: 'APP'},
            ]
          },
          //预警分类占比数据
          loadDatas_WarningType(){
            let params = {};
            params = {
              planId:this.$route.params.id,
            };
            let _this = this;
            getWarnLevel(params).then(response => {
              if (response.code == 200) {
                _this.handleData_WarningType(response.data)
              }else {
                this.$message.error(response.message);
              }
            }).catch(error => {
              console.log(error);
            })
          },
          handleData_WarningType(data){
            this.warningTypeDatas = data;
          },
          //预警表格数据
          loadDatas_WarningTable(){
            let params = {};
            params = {
              pageNo:this.page,
              planId:this.$route.params.id,
            };
            let _this = this;
            getWarnList(params).then(response => {
              if (response.code == 200) {
                _this.handleData_WarningTable(response.data)
              }else {
                this.$message.error(response.message);
              }
            }).catch(error => {
              console.log(error);
            })
          },
          handleData_WarningTable(data){
            let thiz = this;
            setTimeout(function () {
              thiz.page= data.number;
              thiz.totalPages=data.totalElements;
              thiz.tableData = data.content;
              if (thiz.tableData != null) {
                thiz.tableData.forEach((value, index) => {
                  if(value.source == ''){
                    value.source = '-'
                  }
                  // let publishTime = new Date(value.publishTime).getTime();
                  let time =iKnowsUtil.dataFormat(value.publishTime);
                  value.time = time;
                  if (value.level == 4) {
                    value.level = '重大'
                    let obj = {
                      index:index,
                      style:{color:"#ff0000"}
                    }
                    thiz.itemsStyle.push(obj)
                  }else if(value.level == 3){
                    value.level = '较大'
                  }else if(value.level == 2){
                    value.level = '轻微'
                  }else if(value.level == 1){
                    value.level = '一般'
                  };
                  if(value.readStatus == 0){
                    value.readStatus = '未读'
                  }else if(value.readStatus == 1){
                    value.readStatus = '已读'
                  }
                })
              }else {
                thiz.tableData=[];
              }
              thiz.category = [
                {
                  prop: 'level',
                  label: '预警等级',
                  width: 180,
                  itemsStyle:thiz.itemsStyle
                },
                {
                  prop:'title',
                  label:'文章标题',
                  showHover:true,
                  style: {textAlign: 'left'},
                  headerStyle: {textAlign: 'left'}},
                {
                  prop:'time',
                  label:'发布时间',
                  width: 200,
                },
                {
                  prop:'source',
                  label:'文章来源',
                  width: 200,
                  style: {textAlign: 'left'},
                  headerStyle: {textAlign: 'left'}
                  },
              ];
              thiz.operations = ['查看'];
            }, 1000);


          },
          // 当前页码
          refreshdata(val) {
            this.page=val;
            this.loadDatas_WarningTable();
          },
          // 点击跳转详情
          clickTableCell(rowIndex) {
            let thiz = this;
            let pid = thiz.$route.params.id;
            thiz.tableData.forEach(function (value,index) {
              if (rowIndex == index) {
                let id =  value.webpageCode;
                let time = value.publishTime;

                let releaseDatetime= new Date(time).getTime();
                let userName = thiz.$iknowsUtil.getUserName();
                window.open('/details/'+userName+'?webpageCode='+id+'&releaseDatetime='+ releaseDatetime+'&planId='+pid );
              }
            })
          },
          // 查看按钮
          operateData(rowIndex,index){
            let thiz = this;
            let pid = thiz.$route.params.id;
            thiz.tableData.forEach(function (value,index) {
              if (rowIndex == index) {
                let id =  value.webpageCode;
                let time = value.publishTime;
                let time1 = value.time;
                let releaseDatetime= new Date(time).getTime();
                let userName = thiz.$iknowsUtil.getUserName();
                window.open('/details/'+userName+'?webpageCode='+id+'&releaseDatetime='+ releaseDatetime +'&planId='+pid);
              }
            })
          },
          // //全选
          // allisselect(rowIndex){
          //   this.isRead = rowIndex;
          // },
          // //全部标记为已读
          // allRead(){
          //   let readArr=[];
          //   let thiz = this;
          //   thiz.tableData.forEach(function (value,index) {
          //     thiz.isRead.forEach(function (v,i) {
          //       if (v == index) {
          //         readArr.push(value.id);
          //       }
          //     })
          //   })
          //   console.log(readArr);
          //   let params = new URLSearchParams();
          //   params = {
          //     ids:readArr.join()
          //   };
          //   let _this = this;
          //   warnListRead(params).then(response => {
          //     if (response.code == 200) {
          //       _this.loadDatas_WarningTable();
          //     }else {
          //       _this.$message.error(response.message);
          //     }
          //   }).catch(error => {
          //     console.log(error);
          //   })
          // }

        },
        mounted(){
            this.loadDatas_WarningChange();
            this.loadDatas_WarningType();
            this.loadDatas_WarningTable();
        }
    }

</script>

<style scoped>
  .blank_1{
    height: 30px;
  }
  .monitor-title{
    height:30px ;
    line-height: 30px;
    box-shadow: 0 1px 4px 0 #CDCDCD;
    margin-bottom: 4px;
  }
  .warningList-content{
    width: 100%;
    height: 100%;
  }
  .index-content{
    width: 100%;
    display: -webkit-flex;
    display: flex;
    padding: 0 30px;
    box-sizing: border-box;
  }
  .index-warning-trend{
    -webkit-flex: 1;
    flex: 1;
    margin-bottom: 22px;
  }
  .index-charts{
    height:440px ;
    border-bottom:2px solid #E5E5E5;
    padding-bottom: 10px;
  }
  .border-r{
    border-right:2px solid #E5E5E5;
  }
  .index-title{
    padding: 30px 0 0 30px;
    font-weight: 600;
  }
  .warningTable{
    padding:20px 30px;
  }
  .allRead{
    height: 35px;
    line-height: 30px;
    padding: 0 12px;
    /*width: 120px;*/
    margin: 5px 0;
    font-weight: bold;
    cursor: pointer;
    margin-left: 30px;
  }
  .noData{
    height: 450px;
    line-height: 450px;
    text-align: center;
    border-bottom: 2px solid #E5E5E5;
    font-size: 14px;
  }
</style>
