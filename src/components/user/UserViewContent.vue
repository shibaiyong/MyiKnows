<template>
  <div class="rzl_bc_white viewcontent">
    <div class="usertop"><p class="font18">用户中心</p></div>
    <table class="userinfo rzl_fc_darkgray font16">
      <tr>
        <td class="fieldcolumn"><label>用户名：</label></td>
        <td class="valuecolumn"><label>{{userInfo.userName}}</label></td>
        <td class="btncolumn" colspan="4">
          <!-- <router-link :to="{name:'useredit',params:{userid:123}}">信息修改</router-link> -->
          <button class="rzl_content_button" @click="goEdit()">信息修改</button>
        </td>
      </tr>
      <tr>
        <td class="fieldcolumn"><label>姓名：</label></td>
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
    <div class="user-divide"></div>
    <div class="usertop"><p class="font18">关注信息</p></div>
    <table class="userinfo rzl_fc_darkgray font16">
        <tr>
          <td class="fieldcolumn"><label>关注分类：</label></td>
          <td class="valuecolumn"><label>
            <div v-if="userInfo.classifications != null && userInfo.classifications.length >0" class="tabinfo">
              <span v-for="(item, index) in userInfo.classifications">{{item.name}}&nbsp;&nbsp;</span>
            </div>
            <div v-else class="tabinfo">
              <span>全部</span>
            </div>

          </label></td>
          <td class="btncolumn" colspan="4">
            <!-- <router-link :to="{name:'useredit',params:{userid:123}}">信息修改</router-link> -->
            <button class="rzl_content_button" @click="goConfig()">配置修改</button>
          </td>
        </tr>
        <tr>
          <td class="fieldcolumn"><label>关注地区：</label></td>
          <td class="valuecolumn"><label>

            <div v-if="userInfo.concernRegions != null && userInfo.concernRegions.length >0" class="tabinfo">
              <span v-for="(item, index) in userInfo.concernRegions">{{item.regionName}}&nbsp;&nbsp;</span>
            </div>
            <div v-else class="tabinfo">
              <span>全部</span>
            </div>

          </label></td>
        </tr>
        <tr>
          <td class="fieldcolumn"><label>所在地区：</label></td>
          <td class="valuecolumn"><label>

              <div v-if="userInfo.regions != null && userInfo.regions.length >0" class="tabinfo">
                <span v-for="(item, index) in userInfo.regions">{{item.regionName}}&nbsp;&nbsp;</span>
              </div>
              <div v-else class="tabinfo">
                <span>全部</span>
              </div>
          </label></td>
        </tr>
    </table>
    <UserConfigure :show="showUserConfigure" @save-configure-success="configureSuccess" @close ="closeBtn"></UserConfigure>
  </div>
</template>
<script>

  import {getUserInfo} from "@/assets/js/api.js"
  import UserConfigure from '@/components/common/UserConfigure';

  export default {
    name: "UserView_content",
    components: {UserConfigure},
    data() {
      return {
        showUserConfigure: false,
        userInfo: {
          userid: '',
          userName: '',
          realName: '',
          mobile: '',
          email: '',
          concernRegions: [],
          classifications: [],
          regions: []
        }
      };
    },
    mounted() {
      //获取用户信息UserInfo对象
      this.getUserInfo();
    },
    methods: {
      //获取用户信息
      getUserInfo() {
        getUserInfo().then(res => {

          if (res.code == '200') {
            Object.assign(this.userInfo, res.data);
          } else {
            //获取用户信息失败时,给出提示
            this.$message.error('请求失败，请重新尝试！');
          }
        })
      },
      // 跳转编辑页面方法
      goEdit() {
        let userid = this.userid;
        let userName = this.$iknowsUtil.getUserName();
        this.$router.push({path: '/useredit/'+userName});
      },
      goConfig(){
        this.showUserConfigure = true;
      },
      //配置成功页面跳转
      configureSuccess(){
        this.showUserConfigure = false;
        this.getUserInfo();
      },
      //关闭配置弹框
      closeBtn(){
        this.showUserConfigure = false;
      }
    }
  }
</script>
<style scoped type="css">
  .viewcontent {
    width: 100%;
    height: 98%;
    min-height: 600px;
  }

  .viewcontent .usertop {
    width: 100%;
    padding-top: 20px;
    padding-left: 20px;
  }

  .viewcontent .userinfo {
    width: 100%;
    padding: 30px 0 0 60px;
    line-height: 60px;
  }

  .viewcontent .userinfo .fieldcolumn {
    padding-left: 10px;
    text-align: right;
    width: 9%;
  }

  .viewcontent .userinfo .valuecolumn {
    padding-left: 10px;
    text-align: left;
    width: 24%;
  }

  .viewcontent .userinfo .btncolumn {
    padding-left: 30px;
    width: 20px;
    border: 0 solid;
  }
  .user-divide{
    width: 100%;
    height: 1px;
    border-bottom: 20px solid #f5f5f5;
  }
  .tabinfo{
    display: inline;
  }
</style>
