<template>
  <div>
    <div class="rzl_bc_white monitor-title">
      <p class="rzl-contarner font14">{{monitorName}}</p>
    </div>
    <!-- 内容区最外层容器均采用rzl-contarner样式 -->
    <div class="rzl-contarner rzl_bc_undercoat">
      <div class="warningList-content">
        <ITabConfig ></ITabConfig>
        <div class="index-content rzl_bc_white">
          <!--近期预警趋势图表-->
          <div class="index-warning-trend" >
            <div class="rzl_fc_darkgray font18 index-title">预警变化趋势</div>
            <div class="index-charts border-r" v-if="warningChangeDatas.length">
              <lineChart id="warningChange"
                         :data="warningChangeDatas"
                         axis="create_time"
                         :category="warningChangeCategory">
              </lineChart>
            </div>

          </div>
          <!--预警分类占比-->
          <div class="index-warning-trend">
            <div class="rzl_fc_darkgray font18 index-title">预警分类占比</div>
            <div class="index-charts" v-if="warningTypeDatas.length">
              <pieCharts id="warningType"
                         :data="warningTypeDatas"
                         label="type"
                         prop="type_num"></pieCharts>
            </div>
          </div>
        </div>
        <div class="warningTable rzl_bc_white">
          <warningTable id="warningTable"
                        :data="tableData"
                        :category="category"
                        :operations="operations"
                        :isSelect="false"
                        :showPageControl="true"
                        :total="100"
                        @refresh-data="refreshdata"
                        @click-table-cell="clickTableCell"
                        @operate-data="operateData"
          ></warningTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import ITabConfig from '@/components/common/TabConfig';
    import lineChart from '@/components/common/ZCChartsLine';
    import pieCharts from'@/components/common/ZCChartsPie';
    import warningTable from '@/components/common/ZCTable'
    export default {
        name: "WarningListContent",
        components: {ITabConfig,lineChart,pieCharts,warningTable},
        data() {
          return {
            warningChangeDatas:[],
            warningChangeCategory:[],
            warningTypeDatas:[],
            monitorName:'苏州民生网全网监测',
            tableData:[],
            category:[],
            operations:[],
            itemsStyle:[]
          }
        },
        methods:{
          // 预警变化趋势数据
          loadDatas_WarningChange() {
            let data=[{
              "create_time": "09/13",
              "weixin_num":20,
              "weibo_num":20,
              "web_num":50,
              "app_num":10,
              "paper_num": 35
            },{
              "create_time": "09/14",
              "weixin_num":20,
              "weibo_num":20,
              "web_num":50,
              "app_num":10,
              "paper_num": 15
            },{
              "create_time": "09/15",
              "weixin_num":10,
              "weibo_num":20,
              "web_num":5,
              "app_num":10,
              "paper_num": 15
            }];
            this.handleData_WarningChange(data)
            // let para = {};
            // getListPage(para).then((res) => {
            //   let response = JSON.parse(res.bodyText);
            //   this.intelliGenceTrendDatas = {categoryArr: [], valueArr: []};
            //   if (response.code == 200 && response.data) {
            //     this.handleData_TimeTrend(response.data)
            //   }
            // });
          },
          handleData_WarningChange(data) {
            this.warningChangeDatas = data;
            this.warningChangeCategory=[
              {prop: 'weixin_num', label: '微信'},
              {prop: 'weibo_num', label: '微博'},
              {prop: 'web_num', label: '网站'},
              {prop: 'app_num', label: 'APP'},
              {prop: 'paper_num', label: '数字报'},
            ]
          },
          //预警分类占比数据
          loadDatas_WarningType(){
            let data = [{
              "type_num": 40,
              "type": "重大-已处理"
            },{
              "type_num": 23,
              "type": "重大-未处理"
            },{
              "type_num": 30,
              "type": "轻微"
            },{
              "type_num": 35,
              "type": "一般"
            },{
              "type_num": 20,
              "type": "正常"
            }]
            this.handleData_WarningType(data);
          },
          handleData_WarningType(data){
            this.warningTypeDatas = data;
          },
          //预警表格数据
          loadDatas_WarningTable(){
            let data = {
              number: 1,
              totalPages: 422,
              totalElements: 4219,
              elementsNo: 0,
              limit: 10,
              content: [
                {
                    id:'01',
                    level:'重大',
                    title:'美国制裁上瘾新兴市场扛得住吗?这个国家左右为难',
                    time:'2018/08/21 12:23',
                    type:'已读',
                    longTime:'10分钟',
                    source:'人民网'
                },
                {
                  id:'02',
                  level:'正常',
                  title:'美国制裁上瘾新兴市场扛得住吗?这个国家左右为难',
                  time:'2018/08/21 12:23',
                  type:'未读',
                  longTime:'10分钟',
                  source:'人民网'
                },
                {
                  id:'03',
                  level:'重大',
                  title:'美国制裁上瘾新兴市场扛得住吗?这个国家左右为难',
                  time:'2018/08/21 12:23',
                  type:'未读',
                  longTime:'10分钟',
                  source:'人民网'
                },
                {
                  id:'04',
                  level:'轻微',
                  title:'美国制裁上瘾新兴市场扛得住吗?这个国家左右为难',
                  time:'2018/08/21 12:23',
                  type:'未读',
                  longTime:'10分钟',
                  source:'人民网'
                },
                {
                  id:'05',
                  level:'较大',
                  title:'美国制裁上瘾新兴市场扛得住吗?这个国家左右为难',
                  time:'2018/08/21 12:23',
                  type:'已读',
                  longTime:'10分钟',
                  source:'人民网'
                },
                {
                  id:'06',
                  level:'重大',
                  title:'美国制裁上瘾新兴市场扛得住吗?这个国家左右为难',
                  time:'2018/08/21 12:23',
                  type:'未读',
                  longTime:'10分钟',
                  source:'人民网'
                },
                {
                  id:'07',
                  level:'一般',
                  title:'美国制裁上瘾新兴市场扛得住吗?这个国家左右为难',
                  time:'2018/08/21 12:23',
                  type:'未读',
                  longTime:'10分钟',
                  source:'人民网'
                }
              ]
            };
            this.handleData_WarningTable(data);
          },
          handleData_WarningTable(data){
            let thiz = this;
            setTimeout(function () {
              thiz.tableData = data.content;
              thiz.tableData.forEach((value, index) => {
                if (value.level == '重大') {
                  let obj = {
                    index:index,
                    style:{color:"#ff0000"}
                  }
                  thiz.itemsStyle.push(obj)
                }
              })
              thiz.category = [
                {
                  prop: 'level',
                  label: '预警等级',
                  itemsStyle:thiz.itemsStyle
                },
                {prop:'title',label:'文章标题',showHover:true},
                {prop:'type',label:'状态'},
                {prop:'time',label:'发布时间'},
                {prop:'longTime',label:'响应时间'},
                {prop:'source',label:'文章来源'},
              ];
              thiz.operations = ['查看'];
            }, 1000);


          },
          // 当前页码
          refreshdata(val) {
            alert(val);
          },
          // 点击跳转详情
          clickTableCell(rowIndex) {
            let thiz = this;
            thiz.tableData.forEach(function (value,index) {
              if (rowIndex == index) {
                console.log(value.id);
              }
            })
          },
          // 查看按钮
          operateData(index){
            alert(index)
          },

        },
        mounted(){
            this.loadDatas_WarningChange();
            this.loadDatas_WarningType();
            this.loadDatas_WarningTable();
        }
    }

</script>

<style scoped>
  .monitor-title{
    height:30px ;
    line-height: 30px;
    box-shadow: 0 1px 4px 0 #CDCDCD;
    margin-bottom: 4px;
  }
  .warningList-content{
    padding-top: 16px;
    width: 100%;
    height: 100%;
  }
  .index-content{
    width: 100%;
    height: 500px;
    display: -webkit-flex;
    display: flex;
  }
  .index-warning-trend{
    -webkit-flex: 1;
    flex: 1;
    margin-bottom: 30px;
  }
  .index-charts{
    height:430px ;
    border-bottom:2px solid #E5E5E5;
  }
  .border-r{
    border-right:2px solid #E5E5E5;
  }
  .index-title{
    padding: 30px 0 0 30px;
    font-weight: 600;
  }
  .warningTable{
    padding:30px;
  }
</style>
