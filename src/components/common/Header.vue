<template>
  <div class="header" id="iHeader">
    <div class="header-list font20">
      <!-- 采用数组方式时UI组件存在解析问题：TODO -->
      <div class="list-item">
        <el-button type="primary" @click="handleClick(0, 1)" class="nav-item font20" :class="navIndex == 1?'active':''">首页</el-button>
      </div>
      <div class="list-item">
        <el-button type="primary" @click="handleClick(1, 1)" class="nav-item font20" :class="navIndex == 2?'active':''">舆情头条</el-button>
      </div>
      <div class="list-item">
        <el-dropdown placement="top-start" @command="handleCommand">
          <el-button type="primary" @click="handleClick(2, 2)" class="nav-item font20" :class="navIndex == 3?'active':''">
            监测中心<i class="el-icon-arrow-down el-icon--right font14 rzl_fc_undercoat menu-icon"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" class="center-downMenu">
            <el-dropdown-item  command="1"  class="font16 rzl_fc_undercoat" :class="kpTypeShow=='general'?'downItem-active':''"><i class="downItem-icon"></i><span class="downItem-text">常规监测</span></el-dropdown-item>
            <el-dropdown-item  command="2" class="font16 rzl_fc_undercoat"  :class="kpTypeShow=='person'?'downItem-active':''"><i class="downItem-icon"></i><span class="downItem-text">人物监测</span></el-dropdown-item>
            <el-dropdown-item  command="3" class="font16 rzl_fc_undercoat"  :class="kpTypeShow=='article'?'downItem-active':''"><i class="downItem-icon"></i><span class="downItem-text">文稿监测</span></el-dropdown-item>
            <el-dropdown-item  command="4" class="font16 rzl_fc_undercoat"  :class="kpTypeShow=='event'?'downItem-active':''"><i class="downItem-icon"></i><span class="downItem-text">事件监测</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="list-item">
        <el-button type="primary" @click="handleClick(3, 1)" class="nav-item font20" :class="navIndex == 4?'active':''">简报中心</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 使用方式
   * 1 引入header组件 import iHeader from '@/components/common/IHeader'
   * 2 声明   components: {iHeader},
   * 3 在html中引用   <iHeader
   *                          @onClickListener="a"
   *                          :items="items"/>
   * 4 参数说明
   *  items：标题数组 类型 string数组
   *    例：items:["首页","舆情头条","监测中心","简报中心"] 必传
   *  @onClickListener ：点击事件监听，会返回被点击按钮的index 非比传
   *    例：function a(index){
   *          alert(index)
   *     }
   * */
  export default {
    name: "i-header",
    props: {
      navIndex: {
        type: Number,
        require: true,
        default () {
          return 0;
        }
      }
    },
    watch: {
      $route: {
        handler: function(val, oldVal){
          this.kpTypeShow = this.$route.params.type;
        },
        // 深度观察监听
        deep: true
      },
    },
    data: function () {
      return {
        index: 0,
        kpTypeShow: '',
      }
    },
    methods: {
      handleCommand (type){
        let userName = this.$iknowsUtil.getUserName();
        // 常规监测
        if(type ==1){
          this.$router.push("/center/monitorcenter/general/"+userName);
        }
        // 人物监测
        if(type ==2){
          this.$router.push("/center/monitorcenter/person/"+userName)
        }
        // 文稿监测
        if(type ==3){
          this.$router.push("/center/monitorcenter/article/"+userName)
        }
        // 事件监测
        if(type ==4){
          this.$router.push("/center/monitorcenter/event/"+userName)
        }
      },
      init: function () {
        var index = -1;
        let name = this.$route.name;
        switch (name) {
          case "home":
            index = 0
            break
          case "intelligencetopnews":
            index = 1
            break
          case "monitorcenter":
            index = 2
            break
          case "bulletincenter":
            index = 3
            break
        }
        this.index = index;
      },
      handleClick(index, type) {
        if (index == this.index) {
          return
        }
        let userName = this.$iknowsUtil.getUserName();
        switch (index) {
          case 0:
            this.$router.push("/home/"+userName)
            break
          case 1:
            this.$router.push("/intelligencetopnews/"+userName)
            break
          case 2:
            break
          case 3:
            this.$router.push("/bulletincenter/"+userName)
            break
        }
      },
    },
    mounted: function () {
      this.init();
      this.kpTypeShow = this.$route.params.type;
    },
  }
</script>

<style scoped>
  .header {
    box-sizing: border-box;
    width: 100%;
    position: relative;
  }
  .header .header-list {
    position: relative;
    background: #2D2B4C;
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: row;
  }

  .header .list-item {
    height: 60px;
    line-height: 60px;
    color: #FFFFFF;
    text-align: center;
    flex: 1;
  }
  .header .list-item .nav-item{
    position: relative;
    margin: 0 auto;
    width: 120px;
    height: 100%;
    line-height: 60px;
    color: #FFFFFF;
    text-align: center;
    box-sizing: border-box;
  }
  .header .list-item >>>.el-button--primary{
    padding: 0;
    border-radius: none;
    background: none;
  }
  .header .list-item >>>.el-dropdown-menu{
    background-color: #2D2B4C;
  }

 .downItem-icon{
    display: inline-block;
    margin-right: 10px;
    width: 6px;
    height: 6px;
    line-height: 56px;
    border-radius: 50%;
    vertical-align: text-top;
    margin-top: 7px;
    background: #2D2B4C;
  }
  .downItem-text{
    display: inline-block;
  }
  .header .list-item span {
    cursor: pointer;
    padding: 15px;
  }
  .header .list-item .active{
    color: #1DD1EF;
  }
  .header .list-item  .nav-item span .menu-icon{
    margin-left: 15px;
    cursor: pointer;
  }
  .header .list-downMenu {
    margin-left: -50px;
    position: absolute;
    display: inline-block;
    top: 60px;
    left: 0px;
    background: #2D2B4C;
    height: 222px;
    width: 200px;
  }

</style>
