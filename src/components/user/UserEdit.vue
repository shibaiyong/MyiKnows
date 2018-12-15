<template>
<div class="useredit" ref="documentHeight">
    <div class="top-header" ref='topHeight'>
      <ITop></ITop>
      <IHeader v-bind:items="items"></IHeader>
    </div>
    <div class="rzl-contarner rzl_bc_undercoat wrapcontent" ref='middleHeight'>
        <IUserEditContent></IUserEditContent>
    </div>
    <IFoot></IFoot>
</div>
</template>
<script>
import ITop from "@/components/common/Top.vue";
import IHeader from '@/components/common/Header.vue';
import IUserEditContent from "@/components/user/UserEditContent.vue";
import IFoot from "@/components/common/Footer.vue";
export default {
    name:"useredit",
    components:{ITop,IHeader,IUserEditContent,IFoot},
    data(){
        return {
            items:['首页','舆情头条','检测中心','简报中心']
        };
    },
    method:{
        
    },
    mounted(){
    }
}
</script>
<style scoped type="css">
    .useredit{
        height: 100%;
    }
    .useredit .wrapcontent{
        padding-top: 20px;
    }
</style>