<template>
  <div id="login">
    
    <div class="loginleft">

      <div class="shownumber font28"><p class="font58">{{toThousands(numberStart)}}</p>今日数据总量</div>
      <ul class="companyInfo">
        <li>
          <span class="font14">北京荣之联科技股份有限公司</span>
          <span class="font14">技术咨询: 座机 010-62602000-2032</span>
          <span class="font14">地址: 北京市朝阳区酒仙桥北路甲10号院106号楼荣之联大厦</span>
        </li>
        <li class="font14">Copyright©1692018.UEC Group Co.,Ltd.京ICP备14049550号</li>
      </ul>
    </div>
    <div class="loginright">
      <div class="logo">
        <img src="../../assets/logo.png"/>
      </div>
      <h3 class="font44">欢迎登录</h3>
      <ul>
        <li class="bottom16" :class="{ 'verify': errorUserNameShow }">用户名</li>
        <li class="input bottom46" :class="{ 'verify': errorUserNameShow }">
          <input :class="{ 'verify': errorUserNameShow,'verifylan': errorUserNameShowAcive }" type="text" v-model="userInfo.userName" placeholder="请输入用户名" @focus="changeStatusActive('username')" @blur="changeStatusBlur('username')"/>
          <span v-show="errorUserNameShow"><img src="../../assets/error.png"/>&nbsp;{{ errorUserNameMessage }}</span>
        </li>
        <li class="bottom16" :class="{ 'verify': errorPassWordShow }">密码</li>
        <li class="input bottom24" :class="{ 'verify': errorPassWordShow }">
          <input :class="{ 'verify': errorPassWordShow, 'verifylan': errorPassWordShowAcive }" type="password" autocomplete="off" v-model="userInfo.password" @keyup.enter="gotoLogin" placeholder="请输入密码" @focus="changeStatusActive('password')" @blur="changeStatusBlur('password')"/>
          <span v-show="errorPassWordShow"><img src="../../assets/error.png"/>&nbsp;{{ errorPassWordMessage }}</span>
        </li>
        <li class="remeberme">
          <CheckBox :label="'选中'" :dataArr="dataArr" :all="isChecked"><a href="javascript:void(0)" class="font14">记住密码</a></CheckBox>
          
        </li>
        <li><button class="font16" @click="gotoLogin">登录</button></li>
      </ul>
    </div>
    <messageBox :visible="isVisible" :textOptions="textOptions">
      <input slot="content" type="text" v-model="email"/>
    </messageBox>
  </div> 
</template>

<script>
import iknowsUtil from "@/assets/js/iknowsUtil";
import messageBox from "@/components/common/messageBox";
import CheckBox from "@/components/common/CheckBox";
import { login, getTotalData } from "@/assets/js/api.js";
import sha256 from "js-sha256";

export default {
  name: "login",
  data() {
    return {
      //弹窗组件的配置项
      textOptions: {
        title: "",
        cancel: "",
        confirme: "",
        content: ""
      },
      isVisible: -1,
      email: "",
      userInfo: {
        userName: "",
        password: ""
      },
      numberStart: 0,
      numberEnd: 0,
      verifyUserName: false,
      verifyPassWord: false,
      errorUserNameShow: false,
      errorPassWordShow: false,
      errorUserNameShowAcive:false,
      errorPassWordShowAcive:false,
      errorUserNameMessage: "",
      errorPassWordMessage: "",
      dataArr: [],
      isChecked: "",
      totalTimer:''
    };
  },
  created() {
    //初始化当前数据总量
    getTotalData().then(res => {
      if (res.data) {
        this.numberEnd = res.data.total;
      }
    });
  },
  mounted() {
    this.initUser();
    this.changeNumber(5, 1500);
    this.getTotalData();
  },
  methods: {
    initUser() {
      //初始化用户名和密码,从cookie中获取。
      let rlUserInfo = iknowsUtil.getCookie("rlUserInfo");

      if (rlUserInfo.password) {
        let len = rlUserInfo.password.length - 64;
        rlUserInfo.password = rlUserInfo.password.substr(32, len);
        this.isChecked = "选中";
      }
      Object.assign(this.userInfo, rlUserInfo);
    },

    gotoLogin(e) {
      let verifyResult = this.formValidation(); //验证结果

      if (!verifyResult) {
        //如果验证没有通过，中断登录操作
        return false;
      }
      
      let password256 = sha256(this.userInfo.password);
      let params = {
        userName: this.userInfo.userName,
        password: password256
      };
      login(params).then(res => {
        if (res.code == "200" && res.data != null) {
          let token = res.data.token;
          //将请求到的token,保存到localStorage
          localStorage.iKnowsToken = token;
          localStorage.iKnowsUserName = this.userInfo.userName;
          //登录成功后，跳转到首页
          this.$router.push({ path: "/" });
        } else {
          this.$mAlert("用户名和密码不正确");
        }
      });
    },

    rememberMe() {
      //记住密码
      let userInfoStr = JSON.stringify(this.userInfo);
      let userInfo = JSON.parse(userInfoStr);
      if (userInfo.userName == "" || userInfo.passWord == "") {
        this.showMessageBox({
          title: "",
          cancel: "",
          confirme: "确定",
          content: "用户名和密码不能为空",
          confirmCallback: () => {
            this.isVisible = -1;
          }
        });
        return false;
      }
      userInfo.password =
        sha256(userInfo.password).substr(0, 32) +
        userInfo.password +
        sha256(userInfo.password).substr(32, 32);
      iknowsUtil.setCookie("rlUserInfo", 7, userInfo); //设置cookie
    },

    forgotMe() {
      iknowsUtil.deleteCookie("rlUserInfo");
    },

    forgotPassWord() {
      //忘记密码

      this.showMessageBox({
        title: "请输入注册邮箱",
        cancel: "取消",
        confirme: "确定",
        content: "",
        confirmCallback: () => {
          this.showMessageBox({
            title: "",
            cancel: "",
            confirme: "确定",
            content: "邮件已成功发到你的邮箱",
            confirmCallback: () => {
              this.isVisible = -1;
            }
          });
        },
        cancelCallback: () => {
          this.isVisible = -1;
        }
      });
    },

    showMessageBox(textOptions) {
      //调用弹窗组件的方法,形参的数据类型为对象格式。
      this.isVisible = 1;
      this.textOptions = textOptions;
    },

    changeNumber(keepTime, cycleTime) {
      //数字滚动叠加

      let span = this.numberEnd - this.numberStart;
      let translateTime = cycleTime;
      let changeTime = Math.ceil(translateTime / keepTime);
      let step = Math.ceil(span / changeTime);
      let changeNumberInterval = setInterval(() => {
        this.numberStart = this.numberStart + step;
        if (this.numberStart >= this.numberEnd && span >= 0) {
          clearInterval(changeNumberInterval);
          this.numberStart = this.numberEnd;
        } else if (this.numberStart <= this.numberEnd && span < 0) {
          clearInterval(changeNumberInterval);
          this.numberStart = this.numberEnd;
        }
      }, keepTime);
    },

    formValidation() {
      //用户名支持数字，字母，区分大小写；密码支持数字，字母，区分大小写。
      let userName = this.userInfo.userName;
      let passWord = this.userInfo.password;

      let userReg = /^[a-zA-Z\d]{3,20}$/;
      let passwordReg = /^[a-zA-Z\d]{6,20}$/;

      if (!userReg.test(userName)) {
        this.errorUserNameMessage = "用户名错误";
        this.errorUserNameShow = true;
        this.errorUserNameShowAcive = false;
        return false;
      }  else {
        this.errorUserNameShow = false;
      }
      if (!passwordReg.test(passWord)) {
        this.errorPassWordMessage = "密码错误";
        this.errorPassWordShow = true;
        this.errorPassWordShowAcive = false;
        return false
      } else {
        this.errorPassWordShow = false;
      }

      return true
    },

    getTotalData() {
      this.totalTimer = setInterval(() => {
        getTotalData().then(res => {
          if (res.data) {
            this.numberEnd = res.data.total;
          }
        });
      }, 10000);
    },

    changeStatusActive( data ){
      if( data == 'username' ){
        this.errorUserNameShow = false
        this.errorUserNameShowAcive = true
      }else if( data == 'password' ){
        this.errorPassWordShow = false
        this.errorPassWordShowAcive = true
      }
    },
    changeStatusBlur(data){
      if( data == 'username' ){
        this.errorUserNameShow = false
        this.errorUserNameShowAcive = false
      }else if( data == 'password' ){
        this.errorPassWordShow = false
        this.errorPassWordShowAcive = false
      }
    },
    toThousands(num){
      if (num == null || num == undefined) return "";
      var flag = false;
      var indexDot = num.toString().indexOf('.');
      var dot;
      if (indexDot > 0) {
        dot = num.toString().substring(indexDot);
        num = num.toString().substring(0, indexDot);
      }
      var result = '', counter = 0;
      var reg = /^\-/;
      var reg1 = /\(/g;
      num = (num || 0).toString();
      if (reg1.test(num)) {
        num = num.replace(reg1, '');
        flag = true;
      } else {
        flag = false;
      }
      var num1 = num;
      num = num.replace(reg, '');
      for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result = num.charAt(i) + result;
        if (!(counter % 3) && i != 0) {
          result = ',' + result;
        }
      }
      if (num1 < 0) {
        result = "-" + result
      }
      if (indexDot > 0) {
        result = result + dot;
      }
      if (flag == true) {
        result = '(' + result;
      }
      return result;
    }
  },
  beforeDestroy(){
    clearInterval( this.totalTimer )
  },
  watch: {
    dataArr(val) {
      if (val.length) {
        this.rememberMe();
      } else {
        this.forgotMe();
      }
    },
    numberEnd() {
      this.changeNumber(5, 1500);
    }
  },
  components: {
    messageBox,
    CheckBox
  }
};
</script>

<style scoped>

#login{
  width:100%;
  height: 100%;
  overflow:hidden;
}
.loginleft{
  width:62%;
  height:100%;
  background: url("../../assets/login_bg.jpg") no-repeat center center;
  float:left;
  background-size:100% 100%;
  position: relative;
}
.loginleft .shownumber{
  width:100%;
  position:absolute;
  bottom:10%;
  left:0;
  color:white;
  line-height: 40px;
  padding-left:6%;
  font-weight: bold;
}
.loginleft .shownumber p{
  
  line-height: 67px;
  font-weight: bold;
}
.loginleft .companyInfo{
  width:100%;
  position:absolute;
  bottom:3%;
  left:0;
  color:white;
  line-height: 21px;
  padding-left:6%;
}
.loginleft .companyInfo span+span{
  display:inline-block;
  margin-left:3%;
}
.loginright{
  width:38%;
  height:100%;
  float:left;
  background:white;
}
.loginright .logo{
  width:60%;
  margin:20% auto 17% auto;
}
.loginright .logo img{
  width:73%;
}
.loginright h3{
  width:60%;
  height:62px;
  font-family:'PingFangSC-Medium';
  font-weight:500;
  color:rgba(68,68,68,1);
  line-height:62px;
  margin:0 auto;
  margin-bottom:7%;
}
.loginright ul{
  width:60%;
  margin:0 auto;
}

.loginright li.input{
  border:1px solid rgba(204,204,204,1);
  border-radius:4px;
  overflow: hidden;
}

.loginright li.input span{
  height: auto;
}


.loginright li input {
  width: 54%;
  outline: none;
  padding-left: 40px;
  height:56px;
  border:none;
  box-sizing: border-box;
}
.loginright li.bottom46 input{
  background:rgba(255,255,255,1) url(../../assets/username-ico.png) no-repeat 12px center;
}
.loginright li.bottom24 input{
  background:rgba(255,255,255,1) url(../../assets/password-ico.png) no-repeat 12px center;
}
.loginright li.verify {
  border-color: red;
  color:red;
}
.loginright li.bottom46 input.verify {
  color:red;
  background:rgba(255,255,255,1) url(../../assets/username-error.png) no-repeat 12px center;
}
.loginright li.bottom24 input.verify {
  color:red;
  background:rgba(255,255,255,1) url(../../assets/password-error.png) no-repeat 12px center;
}
.loginright li.bottom46 input.verifylan {
  background:rgba(255,255,255,1) url(../../assets/username-active.png) no-repeat 12px center;
}
.loginright li.bottom24 input.verifylan {
  background:rgba(255,255,255,1) url(../../assets/password-active.png) no-repeat 12px center;
}
.loginright li span{
  display: inline-block;
  width:42%;
  height: 10px;
  text-align: right
}
.remeberme{
  text-align:right;
  margin-bottom:12%;
}
.remeberme a{
  color:#333;
}
.loginright li:last-child button {
  width: 100%;
  border: none;
  color: white;
  cursor: pointer;
  height:56px;
  background:rgba(29,32,136,1);
  border-radius:4px;
  font-size:16px;
  font-family:'PingFangSC-Medium';
  font-weight:500;
  color:rgba(255,255,255,1);
}
.bottom16{
  margin-bottom:2%;
}


.bottom46{
  margin-bottom:6%;
}
.bottom24{
  margin-bottom:3%;
}


</style>
