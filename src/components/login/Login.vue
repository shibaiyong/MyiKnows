<template>
  <div id="login">
    <div class="logo"><img src="../../assets/loginlogo.png"/><img src="../../assets/inewslogo.png"/></div>
    <div class="login-container">
      <div class="frontImg">
        <div class="banner">
          <img src="../../assets/whitelogo.png"/>
        </div>
        <div class="shownumber"><span class="kuohaoleft"></span><p>当前数据总量&nbsp;:&nbsp;{{numberStart}}</p><span class="kuohaoright"></span></div>
      </div>
      
      <div class="welcomeLogin">
        <h3>欢迎登录</h3>
        <ul>
          <li><input type="text" v-model="userInfo.userName"/></li>
          <li><input type="password" autocomplete="off" v-model="userInfo.passWord"/></li>
          <li><a href="javascript:void(0)" class="font14" @click="rememberMe">记住我</a><a href="javascript:void(0);" class="font14" @click="forgotPassWord">忘记密码</a></li>
          <li><button class="font16">登录</button></li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <ul>
        <li>技术咨询: 座机 010-62602000-2032</li>
        <li>北京荣之联科技股份有限公司</li>
        <li>地址：北京市朝阳区酒仙桥北路甲10号院106号楼荣之联大厦</li>
        <li>Copyright�.UEC Group Co.,Ltd.京ICP备14049550号</li>
      </ul>
    </div>
    <messageBox :visible="isVisible" :textOptions="textOptions">
      <input slot="content" type="text" v-model="email"/>
    </messageBox>
  </div>
</template>

<script>

  import Vue from 'vue'
  import iknowsUtil from "@/assets/js/iknowsUtil"
  import messageBox from "@/components/common/messageBox"

  export default {
    name: "login",
    data() {
      return {
        //弹窗组件的配置项
        textOptions:{
          title:'',
          cancel:'',
          confirme:'',
          content:''
        },
        isVisible:-1,
        email:'',
        userInfo:{
          "userName":"",
          "passWord":""
        },
        numberStart:23456,
        numberEnd:  98764
      }
    },
    created() {
      
    },
    mounted(){
      this.initUser();
      this.changeNumber(5,1500);
    },
    methods: {

      initUser(){//初始化用户名和密码,从cookie中获取。
        Object.assign(this.userInfo, iknowsUtil.getCookie('rlUserInfo'));
      },

      rememberMe(){//记住密码
        let userInfo = this.userInfo;
        if( userInfo.userName == '' || userInfo.passWord == ''){
          this.showMessageBox({
            title:'',
            cancel:'',
            confirme:'确定',
            content:'用户名和密码不能为空',
            confirmCallback:()=>{
              this.isVisible = -1;
            }
          });
          return false;
        }
        iknowsUtil.setCookie('rlUserInfo', 7, userInfo);//设置cookie
      },
      forgotPassWord(){//忘记密码

        this.showMessageBox({
          title:'请输入注册邮箱',
          cancel:'取消',
          confirme:'确定',
          content:'',
          confirmCallback:()=>{
            this.showMessageBox({
            title:'',
            cancel:'',
            confirme:'确定',
            content:'邮件已成功发到你的邮箱',
            confirmCallback:()=>{
              this.isVisible = -1;
            }
          });
          },
          cancelCallback:()=>{
            this.isVisible = -1;
          }
        });
      },

      showMessageBox(textOptions){//调用弹窗组件的方法,形参的数据类型为对象格式。
        this.isVisible = 1;
        this.textOptions = textOptions;
      },

      changeNumber(keepTime, cycleTime){//数字滚动叠加

        let span = this.numberEnd - this.numberStart;
        let translateTime = cycleTime;
        let changeTime = Math.ceil( translateTime / keepTime );
        let step = Math.floor(span / changeTime); 
        let changeNumberInterval = setInterval( () => {
          this.numberStart = this.numberStart + step;
          if( this.numberStart >= this.numberEnd ){
            clearInterval( changeNumberInterval );
            this.numberStart = this.numberEnd
          }
        }, keepTime );
      }
    },
    components:{
      messageBox
    }
  }
</script>

<style scoped>
  #login{
    background:#33459f;
    overflow:hidden;
    height:100%;
    background:url('../../assets/loginbanner.png') no-repeat content-box;
  }
  .logo{
    height: 55px;
    padding:0 48px;
    margin-top:49px;
    box-sizing: border-box;
  }  
  .logo img{
    vertical-align: middle;
    margin-right: 48px;
  }
  .login-container{
    width:100%;
    margin-top:154px;
    display:flex;
    justify-content: space-around;
    align-items: center;
  }
  
  .frontImg{
    width:40%;
    font-size: 64px;
    text-align: center;
  }
  
  .frontImg .shownumber{
    display:inline-block;
    color:white;
    margin-top:100px;
  }
  .frontImg .shownumber p{
    display: inline-block;
    vertical-align: middle;
  }
  .kuohaoright,.kuohaoleft{
    display: inline-block;
    width:46px;
    height:80px;
    vertical-align: middle;
    border: 6px solid #FFFFFF;
    position: relative;
  }
  .kuohaoright{
    border-radius: 0px 8px 8px 0;
    border-left:none;
    right:16px;
  }
  .kuohaoleft{
    border-radius: 8px 0px 0px 8px;
    border-right:none;
    left:16px;
  }
  .welcomeLogin{
    background:white;
    padding:32px 104px 61px;
    border-radius: 10px;
  }
  
  .welcomeLogin li,.welcomeLogin h3{
    margin-bottom:27px;
    color:#444444;
    text-align:center;
    font-weight:bold;
  }
  
  .welcomeLogin li input{
    width:302px;
    height:42px;
    background: #FFFFFF;
    border: 1px solid #0021C1;
    border-radius: 8px;
    outline: none;
    padding-left:10px;
  }
  .welcomeLogin li:nth-child(3){
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .welcomeLogin li:last-child button{
    width:300px;
    height:40px;
    background:#0021C1;
    border:none;
    border-radius: 8px;
    color:white;
    font-weight: bold;
  }
  
  .footer{
    text-align: center;
    margin-top:200px;
    font-size: 18px;
    color: #FFFFFF;
  }
  .footer li{
    margin-bottom: 6px;
  }
</style>
