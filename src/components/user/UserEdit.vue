<template>
<div class="useredit">
    <div class="top-header">
      <ITop></ITop>
      <IHeader v-bind:items="items"></IHeader>
    </div>
    <div class="rzl-contarner rzl_bc_undercoat wrapcontent">
    <IUserEditContent></IUserEditContent>
    </div>
    <IFoot></IFoot>
</div>
</template>
<script>
import ITop from "../common/Top.vue";
import IHeader from '../common/Header.vue';
import IUserEditContent from "../user/UserEditContent.vue";
import IFoot from "../common/Footer.vue";
export default {
    name:"useredit",
    components:{ITop,IHeader,IUserEditContent,IFoot},
    data(){
        return {
            items:['首页','舆情头条','检测中心','简报中心']
        };
    }
}
</script>
<style scoped type="css">
    .useredit{
        height: 100%;
    }
    .useredit .wrapcontent{
        height:calc(100% - 200px - 88px - 60px);
        overflow: auto;
        padding-top: 20px;
    }
</style>