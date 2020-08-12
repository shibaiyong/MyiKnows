<template>

  <div class="user_configure" id="user_configure" v-if="show" v-loading.fullscreen.lock="fullscreenLoading">

    <div class="user_configure_content">


      <!----------------------------------------推荐设置----------------------------------------->
      <!--标题-->
      <div class="configure_title">
        <span>推荐配置</span>
        <span class="configure_close font16" v-if="configure_close" @click="closeBtn()"><i data-v-37a846a7="" class="el-icon-close"></i></span>
      </div>

      <!------------------推荐分类----------------->
      <div class="configure_detail clearfix">

        <!--推荐分类视图-->
        <div class="configure_sort">

          <!--副标题-->
          <div class="configure_subTitle">您关注的分类 (多选):</div>

          <!--推荐分类按钮部分-->
          <div class="clearfix">
            <div class="configure_item"
                 v-for="(item,index) in RSData"
                 :class="item.isSelected?'configure_item_select':''"
                 v-if="item.id === item.parentId">
              <!--分类名-->
              <span class="configure_item_name"
                    :class="hasChildren(0,item.id)?'':'isSingle'"
                    v-text="item.name"
                    @click="configureItemNameClick(0,item.id,item)">
              </span>
              <!--下拉按钮-->
              <span class="configure_item_more"
                    v-if="hasChildren(0,item.id)"
                    @click="configureItemMoreClick(0,item.id,item.showChildren)">
              <i class="el-icon-arrow-up" v-if="item.showChildren"></i>
              <i class="el-icon-arrow-down" v-if="!item.showChildren"></i>
              </span>
            </div>
          </div>

          <!--子分类视图-->
          <div class="configure_sub" v-if="RSSubData.length">

            <span class="configure_sub_item"
                  v-for="item in RSSubData"
                  v-text="item.name"
                  :class="item.isSelected?'configure_sub_item_select':''"
                  @click="configureItemNameClick(0,item.id,item)">
            </span>

          </div>

        </div>

        <!--已选中推荐分类视图-->
        <div class="configure_select clearfix">

          <!--副标题-->
          <div class="configure_subTitle">已定制条件 (关注的分类):</div>

          <div class="configure_item"
               v-for="(item,index) in RSSelect">
              <span class="configure_item_name configure_item_name_select"
                    v-text="item.name">
              </span>
            <span class="configure_item_more"
                  @click="configureItemCloseClick(0,index)">
              <i class="el-icon-close"></i>
            </span>
          </div>

        </div>

      </div>


      <!------------------推荐地区----------------->
      <div class="configure_detail clearfix">
        <!--推荐地区视图-->
        <div class="configure_sort">

          <!--副标题-->
          <div class="configure_subTitle">您关注的地区 (多选):</div>

          <!--推荐分类按钮部分-->
          <div class="clearfix">
            <div class="configure_item"
                 v-for="(item,index) in RAData"
                 :class="item.isSelected?'configure_item_select':''"
                 v-if="item.id === item.parentId">
              <span class="configure_item_name"
                    :class="hasChildren(1,item.id)?'':'isSingle'"
                    v-text="item.name"
                    @click="configureItemNameClick(1,item.id,item)">
            </span>
              <span class="configure_item_more"
                    v-show="hasChildren(1,item.id)"
                    @click="configureItemMoreClick(1,item.id,item.showChildren)">
              <i :class="item.showChildren?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
            </span>
            </div>
          </div>

          <!--子分类视图-->
          <div class="configure_sub" v-if="RASubData.length">

            <span class="configure_sub_item"
                  v-for="item in RASubData"
                  v-text="item.name"
                  :class="item.isSelected?'configure_sub_item_select':''"
                  @click="configureItemNameClick(1,item.id,item)">
            </span>

          </div>

        </div>

        <!--已选中推荐地区视图-->
        <div class="configure_select clearfix">

          <!--副标题-->
          <div class="configure_subTitle">已定制条件 (关注的地区):</div>

          <div class="configure_item"
               v-for="(item,index) in RASelect">
              <span class="configure_item_name"
                    v-text="item.name">
              </span>
            <span class="configure_item_more"
                  @click="configureItemCloseClick(1,index)">
              <i class="el-icon-close"></i>
            </span>
          </div>

        </div>
      </div>


      <!----------------------------------------本地设置----------------------------------------->
      <!--标题-->
      <div class="configure_title">本地配置</div>
      <!----------------推荐地区--------------->
      <div class="configure_detail clearfix">
        <!--推荐地区视图-->
        <div class="configure_sort">

          <!--副标题-->
          <div class="configure_subTitle">您所在的地区(单选):</div>

          <!--推荐分类按钮部分-->
          <div class="clearfix">
            <div class="configure_item"
                 v-for="(item,index) in LAData"
                 :class="item.isSelected?'configure_item_select':''"
                 v-if="item.id === item.parentId">
              <span class="configure_item_name"
                    :class="hasChildren(2,item.id)?'':'isSingle'"
                    v-text="item.name"
                    @click="configureItemNameClick(2,item.id,item)">
            </span>
              <span class="configure_item_more"
                    v-show="hasChildren(2,item.id)"
                    @click="configureItemMoreClick(2,item.id,item.showChildren)">
              <i :class="item.showChildren?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
            </span>
            </div>
          </div>

          <!--子分类视图-->
          <div class="configure_sub" v-if="LASubData.length">

            <span class="configure_sub_item"
                  v-for="item in LASubData"
                  v-text="item.name"
                  :class="item.isSelected?'configure_sub_item_select':''"
                  @click="configureItemNameClick(2,item.id,item)">
            </span>

          </div>

        </div>

        <!--已选中推荐地区视图-->
        <div class="configure_select clearfix">

          <!--副标题-->
          <div class="configure_subTitle">已定制条件 (关注的地区):</div>

          <div class="configure_item"
               v-for="(item,index) in LASelect">
              <span class="configure_item_name"
                    v-text="item.name">
              </span>
            <span class="configure_item_more"
                  @click="configureItemCloseClick(2,index)">
              <i class="el-icon-close"></i>
            </span>
          </div>

        </div>
      </div>

      <!--保存和重置按钮-->
      <div class="user_configure_control">

        <span class="save_btn" @click="saveBtnClick()">保存</span>
        <span class="reset_btn" @click="resetBtnClick()">{{cancleText}}</span>

      </div>


    </div>


  </div>
</template>

<script>

  import {getUserInfo, userConfigureAllClassification, userConfigureAllRegion} from '@/assets/js/api';
  import {
    userConfigureSaveClassification,
    userConfigureSaveConcernRegion,
    userConfigureSaveLocalRegion,
    userConfigureSaveSeccess
  } from '@/assets/js/api';

  export default {
    name: "user-configure",
    props: {
      show: {type: Boolean, require: false, default: false}
    },
    data() {
      return {
        fullscreenLoading: false,
        cancleText: '重置',
        userConfigureType: {
          recommendSort: 0,
          recommendArea: 1,
          localArea: 2
        },

        sortAll: [],
        regionAll: [],
        /*推荐分类recommendSort*/
        RSData: [],
        RSSelect: [],
        RSSubData: [],
        /*推荐地区recommendArea*/
        RAData: [],
        RASelect: [],
        RASubData: [],
        /*本地地区localArea*/
        LAData: [],
        LASelect: [],
        LASubData: [],
        // 关闭按钮
        configure_close:false
      }
    },

    methods: {


      /*保存按钮点击事件*/
      saveBtnClick() {

        this.$confirm('确定保存吗？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存',
          cancelButtonText: '取消'
        }).then(() => {
          this.fullscreenLoading = true;
          let RSResult = '', RAResult = '', LAResult = '';
          this.RSSelect.forEach(function (item) {
            RSResult += (item.id + ',');
          });

          this.RASelect.forEach(function (item) {
            RAResult += (item.id + ',');
          });

          this.LASelect.forEach(function (item) {
            LAResult += (item.id + ',');
          });
          RSResult = RSResult.substr(0, RSResult.lastIndexOf(','));
          RAResult = RAResult.substr(0, RAResult.lastIndexOf(','));
          LAResult = LAResult.substr(0, LAResult.lastIndexOf(','));


          this.saveClassification(RSResult,RAResult,LAResult);
        }).catch(action => {

        });

      },

      /*保存分类*/
      saveClassification(RSResult,RAResult,LAResult){
        userConfigureSaveClassification({classification: RSResult}).then(response => {

          // console.log('保存分类');
          // console.log(response);
          if(response.code == 200){
            this.saveConcernRegion(RSResult,RAResult,LAResult)
          }else{
            this.$message.error(`保存分类error,${response.code}`);
            this.fullscreenLoading = false;
          }

        });
      },

      /*保存关注地区*/
      saveConcernRegion(RSResult,RAResult,LAResult){
        userConfigureSaveConcernRegion({region: RAResult}).then(response => {
          // console.log('保存关注地区');
          // console.log(response);
          if(response.code == 200){
            this.saveLocalRegion(RSResult,RAResult,LAResult)
          }else{
            this.$message.error(`保存关注地区error,${response.code}`);
            this.fullscreenLoading = false;
          }
        });
      },

      /*保存本地地区*/
      saveLocalRegion(RSResult,RAResult,LAResult){
        userConfigureSaveLocalRegion({region: LAResult}).then(response => {
          // console.log('保存本地地区');
          // console.log(response);
          if(response.code == 200){



            this.saveSuccess();


          }else{
            this.$message.error(`保存本地地区error,${response.code}`);
            this.fullscreenLoading = false;
          }

        });
      },

      saveSuccess(){

        userConfigureSaveSeccess().then(response=>{

          if(response.code == 200){
            let userName = document.getElementById('app').getAttribute('userName');
            localStorage.iKnowsUserConfig=1;
            this.fullscreenLoading = false;
            this.$emit('save-configure-success');

          }else {
            this.$message.error(`error,${response.code}`);
          }
        })
      },
      // 关闭按钮
      closeBtn(){
        this.$emit('close');
      },
      /*重置按钮点击事件*/
      resetBtnClick() {
        if(this.cancleText == '关闭'){
          // this.show = false;
          this.$emit('close');
        }else{
          this.RSSelect = [{name: "全部", id: 0, parentId: 0, isSelected: false}];
          this.RASelect = [{name: "全部", id: 0, parentId: 0, isSelected: false}];
          this.LASelect = [{name: "全部", id: 0, parentId: 0, isSelected: false}];

          this.layoutUserConfigureItems();
        }

      },

      /*判断是否包含子元素*/
      hasChildren(type, id) {

        let result = [], checklist = [];

        if (type === 0) {
          checklist = this.RSData;
        } else if (type === 1) {
          checklist = this.RAData;
        } else {
          checklist = this.LAData;
        }

        checklist.forEach(function (item) {
          if (item.parentId === id) {
            result.push(item);
          }
        });

        return (result.length > 1 ? true : false);
      },


      /*点击按钮文字部分*/
      configureItemNameClick(type, id, row) {

        let thiz = this, data = [];

        if (type === 0) {

          //this.RSSubData = [];
          data = this.RSSelect;

          /*判断是否超过最大数量*/
          if (data.length >= 4 && id !== 0) {
            this.$message.error('超过最大数量限制');
            return;
          }

          /*判断该项是否已经包含*/
          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.id === id) {
              return
            }
          }

          /*判断第一个是否是'全部'*/
          if (data[0].id === 0) {
            data.splice(0, 1);
          }

          /*添加该项到已选中数组*/
          this.RSData.forEach(function (item) {

            item.showChildren = false;
            if (item.id === id) {
              data.push(item);
            }
          });


          /*最终赋值*/
          this.RSSelect = data;


          /*当选择全部时候*/
          if (id === 0) {
            this.RSSelect = [{name: "全部", id: 0, parentId: 0, isSelected: false}];
          } else {
            /*当点击的是父分类,移除所有子分类*/
            if (row.parentId === row.id) {

              for (let i = data.length - 1; i >= 0; i--) {
                let item = data[i];
                if (row.id === item.parentId && item.id !== item.parentId) {
                  this.RSSelect.splice(i, 1);
                }
              }

            } else {
              /*当点击的是子分类,移除所有父分类*/

              for (let i = data.length - 1; i >= 0; i--) {
                let item = data[i];
                if (row.parentId === item.id) {
                  this.RSSelect.splice(i, 1);
                }
              }

            }
          }


        }

        else if (type === 1) {
          //this.RASubData = [];
          data = this.RASelect;

          if (data.length >= 4 && id !== 0) {
            this.$message.error('超过最大数量限制');
            return;
          }
          /*判断是否已经包含*/
          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.id === id) {
              return
            }
          }
          /*判断第一个是否是'全部'*/
          if (data[0].id === 0) {
            data.splice(0, 1);
          }

          this.RAData.forEach(function (item) {
            if (item.id === id) {
              data.push(item);
            }
          });


          this.RASelect = data;

          /*当选择全部时候*/
          if (id === 0) {
            this.RASelect = [{name: "全部", id: 0, parentId: 0, isSelected: false}];
          } else {
            /*当点击的是父分类,移除所有子分类*/
            if (row.parentId === row.id) {

              for (let i = data.length - 1; i >= 0; i--) {
                let item = data[i];
                if (row.id === item.parentId && item.id !== item.parentId) {
                  this.RASelect.splice(i, 1);
                }
              }

            } else {
              /*当点击的是子分类,移除所有父分类*/

              for (let i = data.length - 1; i >= 0; i--) {
                let item = data[i];
                if (row.parentId === item.id) {
                  this.RASelect.splice(i, 1);
                }
              }

            }
          }

        }

        else {

          //this.LASubData = [];
          data = this.LASelect;

          // if (data.length >= 4 && id !== 0) {
          //   this.$message.error('超过最大数量限制');
          //   return;
          // }
          /*判断是否已经包含*/
          // for (let i = 0; i < data.length; i++) {
          //   let item = data[i];
          //   if (item.id === id) {
          //     return
          //   }
          // }

          /*判断第一个是否是'全部'*/
          // if (data[0].id === 0) {
          //   data.splice(0, 1);
          // }

          thiz.LAData.forEach(function (item) {
            if (item.id === id) {
              // data.push(item);
              data = [item];
            }
          });

          this.LASelect = data;

          /*当选择全部时候*/
          if (id === 0) {
            this.LASelect = [{name: "全部", id: 0, parentId: 0, isSelected: false}];
          } else {
            /*当点击的是父分类,移除所有子分类*/
            if (row.parentId === row.id) {

              for (let i = data.length - 1; i >= 0; i--) {
                let item = data[i];
                if (row.id === item.parentId && item.id !== item.parentId) {
                  // this.LASelect.splice(i, 1);
                  data = [item];
                }
              }

            } else {
              /*当点击的是子分类,移除所有父分类*/

              for (let i = data.length - 1; i >= 0; i--) {
                let item = data[i];
                if (row.parentId === item.id) {
                  // this.LASelect.splice(i, 1);
                  data = [item];
                }
              }

            }
          }

        }


        this.layoutUserConfigureItems('configureItemNameClick');

      },


      /*点击按钮下拉菜单*/
      configureItemMoreClick(type, id, itemShow) {
        let result = [];
        if (type === this.userConfigureType.recommendSort) {

          this.RSData.forEach(function (item) {

            if (item.parentId === id && item.parentId !== item.id) {
              result.push(item);
            }else{
              if (id === item.id){
                item.showChildren = !item.showChildren;
              }else{
                item.showChildren = false;
              }
            }
          });

          this.RSSubData = result;
          if(!!itemShow){
            this.RSSubData = [];
          }

        } else if (type === this.userConfigureType.recommendArea) {

          this.RAData.forEach(function (item) {
            if (item.parentId === id && item.parentId !== item.id) {
              result.push(item);
            }else{
              if (id === item.id){
                item.showChildren = !item.showChildren;
              }else{
                item.showChildren = false;
              }
            }
          });
          this.RASubData = result;
          if(!!itemShow){
            this.RASubData = [];
          }

          // console.log(result);

        } else {

          this.LAData.forEach(function (item) {
            if (item.parentId === id && item.parentId !== item.id) {
              result.push(item);
            }else{
              if (id === item.id){
                item.showChildren = !item.showChildren;
              }else{
                item.showChildren = false;
              }
            }
          });
          this.LASubData = result;
          if(!!itemShow){
            this.LASubData = [];
          }
          // console.log(result);
        }
        this.layoutUserConfigureItems('configureItemMoreClick')
      },


      /*已选择按钮移除*/
      configureItemCloseClick(type, index) {

        if (type === 0) {
          this.RSSelect.splice(index, 1);

          if (this.RSSelect.length === 0) {
            this.RSSelect.push({name: "全部", id: 0, parentId: 0, isSelected: false});
          }

        } else if (type === 1) {
          this.RASelect.splice(index, 1);
          if (this.RASelect.length === 0) {
            this.RASelect.push({name: "全部", id: 0, parentId: 0, isSelected: false});
          }

        } else {
          this.LASelect.splice(index, 1);
          if (this.LASelect.length === 0) {
            this.LASelect.push({name: "全部", id: 0, parentId: 0, isSelected: false});
          }

        }


        this.layoutUserConfigureItems('configureItemCloseClick');

      },


      /*刷新页面*/
      layoutUserConfigureItems(string) {

        // console.log(string);
        for (let i = 0; i < this.RSData.length; i++) {
          let DItem = this.RSData[i];
          DItem.isSelected = false;

          for (let j = 0; j < this.RSSelect.length; j++) {
            let SItem = this.RSSelect[j];

            if (SItem.id === DItem.id || DItem.id === SItem.parentId) {
              // console.log(`RSData----name=${DItem.name}`);
              DItem.isSelected = true;
            }
          }
        }
        // console.log(this.RSData);

        for (let i = 0; i < this.RAData.length; i++) {
          let DItem = this.RAData[i];
          DItem.isSelected = false;

          for (let j = 0; j < this.RASelect.length; j++) {
            let SItem = this.RASelect[j];

            if (SItem.id === DItem.id || DItem.id === SItem.parentId) {
              // console.log(`RAData----name=${DItem.name}`);
              DItem.isSelected = true;
            }
          }
        }

        for (let i = 0; i < this.LAData.length; i++) {
          let DItem = this.LAData[i];
          DItem.isSelected = false;

          for (let j = 0; j < this.LASelect.length; j++) {
            let SItem = this.LASelect[j];

            if (SItem.id === DItem.id || DItem.id === SItem.parentId) {
              // console.log(`LAData----name=${DItem.name}`);
              DItem.isSelected = true;
            }
          }
        }


        this.$set(this.RSData, "random", {});
        this.$delete(this.RSData, "random");
        this.$set(this.RSSelect, "random", {});
        this.$delete(this.RSSelect, "random");


        this.$set(this.RAData, "random", {});
        this.$delete(this.RAData, "random");
        this.$set(this.RASelect, "random", {});
        this.$delete(this.RASelect, "random");

        this.$set(this.LAData, "random", {});
        this.$delete(this.LAData, "random");
        this.$set(this.LASelect, "random", {});
        this.$delete(this.LASelect, "random");


      },

      /*-----------------网络请求-------------------*/
      getUserInfo() {
        getUserInfo().then(response => {
          let data = response.data;


          /*推荐分类*/
          if (data.classifications && data.classifications.length) {
            let result = [];

            data.classifications.forEach(function (item) {
              result.push(
                {
                  name: item.name,
                  id: item.id,
                  parentId: (item.parentId === 0) ? item.id : item.parentId,
                  isSelected: false
                }
              )
            });
            this.RSSelect = result;

          } else {

            this.RSSelect = [{name: "全部", id: 0, parentId: 0, isSelected: false}];

          }


          /*推荐地区*/
          if (data.concernRegions && data.concernRegions.length) {

            let result = [];

            data.concernRegions.forEach(function (item) {
              result.push(
                {
                  name: (item.cityCode === item.provinceCode) ? item.provinceShort : item.cityShort,
                  id: item.cityCode,
                  parentId: item.provinceCode,
                  isSelected: false
                }
              )
            });

            this.RASelect = result;

          } else {

            this.RASelect = [{name: "全部", id: 0, parentId: 0, isSelected: false}];

          }


          /*本地地区*/
          if (data.regions && data.regions.length) {

            let result = [];

            data.regions.forEach(function (item) {
              result.push(
                {
                  name: (item.cityCode === item.provinceCode) ? item.provinceShort : item.cityShort,
                  id: item.cityCode,
                  parentId: item.provinceCode,
                  isSelected: false
                }
              )
            });

            this.LASelect = result;

          } else {

            this.LASelect = [{name: "全部", id: 0, parentId: 0, isSelected: false}];

          }
          // console.log(response);

          this.layoutUserConfigureItems('getUserInfo');
        })
      },

      /*所有分类*/
      userConfigureAllClassification() {

        userConfigureAllClassification().then(response => {
          // console.log(response);
          let result = [];

          response.data.forEach(function (item) {
            result.push(
              {
                name: item.name,
                id: item.id,
                parentId: (item.parentId === 0) ? item.id : item.parentId,
                isSelected: false,
                // showChildren:false,
              }
            )
          });

          result.unshift({name: "全部", id: 0, parentId: 0, isSelected: false});

          this.RSData = result;

          this.layoutUserConfigureItems('userConfigureAllClassification');

        })
      },

      /*所有地区*/
      userConfigureAllRegion() {

        userConfigureAllRegion().then(response => {
          let result = [];

          response.data.forEach(function (item) {
            result.push(
              {
                name: (item.cityCode === item.provinceCode) ? item.provinceShort : item.cityShort,
                id: item.cityCode,
                parentId: item.provinceCode,
                isSelected: false
              }
            )
          });

          result.unshift({name: "全部", id: 0, parentId: 0, isSelected: false});


          this.RAData = result;
          this.layoutUserConfigureItems('userConfigureAllRegion');


        })
      },


      userConfigureAllRegion1() {

        userConfigureAllRegion().then(response => {
          let result = [];

          response.data.forEach(function (item) {
            result.push(
              {
                name: (item.cityCode === item.provinceCode) ? item.provinceShort : item.cityShort,
                id: item.cityCode,
                parentId: item.provinceCode,
                isSelected: false
              }
            )
          });

          result.unshift({name: "全部", id: 0, parentId: 0, isSelected: false});


          this.LAData = result;
          this.layoutUserConfigureItems('userConfigureAllRegion1');

        })
      },


    },

    mounted() {
      if(this.$route.name == 'home'){
        this.cancleText = '重置';
        this.configure_close=false;
      }else{
        this.cancleText = '关闭';
        this.configure_close=true;
      }
      let userName = this.$iknowsUtil.getUserName();
      if(!userName){
        this.$router.push('/login');
      }else{
        this.getUserInfo();
        this.userConfigureAllClassification();
        this.userConfigureAllRegion();
        this.userConfigureAllRegion1();
      }

    }
  }
</script>

<style scoped>

  .user_configure {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 5% 15%;
  }
  @media screen and (max-width:1440px){
    .user_configure{
      padding: 5% 10%;
    }
  }
  .user_configure_content {
    background-color: #fff;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 0 25px;
    overflow-y: auto;
    border-radius: 8px;
  }

  /*标题*/
  .configure_title {
    font-size: 20px;
    color: #333;
    padding: 16px 0;
    border-bottom: 1px solid #D8D8D8;
  }

  /*副标题*/
  .configure_subTitle {
    font-size: 16px;
    color: rgba(51, 51, 51, 0.7);
    padding: 16px 0;
  }

  /*左侧分类按钮*/
  .configure_sort {
    float: left;
    width: 65%;
  }

  /*右侧已选择分类*/
  .configure_select {
    float: right;
    width: 30%;
    padding-left: 5%;
  }

  .configure_item {
    display: inline-flex;
    float: left;
    color: #2D2B4C;
    border: 1px solid #2D2B4C;
    border-radius: 8px;
    margin-right: 15px;
    margin-bottom: 24px;
    font-size: 0;
    cursor: pointer;
  }

  .configure_item_select, .configure_item:hover {

    color: #fff;
    background-color: #2D2B4C;
  }

  .configure_item_name {
    display: inline-block;
    padding-left: 14px;
    height: 38px;
    line-height: 38px;
    font-size: 16px;
    cursor: pointer;
  }

  .configure_item_name_select{
    cursor: default;
  }
  .isSingle {
    padding-right: 14px;
  }

  .configure_item_more {
    display: inline-block;
    height: 38px;
    line-height: 38px;
    padding: 0 3px;
    font-size: 16px;
    cursor: pointer;

  }

  .configure_sub {
    background-color: #f2f2f2;
    margin-bottom: 15px;

  }

  .configure_sub_item {
    display: inline-block;
    cursor: pointer;
    padding: 10px 10px;
    color: #999999;
  }

  .configure_sub_item_select {
    color: #2D2B4C;
  }

  .configure_sub_item:hover {
    color: #2D2B4C;
  }

  /*操作视图*/
  .user_configure_control {
    border-top: 1px solid #d8d8d8;
    padding: 24px 0;
    width: 100%;
    background-color: #fff;
    text-align: center;
    font-size: 0;
  }

  .user_configure_control .save_btn {
    display: inline-block;
    cursor: pointer;
    background: #2D2B4C;
    border-radius: 8px;
    color: #fff;
    width: 112px;
    height: 38px;
    line-height: 38px;
    font-size: 16px;
    margin-right: 24px;
  }

  .user_configure_control .reset_btn {
    display: inline-block;
    cursor: pointer;
    border: 1px solid #2D2B4C;
    border-radius: 8px;
    color: #2D2B4C;
    width: 112px;
    height: 38px;
    line-height: 38px;
    font-size: 16px;
    margin-left: 24px;
  }
  .configure_close{
    width: 36px;
    height: 36px;
    border-radius: 50%;
    /*background:rgba(51, 51, 51, 0.35);*/
    float: right;
    cursor: pointer;
    font-size: 30px;
    text-align: center;
    line-height: 36px;
    color: #000000;
    margin-top: -7px;
  }

</style>
