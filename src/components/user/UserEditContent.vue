<template>
     <div class="rzl_bc_white viewcontent">
        <div class="usertop"><p class="font18">用户中心</p></div>
        <table class="userinfo rzl_fc_darkgray font16">
            <tr>
                <td class="fieldcolumn"><label>用户名：</label></td>
                <td class="valuecolumn"><input class="valuecolumn_txt" type="text" v-model="username"></td>
            </tr>
            <tr>
                <td class="fieldcolumn"><label >姓名：</label></td>
                <td class="valuecolumn"><input class="valuecolumn_txt" type="text" v-model="realname"></td>
            </tr>
             <tr>
                <td class="fieldcolumn"><label>联系电话：</label></td>
                <td class="valuecolumn"><input class="valuecolumn_txt" type="text" v-model="telephone" ></td>
            </tr>
             <tr>
                <td class="fieldcolumn"><label>电子邮箱：</label></td>
                <td class="valuecolumn"><input class="valuecolumn_txt" type="text" v-model="email"></td>
            </tr>
            <tr>
                <td class="fieldcolumn"><label >微信：</label></td>
                <td class="btncolumn" v-if="webchat===''">
                    <input type="button" @click="goBindWebChat()" value="绑定" >
                </td>
                <td class="valuecolumn" v-else>
                    <label class="font16" />{{webchat}}</label>
                </td>
            </tr>
            <tr>
                <td class="fieldcolumn"><label >旧密码：</label></td>
                <td class="valuecolumn"><input class="valuecolumn_txt" type="text" v-model="oldpwd"></td>
            </tr>
            <tr>
                <td class="fieldcolumn"><label >新密码：</label></td>
                <td class="valuecolumn"><input class="valuecolumn_txt" type="text" v-model="newpwd"></td>
            </tr>
            <tr>
                <td class="fieldcolumn"><label >确认新密码：</label></td>
                <td class="valuecolumn"><input class="valuecolumn_txt" type="text" v-model="repeatnewpwd"></td>
            </tr>
            <tr>
                <td></td>
                <td class="btncolumn" colspan="2">
                    <button class="btncolletion rzl_content_button" @click="goSave()" >保存</button>
                    <button class="rzl_content_button" @click="goBack()" >返回</button>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
  name:"UserEdit_content",
    data(){ 
     return {
 
            username:'蓝猫淘气',
            realname:'蓝淘',
            telephone:'10086',
            email:'aa@rongliam.com',
            webchat:'11',
            oldpwd:'',
            newpwd:'',
            repeatnewpwd:''

     };
    },
    created(){
           //获取用户信息UserInfo对象
           
    },
    mounted(){

        //alert(this.$route.params.userid);
        var _this = this;
        //根据userid获取用户完整数据加载编辑页面
        // setTimeout(function(){
        //     _this.username = 'www',
        //     _this.realname='www',
        //     _this.telephone='www',
        //     _this.email='33333',
        //     _this.webchat='22',
        //     _this.oldpwd='11',
        //     _this.newpwd='',
        //     _this.repeatnewpwd=''
            
        // },1000)
    },
    methods:{
        // 调用方法
        goBindWebChat(userid){
           alert('chat')
        },
         goSave(userid){
           alert(`user=${this.username},realname=${this.realname}`)
        },
        goBack(){
            //this.$router.push({name:'userview',});
            this.$router.go(-1);
        }
    }
}
</script>
<style scoped type="css">
.viewcontent{
    width: 100%;
    height:98%;
}
.viewcontent .usertop{
    width: 100%;
    padding-top: 20px;
    padding-left:20px;
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
    line-height: 38px;
    border-radius: 10px;
    padding: 0 10px;
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
