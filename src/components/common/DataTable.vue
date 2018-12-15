<template>
    <div class="dataTables">

        <table class="inews-table">
            <thead>
                <tr>
                    <th :style="{'width':'72px'}"><span :style="{'width':'72px'}"><CheckBox :totalSelect="isTotal" :allSelect="hasTotal"/><i class="allcheck">全选</i></span></th>
                    <th :style="{'width':'270px'}">报告生成时间</th>
                    <th :style="{'width':'150px'}">方案类型</th>
                    <th :style="{'width':'150px'}">报告类型</th>
                    <th class="textleft" :style="{'width':'200px','padding-left':'30px'}">监控任务名称</th>
                    <th class="textleft" :style="{'width':'350px'}">报告名称</th>
                    <th :style="{'width':'262px'}"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='item in data' :key="item.reportId">

                    <td><span><CheckBox :label="item.reportId" :dataArr="dataArr" :all="checkAll" /></span></td>
                    <td>{{ item.reportTime }}</td>
                    <td>{{ item.planType | formatType }}</td>
                    <td>{{ item.reportTypeName }}</td>
                    <td class="textleft" :style="{'padding-left':'30px'}"><span class="planname" :title="item.planName">{{ item.planName }}</span></td>
                    <td class="textleft"><span class="planname reportName" :title="item.reportName">{{ item.reportName }}</span></td>
                    <td>
                        <button @click="toReportView(item)" class="btn btn6030 font12">查看</button>
                        <button @click="download(item)" class="btn btn6030 font12">下载</button>
                        <button @click="transformData('delete', item)" class="btn btn6030 font12">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import axios from "axios";
    import CheckBox from "@/components/common/CheckBox"
    import { deleteAllBulletinList, eventBus, downloadBulletinList, url } from "@/assets/js/api.js"
    export default {
        name:'dataTables',
        props:['data','transformData'],
        data(){
            return {
                tabledata:[],
                right:true,
                id:'',
                checkAll:'',
                dataArr:[]
            }
        },
        created(){
            eventBus.$on('deleteAllBulletinList', params => {
                this.deleteAllBulletinList();
            })
        },
        updated(){

        },
        methods:{
            toReportView (item) {
                let timeType = item.reportType;
                let planName = item.planName;
                let reportId = item.reportId;
                let pid = item.pid;
                // if(timeType >= 5){
                //  timeType = timeType - 5;
                // }
                //window.open(`/downloadReport?timeType=${timeType}&pid=${pid}&planName=${planName}`);
                let userName = this.$iknowsUtil.getUserName();
                let planType = item.planType;
                if (planType >= 5){
                  window.open(`/eventReport/`+userName+`?timeType=${timeType}&pid=${pid}&planName=${planName}&reportId=${reportId}`);
                } else {
                  window.open(`/downloadReport/`+userName+`?timeType=${timeType}&pid=${pid}&planName=${planName}&reportId=${reportId}`);
                }

            },
            download(item){
                let timeType = item.reportType;
                let userName = this.$iknowsUtil.getUserName();
                let token = localStorage.getItem('iKnows'+userName+'Token');
                let downFlag = 1
                let reportId = item.reportId
                let pid = item.pid
                if(timeType >= 5){
                  timeType = timeType - 5;
                }
                let baseUrl = url;
                //window.open(`http://49.4.90.208:8095/iknows/report/download?timeType=${timeType}&pid=${item.pid}&token=${token}&downFlag=1`);
                window.open(`${baseUrl}/report/download?timeType=${timeType}&pid=${pid}&token=${token}&reportId=${reportId}&downFlag=1`);
            },
            isTotal(total){//全选框对外触发的方法。复选框全部被选中。
                this.checkAll = total;
            },
            //批量删除简报中心的数据
            deleteAllBulletinList(){
                if(this.dataArr.length == 0){
                    this.$mAlert('你未选择需要删除的监测方案.')
                    return false
                }
                this.$mConfirm('是否确认删除已选择的方案监测, 是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    var _this = this
                    deleteAllBulletinList( { reportIds:this.dataArr } ).then( res => {
                    if(res.code == '200'){
                        this.isTotal()
                        //删除成功后重新更新列表
                        eventBus.$emit('getBulletinList');
                    }
                    }, () => {})
                })
            }

        },
        mounted(){

        },
        computed:{
            hasTotal(){//当各个复选框被选中时,全选框也被选中
                return this.dataArr.length == this.data.length
            }
        },
        filters:{
            formatType( value ){
                if ( value == '1' || value == '2' ){
                    return '常规监测'
                }else if( value == '3' ){
                    return '人物监测'
                }else if( value == '4' ){
                    return '文稿监测'
                }else if( value == '5' || value == '6'){
                    return '事件监测'
                }
            },
            // formatPlanName( value ){
            //   if ( value == '1' ){
            //     return '日报'
            //   }else if( value == '2' ){
            //     return '周报'
            //   }else if( value == '3' ){
            //     return '月报'
            //   }else if( value == '4' ){
            //     return '季报'
            //   }else if( value == '5' ){
            //     return '事件'
            //   }else if( value == '6' ){
            //     return '自定义'
            //   }
            // }
        },
        components:{
            CheckBox
        }
    }

</script>
<style scoped>
    .dataTables{
        width:100%;
    }
    /* 表格固定布局 */
    .inews-table{
        width:100%;
        word-break: break-all; word-wrap: break-word;
        font-size: 14px;
        color: #555555;
    }
    /* 按钮的公共样式 */
    .btn6030{
      /*width:24%; */
      height:30px;
      margin:4% 2%;
        /* font-size: 0.8%; */
    }



    .inews-table .textleft{
        text-align: left;
    }
    .inews-table td,.inews-table th{
        text-align: center;
        border:none;
        vertical-align: middle;
    }
    .inews-table th{
        height: 40px;
        font-weight: bold;
        background: #F5F5F5;
    }
    .inews-table th span{
        display: inline-block;
    }
    .inews-table tr{
        border-top:1px solid #ccc;
    }
    .inews-table tr:last-child{
        border-bottom:1px solid #ccc;
    }
    .inews-table tr td{
        height:58px;
    }
    .inews-table tr td span{
     display: block;
    }
  .allcheck{
      display:inline-block;
      margin-left:24px;
      position:relative;
      right: 16px;
      vertical-align: middle;
      font-weight: bold;
  }
  .planname{
    width: 170px;
    height: 58px;
    line-height: 58px;
    display: block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .reportName{
    width: 280px;
  }
</style>
