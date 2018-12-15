<template>
  <div class="rzl_bc_white viewcontent">
    <div class="usertop">
      <p class="font18">用户中心</p>
    </div>
    <table class="userinfo rzl_fc_darkgray font16">
      <tr class="errorTip">
        <td></td>
        <td v-show="errorUserNameShow" class="paddingleft10">{{ errorUserNameMessage }}</td>
      </tr>
      <tr>
        <td class="fieldcolumn"><label>用户名：</label></td>
        <td class="valuecolumn">
          <input :class="{'valuecolumn_txt' : true, 'verify': errorUserNameShow }" type="text" disabled="disabled" v-model="userInfo.userName">
        </td>
      </tr>
      <tr class="errorTip">
        <td></td>
        <td v-show="errorRealNameShow" class="paddingleft10">{{ errorRealNameMessage }}</td>
      </tr>
      <tr>
        <td class="fieldcolumn"><label>姓名：</label></td>
        <td class="valuecolumn">
          <input :class="{'valuecolumn_txt' : true, 'verify': errorRealNameShow }" type="text" v-model="userInfo.realName">
        </td>
      </tr>
      <tr class="errorTip">
        <td></td>
        <td v-show="errorMobileShow" class="paddingleft10">{{ errorMobileMessage }}</td>
      </tr>
      <tr>
        <td class="fieldcolumn"><label>联系电话：</label></td>
        <td class="valuecolumn">
          <input :class="{'valuecolumn_txt' : true, 'verify': errorMobileShow }" type="text" v-model="userInfo.mobile">
        </td>
      </tr>
      <tr class="errorTip">
        <td></td>
        <td v-show="errorEmailShow" class="paddingleft10">{{ errorEmailMessage }}</td>
      </tr>
      <tr>
        <td class="fieldcolumn"><label>电子邮箱：</label></td>
        <td class="valuecolumn">
          <input :class="{'valuecolumn_txt' : true, 'verify': errorEmailShow }" type="text" v-model="userInfo.email">
        </td>
      </tr>
      <!-- <tr>
                <td class="fieldcolumn"><label >微信：</label></td>
                <td class="btncolumn" v-if="userInfo.webchat===''">
                    <input type="button" @click="goBindWebChat()" value="绑定" >
                </td>
                <td class="valuecolumn" v-else>
                    <label class="font16" />{{userInfo.webchat}}</label>
                </td>
            </tr> -->
      <tr class="errorTip">
        <td></td>
        <td v-show="errorOldPassShow" class="paddingleft10">{{ errorOldPassMessage }}</td>
      </tr>
      <tr>
        <td class="fieldcolumn"><label>旧密码：</label></td>
        <td class="valuecolumn">
          <input :class="{'valuecolumn_txt' : true, 'verify': errorOldPassShow }" type="password" v-model="userInfo.oldPassword">
        </td>
      </tr>
      <tr class="errorTip">
        <td></td>
        <td v-show="errorNewPassShow" class="paddingleft10">{{ errorNewPassMessage }}</td>
      </tr>
      <tr>
        <td class="fieldcolumn"><label>新密码：</label></td>
        <td class="valuecolumn">
          <input :class="{'valuecolumn_txt' : true, 'verify': errorNewPassShow }" type="password" v-model="userInfo.newPassword">
        </td>
      </tr>
      <tr class="errorTip">
        <td></td>
        <td v-show="errorComfirmNewPassShow" class="paddingleft10">{{ errorComfirmNewPassMessage }}</td>
      </tr>
      <tr>
        <td class="fieldcolumn"><label>确认新密码：</label></td>
        <td class="valuecolumn">
          <input :class="{'valuecolumn_txt' : true, 'verify': errorComfirmNewPassShow }" type="password" v-model="confirmNewPassWord">
        </td>
      </tr>
      <tr>
        <td></td>
        <td class="btncolumn" colspan="2">
          <button class="btncolletion rzl_content_button" @click="saveUserInfo()">保存</button>
          <button class="rzl_content_button" @click="goBack()">返回</button>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>

  import { modifyUserInfo,getUserInfo } from "@/assets/js/api.js"
  import sha256 from "js-sha256"
  var i = 0;
  export default {
  name:"UserEdit_content",
    data(){
        return {
            userInfo:{
                userName:'',
                realName:'',
                mobile:'',
                email:'',
                oldPassword:'',
                newPassword:'',
            },
            confirmNewPassWord:'',
            errorUserNameShow:false,
            errorUserNameMessage:'',
            errorRealNameShow:false,
            errorRealNameMessage:'',
            errorMobileShow:false,
            errorMobileMessage:'',
            errorEmailShow:false,
            errorEmailMessage:'',
            errorOldPassShow:false,
            errorOldPassMessage:'',
            errorNewPassShow:false,
            errorNewPassMessage:'',
            errorComfirmNewPassShow:false,
            errorComfirmNewPassMessage:'',
            saveDisabled:true
        };
    },
    methods:{
        // 返回
        goBack(){
            //this.$router.push({name:'userview',});
            this.$router.go(-1);
        },
        // 获取用户信息
        getUserInfo(){
            getUserInfo().then(res => {
                if(res.code == '200'){
                    this.userInfo = Object.assign({},this.userInfo, res.data);
                    this.confirmNewPassWord = '';
                    let userName = this.$iknowsUtil.getUserName();
                    localStorage.setItem('iKnows'+userName+'Info',JSON.stringify( this.userInfo ));
                }else{
                    //获取用户信息失败时,使用默认值
                    Object.assign(this.userInfo,{
                        userName:'无',
                        realName:'无',
                        mobile:'无',
                        email:'无'
                    });
                }
            })
        },
        // 验证用户信息
        formValidation(){
            this.errorUserNameShow=false;
            this.errorRealNameShow=false;
            this.errorMobileShow=false;
            this.errorEmailShow=false;
            this.errorOldPassShow=false;
            this.errorNewPassShow=false;
            this.errorComfirmNewPassShow=false;
          //用户名支持数字，字母，区分大小写；密码支持数字，字母，区分大小写。
            let userName = this.userInfo.userName;
            let realName = this.userInfo.realName;
            let mobile = this.userInfo.mobile;
            let email = this.userInfo.email;
            let oldPassword = this.userInfo.oldPassword;
            let newPassWord = this.userInfo.newPassword;
            let confirmNewPassWord = this.confirmNewPassWord;
            let userReg = /^[a-zA-Z\d_]{3,20}$/;
            let passwordReg = /^[a-zA-Z\d]{6,20}$/;
            let mobileReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            //验证邮箱合法性(匹配邮箱中名称可以包含汉字、字母、数字，域名只允许为英文和数字)
            let emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

            let verifyUserName = userReg.test( userName );
            let verifyRealName = userReg.test( realName );
            let verifyMobile = mobileReg.test( mobile );
            let verifyEmail = emailReg.test( email );
            let verifyPassWord = passwordReg.test( newPassWord );

            if( !verifyUserName ){
              this.errorUserNameMessage = '用户名长度3-20个字符，支持英文大小写、数字、下划线';
              this.errorUserNameShow = true;
              return false;
            }
            if( !verifyRealName ){
              this.errorRealNameMessage = '姓名长度3-20个字符，支持英文大小写、数字、下划线';
              this.errorRealNameShow = true;
              return false;
            }

            if( !verifyMobile ){
              this.errorMobileMessage = '手机号不合法';
              this.errorMobileShow = true;
              return false;
            }

            if( !verifyEmail ){
              this.errorEmailMessage = '邮箱不合法';
              this.errorEmailShow = true;
              return false
            }
            // 新旧密码均不能为空（三个）
            if( oldPassword == '' || oldPassword.length < 6 || oldPassword.length >20){
                this.errorOldPassMessage = '密码长度6-20个字符，支持英文大小写、数字、符号';
                this.errorOldPassShow = true;
                return false
            }

            if( !verifyPassWord || newPassWord == '' ){
                this.errorNewPassMessage = '密码长度6-20个字符，支持英文大小写、数字、符号';
                this.errorNewPassShow = true;
                return false
            }

            if( (newPassWord != confirmNewPassWord) && (newPassWord || confirmNewPassWord) ){
                this.errorComfirmNewPassMessage = '两次密码输入不一致';
                this.errorComfirmNewPassShow = true;
                return false
            }

        return true
      },
        // 保存
        saveUserInfo(){

          let userInfo = this.userInfo;
          let form =  this.formValidation() ;//执行表单验证，获取验证结果
          if (form === true){
            let params = {};
            params.userName= userInfo.userName;
            params.realName= userInfo.realName;
            params.mobile= userInfo.mobile;
            params.email= userInfo.email;
            if(userInfo.oldPassword && userInfo.newPassword){
              params.oldPassword= sha256( userInfo.oldPassword );
              params.newPassword= sha256( userInfo.newPassword );
            }

            modifyUserInfo( params ).then( res => {
              if(res.code == '200'){
                // this.getUserInfo();
                this.$message({
                  message: '用户信息修改成功',
                  type: 'success'
                });
                setTimeout(() => {                 
                  let userName = this.$iknowsUtil.getUserName();
                  this.$router.push({path:'/userview/'+userName});
                }, 500);

              }else {
                this.$message({
                  message: res.message,
                  type: 'error'
                });
              }

            })
          }
          // this.checkRepeat()                       //检测用户是否修改了信息

        },
    },
    mounted(){
      this.getUserInfo();
    }
}
</script>
<style scoped type="css">
  .viewcontent{
    width: 100%;
    height:98%;
    min-height: 600px;
}
.viewcontent .usertop{
    width: 100%;
    padding-left:20px;
    padding-top: 20px;
}
.viewcontent .userinfo{
    width: 100%;
    padding:30px 0 0 60px;
    line-height: 60px;
}
.viewcontent .userinfo .fieldcolumn{
    padding-left: 10px;
    text-align: right;
    width: 5%;
}
.viewcontent .userinfo .valuecolumn{
    padding-left: 10px;
    text-align: left;
    width:50%;
}
.viewcontent .userinfo .valuecolumn .valuecolumn_txt{
    width: 400px;
    border: 1px solid #CDCDCD;
    height: 38px;
    line-height: 38px;
    border-radius: 10px;
    padding: 0 10px;
    outline: none;
}
.viewcontent .userinfo .valuecolumn .valuecolumn_txt.verify{
    border: 1px solid red;
}

.errorTip td{
    line-height:18px;
}
.errorTip td.paddingleft10{
    padding-left:10px;
    color:red;
}
.viewcontent .userinfo .btncolumn{
    padding-left: 30px;
    width: 20px;
    border: 0 solid transparent;
    line-height: 150px;
}
.viewcontent .userinfo .btncolumn .btncolletion{
    margin:0 40px 0 40px;
}

</style>
