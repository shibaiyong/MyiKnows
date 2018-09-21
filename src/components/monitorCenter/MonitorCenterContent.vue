<template>
  <div class="rzl_fc_darkgray">
    <div class="monitor-center">
      <div class="search-input-box">
        <input type="text" v-model="searchTitle"/>
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
      <div class="items-box ">
        <div class="item " :class="{itemLeft:index%2==1,itemRight:index%2==0}" v-for="(item,index) in listData">
          <div class="item-title">
            <div class="left-title font16 rzl_fc_darkgray">
              <checkBox :label="item.id" :dataArr="dataArr" :all="checkAll"/>
              {{item.name}}
            </div>
            <div class="right-title font14">
              <span>运行中 常规监控</span>
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
                  @mouseout="mouseout(item,2)">
                  修改配置
              </span>
            <span @click="stopItem(item)"
                  :class="{rzl_bc_navy:item.buttonStyle[3],rzl_fc_white:item.buttonStyle[3]}"
                  @mouseover='mouseover(item,3)'
                  @mouseout="mouseout(item,3)">
                  停止
              </span>
          </div>
        </div>
      </div>
      <div class="pagination">
        <Pagination :totalNum="total"
                    @currentChange="currentChange"
                    ref="pagination"/>
      </div>
      <div class="go-top" v-if="showGoTop" @click="goTop">
        <img src="../../assets/up.png"/>
      </div>
      <div class="dialog">
        
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
  import Pagination from "@/components/common/Pagination"

  export default {
    name: "monitor-center",
    components: {ITop, IHeader, IFooter, dataUtil, checkBox, Pagination},
    watch: {
      searchTitle() {
        if (this.searchTitle && this.searchTitle.length > 20) {
          this.showInputWarring = true
        } else {
          this.showInputWarring = false
        }
      }
    },
    data() {
      return {
        items: ["首页", "舆情头条", "监测中心", "简报中心"],
        searchTitle: "",
        showInputWarring: false,
        missType: "A",
        missStatus: "A",
        statusData: [],
        listData: [],
        dataArr: [],
        checkAll: "",
        total: 0,
        page: 0,
        showGoTop: false
      }
    },
    methods: {
      loadList() {
        //TODO  加载列表
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
        //TODO 查看结果
        this.$router.push("/publicsentiment")
      },
      stopItem(item) {
        this.$confirm('此操作将永久删除该已经该条消息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // type: 'warning'
        }).then(() => {
          alert(item.id);
          //TODO 停止
        })
      },
      updateConfig(item) {
        //TODO 更改配置
        this.$router.push("/center/config")
      },
      builderDoc(item) {
        //TODO 生成文档
      },
      search() {
        if (this.showInputWarring) {
          return
        }
        //TODO  搜索
      },
      createCase() {
        //TODO 创建新的方案
      },
      stopList() {
        if (this.dataArr.length < 1) {
          this.$alert('请至少勾选一条消息后再进行批量删除.', '提示')
          return
        }
        this.$confirm('此操作将永久删除该已经勾选的消息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // type: 'warning'
        }).then(() => {
          // TODO 批量停止
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
        // alert(index);
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
        if (item.isSelected) {
          return
        } else {
          var list = parentItem.items;
          for (var i = 0; i < list.length; i++) {
            list[i].isSelected = false;
          }
          item.isSelected = !item.isSelected
          this[parentItem.id] = item.id
        }
      }
    },
    mounted() {
      this.statusData = dataUtil.getStatusData()
      this.listData = dataUtil.getMonitorListData()
      this.total = 100;
      this.$refs.pagination.changeCurrentPage(1)
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
  }

  .monitor-center .items-box .item-title .left-title {
    flex: 1;
    text-align: center;
    font-weight: bold;
  }

  .monitor-center .items-box .item-title .right-title {
    flex: 1;
    padding-right: 12.5%;
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

  .monitor-center .dialog {

  }
</style>
