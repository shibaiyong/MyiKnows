<template>
  <div class="top">
    <img class="logo" src="../../assets/logo.png"/>
    <div class="right-box">
      <div class="logout" :class="{ buttonSelect: buttonMode==1 }" @click="logout()">
        <img src="../../assets/logout.png" :class="{ imgSelect: buttonMode==1 }"/>
        <span class="font16">退出</span>
      </div>
      <div class="help" :class="{ buttonSelect: buttonMode==2 }" @click="help()">
        <img src="../../assets/question.png" :class="{ imgSelect: buttonMode==2 }"/>
        <span class="font16">帮助</span>
      </div>
      <div class="backstage" :class="{ buttonSelect: buttonMode==3 }" @click="message()">
        <img src="../../assets/et-message.png" :class="{ imgSelect: buttonMode==3 }"/>
        <span class="font16">消息</span>
      </div>
      <div class="manager" :class="{ buttonSelect: buttonMode==4 }" @click="manager()">
        <img src="../../assets/manager.png" :class="{ imgSelect: buttonMode==4 }"/>
        <span class="font16">后台管理</span>
      </div>
      <div class="welcome font16" >
        欢迎，中央网信办政府机构
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
        buttonMode: 1,
      }
    },
    methods: {
      logout: function () {
        this.buttonMode = 1;
      },
      help: function () {
        this.buttonMode = 2;

      },
      message: function () {
        this.buttonMode = 3;

      },
      manager: function () {
        this.buttonMode = 4;

      },
    }
  }
</script>

<style scoped>
  .top {
    min-width: 1344px;
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
    cursor:pointer;
    float: right;
    font-size: 0px;
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
    cursor:default;
    color: #555555;
    font-weight: bolder;
  }
</style>
