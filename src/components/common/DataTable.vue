<template>
    <div class="dataTables">

        <table class="inews-table">
            <thead>
                <tr>
                    <th :style="{'width':'174px'}"><CheckBox :totalSelect="isTotal" :allSelect="hasTotal"/><span class="allcheck">全选</span></th>

                    <th :style="{'width':'233px'}">报告生成时间</th>
                    <th :style="{'width':'172px'}">方案类型</th>
                    <th class="textleft" :style="{'width':'212px','padding-left':'50px'}">监控任务名称</th>
                    <th class="textleft" :style="{'width':'541px'}">报告名称</th>
                    <th :style="{'width':'262px'}"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='item in data' :key="item.reportId">

                    <td><CheckBox :label="item.reportId" :dataArr="dataArr" :all="checkAll"/></td>
                    <td>{{ item.reportTime }}</td>
                    <td>{{ item.planType | formatType }}</td>
                    <td class="textleft" :style="{'padding-left':'50px'}">{{ item.planName }}</td>
                    <td class="textleft">{{ item.reportName }}</td>
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
    import { deleteAllBulletinList, eventBus, downloadBulletinList } from "@/assets/js/api.js"
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
                let timeType = item.reportType
                let planName = item.planName
                let reportId = item.reportId
                let pid = item.pid
                if(timeType >= 5){
                 timeType = timeType - 5;
                }
                //window.open(`/downloadReport?timeType=${timeType}&pid=${pid}&planName=${planName}`);
                window.open(`/downloadReport?timeType=${timeType}&pid=${pid}&planName=${planName}&reportId=${reportId}`);
            },
            download(item){
                let timeType = item.reportType
                let token = localStorage.iKnowsToken
                let downFlag = 1
                let reportId = item.reportId
                let pid = item.pid
                if(timeType >= 5){
                  timeType = timeType - 5;
                }
                //window.open(`http://49.4.90.208:8095/iknows/report/download?timeType=${timeType}&pid=${item.pid}&token=${token}&downFlag=1`);
                window.open(`http://49.4.90.208:8095/iknows/report/download?timeType=${timeType}&pid=${pid}&token=${token}&reportId=${reportId}&downFlag=1`);
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
                }else{
                    return '文稿监测'
                }
            }
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
        width:22%;
        height:30px;
        margin:4%;
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

  .allcheck{
      display:inline-block;
      margin-left:30px;
      position:relative;
      right: 24px;
      vertical-align: middle;
      font-weight: bold;
  }
</style>
