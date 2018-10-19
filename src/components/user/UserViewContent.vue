<template>
    <div class="rzl_bc_white viewcontent">
        <div class="usertop"><p class="font18">用户中心</p></div>
        <table class="userinfo rzl_fc_darkgray font16">
            <tr>
                <td class="fieldcolumn"><label>用户名：</label></td>
                <td class="valuecolumn"><label>{{userInfo.userName}}</label></td>
                <td class="btncolumn" colspan="4">
                    <!-- <router-link :to="{name:'useredit',params:{userid:123}}">信息修改</router-link> -->
                    <button class="rzl_content_button" @click="goEdit()" >信息修改</button>
                </td>
            </tr>
             <tr>
                <td class="fieldcolumn"><label >姓名：</label></td>
                <td class="valuecolumn"><label>{{userInfo.realName}}</label></td>
            </tr>
             <tr>
                <td class="fieldcolumn"><label>联系电话：</label></td>
                <td class="valuecolumn"><label>{{userInfo.mobile}}</label></td>
            </tr>
             <tr>
                <td class="fieldcolumn"><label>电子邮箱：</label></td>
                <td class="valuecolumn"><label>{{userInfo.email}}</label></td>
            </tr>
        </table>
    </div>
</template>
<script>

import { getUserInfo } from "@/assets/js/api.js"
 
export default {
    name:"UserView_content",
    data(){ 
     return {
         userInfo:{
            userid:'',
            userName:'',
            realName:'',
            mobile:'',
            email:''
         }   
     };
    },
    mounted(){
        //获取用户信息UserInfo对象
        this.getUserInfo();


    },methods:{
        //获取用户信息
        getUserInfo(){
            getUserInfo().then(res => {

                if(res.code == '200'){
                    Object.assign(this.userInfo,res.data);
                }else{
                    //获取用户信息失败时,使用默认值
                    Object.assign(this.userInfo,{
                        userName:'海绵有风',
                        realName:'王紫涵',
                        mobile:'10086',
                        email:'aa@rongliam.com'
                    });
                }
            })
        },
        // 跳转编辑页面方法
        goEdit(){
            let userid=this.userid;
            this.$router.push({name:'useredit',params:{userid}});
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
    width: 9%;
}
.viewcontent .userinfo .valuecolumn{
    padding-left: 10px;
    text-align: left;
    width:24%;
}
.viewcontent .userinfo .btncolumn{
    padding-left: 30px;
    width: 20px;
    border: 0 solid;
}
</style>
