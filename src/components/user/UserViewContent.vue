<template>
    <div class="rzl_bc_white viewcontent">
        <div class="usertop"><p class="font18">用户中心</p></div>
        <table class="userinfo rzl_fc_darkgray font16">
            <tr>
                <td class="fieldcolumn"><label>用户名：</label></td>
                <td class="valuecolumn"><label>{{username}}</label></td>
                <td class="btncolumn" colspan="4">
                    <!-- <router-link :to="{name:'useredit',params:{userid:123}}">信息修改</router-link> -->
                    <button class="rzl_content_button" @click="goEdit()" >信息修改</button>
                </td>
            </tr>
             <tr>
                <td class="fieldcolumn"><label >姓名：</label></td>
                <td class="valuecolumn"><label>{{realname}}</label></td>
            </tr>
             <tr>
                <td class="fieldcolumn"><label>联系电话：</label></td>
                <td class="valuecolumn"><label>{{telephone}}</label></td>
            </tr>
             <tr>
                <td class="fieldcolumn"><label>电子邮箱：</label></td>
                <td class="valuecolumn"><label>{{email}}</label></td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    name:"UserView_content",
    data(){ 
     return {
            userid:'123',
            username:'海绵有风',
            realname:'王紫涵',
            telephone:'10086',
            email:'aa@rongliam.com'
     };
    },
    mounted(){
           //获取用户信息UserInfo对象

    },methods:{
        // 跳转编辑页面方法
        goEdit(){
            var userid=this.userid;
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
    width: 6%;
}
.viewcontent .userinfo .valuecolumn{
    padding-left: 10px;
    text-align: left;
    width:13%;
}
.viewcontent .userinfo .btncolumn{
    padding-left: 30px;
    width: 20px;
    border: 0 solid;
}
</style>
