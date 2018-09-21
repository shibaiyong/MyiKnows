<template>
  <div>
    <div class="message-center rzl_fc_darkgray">
      <div class="empty-button-box font14 rzl_fc_navy">
        <span @click="signAllRead">全部标记已读</span>
        <span @click="deleteList">批量删除</span>
      </div>
      <div class="message-list-box rzl_fc_darkgray">
        <div class="list-title font14 rzl_fc_darkgray">
          <span class="title-checkAll">
             <checkBox
               :allSelect="allSelect"
               :totalSelect="totalSelect"/>&nbsp; 全选</span>
          <span class="title-date">日期</span>
          <span class="title-type">类型</span>
          <span class="title-content">消息内容</span>
          <span class="title-status">状态</span>
          <span class="title-delete"> &nbsp;</span>
        </div>
        <div class="list-item font14 rzl_fc_darkgray" v-for="item in listData">
          <div class="item-checkAll">
            <checkBox
              :label="item.id"
              :dataArr="dataArr"
              :all="checkAll"
            />
          </div>
          <span class="item-date">{{item.date}}</span>
          <span class="item-type">{{item.type == 1?"系统消息":"未知消息"}}</span>
          <span class="item-content">{{item.content}}</span>
          <span class="item-status">{{item.status == 1?"已读":"未读  "}}</span>
          <div class="item-delete empty-button-box font14 rzl_fc_navy">
            <span @click="deleteItem(item)">删除</span>
          </div>
        </div>

      </div>
      <div class="pagination">
        <!--<Pagination :totalNum="total"-->
        <!--@currentChange="currentChange"-->
        <!--ref="pagination"/>-->
      </div>
    </div>
  </div>
</template>

<script>
  import ITop from '@/components/common/Top';
  import IHeader from '@/components/common/Header';
  import IFooter from '@/components/common/Footer';
  import checkBox from '@/components/common/CheckBox';
  import dataUtil from '../../assets/js/dataUtlis'
  import Pagination from "@/components/common/Pagination"

  export default {
    name: "message-center-content",
    components: {ITop, IHeader, IFooter, dataUtil, checkBox, Pagination},
    data() {
      return {
        searchTitle: "",
        dataArr: [],
        checkAll: "",
        total: 0,
        page: 0,
        listData: [],
        showGoTop: false,
      }
    },
    computed: {
      allSelect() {
        return this.dataArr.length == 7
      }
    },
    methods: {
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
        this.$mConfirm('此操作将永久删除该已经该条消息, 是否继续?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          alert(item.id);
        })
      },
      signAllRead() {
        //TODO 标记已读
      },
      deleteList() {
        if (this.dataArr.length < 1) {
          this.$mAlert('请至少勾选一条消息后再进行批量删除.')
          return
        }

        this.$mConfirm('此操作将永久删除该已经勾选的消息, 是否继续?', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
        }).then(() => {
          alert(1)
        })
      },
      totalSelect(params) {
        console.log(params);
        this.checkAll = params
      }
    },
    mounted() {
      this.listData = dataUtil.getMessageCenterListData();

    }
  }
</script>

<style scoped>
  .message-center {
    background: white;
    width: 100%;
    box-sizing: border-box;
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 34px;
  }

  .message-center .empty-button-box {

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
