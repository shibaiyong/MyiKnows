<template>
  <div class="top">
    <img class="logo" src="../../assets/logo.png"/>
    <div class="right-box">
      <div class="logout" :class="{ buttonSelect: selectIndex==index }" @click="clickButton(index)"
           v-for="(item,index) in listData">
        <img :src="item.path" :class="{ imgSelect: selectIndex==index }"/>
        <span class="font16">{{item.name}}</span>
      </div>
      <div class="welcome font16">
        欢迎，{{name}}
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 使用方式
   * 1 引入top组件 import iTop from '@/components/common/ITop'
   * 2 声明   components: {iTop},
   * 3 在html中引用  <iTop/>
   * */
  export default {
    name: "top",
    data() {
      return {
        selectIndex: -1,
        listData: [
          {name: "退出", path: require("../../assets/logout.png")},
          {name: "帮助", path: require("../../assets/question.png")},
          {name: "消息", path: require("../../assets/et-message.png")},
          {name: "后台管理", path: require("../../assets/manager.png")}
        ],
        name: "中央网信办政府机构"
      }
    },
    methods: {
      clickButton: function (index) {
        if (this.selectIndex == index) {
          return
        }
        switch (index) {
          case 0:
            // this.$router.push("/logout")
            break
          case 1:
            // this.$router.push("/help")
            break
          case 2:
            this.$router.push("/messagecenter")
            break
          case 3:
            // this.$router.push("/backmanager")
            break
        }
      }
    },
    mounted() {
      var path = this.$route.path
      switch (path) {
        case "/logout":
          this.selectIndex = 0
          break
        case "/help":
          this.selectIndex = 1
          break
        case "/messagecenter":
          this.selectIndex = 2
          break
        case "/backmanager":
          this.selectIndex = 3
          break
      }
    }
  }
</script>

<style scoped>
  .top {
    width: 100%;
    box-sizing: border-box;
    height: 88px;
    position: relative;
  }

  .top .right-box .buttonSelect {
    color: #1DD1EF;
  }

  .top .right-box .imgSelect {
    background: #1DD1EF;
  }

  .top .logo {
    position: absolute;
    top: 20px;
    left: 80px;
    height: 48px;
    width: 140px;
  }

  .top .right-box {
    margin-left: 200px;
    float: right;
    display: inline-block;
    position: absolute;
    top: 40px;
    right: 80px;
    height: 28px;
    line-height: 28px;
    vertical-align: middle;
  }

  .top .right-box div {
    cursor: pointer;
    float: right;
    height: 28px;
    line-height: 28px;
    display: inline-block;
    vertical-align: middle;
  }

  .top .right-box img {
    border-radius: 50%;
    padding: 3px;
    background: #CDCDCD;
    margin-left: 30px;
    height: 22px;
    width: 22px;
    line-height: 22px;
    vertical-align: middle;
    margin-right: 10px;
  }

  .top .right-box span {
    vertical-align: middle;
    display: inline-block;
    height: 28px;
    line-height: 28px;
  }

  .top .right-box .welcome {
    cursor: default;
    color: #555555;
    font-weight: bolder;
  }
</style>
