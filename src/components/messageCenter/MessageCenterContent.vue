<template>
  <div>
    <div class="message-center rzl_fc_darkgray" id="message-center-content">
      <div class="empty-button-box font14 rzl_fc_navy">
        <span @click="signAllRead">全部标记已读</span>
        <span @click="deleteList">批量删除</span>
      </div>
      <div class="message-list-box rzl_fc_darkgray">
        <div class="list-title font14 rzl_fc_darkgray">
          <span class="title-checkAll">
             <checkBox
               :allisselect="allisselect"
               :selectall="selectall"/>&nbsp; 全选</span>
          <span class="title-date">日期</span>
          <span class="title-type">类型</span>
          <span class="title-content">消息内容</span>
          <span class="title-status">状态</span>
          <span class="title-delete"> &nbsp;</span>
        </div>
        <div class="list-item font14 rzl_fc_darkgray" v-for="item in listData" v-if="listData.length">
          <div class="item-checkAll">
            <checkBox
              :label="item.id"
              :checklist="checklist"
              :all="checkAll"
            />
          </div>
          <span class="item-date"> {{getDate(item.publishTime)}}</span>
          <span class="item-type">{{item.type == 1?"系统消息":"预警消息"}}</span>
          <span class="item-content">{{item.content}}</span>
          <span class="item-status">{{item.state == 1?"已读":"未读  "}}</span>
          <div class="item-delete empty-button-box font14 rzl_fc_navy">
            <span @click="deleteItem(item)">删除</span>
          </div>
        </div>
        <div class="no-data" v-if="!listData.length">暂无相关数据</div>
      </div>
      <div class="pagination" v-if="listData.length">
        <Pagination :totalNum="total"
                    @currentChange="currentChange"
                    :pageSize=pageSize
                    ref="pagination"/>
      </div>
    </div>
  </div>
</template>

<script>
  import ITop from '@/components/common/Top'
  import IHeader from '@/components/common/Header'
  import IFooter from '@/components/common/Footer'
  import checkBox from '@/components/common/CheckBox'
  import dataUtil from '@/assets/js/dataUtlis'
  import Pagination from "@/components/common/Pagination"
  import { messagePageList, messageRead, messageDelete } from '@/assets/js/api.js'
  import iKnowsUtil from '@/assets/js/iknowsUtil'

  export default {
    name: "message-center-content",
    components: {ITop, IHeader, IFooter, dataUtil, checkBox, Pagination},
    props: ["parentHeight"],
    data() {
      return {
        searchTitle: "",
        checklist: [],
        checkAll: "",
        total: 0,
        page: 1,
        listData: [],
        showGoTop: false,
        pageSize: 10
      }
    },
    watch: {
      parentHeight() {
        var dom = document.getElementById("message-center-content")
        if (dom && this.parentHeight != 0 && this.parentHeight > dom.offsetHeight) {
          var a = this.parentHeight > 600 ? this.parentHeight : 600
          dom.style.minHeight = a + "px"
          console.log(a)
        }
      }
    },
    computed: {
      allisselect() {
        return this.checklist.length == this.listData.length
      }
    },
    methods: {
      // initHeight() {
      //   // var dom = document.getElementById("message-center-content")
      //   // if (dom && this.parentHeight != 0 && this.parentHeight > dom.offsetHeight) {
      //   //   dom.style.height = this.parentHeight+"px"
      //   // }
      // },
      getDate(time) {
        if (!time || time == null || time == "" || time == undefined) {
          return "未知时间"
        }
        return iKnowsUtil.dataFormat(new Date(time).getTime())
      },
      currentChange(page) {
        this.page = page;
        this.loadList()
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
      deleteItem(item) {
        this.$mConfirm('此操作将永久删除该条消息, 是否继续?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          var _this = this
          var params = new URLSearchParams();
          params.append('ids', item.id);
          messageDelete(params).then(response => {
            _this.loadList()
          }).catch(error => {
            console.log(error);
          })
        })
      },
      signAllRead() {
        var str = "";
        for (var i = 0; i < this.listData.length; i++) {
          if (this.listData[i].state == 0) {
            str = str + this.listData[i].id + ","
          }
        }
        if (str) {
          str = str.substr(0, str.length - 1);
        } else {
          this.$mAlert("没有未读消息")
          return
        }
        var params = new URLSearchParams();
        params.append('ids', str);
        var _this = this
        messageRead(params).then(response => {
          _this.loadList()
        }).catch(error => {
          console.log(error);
        })
      },
      deleteList() {
        var _this = this
        if (this.checklist.length < 1) {
          this.$mAlert('请至少勾选一条消息后再进行批量删除.')
          return
        }
        this.$mConfirm('此操作将永久删除已经勾选的消息, 是否继续?', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
        }).then(() => {
          var str = ""
          for (var i = 0; i < _this.checklist.length; i++) {
            str = str + _this.checklist + ","
          }
          str = str.substr(0, str.length - 1);
          var params = new URLSearchParams();
          params.append('ids', str);
          messageDelete(params).then(response => {
            _this.loadList()
          }).catch(error => {
            console.log(error);
          })
        })
      },
      selectall(params) {
        console.log(params);
        this.checkAll = params
      },
      loadList() {
        //重置复选框
        this.checkAll = "update"
        var data = {"pageNo": this.page}
        messagePageList({params: data}).then(response => {
          if (response && response.code == 200 && response.data.content.length > 0) {
            this.listData = response.data.content
            this.total = response.data.totalElements
          }
        }).catch(error => {
          console.log(error);
        })
      }
      
    },

    mounted() {
      // this.listData = dataUtil.getMessageCenterListData();
      this.loadList()
      //this.getLastMessage()
    }
  }
</script>

<style scoped>
  .message-center {
    background: white;
    width: 100%;
    box-sizing: border-box;
    padding: 34px 30px 1px;
  }

  .message-center .empty-button-box span {
    cursor: pointer;
    padding: 7px 13px;
    border: #1D2088 2px solid;
    margin-right: 15px;
    border-radius: 10px;
  }

  .message-center .message-list-box {
    width: 100%;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .message-center .list-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    background: #F5F5F5;
    height: 40px;
    line-height: 40px;
  }

  .message-center .list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 57px;
    line-height: 57px;
    text-align: center;
    border-bottom: #cdcdcd 1px solid;
  }

  .message-center .list-title .title-checkAll {
    text-align: right;
    flex: 1;
  }

  .message-center .no-data {
    text-align: center;
    height: 60px;
    line-height: 60px;
    color: #606266;
  }

  .message-center .list-title .title-date {
    flex: 3;
  }

  .message-center .list-title .title-type {
    flex: 3;
  }

  .message-center .list-title .title-content {
    text-align: left;
    flex: 5;
  }

  .message-center .list-title .title-status {
    flex: 2;
  }

  .message-center .list-title .title-delete {
    flex: 2;
  }

  .message-center .list-item .item-checkAll {
    flex: 1;
    text-align: right;
  }

  .message-center .list-item .item-date {
    flex: 3;
  }

  .message-center .list-item .item-type {
    flex: 3;
  }

  .message-center .list-item .item-content {
    text-align: left;
    flex: 5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .message-center .list-item .item-status {
    flex: 2;
  }

  .message-center .list-item .item-delete {
    flex: 2;
  }

  .message-center .list-title span {
    text-align: center;
    font-weight: bold;
  }

  .message-center .pagination {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;
    margin-bottom: 40px;
  }
</style>
