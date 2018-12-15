<template>
<div class="container" ref='documentHeight'>
  <div class="top-header" ref='topHeight'>
    <iTop/>
    <iHeader  :navIndex=4></iHeader>
  </div>
  <div id="pageCenter" class="rzl-contarner" ref='middleHeight'>
    <div class="pagecontainer" ref='pagecontainer'>
      <div><button class="btn btn8030" @click="handleAlldelete">批量删除</button></div>
      <iDataTable :data="tableData" :transformData="handleUserOperate"></iDataTable>
      <div class="paginationContainer" :style="{'visibility':hidden}"><Pagination :totalNum="total" @currentChange="getBulletinList"></Pagination></div>
    </div>
  </div>
  <div class="footercontainer" ref='bottomHeight'>
    <iFooter/>
  </div>
</div>
</template>

<script>

  import iDataTable from "@/components/common/DataTable"
  import Pagination from "@/components/common/Pagination"
  import iHeader from "@/components/common/Header"
  import iFooter from "@/components/common/Footer"
  import iTop from '@/components/common/Top'
  import { deleteBulletinList, viewBulletinList, getBulletinList, eventBus } from '@/assets/js/api.js'

  export default {
    name: "BulletinCenter",
    data() {
      return {
        tableData:[],
        total:100,
        defaultPageIndex:1,
        pageSize:10,
        contentHeight:814
      }
    },
    updated(){
    },
    created() {
      eventBus.$on('getBulletinList',params => {
        this.getBulletinList();
      })
    },
    methods: {
      handleUserOperate( params, ids ){
        if( params == 'view'){
          viewBulletinList({ reportId:ids }).then( res => {
            console.log(res)
          })
        }else if( params == 'delete'){
          let arr = [];
          arr.push( ids.reportId )
          let reportIds = {
            reportIds : arr
          }
          this.$mConfirm('是否确认删除该方案监测, 是否继续? ', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            var _this = this
            deleteBulletinList( reportIds ).then( res => {
              if(res.code == '200'){
                //删除成功后重新更新列表
                _this.getBulletinList();
              }
            }, () => {})
          })

        }
      },

      handleAlldelete(){
        eventBus.$emit('deleteAllBulletinList')

      },

      getBulletinList(pageIndex){
        var pageIndex = pageIndex || this.defaultPageIndex;
        var params = {
          pageNo:pageIndex,
          pageSize:this.pageSize
        }
        getBulletinList( params ).then( res => {

          if(res.data && res.code == '200'){
            //设置分页组件的总条数
            this.total = res.data.totalElements;
            //设置列表显示的数据
            this.tableData = res.data.content ? res.data.content : [];
          }

        })
      },

      ajustHeight(){
        // let topHeight = this.$refs.topHeight.offsetHeight
        // let bottomHeight = this.$refs.bottomHeight.offsetHeight
        // let documentHeight = this.$refs.documentHeight.offsetHeight
        // let pagecontainerHeight = this.$refs.pagecontainer.offsetHeight

        // let middleHeight = documentHeight - topHeight - bottomHeight
        // middleHeight = middleHeight < 600 ? 520 : middleHeight;
        // this.$refs.pagecontainer.style.height = pagecontainerHeight > middleHeight ? pagecontainerHeight + 'px' : middleHeight + 80 + 'px'
      }
    },
    mounted(){
      this.getBulletinList();
    },
    computed:{
      hidden(){
        let len = this.pageSize
        if( len >= this.total){
          return 'hidden'
        }else{
          return ''
        }
      }
    },
    components:{
      iDataTable,
      Pagination,
      iHeader,
      iFooter,
      iTop
    }
  }
</script>

<style scoped>
  .container{
    height: 100%;
  }
  .pagecontainer{
    background:white;
    padding:30px 30px 40px;
    box-sizing: border-box;
    min-height: 630px;
  }
  .rzl-contarner{
    margin:0 auto;
    background:#F5F5F6;
    box-sizing: border-box;
  }
  .btn8030{
    width:80px;
    height:30px;
    margin-bottom:34px;
  }
  .paginationContainer{
    text-align: right;
    margin-top:15px;
  }
  .footercontainer{
    width:100%;
    /* position:absolute;
    bottom:0;
    left:0; */
  }
</style>
