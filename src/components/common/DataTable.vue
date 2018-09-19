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
                <tr v-for='item in data'>
                    
                    <td><CheckBox :label="item.id" :dataArr="dataArr" :all="checkAll"/></td>
                    <td>{{ item.time }}</td>
                    <td>{{ item.type }}</td>
                    <td class="textleft" :style="{'padding-left':'50px'}">{{ item.taskName }}</td>
                    <td class="textleft">{{ item.reportName }}</td>
                    <td><button @click="transformData(item.id)" class="btn btn6030">查看</button><button class="btn btn6030">删除</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import axios from "axios";
    import CheckBox from "@/components/common/CheckBox"
    
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
            
        },
        updated(){
            // console.log(this.dataArr);
        },
        methods:{
            
            isTotal(total){//全选框对外触发的方法。复选框全部被选中。
                this.checkAll = total;
            }

        },
        mounted(){

        },
        computed:{
            hasTotal(){//当各个复选框被选中时,全选框也被选中
                return this.dataArr.length == this.data.length
            }
        },
        components:{
            CheckBox
        }
    }

</script>
<style scoped>
    /* 表格固定布局 */
    .inews-table{
        width:100%;
        table-layout:fixed; word-break: break-all; word-wrap: break-word;
        font-size: 14px;
        color: #555555;
    }
    /* 按钮的公共样式 */
    .btn6030{
        width:60px;
        height:30px;
        margin:11px;
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